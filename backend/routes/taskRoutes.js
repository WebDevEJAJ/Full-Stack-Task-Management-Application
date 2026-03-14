import express from 'express';
import { body, param, query } from 'express-validator';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { handleValidationErrors } from '../middleware/errorMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Create task
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required').trim(),
    body('description').optional().trim(),
    body('status')
      .optional()
      .isIn(['todo', 'in-progress', 'completed'])
      .withMessage('Invalid status'),
  ],
  handleValidationErrors,
  createTask
);

// Get all tasks (with pagination, filtering, search)
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('status')
      .optional()
      .isIn(['todo', 'in-progress', 'completed'])
      .withMessage('Invalid status'),
    query('search').optional().trim(),
  ],
  handleValidationErrors,
  getTasks
);

// Get single task
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid task ID')],
  handleValidationErrors,
  getTaskById
);

// Update task
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid task ID'),
    body('title').optional().notEmpty().withMessage('Title cannot be empty').trim(),
    body('description').optional().trim(),
    body('status')
      .optional()
      .isIn(['todo', 'in-progress', 'completed'])
      .withMessage('Invalid status'),
  ],
  handleValidationErrors,
  updateTask
);

// Delete task
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid task ID')],
  handleValidationErrors,
  deleteTask
);

export default router;
