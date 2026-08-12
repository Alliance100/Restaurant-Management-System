import express from 'express';
import { createIntent, stripeWebhook } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-intent', authenticate, createIntent);
// Note: /stripe/webhook is mounted directly in app.js before express.json() 
// because it needs the raw request body.

export default router;
