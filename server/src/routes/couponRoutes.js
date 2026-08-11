import express from 'express';
import { validateCoupon, listCoupons, createCoupon, toggleCoupon, updateCoupon, deleteCoupon } from '../controllers/couponController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Customer: validate a coupon (must be logged in)
router.post('/validate', authenticate, validateCoupon);

// Admin only
router.get('/',           authenticate, requireRole('admin'), listCoupons);
router.post('/',          authenticate, requireRole('admin'), createCoupon);
router.patch('/:id/toggle', authenticate, requireRole('admin'), toggleCoupon);
router.put('/:id',        authenticate, requireRole('admin'), updateCoupon);
router.delete('/:id',     authenticate, requireRole('admin'), deleteCoupon);

export default router;
