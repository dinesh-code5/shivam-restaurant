import express from 'express';
import { body, validationResult } from 'express-validator';
import RoomReservation from '../models/RoomReservation.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route POST /api/reservations/room (public)
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
    body('checkIn').notEmpty().withMessage('Check-in date is required'),
    body('checkOut').notEmpty().withMessage('Check-out date is required'),
    body('roomType').notEmpty().withMessage('Room type is required'),
    body('guests').isInt({ min: 1, max: 20 }).withMessage('Guests must be between 1 and 20'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
      }

      if (new Date(req.body.checkOut) <= new Date(req.body.checkIn)) {
        return res.status(400).json({ success: false, message: 'Check-out date must be after check-in date' });
      }

      const reservation = await RoomReservation.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Room reservation submitted successfully! We will contact you shortly.',
        data: reservation,
      });
    } catch (err) {
      next(err);
    }
  }
);

// @route GET /api/reservations/room (admin)
router.get('/', protect, async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'All') filter.status = status;

    const reservations = await RoomReservation.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: reservations.length, data: reservations });
  } catch (err) {
    next(err);
  }
});

// @route PUT /api/reservations/room/:id (admin)
router.put('/:id', protect, async (req, res, next) => {
  try {
    const reservation = await RoomReservation.findByIdAndUpdate(
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

// @route DELETE /api/reservations/room/:id (admin)
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const reservation = await RoomReservation.findByIdAndDelete(req.params.id);

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    res.json({ success: true, message: 'Reservation deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
