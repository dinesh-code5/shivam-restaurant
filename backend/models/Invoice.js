import mongoose from 'mongoose';

const invoiceItemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number,
  total: Number,
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'TableSession' },
  tableNumber: { type: Number },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  items: [invoiceItemSchema],
  subtotal: { type: Number, required: true },
  gstRate: { type: Number, default: 5 },
  gstAmount: { type: Number, required: true },
  total: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'other'],
    default: 'cash',
  },
  isPaid: { type: Boolean, default: false },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending',
  },
  verifiedAt: { type: Date, default: null },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  pdfPath: { type: String, default: '' },
  whatsappSent: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Invoice', invoiceSchema);
