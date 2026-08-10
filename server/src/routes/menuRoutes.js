import express from 'express';
import { getMenuItems, getMenuItemBySlug, createMenuItem, updateMenuItem } from '../controllers/menuController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/', getMenuItems);

// Admin only
router.get('/admin', authenticate, requireRole('admin'), getMenuItems);
router.post('/admin', authenticate, requireRole('admin'), createMenuItem);
router.patch('/admin/:id', authenticate, requireRole('admin'), updateMenuItem);

// Public dynamic routes (must be at the bottom)
router.get('/:slug', getMenuItemBySlug);

export default router;
