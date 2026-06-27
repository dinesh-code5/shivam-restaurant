import express from 'express';
import KOT from '../models/KOT.js';
import TableSession from '../models/TableSession.js';
import { protect } from '../middleware/auth.js';
import { createNotification } from '../services/notificationService.js';

const router = express.Router();

// GET /api/kot — kitchen view (active KOTs)
router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    else filter.status = { $in: ['new', 'preparing', 'ready'] };

    const kots = await KOT.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: kots });
  } catch (err) { next(err); }
});

// PUT /api/kot/:id/status — kitchen updates KOT status
router.put('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const kot = await KOT.findByIdAndUpdate(
      req.params.id,
      { status, ...(status === 'served' ? { servedAt: new Date() } : {}) },
      { new: true }
    );
    if (!kot) return res.status(404).json({ success: false, message: 'KOT not found' });

    // Update individual order items in session
    if (status === 'ready') {
      await createNotification('kot_ready', `KOT #${kot.kotNumber} Ready`, `Table ${kot.tableNumber} order is ready`, { kotId: kot._id }, 'waiter');
    }

    if (status === 'served') {
      // Mark items as served in the session
      const session = await TableSession.findById(kot.session);
      if (session) {
        const kotItemNames = kot.items.map((i) => i.name);
        session.orders.forEach((o) => {
          if (kotItemNames.includes(o.name) && o.status !== 'served') {
            o.status = 'served';
          }
        });
        await session.save();
      }
    }

    res.json({ success: true, data: kot });
  } catch (err) { next(err); }
});

export default router;
