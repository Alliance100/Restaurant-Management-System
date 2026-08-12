import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: 'c:\\Users\\Person\\Desktop\\Restaurant Management System\\server\\.env' });

const test = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const Order = mongoose.model('Order', new mongoose.Schema({}, { strict: false, collection: 'orders' }));

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const monthEnd = new Date();
  monthEnd.setHours(23, 59, 59, 999);

  console.log({ todayStart, todayEnd, monthStart, monthEnd });

  const todayRev = await Order.aggregate([
    { $match: { status: 'delivered', createdAt: { $gte: todayStart, $lte: todayEnd } } },
    { $group: { _id: null, total: { $sum: '$total' } } }
  ]);

  const monthRev = await Order.aggregate([
    { $match: { status: 'delivered', createdAt: { $gte: monthStart, $lte: monthEnd } } },
    { $group: { _id: null, total: { $sum: '$total' } } }
  ]);

  console.log('Today Rev:', todayRev);
  console.log('Month Rev:', monthRev);

  process.exit(0);
};

test();
