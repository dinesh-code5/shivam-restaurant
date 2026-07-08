import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import Room from '../models/Room.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
console.log('DEBUG: roomManageRoutes.js is being loaded!');
// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'restaurant_rooms',
    format: async (req, file) => 'png',
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});
const upload = multer({ storage });

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

// // POST /api/rooms/manage
// router.post('/manage', protect, upload.any(), async (req, res, next) => {
//   console.log('DEBUG: Received POST /manage request (upload.any())');
//   console.log('DEBUG: req.body (after multer):', req.body);
//   console.log('DEBUG: req.files (after multer):', req.files);
//   console.log('DEBUG: req.file (after multer):', req.file);
  
//   res.status(200).json({ success: true, message: 'Check console logs' });
// });

// PUT /api/rooms/manage/:id
// POST /api/rooms/manage
router.post('/manage', protect, upload.any(), async (req, res, next) => {
  try {
    console.log('DEBUG: req.files:', req.files);
    console.log('DEBUG: req.body:', req.body);

    const {
      name, type, price, capacity, size, roomNumber,
      description, isAvailable, amenities
    } = req.body;

    const imageFile = req.files?.find(f => f.fieldname === 'image');
    console.log('DEBUG: matched imageFile:', imageFile);

    const room = await Room.create({
      name,
      type,
      price: Number(price),
      capacity: Number(capacity),
      size,
      roomNumber,
      description,
      isAvailable: isAvailable === 'true' || isAvailable === true,
      amenities: amenities ? amenities.split(',').map(a => a.trim()).filter(Boolean) : [],
      images: imageFile ? [imageFile.path] : [],
    });

    res.status(201).json({ success: true, data: room });
  } catch (err) {
    console.error('DEBUG: Room create error:', err);
    next(err);
  }
});

// PUT /api/rooms/manage/:id
router.put('/manage/:id', protect, upload.any(), async (req, res, next) => {
  try {
    const {
      name, type, price, capacity, size, roomNumber,
      description, isAvailable, amenities
    } = req.body;

    const imageFile = req.files?.find(f => f.fieldname === 'image');

    const updateData = {
      name,
      type,
      price: Number(price),
      capacity: Number(capacity),
      size,
      roomNumber,
      description,
      isAvailable: isAvailable === 'true' || isAvailable === true,
      amenities: amenities ? amenities.split(',').map(a => a.trim()).filter(Boolean) : [],
    };

    if (imageFile) {
      updateData.images = [imageFile.path];
    }

    const room = await Room.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

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
