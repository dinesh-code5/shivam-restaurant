import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  console.log('DEBUG: Axios outgoing request:', config.method, config.url);
  if (config.data instanceof FormData) {
      console.log('DEBUG: Axios request body is FormData:');
      for (let pair of config.data.entries()) {
          console.log(pair[0], pair[1]);
      }
  } else {
      console.log('DEBUG: Axios request body:', config.data);
  }
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
