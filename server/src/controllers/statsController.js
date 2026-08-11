import User from '../models/User.js';
import Category from '../models/Category.js';
import MenuItem from '../models/MenuItem.js';
import Order from '../models/Order.js';

export const getStats = async (req, res) => {
  try {
    // Date range for "today"
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [
      totalCategories,
      totalMenuItems,
      totalUsers,
      featuredItems,
      totalOrders,
      pendingOrders,
      todayOrders,
      todayRevenue,
    ] = await Promise.all([
      Category.countDocuments({ isActive: true }),
      MenuItem.countDocuments({ isAvailable: true }),
      User.countDocuments({ role: 'customer' }),
      MenuItem.countDocuments({ isFeatured: true, isAvailable: true }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ createdAt: { $gte: todayStart, $lte: todayEnd } }),
      Order.aggregate([
        {
          $match: {
            status: 'delivered',
            createdAt: { $gte: todayStart, $lte: todayEnd },
          },
        },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCategories,
        totalMenuItems,
        totalUsers,
        featuredItems,
        totalOrders,
        pendingOrders,
        todayOrders,
        todayRevenue: todayRevenue[0]?.total || 0, // in cents
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
