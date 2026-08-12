import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({path: 'c:\\Users\\Person\\Desktop\\Restaurant Management System\\server\\.env'});

const test = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const Order = mongoose.model('Order', new mongoose.Schema({}, { strict: false, collection: 'orders' }));

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  // FIX: properly get last day of month
  const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
  monthEnd.setHours(23, 59, 59, 999);

  const todayRev = await Order.aggregate([
    { $match: { status: 'delivered', createdAt: { $gte: todayStart, $lte: todayEnd } } },
    { $group: { _id: null, total: { $sum: '$total' } } }
  ]);

  const monthRev = await Order.aggregate([
    { $match: { status: 'delivered', createdAt: { $gte: monthStart, $lte: monthEnd } } },
    { $group: { _id: null, total: { $sum: '$total' } } }
  ]);
  
  const dailyRev = await Order.aggregate([
    { $match: { status: 'delivered', createdAt: { $gte: monthStart, $lte: monthEnd } } },
    { $group: { _id: { day: { $dayOfMonth: '$createdAt' } }, total: { $sum: '$total' } } },
    { $sort: { '_id.day': 1 } }
  ]);

  console.log('todayRev', JSON.stringify(todayRev));
  console.log('monthRev', JSON.stringify(monthRev));
  console.log('dailyRev', JSON.stringify(dailyRev));
  process.exit(0);
};

test();
