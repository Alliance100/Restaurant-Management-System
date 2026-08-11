import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from '../src/models/Order.js';

dotenv.config();

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  try {
    const order = new Order({
      user: new mongoose.Types.ObjectId(),
      customerName: 'Test',
      items: [],
      subtotal: 100,
      total: 100,
      deliveryAddress: { line1: 'Test', city: 'Test' }
    });
    await order.save();
    console.log('Order saved successfully');
  } catch (err) {
    console.error('Error saving order:', err.message);
    console.error(err.stack);
  }
  mongoose.disconnect();
}
test();
