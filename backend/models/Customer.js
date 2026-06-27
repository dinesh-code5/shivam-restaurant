import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  dob: { type: String, default: '' },
  visitCount: { type: Number, default: 0 },
  lastVisit: { type: Date, default: null },
  totalSpent: { type: Number, default: 0 },
  birthdayOfferSent: { type: Boolean, default: false },
  lastRetentionSent: { type: Date, default: null },
  welcomeSent: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Customer', customerSchema);
