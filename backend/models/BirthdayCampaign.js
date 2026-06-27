import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  discountPercent: { type: Number, default: 10 },
  message7Days: { type: String, default: 'Your birthday is coming! Visit Shivam Resort & Restaurant for a special celebration.' },
  messageBirthday: { type: String, default: 'Happy Birthday {{name}}! 🎂 Enjoy {{discount}}% OFF at Shivam Resort & Restaurant today! Show this message to avail your offer.' },
  isEnabled: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('BirthdayCampaign', campaignSchema);
