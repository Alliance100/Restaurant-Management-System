import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../src/app.js';

dotenv.config();

let isConnected = false;

// Connect to MongoDB cacheably in a serverless environment
const connectToDatabase = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('Connected to MongoDB (Serverless)');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
};

// Vercel serverless function entry point
export default async (req, res) => {
  await connectToDatabase();
  return app(req, res);
};
