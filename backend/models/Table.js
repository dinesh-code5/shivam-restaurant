import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true },
  capacity: { type: Number, default: 4 },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved', 'cleaning'],
    default: 'available',
  },
  section: { type: String, default: 'Main Hall' },
  qrCode: { type: String, default: '' }, // base64 QR image
  currentSession: { type: mongoose.Schema.Types.ObjectId, ref: 'TableSession', default: null },
}, { timestamps: true });

export default mongoose.model('Table', tableSchema);
