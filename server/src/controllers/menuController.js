import MenuItem from '../models/MenuItem.js';
import Category from '../models/Category.js';

export const getMenuItems = async (req, res) => {
  try {
    const { search, category, dietaryTag, sort, page = 1, limit = 12 } = req.query;
    const query = {};

    // Filter by active status for non-admins
    if (req.user?.role !== 'admin') {
      query.isAvailable = true;
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query.categoryId = categoryDoc._id;
      } else {
        // Return empty if category slug is invalid
        return res.status(200).json({ success: true, data: [], meta: { page: 1, limit, total: 0, pages: 0 } });
      }
    }

    if (dietaryTag) {
      query.dietaryTag = dietaryTag;
    }

    let sortObj = {};
    if (sort === 'price_asc') sortObj.price = 1;
    else if (sort === 'price_desc') sortObj.price = -1;
    else sortObj.createdAt = -1; // default newest

    const startIndex = (Number(page) - 1) * Number(limit);
    const total = await MenuItem.countDocuments(query);
    const items = await MenuItem.find(query).sort(sortObj).skip(startIndex).limit(Number(limit)).populate('categoryId', 'name slug');

    res.status(200).json({
      success: true,
      data: items,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMenuItemBySlug = async (req, res) => {
  try {
    const query = { slug: req.params.slug };
    if (req.user?.role !== 'admin') {
      query.isAvailable = true;
    }

    const item = await MenuItem.findOne(query).populate('categoryId', 'name slug');
    if (!item) return res.status(404).json({ success: false, message: 'Item not found or unavailable' });
    
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createMenuItem = async (req, res) => {
  try {
    const existing = await MenuItem.findOne({ slug: req.body.slug });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Slug already exists' });
    }
    const item = await MenuItem.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
