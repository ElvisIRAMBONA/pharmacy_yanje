import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh_token: refreshToken
          });
          
          const newAccessToken = response.data.access_token;
          localStorage.setItem('token', newAccessToken);
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          localStorage.removeItem('userRole');
          window.location.href = '/';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/users/', userData),
  getUsers: () => api.get('/auth/users/'),
  updateUser: (id, userData) => api.put(`/auth/users/${id}/`, userData),
  deleteUser: (id) => api.delete(`/auth/users/${id}/`),
};

export const medicinesAPI = {
  getAll: () => api.get('/medicines/'),
  getById: (id) => api.get(`/medicines/${id}/`),
  create: (data) => api.post('/medicines/', data),
  update: (id, data) => api.put(`/medicines/${id}/`, data),
  delete: (id) => api.delete(`/medicines/${id}/`),
  getExpired: () => api.get('/medicines/expired/'),
};

export const inventoryAPI = {
  getAll: () => api.get('/inventory/'),
  getById: (id) => api.get(`/inventory/${id}/`),
  update: (id, data) => api.put(`/inventory/${id}/`, data),
  getLowStock: () => api.get('/inventory/alerts/low-stock/'),
  getStats: () => api.get('/inventory/stats/'),
};

export const salesAPI = {
  getAll: () => api.get('/sales/'),
  getById: (id) => api.get(`/sales/${id}/`),
  create: (data) => api.post('/sales/', data),
  getDailyReport: (date) => api.get(`/sales/reports/daily/?date=${date}`),
  getMonthlyReport: (month, year) => api.get(`/sales/reports/monthly/?month=${month}&year=${year}`),
  getInvoice: (id) => api.get(`/sales/${id}/invoice/`, { responseType: 'text' }),
};

export const suppliersAPI = {
  getAll: () => api.get('/suppliers/'),
  getById: (id) => api.get(`/suppliers/${id}/`),
  create: (data) => api.post('/suppliers/', data),
  update: (id, data) => api.put(`/suppliers/${id}/`, data),
};

export default api;