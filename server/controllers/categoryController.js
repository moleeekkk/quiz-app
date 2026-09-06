import Category from '../models/Category.js';

// @desc    Get all categories from database collection
// @route   GET /api/categories
// @access  Public
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new category in collection
// @route   POST /api/categories
// @access  Public / Private Admin
export const createCategory = async (req, res) => {
  try {
    const { name, is_active } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const trimmedName = name.trim();
    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${trimmedName}$`, 'i') },
    });

    if (existing) {
      return res.status(400).json({ message: 'Category already exists in database' });
    }

    const category = new Category({
      name: trimmedName,
      is_active: is_active !== false,
    });

    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update category name and/or status
// @route   PUT /api/categories/:id
// @access  Public / Private Admin
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, is_active } = req.body;

    let category = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(id);
    } else {
      category = await Category.findOne({ name: id });
    }

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name && name.trim()) {
      // Check if new name clashes with another category
      const trimmedName = name.trim();
      const existing = await Category.findOne({
        name: { $regex: new RegExp(`^${trimmedName}$`, 'i') },
        _id: { $ne: category._id },
      });
      if (existing) {
        return res.status(400).json({ message: 'A category with that name already exists' });
      }
      category.name = trimmedName;
    }

    if (typeof is_active === 'boolean') {
      category.is_active = is_active;
    }

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete category from collection
// @route   DELETE /api/categories/:id
// @access  Public / Private Admin
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      deleted = await Category.findByIdAndDelete(id);
    } else {
      deleted = await Category.findOneAndDelete({ name: id });
    }

    if (!deleted) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category removed successfully from database' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
