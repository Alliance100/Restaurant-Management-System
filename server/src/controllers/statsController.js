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

    // Date range for "this month"
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
    monthEnd.setHours(23, 59, 59, 999);

    const [
      totalCategories,
      totalMenuItems,
      totalUsers,
      featuredItems,
      totalOrders,
      pendingOrders,
      todayOrders,
      todayRevenue,
      monthRevenue,
      dailyRevenue,
    ] = await Promise.all([
      Category.countDocuments({ isActive: true }),
      MenuItem.countDocuments({ isAvailable: true }),
      User.countDocuments({ role: 'customer' }),
      MenuItem.countDocuments({ isFeatured: true, isAvailable: true }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ createdAt: { $gte: todayStart, $lte: todayEnd } }),
      // Today's revenue
      Order.aggregate([
        {
          $match: {
            status: 'delivered',
            createdAt: { $gte: todayStart, $lte: todayEnd },
          },
        },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      // This month's total revenue
      Order.aggregate([
        {
          $match: {
            status: 'delivered',
            createdAt: { $gte: monthStart, $lte: monthEnd },
          },
        },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      // Day-by-day revenue for the current month
      Order.aggregate([
        {
          $match: {
            status: 'delivered',
            createdAt: { $gte: monthStart, $lte: monthEnd },
          },
        },
        {
          $group: {
            _id: { day: { $dayOfMonth: '$createdAt' } },
            total: { $sum: '$total' }
          }
        },
        { $sort: { '_id.day': 1 } }
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
        todayRevenue: todayRevenue[0]?.total || 0,
        monthRevenue: monthRevenue[0]?.total || 0,
        dailyRevenue: dailyRevenue.map(item => ({
          day: item._id.day,
          total: item.total,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
