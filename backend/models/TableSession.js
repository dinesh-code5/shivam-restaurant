import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  notes: { type: String, default: '' },
  kotSent: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'served'],
    default: 'pending',
  },
}, { _id: true });

const tableSessionSchema = new mongoose.Schema({
  table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
  tableNumber: { type: Number, required: true },

  // Customer info
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerDOB: { type: String, default: '' },
  guestCount: { type: Number, default: 1 },

  // Waiter
  waiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  waiterName: { type: String, default: '' },

  // Orders
  orders: [orderItemSchema],

  // Billing
  subtotal: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  gstRate: { type: Number, default: 5 },
  gstAmount: { type: Number, default: 0 },
  serviceCharge: { type: Number, default: 0 },
  total: { type: Number, default: 0 },

  status: {
    type: String,
    enum: ['active', 'billed', 'closed'],
    default: 'active',
  },

  invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', default: null },

  // Timestamps
  startedAt: { type: Date, default: Date.now },
  billedAt: { type: Date },
  closedAt: { type: Date },
}, { timestamps: true });

// Recalculate totals
tableSessionSchema.methods.recalculate = function () {
  this.subtotal = this.orders.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxable = Math.max(0, this.subtotal - this.discount);
  this.gstAmount = parseFloat((taxable * (this.gstRate / 100)).toFixed(2));
  this.total = parseFloat((taxable + this.gstAmount + this.serviceCharge).toFixed(2));
};

export default mongoose.model('TableSession', tableSessionSchema);
