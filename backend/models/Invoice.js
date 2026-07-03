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
  gstin: { type: String, default: '' },
  fssai: { type: String, default: '' },
  restaurantAddress: { type: String, default: '' },
  restaurantEmail: { type: String, default: '' },
  restaurantWebsite: { type: String, default: '' },
  items: [invoiceItemSchema],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  taxableAmount: { type: Number, default: 0 },
  gstRate: { type: Number, default: 5 },
  gstAmount: { type: Number, required: true },
  serviceCharge: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'other'],
    default: 'cash',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'rejected'],
    default: 'pending',
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  // receiptImage: { type: String, default: '' },
  paidAt: { type: Date },
  transactionId: { type: String, default: '' },
  verifiedAt: { type: Date, default: null },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  pdfPath: { type: String, default: '' },
  whatsappSent: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Invoice', invoiceSchema);
