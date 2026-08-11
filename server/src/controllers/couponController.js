import Coupon from '../models/Coupon.js';

// ─── Public: Validate a coupon code ─────────────────────────────────────────
export const validateCoupon = async (req, res) => {
  try {
    const { code, orderSubtotal } = req.body; // orderSubtotal in cents

    const coupon = await Coupon.findOne({ code: code?.toUpperCase(), isActive: true });
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return res.status(400).json({ success: false, message: 'This coupon has expired' });
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'This coupon has reached its usage limit' });
    }

    if (orderSubtotal < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount for this coupon is $${(coupon.minOrderAmount / 100).toFixed(2)}`,
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((orderSubtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
      }
    } else {
      discountAmount = Math.min(coupon.discountValue, orderSubtotal);
    }

    res.status(200).json({
      success: true,
      data: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Admin: List all coupons ─────────────────────────────────────────────────
export const listCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Admin: Create a coupon ──────────────────────────────────────────────────
export const createCoupon = async (req, res) => {
  try {
    const existing = await Coupon.findOne({ code: req.body.code?.toUpperCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Coupon code already exists' });
    }
    const coupon = await Coupon.create({ ...req.body, code: req.body.code?.toUpperCase() });
    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Admin: Toggle coupon active/inactive ────────────────────────────────────
export const toggleCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.status(200).json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Admin: Update a coupon ──────────────────────────────────────────────────
export const updateCoupon = async (req, res) => {
  try {
    if (req.body.code) req.body.code = req.body.code.toUpperCase();
    
    // Check if code is being changed to one that already exists
    if (req.body.code) {
      const existing = await Coupon.findOne({ code: req.body.code, _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(409).json({ success: false, message: 'Coupon code already exists' });
      }
    }

    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    
    res.status(200).json({ success: true, data: coupon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Admin: Delete a coupon ──────────────────────────────────────────────────
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
