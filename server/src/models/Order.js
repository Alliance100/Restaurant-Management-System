import mongoose from 'mongoose';

// Snapshot of a single item at the time of ordering
const orderItemSchema = new mongoose.Schema({
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
  name: { type: String, required: true },
  slug: { type: String },
  imageUrl: { type: String },
  categoryName: { type: String },
  basePrice: { type: Number, required: true },  // in cents
  quantity: { type: Number, required: true, min: 1 },
  addOns: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true }, // in cents
    },
  ],
  lineTotal: { type: Number, required: true }, // (basePrice + sum(addOns)) * quantity in cents
}, { _id: false });

// Delivery address snapshot
const deliveryAddressSchema = new mongoose.Schema({
  label: { type: String, default: 'Home' },
  line1: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String },
  instructions: { type: String },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true }, // e.g. TC-20260811-0001

  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String },
  customerEmail: { type: String },
  customerPhone: { type: String },

  items: [orderItemSchema],

  subtotal: { type: Number, required: true },   // sum of lineTotals, in cents
  deliveryFee: { type: Number, default: 200 },  // in cents (default $2)
  discountAmount: { type: Number, default: 0 }, // in cents
  total: { type: Number, required: true },       // subtotal + deliveryFee - discountAmount

  coupon: {
    code: { type: String },
    discountType: { type: String },
    discountValue: { type: Number },
  },

  deliveryAddress: { type: deliveryAddressSchema, required: true },

  paymentMethod: {
    type: String,
    enum: ['cash_on_delivery'],
    default: 'cash_on_delivery',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending',
  },

  status: {
    type: String,
    enum: [
      'pending',          // Just placed — awaiting admin approval
      'confirmed',        // Admin approved
      'preparing',        // Kitchen is preparing
      'out_for_delivery', // Rider picked up
      'delivered',        // Delivered successfully
      'cancelled',        // Cancelled by customer (only if pending)
      'rejected',         // Rejected by admin
    ],
    default: 'pending',
  },

  statusHistory: [
    {
      status: { type: String },
      changedAt: { type: Date, default: Date.now },
      note: { type: String },
    },
  ],

  estimatedDeliveryMinutes: { type: Number, default: 45 },
  notes: { type: String }, // Customer's special instructions
}, { timestamps: true });

// Auto-generate order number before saving
orderSchema.pre('save', async function () {
  if (this.isNew) {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `TC-${dateStr}-${String(count + 1).padStart(4, '0')}`;

    // Seed initial status history
    this.statusHistory = [{ status: 'pending', changedAt: new Date(), note: 'Order placed by customer' }];
  }
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Order', orderSchema);
