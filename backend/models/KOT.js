import mongoose from 'mongoose';

const kotItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  notes: { type: String, default: '' },
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
});

const kotSchema = new mongoose.Schema({
  kotNumber: { type: String, required: true, unique: true },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'TableSession', required: true },
  tableNumber: { type: Number, required: true },
  waiterName: { type: String, default: '' },
  items: [kotItemSchema],
  status: {
    type: String,
    enum: ['new', 'preparing', 'ready', 'served'],
    default: 'new',
  },
  isAdditional: { type: Boolean, default: false }, // true = add-on KOT
  servedAt: { type: Date },
}, { timestamps: true });

export default mongoose.model('KOT', kotSchema);
