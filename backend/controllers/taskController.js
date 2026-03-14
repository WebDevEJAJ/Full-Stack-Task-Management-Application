import Task from '../models/Task.js';
import { sendResponse, sendError } from '../utils/responseHandler.js';
import { encryptData, decryptData } from '../utils/encryption.js';

// Create a new task
export const createTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    const userId = req.userId;

    const task = new Task({
      userId,
      title,
      description: description || '',
      status: status || 'todo',
    });

    await task.save();

    sendResponse(res, 201, 'Task created successfully', { task });
  } catch (error) {
    next(error);
  }
};

// Get all tasks with pagination, filtering, and search
export const getTasks = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10, status, search } = req.query;

    // Build filter
    const filter = { userId };
    if (status && ['todo', 'in-progress', 'completed'].includes(status)) {
      filter.status = status;
    }

    // Build search query
    if (search) {
      filter.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await Task.countDocuments(filter);

    // Get tasks
    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    sendResponse(res, 200, 'Tasks retrieved successfully', {
      tasks,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single task
export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const task = await Task.findOne({ _id: id, userId });
    if (!task) {
      return sendError(res, 404, 'Task not found');
    }

    sendResponse(res, 200, 'Task retrieved successfully', { task });
  } catch (error) {
    next(error);
  }
};

// Update task
export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { title, description, status } = req.body;

    const task = await Task.findOne({ _id: id, userId });
    if (!task) {
      return sendError(res, 404, 'Task not found');
    }

    // Update only provided fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    task.updatedAt = new Date();

    await task.save();

    sendResponse(res, 200, 'Task updated successfully', { task });
  } catch (error) {
    next(error);
  }
};

// Delete task
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const task = await Task.findOneAndDelete({ _id: id, userId });
    if (!task) {
      return sendError(res, 404, 'Task not found');
    }

    sendResponse(res, 200, 'Task deleted successfully');
  } catch (error) {
    next(error);
  }
};
