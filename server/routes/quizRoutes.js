import express from 'express';
import {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getAdminStats,
  seedDatabase,
} from '../controllers/quizController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin stats & Seeding
router.get('/admin/stats', protectAdmin, getAdminStats);
router.post('/seed', seedDatabase);

// Public Quiz routes
router.get('/', getAllQuizzes);
router.get('/:id', getQuizById);
router.post('/:id/submit', submitQuiz);

// Admin protected Quiz routes
router.post('/', protectAdmin, createQuiz);
router.put('/:id', protectAdmin, updateQuiz);
router.delete('/:id', protectAdmin, deleteQuiz);

export default router;
