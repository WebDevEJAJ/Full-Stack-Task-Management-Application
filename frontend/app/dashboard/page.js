'use client';

import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../utils/apiService';
import ProtectedRoute from '../components/ProtectedRoute';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pagination, setPagination] = useState(null);

  // Filter and search
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    search: '',
  });

  // Form state for creating/editing
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
  });

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Load tasks
  useEffect(() => {
    loadTasks();
  }, [filters]);

  const loadTasks = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getTasks(
        filters.page,
        filters.limit,
        filters.status,
        filters.search
      );
      setTasks(response.data.tasks);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        await updateTask(editingId, formData.title, formData.description, formData.status);
        setSuccess('Task updated successfully');
      } else {
        await createTask(formData.title, formData.description, formData.status);
        setSuccess('Task created successfully');
      }

      setFormData({ title: '', description: '', status: 'todo' });
      setEditingId(null);
      setShowForm(false);
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      setError('');
      await deleteTask(id);
      setSuccess('Task deleted successfully');
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
    });
    setEditingId(task._id);
    setShowForm(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
      page: 1, // Reset to first page on filter change
    });
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <ProtectedRoute>
      <div className="container">
        <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <h2>My Tasks</h2>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* Create/Edit Form */}
          <div className="filter-section">
            <h3>{editingId ? 'Edit Task' : 'Create New Task'}</h3>
            <form onSubmit={handleCreateOrUpdate}>
              <div className="filter-controls">
                <div className="filter-group" style={{ flex: 2 }}>
                  <label>Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="Task title"
                    required
                  />
                </div>

                <div className="filter-group">
                  <label>Status</label>
                  <select name="status" value={formData.status} onChange={handleFormChange}>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <button type="submit">{editingId ? 'Update' : 'Create'}</button>
                {editingId && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ title: '', description: '', status: 'todo' });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Task description (optional)"
                />
              </div>
            </form>
          </div>

          {/* Filters */}
          <div className="filter-section">
            <div className="filter-controls">
              <div className="filter-group">
                <label>Status</label>
                <select name="status" value={filters.status} onChange={handleFilterChange}>
                  <option value="">All Status</option>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Search</label>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search by title"
                />
              </div>

              <div className="filter-group">
                <label>Items Per Page</label>
                <select name="limit" value={filters.limit} onChange={handleFilterChange}>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tasks Display */}
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks found. Create one to get started!</p>
            </div>
          ) : (
            <>
              <div className="task-container">
                {tasks.map((task) => (
                  <div key={task._id} className="task-card">
                    <div className="task-header">
                      <div>
                        <h3 className="task-title">{task.title}</h3>
                        <span
                          className={`task-status status-${task.status}`}
                        >
                          {task.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>

                    {task.description && (
                      <p className="task-description">{task.description}</p>
                    )}

                    <p className="task-date">
                      Created: {new Date(task.createdAt).toLocaleDateString()}
                    </p>

                    <div className="task-actions">
                      <button onClick={() => handleEdit(task)}>Edit</button>
                      <button
                        className="btn-danger"
                        onClick={() => handleDelete(task._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                  >
                    ← Prev
                  </button>

                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={filters.page === page ? 'active' : ''}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page === pagination.pages}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
