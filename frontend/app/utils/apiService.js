import apiClient from './apiClient';

// Auth APIs
export const register = async (email, password, fullName) => {
  const response = await apiClient.post('/auth/register', {
    email,
    password,
    fullName,
  });
  return response.data;
};

export const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', {
    email,
    password,
  });
  return response.data;
};

export const logout = async () => {
  const response = await apiClient.post('/auth/logout');
  return response.data;
};

export const getProfile = async () => {
  const response = await apiClient.get('/auth/profile');
  return response.data;
};

// Task APIs
export const createTask = async (title, description, status = 'todo') => {
  const response = await apiClient.post('/tasks', {
    title,
    description,
    status,
  });
  return response.data;
};

export const getTasks = async (page = 1, limit = 10, status = '', search = '') => {
  const params = new URLSearchParams({
    page,
    limit,
    ...(status && { status }),
    ...(search && { search }),
  });
  const response = await apiClient.get(`/tasks?${params}`);
  return response.data;
};

export const getTaskById = async (id) => {
  const response = await apiClient.get(`/tasks/${id}`);
  return response.data;
};

export const updateTask = async (id, title, description, status) => {
  const response = await apiClient.put(`/tasks/${id}`, {
    title,
    description,
    status,
  });
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await apiClient.delete(`/tasks/${id}`);
  return response.data;
};
