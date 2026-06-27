import express from 'express';
import QRCode from 'qrcode';
import Table from '../models/Table.js';
import TableSession from '../models/TableSession.js';
import KOT from '../models/KOT.js';
import Invoice from '../models/Invoice.js';
import Customer from '../models/Customer.js';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';
import { sendWelcome, sendInvoiceNotification, sendFeedbackRequest } from '../services/whatsappService.js';
import { generateInvoicePDF } from '../services/pdfService.js';
import { createNotification } from '../services/notificationService.js';
import Feedback from '../models/Feedback.js';
import crypto from 'crypto';

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ── Helper: auto-increment invoice number ─────────────────────────────────
const getNextInvoiceNumber = async () => {
  const last = await Invoice.findOne().sort({ createdAt: -1 });
  if (!last) return 'INV-0001';
  const num = parseInt(last.invoiceNumber.split('-')[1] || '0') + 1;
  return `INV-${String(num).padStart(4, '0')}`;
};

const getNextKOTNumber = async () => {
  const last = await KOT.findOne().sort({ createdAt: -1 });
  if (!last) return 'KOT-001';
  const num = parseInt(last.kotNumber.split('-')[1] || '0') + 1;
  return `KOT-${String(num).padStart(3, '0')}`;
};

// ── GET /api/tables — all tables with status ──────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const tables = await Table.find().sort({ number: 1 });
    const sessions = await TableSession.find({ status: { $in: ['active', 'billed'] } })
      .populate('invoice', 'invoiceNumber paymentMethod paymentStatus isPaid total')
      .populate('waiter', 'name');

    const sessionMap = {};
    sessions.forEach((s) => { sessionMap[s.table.toString()] = s; });

    const result = tables.map((t) => {
      const session = sessionMap[t._id.toString()];
      return {
        ...t.toObject(),
        session: session ? {
          _id: session._id,
          customerName: session.customerName,
          customerPhone: session.customerPhone,
          guestCount: session.guestCount,
          waiterName: session.waiterName,
          total: session.total,
          orderCount: session.orders.length,
          startedAt: session.startedAt,
          status: session.status,
          invoice: session.invoice,
        } : null,
      };
    });

    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

// ── POST /api/tables — create table ──────────────────────────────────────
router.post('/', protect, async (req, res, next) => {
  try {
    const { number, capacity, section } = req.body;
    const qr = await QRCode.toDataURL(`${FRONTEND_URL}/menu?table=${number}`);
    const table = await Table.create({ number, capacity: capacity || 4, section, qrCode: qr });
    res.status(201).json({ success: true, data: table });
  } catch (err) { next(err); }
});

// ── PUT /api/tables/:id — edit table ──────────────────────────────────────
router.put('/:id', protect, async (req, res, next) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: table });
  } catch (err) { next(err); }
});

// ── DELETE /api/tables/:id ────────────────────────────────────────────────
router.delete('/:id', protect, async (req, res, next) => {
  try {
    await Table.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Table deleted' });
  } catch (err) { next(err); }
});

// ── GET /api/tables/:id/qr — get QR code ─────────────────────────────────
router.get('/:id/qr', async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) return res.status(404).json({ success: false, message: 'Table not found' });
    res.json({ success: true, qrCode: table.qrCode, tableNumber: table.number });
  } catch (err) { next(err); }
});

// ── POST /api/tables/:id/session/start — waiter opens table ──────────────
router.post('/:id/session/start', protect, async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) return res.status(404).json({ success: false, message: 'Table not found' });
    if (table.status === 'occupied')
      return res.status(400).json({ success: false, message: 'Table already occupied' });

    const { customerName, customerPhone, customerDOB, guestCount } = req.body;

    // Upsert customer
    let customer = await Customer.findOne({ phone: customerPhone });
    const isNew = !customer;
    if (isNew) {
      customer = await Customer.create({ name: customerName, phone: customerPhone, dob: customerDOB || '', visitCount: 1, lastVisit: new Date() });
    } else {
      customer.visitCount += 1;
      customer.lastVisit = new Date();
      customer.name = customerName;
      if (customerDOB) customer.dob = customerDOB;
      await customer.save();
    }

    const session = await TableSession.create({
      table: table._id,
      tableNumber: table.number,
      customerName,
      customerPhone,
      customerDOB: customerDOB || '',
      guestCount: guestCount || 1,
      waiter: req.user._id,
      waiterName: req.user.name,
    });

    table.status = 'occupied';
    table.currentSession = session._id;
    await table.save();

    // WhatsApp welcome
    if (isNew || !customer.welcomeSent) {
      await sendWelcome(customerPhone, customerName);
      customer.welcomeSent = true;
      await customer.save();
    }

    await createNotification('new_order', 'Table Occupied', `Table ${table.number} — ${customerName} (${guestCount} guests)`, { tableNumber: table.number }, 'admin');

    res.status(201).json({ success: true, data: session });
  } catch (err) { next(err); }
});

// ── GET /api/tables/:id/session — get active session ─────────────────────
router.get('/:id/session', async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table || !table.currentSession)
      return res.json({ success: true, data: null });

    const session = await TableSession.findById(table.currentSession)
      .populate('orders.menuItem', 'name category');
    res.json({ success: true, data: session });
  } catch (err) { next(err); }
});

// ── POST /api/tables/:id/session/order — add items to order ──────────────
router.post('/:id/session/order', protect, async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id).populate('currentSession');
    if (!table?.currentSession)
      return res.status(400).json({ success: false, message: 'No active session' });

    const session = await TableSession.findById(table.currentSession._id);
    const { items } = req.body; // [{menuItemId, name, price, quantity, notes}]

    const newItems = [];
    items.forEach((item) => {
      session.orders.push({
        menuItem: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        notes: item.notes || '',
        kotSent: false,
        status: 'pending',
      });
      newItems.push({ name: item.name, quantity: item.quantity, notes: item.notes || '', menuItemId: item.menuItemId });
    });

    session.recalculate();
    await session.save();

    // Generate KOT
    const kotNumber = await getNextKOTNumber();
    const existingKOTs = await KOT.countDocuments({ session: session._id });
    const kot = await KOT.create({
      kotNumber,
      session: session._id,
      tableNumber: table.number,
      waiterName: req.user.name,
      items: newItems,
      isAdditional: existingKOTs > 0,
    });

    // Mark items as KOT sent
    session.orders.forEach((o) => { if (!o.kotSent) o.kotSent = true; });
    await session.save();

    await createNotification('new_kot', `KOT #${kotNumber}`, `Table ${table.number} — ${newItems.length} items`, { kotId: kot._id, tableNumber: table.number }, 'kitchen');

    res.json({ success: true, data: session, kot });
  } catch (err) { next(err); }
});

// ── PUT /api/tables/:id/session/order/:itemId — update order item ─────────
router.put('/:id/session/order/:itemId', protect, async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);
    const session = await TableSession.findById(table?.currentSession);
    if (!session) return res.status(404).json({ success: false, message: 'No active session' });

    const item = session.orders.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Order item not found' });

    if (req.body.quantity !== undefined) item.quantity = req.body.quantity;
    if (req.body.notes !== undefined) item.notes = req.body.notes;
    if (req.body.status !== undefined) item.status = req.body.status;

    session.recalculate();
    await session.save();
    res.json({ success: true, data: session });
  } catch (err) { next(err); }
});

// ── DELETE /api/tables/:id/session/order/:itemId — remove item ────────────
router.delete('/:id/session/order/:itemId', protect, async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);
    const session = await TableSession.findById(table?.currentSession);
    if (!session) return res.status(404).json({ success: false, message: 'No active session' });

    session.orders = session.orders.filter((o) => o._id.toString() !== req.params.itemId);
    session.recalculate();
    await session.save();
    res.json({ success: true, data: session });
  } catch (err) { next(err); }
});

// ── POST /api/tables/:id/session/bill — generate bill/invoice ────────────
router.post('/:id/session/bill', protect, async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);
    const session = await TableSession.findById(table?.currentSession);
    if (!session) return res.status(404).json({ success: false, message: 'No active session' });

    session.recalculate();
    session.status = 'billed';
    session.billedAt = new Date();

    if (session.invoice) {
      const existingInvoice = await Invoice.findById(session.invoice);
      return res.json({ success: true, invoice: existingInvoice, session, message: 'Bill already generated and awaiting payment verification.' });
    }

    const invoiceNumber = await getNextInvoiceNumber();
    const items = session.orders.map((o) => ({
      name: o.name,
      quantity: o.quantity,
      price: o.price,
      total: parseFloat((o.price * o.quantity).toFixed(2)),
    }));

    const invoice = await Invoice.create({
      invoiceNumber,
      session: session._id,
      tableNumber: table.number,
      customerName: session.customerName,
      customerPhone: session.customerPhone,
      items,
      subtotal: session.subtotal,
      gstRate: session.gstRate,
      gstAmount: session.gstAmount,
      total: session.total,
      paymentMethod: req.body.paymentMethod || 'cash',
      paymentStatus: 'pending',
      isPaid: false,
    });

    session.invoice = invoice._id;
    await session.save();

    await createNotification('bill_generated', 'Bill Generated', `Invoice ${invoiceNumber} - Rs.${session.total} - Table ${table.number} awaiting payment verification`, { invoiceId: invoice._id }, 'admin');
    return res.json({ success: true, invoice, session });

    // Free the table
    table.status = 'available';
    table.currentSession = null;
    await table.save();

    // Update customer spend
    await Customer.findOneAndUpdate(
      { phone: session.customerPhone },
      { $inc: { totalSpent: session.total }, lastVisit: new Date() }
    );

    // WhatsApp notifications
    await sendInvoiceNotification(session.customerPhone, session.customerName, invoiceNumber, session.total);

    // Schedule feedback (10 min) — simplified with setTimeout
    const feedbackToken = crypto.randomBytes(16).toString('hex');
    await Feedback.create({
      customerName: session.customerName,
      customerPhone: session.customerPhone,
      rating: 0,
      review: '',
      session: session._id,
      feedbackToken,
      status: 'pending',
    });

    setTimeout(async () => {
      try {
        await sendFeedbackRequest(session.customerPhone, session.customerName, feedbackToken);
      } catch (e) { console.error('Feedback WA error', e.message); }
    }, 10 * 60 * 1000);

    await createNotification('bill_generated', 'Bill Generated', `Invoice ${invoiceNumber} — ₹${session.total} — Table ${table.number}`, { invoiceId: invoice._id }, 'admin');

    res.json({ success: true, invoice, session });
  } catch (err) { next(err); }
});

// ── GET /api/tables/sessions — all sessions (admin) ──────────────────────
router.get('/sessions/all', protect, async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const sessions = await TableSession.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: sessions });
  } catch (err) { next(err); }
});

export default router;
