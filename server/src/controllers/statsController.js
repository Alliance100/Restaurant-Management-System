import User from '../models/User.js';
import Category from '../models/Category.js';
import MenuItem from '../models/MenuItem.js';

export const getStats = async (req, res) => {
  try {
    const [totalCategories, totalMenuItems, totalUsers, featuredItems] = await Promise.all([
      Category.countDocuments({ isActive: true }),
      MenuItem.countDocuments({ isAvailable: true }),
      User.countDocuments({ role: 'customer' }),
      MenuItem.countDocuments({ isFeatured: true, isAvailable: true }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCategories,
        totalMenuItems,
        totalUsers,
        featuredItems,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
