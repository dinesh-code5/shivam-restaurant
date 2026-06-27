import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['new_order', 'kot_ready', 'new_booking', 'new_feedback', 'bill_generated', 'new_kot'],
    required: true,
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  isRead: { type: Boolean, default: false },
  targetRole: { type: String, enum: ['admin', 'waiter', 'kitchen', 'all'], default: 'admin' },
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
