import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Instead of a hardcoded default header:
const api = axios.create({
  baseURL: API_BASE_URL
});

// Add an interceptor to only set JSON header when body is NOT FormData
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']; // let the browser set multipart/form-data + boundary
  } else {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('shivam_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('shivam_admin_token');
      localStorage.removeItem('shivam_admin_user');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
