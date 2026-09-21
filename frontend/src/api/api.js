const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'An unexpected error occurred. Please try again.');
  }
  return data;
}

const api = {
  // Auth
  registerUser: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  loginUser: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  loginAdmin: (payload) => request('/admin/login', { method: 'POST', body: payload }),

  // Trainers
  getTrainers: () => request('/trainers'),
  getTrainerById: (id) => request(`/trainers/${id}`),
  addTrainer: (payload, token) => request('/trainers', { method: 'POST', body: payload, token }),
  updateTrainer: (id, payload, token) => request(`/trainers/${id}`, { method: 'PUT', body: payload, token }),
  deleteTrainer: (id, token) => request(`/trainers/${id}`, { method: 'DELETE', token }),

  // Memberships
  getMemberships: () => request('/memberships'),
  addMembership: (payload, token) => request('/memberships', { method: 'POST', body: payload, token }),
  updateMembership: (id, payload, token) => request(`/memberships/${id}`, { method: 'PUT', body: payload, token }),
  deleteMembership: (id, token) => request(`/memberships/${id}`, { method: 'DELETE', token }),
  subscribeMembership: (id, token) => request(`/memberships/${id}/subscribe`, { method: 'POST', token }),

  // Workouts
  getWorkouts: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.difficulty && params.difficulty !== 'All') query.append('difficulty', params.difficulty);
    if (params.search) query.append('search', params.search);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/workouts${queryString}`);
  },
  getWorkoutById: (id) => request(`/workouts/${id}`),
  addWorkout: (payload, token) => request('/workouts', { method: 'POST', body: payload, token }),
  updateWorkout: (id, payload, token) => request(`/workouts/${id}`, { method: 'PUT', body: payload, token }),
  deleteWorkout: (id, token) => request(`/workouts/${id}`, { method: 'DELETE', token }),

  // Admin Management & Stats
  getAdminStats: (token) => request('/admin/stats', { token }),
  getAllUsers: (token, search = '') => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request(`/admin/users${query}`, { token });
  },
  assignTrainer: (userId, trainerId, token) =>
    request(`/admin/users/${userId}/assign-trainer`, { method: 'PUT', body: { trainerId }, token }),
  deleteUser: (userId, token) =>
    request(`/admin/users/${userId}`, { method: 'DELETE', token }),

  // Member Features
  getProfile: (token) => request('/user/profile', { token }),
  updateProfile: (payload, token) => request('/user/profile', { method: 'PUT', body: payload, token }),
  checkIn: (token) => request('/user/checkin', { method: 'POST', token }),
  toggleSaveWorkout: (workoutId, token) =>
    request(`/user/saved-workouts/${workoutId}`, { method: 'POST', token }),
};

export default api;
