import express from 'express';
import Room from '../models/Room.js';
import { protect } from '../middleware/auth.js';
import { saveBase64Image } from '../utils/uploadHelper.js';

const router = express.Router();
console.log('DEBUG: roomManageRoutes.js is loaded');

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
  console.log('DEBUG: --- POST /manage request received ---');
  console.log('DEBUG: req.body keys:', Object.keys(req.body));
  console.log('DEBUG: req.body.amenities type:', typeof req.body.amenities);
  console.log('DEBUG: req.body.amenities value:', JSON.stringify(req.body.amenities));
  
  try {
    const {
      name, type, price, capacity, size, roomNumber,
      description, isAvailable, amenities, images
    } = req.body;
    
    if (!images) {
        console.log('DEBUG: imagess is undefined/null in destructuring. Inspecting req.body:', JSON.stringify(req.body).substring(0, 1000));
    }
    
    console.log('DEBUG: Received images in body:', !!images);

    let imagePaths = [];

    if (Array.isArray(images) && images.length > 0) {
      try {
        imagePaths = images.map(img => saveBase64Image(img));
        console.log('DEBUG: Saved images locally:', imagePaths);
      } catch (err) {
        console.error('DEBUG: Base64 image saving failed:', err.message);
      }
    } else if (typeof images === 'string') {
      try {
        imagePaths = [saveBase64Image(images)];
        console.log('DEBUG: Saved image locally:', imagePaths);
      } catch (err) {
        console.error('DEBUG: Base64 image saving failed:', err.message);
      }
    }
    let amenitiesArray = [];
    if (Array.isArray(amenities)) {
      amenitiesArray = amenities;
    } else if (typeof amenities === 'string') {
      amenitiesArray = amenities
        .split(',')
        .map(a => a.trim())
        .filter(Boolean);
    } else {
      console.log('DEBUG: amenities is neither array nor string, type is:', typeof amenities);      // Fallback for null/undefined/other types
      amenitiesArray = [];
    }
    const room = await Room.create({
      name,
      type,
      price: Number(price),
      capacity: Number(capacity),
      size,
      roomNumber,
      description,
      isAvailable: isAvailable === 'true' || isAvailable === true,
      amenities:amenitiesArray,
      images: imagePaths , // stored filename path
    });
    
    console.log('DEBUG: Saved room images field:', room.images);

    res.status(201).json({ success: true, data: room });
  } catch (err) { 
    console.error('DEBUG: POST Error:', err);
    next(err); 
  }
});

// PUT /api/rooms/manage/:id
router.put('/manage/:id', protect, async (req, res, next) => {
  try {
    const {
      name, type, price, capacity, size, roomNumber,
      description, isAvailable, amenities, images
    } = req.body;

    const existingRoom = await Room.findById(req.params.id);
    if (!existingRoom) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    let amenitiesArray = [];
    if (Array.isArray(amenities)) {
      amenitiesArray = amenities;
    } else if (typeof amenities === 'string') {
      amenitiesArray = amenities
        .split(',')
        .map(a => a.trim())
        .filter(Boolean);
    } else {
      // Fallback for null/undefined/other types
      amenitiesArray = [];
    }
      const updateData = {
        name,
        type,
        price: Number(price),
        capacity: Number(capacity),
        size,
        roomNumber,
        description,
        isAvailable: isAvailable === 'true' || isAvailable === true,
        amenities: amenitiesArray,
      };
  if (images && Array.isArray(images) && images.length > 0) {
    try {
      const imagePaths = images.map(img => saveBase64Image(img));

      console.log('DEBUG: Saved updated images locally:', imagePaths);

      updateData.images = imagePaths;
    } catch (err) {
      console.error('DEBUG: Base64 images saving failed on update:', err.message);
      updateData.images = existingRoom.images?.length > 0 ? existingRoom.images : [];
    }
  } else if (typeof images === 'string') {
    try {
      const imagePath = saveBase64Image(images);

      console.log('DEBUG: Saved updated image locally:', imagePath);

      updateData.images = [imagePath];
    } catch (err) {
      console.error('DEBUG: Base64 image saving failed on update:', err.message);
      updateData.images = existingRoom.images?.length > 0 ? existingRoom.images : [];
    }
  } else {
    updateData.images = existingRoom.images?.length > 0 ? existingRoom.images : [];
  }

    const room = await Room.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

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
