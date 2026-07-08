import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['Deluxe Room', 'Premium Suite', 'Family Room', 'Banquet Hall', 'Maharaja Room'],
    required: true,
  },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  capacity: { type: Number, default: 2 },
  size: { type: String, default: '' }, // e.g. "350 sq ft"
  amenities: [{ type: String }],
  images: [{ type: String }], // URLs or base64
  isAvailable: { type: Boolean, default: true },
  roomNumber: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Room', roomSchema);
