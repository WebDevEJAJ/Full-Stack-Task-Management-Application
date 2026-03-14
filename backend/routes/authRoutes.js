import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  logout,
  getProfile,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { handleValidationErrors } from '../middleware/errorMiddleware.js';

const router = express.Router();

// Register route
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('fullName').notEmpty().withMessage('Full name is required'),
  ],
  handleValidationErrors,
  register
);

// Login route
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  handleValidationErrors,
  login
);

// Logout route
router.post('/logout', logout);

// Get profile route (protected)
router.get('/profile', authenticate, getProfile);

export default router;
