import mongoose from 'mongoose';

const addOnSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true } // Price in cents
}, { _id: true });

const menuItemSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String },
  price: { type: Number, required: true }, // Store as smallest currency unit (e.g., cents)
  imageUrl: { type: String },
  dietaryTag: { type: String, enum: ['vegetarian', 'non-vegetarian', 'vegan', 'gluten-free', 'none'], default: 'none' },
  preparationMinutes: { type: Number, default: 15 },
  isFeatured: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  addOns: [addOnSchema]
}, { timestamps: true });

menuItemSchema.index({ categoryId: 1, isAvailable: 1 });
menuItemSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('MenuItem', menuItemSchema);
