import express from 'express';
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

// PUT /api/invoices/:id — mark paid, update payment method
router.put('/:id', protect, async (req, res, next) => {
  try {
    const { isPaid, paymentStatus, verifiedAt, verifiedBy, whatsappSent, ...safeBody } = req.body;
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, safeBody, { new: true });
    res.json({ success: true, data: invoice });
  } catch (err) { next(err); }
});

router.post('/:id/verify', protect, async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

    const session = await TableSession.findById(invoice.session);
    if (!session) return res.status(404).json({ success: false, message: 'Linked table session not found' });

    invoice.isPaid = true;
    invoice.paymentStatus = 'paid';
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

    let feedback = await Feedback.findOne({ session: session._id });
    if (!feedback) {
      feedback = await Feedback.create({
        customerName: session.customerName,
        customerPhone: session.customerPhone,
        rating: 0,
        review: '',
        session: session._id,
        feedbackToken: crypto.randomBytes(16).toString('hex'),
        status: 'pending',
      });
    }

    const feedbackToken = feedback.feedbackToken;
    setTimeout(async () => {
      try {
        await sendFeedbackRequest(session.customerPhone, session.customerName, feedbackToken);
      } catch (e) { console.error('Feedback WA error', e.message); }
    }, 10 * 60 * 1000);

    await session.save();
    await invoice.save();

    await createNotification('bill_generated', 'Payment Verified', `Invoice ${invoice.invoiceNumber} paid - Table ${session.tableNumber} is now available`, { invoiceId: invoice._id }, 'admin');

    res.json({ success: true, data: invoice, session, table });
  } catch (err) { next(err); }
});

export default router;
