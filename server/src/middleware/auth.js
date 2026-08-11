import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const appRole = req.headers['x-app-role'] || 'customer';
    const cookieName = appRole === 'admin' ? 'jwt_admin' : 'jwt_customer';
    const token = req.cookies[cookieName];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid or inactive account' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'You do not have permission' });
    }
    next();
  };
};
