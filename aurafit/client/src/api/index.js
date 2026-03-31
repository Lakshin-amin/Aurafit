import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('aura_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('aura_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register:      (d) => API.post('/auth/register', d),
  login:         (d) => API.post('/auth/login', d),
  getMe:         ()  => API.get('/auth/me'),
  updateProfile: (d) => API.put('/auth/profile', d),
};

export const exerciseAPI = {
  getAll:  (p) => API.get('/exercises', { params: p }),
  getOne:  (id)     => API.get(`/exercises/${id}`),
  create:  (d)      => API.post('/exercises', d),
  update:  (id, d)  => API.put(`/exercises/${id}`, d),
  remove:  (id)     => API.delete(`/exercises/${id}`),
};

export const workoutAPI = {
  getAll:     (p) => API.get('/workouts', { params: p }),
  getOne:     (id)    => API.get(`/workouts/${id}`),
  getMyPlans: ()      => API.get('/workouts/my-plans'),
  create:     (d)     => API.post('/workouts', d),
  update:     (id, d) => API.put(`/workouts/${id}`, d),
  enroll:     (id)    => API.post(`/workouts/${id}/enroll`),
  remove:     (id)    => API.delete(`/workouts/${id}`),
};

export const progressAPI = {
  log:      (d) => API.post('/progress', d),
  getAll:   (p) => API.get('/progress', { params: p }),
  getStats: ()  => API.get('/progress/stats'),
  remove:   (id)=> API.delete(`/progress/${id}`),
};

export default API;
