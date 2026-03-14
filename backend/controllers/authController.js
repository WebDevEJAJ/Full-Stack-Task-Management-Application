import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendResponse, sendError } from '../utils/responseHandler.js';

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

const setCookieOptions = () => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
};

export const register = async (req, res, next) => {
  try {
    const { email, password, fullName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 400, 'User already exists with this email');
    }

    // Create new user
    const user = new User({
      email,
      password,
      fullName,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Set secure cookie
    res.cookie('token', token, setCookieOptions());

    sendResponse(res, 201, 'User registered successfully', {
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return sendError(res, 400, 'Email and password are required');
    }

    // Find user and select password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return sendError(res, 401, 'Invalid email or password');
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return sendError(res, 401, 'Invalid email or password');
    }

    // Generate token
    const token = generateToken(user._id);

    // Set secure cookie
    res.cookie('token', token, setCookieOptions());

    sendResponse(res, 200, 'Login successful', {
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.clearCookie('token', setCookieOptions());
  sendResponse(res, 200, 'Logout successful');
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return sendError(res, 404, 'User not found');
    }
    sendResponse(res, 200, 'Profile retrieved', { user });
  } catch (error) {
    next(error);
  }
};
