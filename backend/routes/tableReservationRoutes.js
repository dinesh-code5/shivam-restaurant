import express from 'express';
import { body, validationResult } from 'express-validator';
import TableReservation from '../models/TableReservation.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route POST /api/reservations/table (public)
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('phone')
      .notEmpty()
      .withMessage('Phone number is required')
      .isLength({ min: 10 })
      .withMessage('Phone number must be at least 10 digits'),
    body('email').optional({ checkFalsy: true }).isEmail().withMessage('Invalid email'),
    body('date').notEmpty().withMessage('Date is required'),
    body('time').notEmpty().withMessage('Time is required'),
    body('guests').isInt({ min: 1, max: 50 }).withMessage('Guests must be between 1 and 50'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
      }

      const reservation = await TableReservation.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Table reservation submitted successfully! We will contact you shortly.',
        data: reservation,
      });
    } catch (err) {
      next(err);
    }
  }
);

// @route GET /api/reservations/table (admin)
router.get('/', protect, async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'All') filter.status = status;

    const reservations = await TableReservation.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: reservations.length, data: reservations });
  } catch (err) {
    next(err);
  }
});

// @route PUT /api/reservations/table/:id (admin) - update status
router.put('/:id', protect, async (req, res, next) => {
  try {
    const reservation = await TableReservation.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    res.json({ success: true, message: 'Reservation updated', data: reservation });
  } catch (err) {
    next(err);
  }
});

// @route DELETE /api/reservations/table/:id (admin)
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const reservation = await TableReservation.findByIdAndDelete(req.params.id);

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    res.json({ success: true, message: 'Reservation deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
