const API_BASE_URL = 'http://localhost:5000/api';

// Helper to get Authorization Header
const getAuthHeaders = () => {
  const token = localStorage.getItem('quiz_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth
  async loginAdmin(credentials) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async verifyAdminToken() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Invalid token');
    return await res.json();
  },

  // Quizzes Public & Admin
  async getAllQuizzes(filters = {}) {
    const queryParams = new URLSearchParams();
    if (filters.category && filters.category !== 'All') queryParams.append('category', filters.category);
    if (filters.difficulty && filters.difficulty !== 'All') queryParams.append('difficulty', filters.difficulty);
    if (filters.search) queryParams.append('search', filters.search);

    const res = await fetch(`${API_BASE_URL}/quizzes?${queryParams.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch quizzes');
    return data;
  },

  async getQuizById(id) {
    const res = await fetch(`${API_BASE_URL}/quizzes/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Quiz not found');
    return data;
  },

  async submitQuiz(id, payload) {
    const res = await fetch(`${API_BASE_URL}/quizzes/${id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to submit quiz');
    return data;
  },

  // Admin CRUD
  async createQuiz(quizData) {
    const res = await fetch(`${API_BASE_URL}/quizzes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(quizData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create quiz');
    return data;
  },

  async updateQuiz(id, quizData) {
    const res = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(quizData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update quiz');
    return data;
  },

  async deleteQuiz(id) {
    const res = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete quiz');
    return data;
  },

  async getAdminStats() {
    const res = await fetch(`${API_BASE_URL}/quizzes/admin/stats`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch stats');
    return data;
  },

  async seedData(force = false) {
    const res = await fetch(`${API_BASE_URL}/quizzes/seed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ force }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to seed database');
    return data;
  },
};
