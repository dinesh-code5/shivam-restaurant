import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import Invoice from '../models/Invoice.js';
import Table from '../models/Table.js';
import TableSession from '../models/TableSession.js';
import Customer from '../models/Customer.js';
import Feedback from '../models/Feedback.js';
import { protect } from '../middleware/auth.js';
import { generateInvoicePDF } from '../services/pdfService.js';
import { sendInvoiceNotification, sendFeedbackRequest } from '../services/whatsappService.js';
import { createNotification } from '../services/notificationService.js';
import crypto from 'crypto';

const router = express.Router();

/*
// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'restaurant_receipts',
    format: async (req, file) => 'png', // supports promises as well
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});
const upload = multer({ storage });
*/

// GET /api/invoices
router.get('/', protect, async (req, res, next) => {
  try {
    const { search, from, to } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { invoiceNumber: new RegExp(search, 'i') },
        { customerName: new RegExp(search, 'i') },
        { customerPhone: new RegExp(search, 'i') },
      ];
    }
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }
    const invoices = await Invoice.find(filter).sort({ createdAt: -1 }).limit(200);
    res.json({ success: true, count: invoices.length, data: invoices });
  } catch (err) { next(err); }
});

// GET /api/invoices/:id/pdf — generate and stream PDF
router.get('/:id/pdf', async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

    const pdfBuffer = await generateInvoicePDF(invoice);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=${invoice.invoiceNumber}.pdf`);
    res.send(pdfBuffer);
  } catch (err) { next(err); }
});

// PUT /api/invoices/:id - Existing generic update
router.put('/:id', protect, async (req, res, next) => {
  try {
    const { isPaid, paymentStatus, verifiedAt, verifiedBy, whatsappSent, ...safeBody } = req.body;
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, safeBody, { new: true });
    res.json({ success: true, data: invoice });
  } catch (err) { next(err); }
});

/*
// PUT /api/invoices/:id/submit-payment - Waiter submits payment method + receipt
router.put('/:id/submit-payment', protect, upload.single('receipt'), async (req, res, next) => {
  try {
    const { paymentMethod } = req.body;
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

    invoice.paymentMethod = paymentMethod;
    invoice.paymentStatus = 'pending';
    invoice.verificationStatus = 'pending';
    if (req.file) {
      invoice.receiptImage = req.file.path; // Cloudinary returns the secure_url in the path property
    }
    await invoice.save();
    res.json({ success: true, data: invoice });
  } catch (err) { next(err); }
});
*/

// PUT /api/invoices/:id/approve-payment - Admin approves payment
router.put('/:id/approve-payment', protect, async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

    const session = await TableSession.findById(invoice.session);
    if (!session) return res.status(404).json({ success: false, message: 'Linked table session not found' });

    invoice.paymentStatus = 'paid';
    invoice.verificationStatus = 'approved';
    invoice.paidAt = new Date();
    invoice.verifiedAt = new Date();
    invoice.verifiedBy = req.user._id;

    session.status = 'closed';
    session.closedAt = new Date();

    const table = await Table.findById(session.table);
    if (table) {
      table.status = 'available';
      table.currentSession = null;
      await table.save();
    }

    await Customer.findOneAndUpdate(
      { phone: session.customerPhone },
      { $inc: { totalSpent: session.total }, lastVisit: new Date() }
    );

    if (!invoice.whatsappSent) {
      await sendInvoiceNotification(session.customerPhone, session.customerName, invoice.invoiceNumber, session.total);
      invoice.whatsappSent = true;
    }

    await session.save();
    await invoice.save();

    await createNotification('bill_generated', 'Payment Approved', `Invoice ${invoice.invoiceNumber} paid - Table ${session.tableNumber} is now available`, { invoiceId: invoice._id }, 'admin');

    res.json({ success: true, data: invoice, session, table });
  } catch (err) { next(err); }
});

// PUT /api/invoices/:id/reject-payment - Admin rejects payment
router.put('/:id/reject-payment', protect, async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

    invoice.paymentStatus = 'rejected';
    invoice.verificationStatus = 'rejected';
    // invoice.receiptImage = ''; // Clear rejected image
    await invoice.save();

    await createNotification('bill_generated', 'Payment Rejected', `Invoice ${invoice.invoiceNumber} payment rejected. Please re-upload.`, { invoiceId: invoice._id }, 'waiter');

    res.json({ success: true, data: invoice });
  } catch (err) { next(err); }
});

router.post('/:id/verify', protect, async (req, res, next) => {
  // Keeping for backward compatibility if needed, but the new routes cover it.
  // Ideally, deprecate this in favor of 'approve-payment'.
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

    const session = await TableSession.findById(invoice.session);
    if (!session) return res.status(404).json({ success: false, message: 'Linked table session not found' });

    invoice.paymentStatus = 'paid';
    invoice.paidAt = new Date();
    invoice.paymentMethod = req.body.paymentMethod || invoice.paymentMethod;
    invoice.verifiedAt = new Date();
    invoice.verifiedBy = req.user?._id || null;

    session.status = 'closed';
    session.closedAt = new Date();

    const table = await Table.findById(session.table);
    if (table) {
      table.status = 'available';
      table.currentSession = null;
      await table.save();
    }

    await Customer.findOneAndUpdate(
      { phone: session.customerPhone },
      { $inc: { totalSpent: session.total }, lastVisit: new Date() }
    );

    if (!invoice.whatsappSent) {
      await sendInvoiceNotification(session.customerPhone, session.customerName, invoice.invoiceNumber, session.total);
      invoice.whatsappSent = true;
    }

    await session.save();
    await invoice.save();

    await createNotification('bill_generated', 'Payment Verified', `Invoice ${invoice.invoiceNumber} paid - Table ${session.tableNumber} is now available`, { invoiceId: invoice._id }, 'admin');

    res.json({ success: true, data: invoice, session, table });
  } catch (err) { next(err); }
});

export default router;
