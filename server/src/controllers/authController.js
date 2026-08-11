import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '7d',
  });
};

const sendTokenResponse = (user, statusCode, req, res) => {
  const token = generateToken(user._id);

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  user.passwordHash = undefined;

  const appRole = req.headers['x-app-role'] || 'customer';
  const cookieName = appRole === 'admin' ? 'jwt_admin' : 'jwt_customer';

  res.status(statusCode).cookie(cookieName, token, options).json({
    success: true,
    data: user
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      passwordHash,
      phone
    });

    sendTokenResponse(user, 201, req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const logout = (req, res) => {
  const appRole = req.headers['x-app-role'] || 'customer';
  const cookieName = appRole === 'admin' ? 'jwt_admin' : 'jwt_customer';

  res.cookie(cookieName, 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;
    
    // Find user
    const user = await User.findById(req.user.id).select('+passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if email is being updated and if it's already in use
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ success: false, message: 'Email already exists' });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;

    // Update address
    if (address) {
      if (user.addresses.length > 0) {
        user.addresses[0] = { ...user.addresses[0], ...address };
      } else {
        user.addresses.push(address);
      }
    }

    // Update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(password, salt);
    }

    await user.save();
    
    // Remove passwordHash from response
    user.passwordHash = undefined;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
