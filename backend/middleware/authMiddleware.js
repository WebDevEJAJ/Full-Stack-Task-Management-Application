import jwt from 'jsonwebtoken';
import { sendError } from '../utils/responseHandler.js';

export const authenticate = (req, res, next) => {
  try {
    // Check for token in cookies OR Authorization header
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(res, 401, 'No authentication token found');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Token has expired');
    }
    return sendError(res, 401, 'Invalid token');
  }
};

export const authorize = (req, res, next) => {
  if (!req.userId) {
    return sendError(res, 403, 'Not authorized');
  }
  next();
};
