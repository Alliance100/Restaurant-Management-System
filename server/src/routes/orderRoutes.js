import express from 'express';
import {
  placeOrder,
  getMyOrders,
  getMyOrderById,
  cancelMyOrder,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// ── Customer routes (must be logged in) ──────────────────────────────────────
router.use(authenticate);
router.post('/',          placeOrder);
router.get('/my-orders',  getMyOrders);
router.get('/my-orders/:id', getMyOrderById);
router.patch('/my-orders/:id/cancel', cancelMyOrder);

// ── Admin routes ──────────────────────────────────────────────────────────────
router.get('/',           requireRole('admin'), getAllOrders);
router.patch('/:id/status', requireRole('admin'), updateOrderStatus);

export default router;
