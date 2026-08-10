import express from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Only authenticated admins can upload images
router.post('/', authenticate, requireRole('admin'), uploadImage);

export default router;
