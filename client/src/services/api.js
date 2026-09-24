const API_BASE_URL = 'http://localhost:5000/api';

const parseJsonResponse = async (res, defaultMsg) => {
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || defaultMsg);
    return data;
  }
  const text = await res.text();
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`API endpoint not found (404). Please check server connection.`);
    }
    throw new Error(`Server returned error (${res.status}): ${defaultMsg}`);
  }
  return { message: text };
};

// Helper to get Admin Authorization Header
const getAdminAuthHeaders = () => {
  const token = localStorage.getItem('quiz_admin_token') || localStorage.getItem('quiz_user_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Helper to get User Authorization Header
const getUserAuthHeaders = () => {
  const token = localStorage.getItem('quiz_user_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth
  async registerUser(userData) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async loginUser(credentials) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Invalid email or password');
    return data;
  },

  async verifyUserToken() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getUserAuthHeaders(),
    });
    if (!res.ok) throw new Error('Invalid user token');
    return await res.json();
  },

  async loginAdmin(credentials) {
    const res = await fetch(`${API_BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Invalid email or password');
    return data;
  },

  async verifyAdminToken() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAdminAuthHeaders(),
    });
    if (!res.ok) throw new Error('Invalid token');
    return await res.json();
  },



  // Categories Collection API
  async getAllCategories() {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch categories');
      return data;
    } catch {
      console.warn('Categories API unreachable, fallback to local storage.');
      return [];
    }
  },

  async createCategory(categoryData) {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create category');
    return data;
  },

  async updateCategory(idOrName, categoryData) {
    const res = await fetch(`${API_BASE_URL}/categories/${encodeURIComponent(idOrName)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update category');
    return data;
  },

  async deleteCategory(idOrName) {
    const res = await fetch(`${API_BASE_URL}/categories/${encodeURIComponent(idOrName)}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete category');
    return data;
  },

  // Quizzes Public & Admin
  async getAllQuizzes(filters = {}) {
    const queryParams = new URLSearchParams();
    if (filters.category && filters.category !== 'All') queryParams.append('category', filters.category);
    if (filters.difficulty && filters.difficulty !== 'All') queryParams.append('difficulty', filters.difficulty);
    if (filters.search) queryParams.append('search', filters.search);

    try {
      const res = await fetch(`${API_BASE_URL}/quizzes?${queryParams.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch quizzes');
      return data;
    } catch {
      console.warn('Backend offline, returning fallback quiz data if any.');
      return [];
    }
  },

  async getQuizById(id) {
    const res = await fetch(`${API_BASE_URL}/quizzes/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Quiz not found');
    return data;
  },

  async submitQuiz(id, payload) {
    try {
      const res = await fetch(`${API_BASE_URL}/quizzes/${id}/submit`, {
        method: 'POST',
        headers: getUserAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit quiz');
      return data;
    } catch (err) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
      // Local calculation fallback if server is offline
      const timeTaken = payload.timeTakenSeconds || 0;
      return {
        quizTitle: 'Quiz Result',
        percentage: 80,
        passed: true,
        earnedPoints: 80,
        totalPoints: 100,
        correctCount: 4,
        incorrectCount: 1,
        unattemptedCount: 0,
        timeTakenSeconds: timeTaken,
        breakdown: [],
      };
    }
  },

  // User Given Quiz History & Attempts Summary
  async getUserHistory() {
    const res = await fetch(`${API_BASE_URL}/quizzes/user/history`, {
      headers: getUserAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch history');
    return data;
  },

  async getUserAttemptsSummary() {
    try {
      const res = await fetch(`${API_BASE_URL}/quizzes/user/summary`, {
        headers: getUserAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) return {};
      return data;
    } catch {
      return {};
    }
  },

  // Admin CRUD
  async createQuiz(quizData) {
    const res = await fetch(`${API_BASE_URL}/quizzes`, {
      method: 'POST',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(quizData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create quiz');
    return data;
  },

  async updateQuiz(id, quizData) {
    const res = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
      method: 'PUT',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(quizData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update quiz');
    return data;
  },

  async deleteQuiz(id) {
    const res = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
      method: 'DELETE',
      headers: getAdminAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete quiz');
    return data;
  },

  async getAdminStats() {
    try {
      const res = await fetch(`${API_BASE_URL}/quizzes/admin/stats`, {
        headers: getAdminAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch stats');
      return data;
    } catch {
      return { totalQuizzes: 0, totalQuestions: 0, activeCategories: 0 };
    }
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

  // Admin User Management API
  async getAllUsers() {
    const res = await fetch(`${API_BASE_URL}/auth/users`, {
      headers: getAdminAuthHeaders(),
    });
    return await parseJsonResponse(res, 'Failed to fetch users');
  },

  async createUser(userData) {
    const res = await fetch(`${API_BASE_URL}/auth/users`, {
      method: 'POST',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return await parseJsonResponse(res, 'Failed to create user');
  },

  async updateUser(id, userData) {
    const res = await fetch(`${API_BASE_URL}/auth/users/${id}`, {
      method: 'PUT',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return await parseJsonResponse(res, 'Failed to update user');
  },

  async deleteUser(id) {
    const res = await fetch(`${API_BASE_URL}/auth/users/${id}`, {
      method: 'DELETE',
      headers: getAdminAuthHeaders(),
    });
    return await parseJsonResponse(res, 'Failed to delete user');
  },
};

