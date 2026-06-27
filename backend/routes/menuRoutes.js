import express from 'express';
import { body, validationResult } from 'express-validator';
import MenuItem from '../models/MenuItem.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route GET /api/menu  (public - only available items, supports ?category & ?type)
router.get('/', async (req, res, next) => {
  try {
    const { category, type, all } = req.query;
    const filter = { type: { $ne: 'Non-Veg' } };

    if (!all) filter.isAvailable = true;
    if (category && category !== 'All') filter.category = category;
    if (type && type !== 'All') filter.type = type === 'Jain' ? { $in: ['Veg', 'Vegan'] } : type;

    const items = await MenuItem.find(filter).sort({ category: 1, createdAt: -1 });
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    next(err);
  }
});

// @route GET /api/menu/:id
router.get('/:id', async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
});

// @route POST /api/menu (admin)
router.post(
  '/',
  protect,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').notEmpty().withMessage('Category is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
      }

      const item = await MenuItem.create(req.body);
      res.status(201).json({ success: true, message: 'Menu item created', data: item });
    } catch (err) {
      next(err);
    }
  }
);

// @route PUT /api/menu/:id (admin)
router.put('/:id', protect, async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    res.json({ success: true, message: 'Menu item updated', data: item });
  } catch (err) {
    next(err);
  }
});

// @route DELETE /api/menu/:id (admin)
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    res.json({ success: true, message: 'Menu item deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
