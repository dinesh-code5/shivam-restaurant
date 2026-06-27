import express from 'express';
import { body, validationResult } from 'express-validator';
import ContactMessage from '../models/ContactMessage.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route POST /api/contact (public)
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('message').notEmpty().withMessage('Message is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
      }

      const msg = await ContactMessage.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Your message has been sent successfully! We will get back to you soon.',
        data: msg,
      });
    } catch (err) {
      next(err);
    }
  }
);

// @route GET /api/contact (admin)
router.get('/', protect, async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, data: messages });
  } catch (err) {
    next(err);
  }
});

// @route PUT /api/contact/:id (admin) - mark read/unread
router.put('/:id', protect, async (req, res, next) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead: req.body.isRead },
      { new: true, runValidators: true }
    );

    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.json({ success: true, message: 'Message updated', data: msg });
  } catch (err) {
    next(err);
  }
});

// @route DELETE /api/contact/:id (admin)
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
