import express from 'express';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/notifications
router.get('/', protect, async (req, res, next) => {
  try {
    const notifs = await Notification.find({ isRead: false })
      .sort({ createdAt: -1 }).limit(50);
    const total = await Notification.countDocuments({ isRead: false });
    res.json({ success: true, count: total, data: notifs });
  } catch (err) { next(err); }
});

// PUT /api/notifications/read-all
router.put('/read-all', protect, async (req, res, next) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All marked as read' });
  } catch (err) { next(err); }
});

// PUT /api/notifications/:id
router.put('/:id', protect, async (req, res, next) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
