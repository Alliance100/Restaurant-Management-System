import Category from '../models/Category.js';
import MenuItem from '../models/MenuItem.js';

export const getCategories = async (req, res) => {
  try {
    // Public route: only return active categories by default
    const filter = req.user?.role === 'admin' ? {} : { isActive: true };
    const categories = await Category.find(filter).sort({ sortOrder: 1 });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, slug, imageUrl, sortOrder, isActive } = req.body;
    
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Slug already exists' });
    }

    const category = await Category.create({ name, slug, imageUrl, sortOrder, isActive });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Auto-deactivate all menu items when a category is deactivated
    if (req.body.isActive === false) {
      await MenuItem.updateMany({ categoryId: id }, { isAvailable: false });
    }

    const category = await Category.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
