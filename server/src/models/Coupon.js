import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  description: { type: String },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
  },
  discountValue: { type: Number, required: true }, // percentage (0-100) or fixed cents
  minOrderAmount: { type: Number, default: 0 },    // in cents
  maxDiscountAmount: { type: Number },              // cap for percentage discounts (in cents)
  usageLimit: { type: Number, default: null },      // null = unlimited
  usedCount: { type: Number, default: 0 },
  expiresAt: { type: Date, default: null },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Coupon', couponSchema);
