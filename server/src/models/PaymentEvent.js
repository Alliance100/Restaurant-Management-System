import mongoose from 'mongoose';

const paymentEventSchema = new mongoose.Schema({
  providerEventId: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  paymentIntentId: { type: String },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  processedAt: { type: Date, default: Date.now },
  payloadHash: { type: String },
});

export default mongoose.model('PaymentEvent', paymentEventSchema);
