import express from 'express';
import { getCategories, createCategory, updateCategory } from '../controllers/categoryController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public (with optional auth for admin filtering)
router.get('/', getCategories);

// Admin only
router.get('/admin', authenticate, requireRole('admin'), getCategories);
router.post('/admin', authenticate, requireRole('admin'), createCategory);
router.patch('/admin/:id', authenticate, requireRole('admin'), updateCategory);

export default router;
