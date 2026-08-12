import Stripe from 'stripe';
import Order from '../models/Order.js';
import PaymentEvent from '../models/PaymentEvent.js';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ─── POST /api/v1/payments/create-intent ─────────────────────────────────────
export const createIntent = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    // Find the order
    const order = await Order.findOne({ _id: orderId, user: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'Order is already paid' });
    }

    if (order.paymentMethod !== 'stripe') {
      return res.status(400).json({ success: false, message: 'Order is not configured for online payment' });
    }

    let paymentIntent;

    if (order.paymentIntentId) {
      // Reuse existing intent
      paymentIntent = await stripe.paymentIntents.retrieve(order.paymentIntentId);
      
      // Update amount if order total changed (though in this system, order total is immutable after creation, but safe to update just in case)
      if (paymentIntent.amount !== order.total) {
        paymentIntent = await stripe.paymentIntents.update(order.paymentIntentId, {
          amount: order.total,
        });
      }
    } else {
      // Create new intent
      paymentIntent = await stripe.paymentIntents.create({
        amount: order.total, // amount in cents
        currency: 'usd',
        metadata: { orderId: order._id.toString() },
      });

      order.paymentIntentId = paymentIntent.id;
      await order.save();
    }

    res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
      }
    });
  } catch (error) {
    console.error('createIntent error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/v1/payments/stripe/webhook ────────────────────────────────────
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // The raw body is populated by Express middleware before express.json()
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Idempotency Check
    const existingEvent = await PaymentEvent.findOne({ providerEventId: event.id });
    if (existingEvent) {
      // Already processed, return 200 quickly
      return res.status(200).json({ received: true });
    }

    // Process specific events
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;

      const order = await Order.findById(orderId);
      if (order && order.total === paymentIntent.amount && paymentIntent.currency === 'usd') {
        if (order.paymentStatus !== 'paid') {
          order.paymentStatus = 'paid';
          order.statusHistory.push({ status: order.status, note: 'Payment successful via Stripe webhook' });
          await order.save();
        }
      } else {
        console.warn('PaymentIntent succeeded but order not found or amount mismatch', { paymentIntent });
      }
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;

      const order = await Order.findById(orderId);
      if (order) {
        order.paymentStatus = 'failed';
        order.statusHistory.push({ status: order.status, note: 'Payment failed via Stripe webhook' });
        await order.save();
      }
    }

    // Save event to prevent replay
    await PaymentEvent.create({
      providerEventId: event.id,
      type: event.type,
      paymentIntentId: event.data.object.id,
      orderId: event.data.object.metadata?.orderId,
    });

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('stripeWebhook processing error:', error);
    // Don't fail the webhook if our internal DB has an issue, just return 500 to let Stripe retry
    res.status(500).end();
  }
};
