import express from 'express';
import { createMessage, getMessages, markAsRead, deleteMessage, getUnreadCount } from '../controllers/messageController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public route to submit a message
router.post('/', createMessage);

// Admin only routes
router.get('/', authenticate, requireRole('admin'), getMessages);
router.get('/unread-count', authenticate, requireRole('admin'), getUnreadCount);
router.patch('/:id/read', authenticate, requireRole('admin'), markAsRead);
router.delete('/:id', authenticate, requireRole('admin'), deleteMessage);

export default router;
