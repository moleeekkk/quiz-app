import express from 'express';
import {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getUserHistory,
  getUserAttemptsSummary,
  getAdminStats,
  seedDatabase,
} from '../controllers/quizController.js';
import { protectAdmin, protectUser, optionalUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin stats & Seeding
router.get('/admin/stats', protectAdmin, getAdminStats);
router.post('/seed', seedDatabase);

// Protected User routes
router.get('/user/history', protectUser, getUserHistory);
router.get('/user/summary', protectUser, getUserAttemptsSummary);

// Public / User Quiz routes
router.get('/', getAllQuizzes);
router.get('/:id', getQuizById);
router.post('/:id/submit', optionalUser, submitQuiz);

// Admin protected Quiz routes
router.post('/', protectAdmin, createQuiz);
router.put('/:id', protectAdmin, updateQuiz);
router.delete('/:id', protectAdmin, deleteQuiz);

export default router;

