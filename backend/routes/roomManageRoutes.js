import express from 'express';
import Room from '../models/Room.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/rooms/manage — all rooms with full details (admin)
router.get('/manage', protect, async (req, res, next) => {
  try {
    const rooms = await Room.find().sort({ type: 1 });
    res.json({ success: true, data: rooms });
  } catch (err) { next(err); }
});

// GET /api/rooms/manage/public — public view
router.get('/manage/public', async (req, res, next) => {
  try {
    const rooms = await Room.find({ isAvailable: true }).sort({ price: 1 });
    res.json({ success: true, data: rooms });
  } catch (err) { next(err); }
});

// POST /api/rooms/manage
router.post('/manage', protect, async (req, res, next) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json({ success: true, data: room });
  } catch (err) { next(err); }
});

// PUT /api/rooms/manage/:id
router.put('/manage/:id', protect, async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    res.json({ success: true, data: room });
  } catch (err) { next(err); }
});

// DELETE /api/rooms/manage/:id
router.delete('/manage/:id', protect, async (req, res, next) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Room deleted' });
  } catch (err) { next(err); }
});

export default router;
