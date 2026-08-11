import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import Coupon from '../models/Coupon.js';

// ─── Customer: Place a new order ────────────────────────────────────────────
export const placeOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, couponCode, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item' });
    }

    // Build item snapshots + compute line totals
    let subtotal = 0;
    const orderItems = [];

    for (const cartItem of items) {
      const menuItem = await MenuItem.findById(cartItem.menuItemId).populate('categoryId', 'name');
      if (!menuItem || !menuItem.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `"${cartItem.name}" is no longer available`,
        });
      }

      // Resolve selected add-ons
      const selectedAddOns = (cartItem.selectedAddOns || []).map((selectedAddon) => {
        const found = menuItem.addOns.find((a) => String(a._id) === String(selectedAddon._id));
        return found ? { name: found.name, price: found.price } : null;
      }).filter(Boolean);

      const addOnsTotal = selectedAddOns.reduce((s, a) => s + a.price, 0);
      const lineTotal = (menuItem.price + addOnsTotal) * cartItem.quantity;

      subtotal += lineTotal;
      orderItems.push({
        menuItemId: menuItem._id,
        name: menuItem.name,
        slug: menuItem.slug,
        imageUrl: menuItem.imageUrl,
        categoryName: menuItem.categoryId?.name,
        basePrice: menuItem.price,
        quantity: cartItem.quantity,
        addOns: selectedAddOns,
        lineTotal,
      });
    }

    const deliveryFee = 200; // $2.00 flat
    let discountAmount = 0;
    let appliedCoupon = null;

    // Validate coupon if provided
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon) {
        if (coupon.expiresAt && new Date() > coupon.expiresAt) {
          return res.status(400).json({ success: false, message: 'This coupon has expired' });
        }
        if (subtotal < coupon.minOrderAmount) {
          return res.status(400).json({
            success: false,
            message: `Minimum order amount for this coupon is $${(coupon.minOrderAmount / 100).toFixed(2)}`,
          });
        }
        if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
          return res.status(400).json({ success: false, message: 'This coupon has reached its usage limit' });
        }

        if (coupon.discountType === 'percentage') {
          discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
          if (coupon.maxDiscountAmount) {
            discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
          }
        } else {
          discountAmount = Math.min(coupon.discountValue, subtotal);
        }

        appliedCoupon = {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
        };

        // Increment usage count
        await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
      }
    }

    const total = subtotal + deliveryFee - discountAmount;

    const order = await Order.create({
      user: req.user._id,
      customerName: req.user.name,
      customerEmail: req.user.email,
      customerPhone: req.user.phone,
      items: orderItems,
      subtotal,
      deliveryFee,
      discountAmount,
      total,
      coupon: appliedCoupon,
      deliveryAddress,
      paymentMethod: 'cash_on_delivery',
      notes,
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error('placeOrder error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Customer: Get my orders ─────────────────────────────────────────────────
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Customer: Get single order (must own it) ────────────────────────────────
export const getMyOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Customer: Cancel their own order (only if pending) ──────────────────────
export const cancelMyOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending orders can be cancelled' });
    }

    order.status = 'cancelled';
    order.statusHistory.push({ status: 'cancelled', note: 'Cancelled by customer' });
    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Admin: Get ALL orders ───────────────────────────────────────────────────
export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const query = {};

    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: orders,
      meta: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Admin: Update order status ──────────────────────────────────────────────
const VALID_TRANSITIONS = {
  pending: ['confirmed', 'rejected'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['out_for_delivery'],
  out_for_delivery: ['delivered'],
  delivered: [],
  cancelled: [],
  rejected: [],
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const allowed = VALID_TRANSITIONS[order.status] || [];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition from "${order.status}" to "${status}"`,
      });
    }

    order.status = status;
    order.statusHistory.push({ status, note: note || `Status updated to ${status} by admin` });

    // Mark as paid when delivered (COD)
    if (status === 'delivered') {
      order.paymentStatus = 'paid';
    }

    await order.save();
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
