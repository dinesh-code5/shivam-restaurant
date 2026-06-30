import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, default: '' },
  rating: { type: Number, min: 1, max: 5 },
  review: { type: String },
  visitDate: { type: Date, default: Date.now },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'TableSession', default: null },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  isFeatured: { type: Boolean, default: false },
  feedbackToken: { type: String }, // optional for general submissions
}, { timestamps: true });

export default mongoose.model('Feedback', feedbackSchema);
