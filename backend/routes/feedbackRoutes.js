import express from 'express';
import Feedback from '../models/Feedback.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// POST /api/feedback — public submission via token link
router.post('/', async (req, res, next) => {
  try {
    const { token, customerName, rating, review } = req.body;
    if (!token) return res.status(400).json({ success: false, message: 'Token required' });

    const fb = await Feedback.findOne({ feedbackToken: token });
    if (!fb) return res.status(404).json({ success: false, message: 'Invalid feedback link' });
    if (fb.rating > 0) return res.status(400).json({ success: false, message: 'Feedback already submitted' });

    fb.customerName = customerName || fb.customerName;
    fb.rating = rating;
    fb.review = review;
    fb.status = 'pending';
    fb.visitDate = new Date();
    await fb.save();

    res.json({ success: true, message: 'Thank you for your feedback!' });
  } catch (err) { next(err); }
});

// GET /api/feedback/token/:token — verify link
router.get('/token/:token', async (req, res, next) => {
  try {
    const fb = await Feedback.findOne({ feedbackToken: req.params.token });
    if (!fb) return res.status(404).json({ success: false, message: 'Invalid link' });
    res.json({ success: true, data: { customerName: fb.customerName, alreadySubmitted: fb.rating > 0 } });
  } catch (err) { next(err); }
});

// GET /api/feedback — admin: all feedback
router.get('/', protect, async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    filter.rating = { $gt: 0 }; // only submitted ones
    const feedbacks = await Feedback.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: feedbacks });
  } catch (err) { next(err); }
});

// PUT /api/feedback/:id — approve/reject/feature
router.put('/:id', protect, async (req, res, next) => {
  try {
    const fb = await Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: fb });
  } catch (err) { next(err); }
});

// DELETE /api/feedback/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { next(err); }
});

// GET /api/feedback/public — approved reviews for website
router.get('/public/approved', async (req, res, next) => {
  try {
    const reviews = await Feedback.find({ status: 'approved', rating: { $gt: 0 } })
      .sort({ isFeatured: -1, createdAt: -1 }).limit(20).select('-feedbackToken -customerPhone');
    res.json({ success: true, data: reviews });
  } catch (err) { next(err); }
});

// POST /api/feedback/submit-general — new public review
router.post('/submit-general', async (req, res, next) => {
  try {
    const { customerName, rating, review } = req.body;
    if (!customerName || !rating || !review) return res.status(400).json({ success: false, message: 'All fields required' });
    
    const fb = new Feedback({
      customerName,
      rating,
      review,
      status: 'pending',
      visitDate: new Date(),
    });
    await fb.save();
    res.json({ success: true, message: 'Thank you for your feedback!' });
  } catch (err) { next(err); }
});

export default router;
