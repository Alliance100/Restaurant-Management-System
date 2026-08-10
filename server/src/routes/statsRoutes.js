import express from 'express';
import { getStats } from '../controllers/statsController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Admin only
router.get('/', authenticate, requireRole('admin'), getStats);

export default router;
