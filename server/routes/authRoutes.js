import express from 'express';
import {
  registerUser,
  loginUser,
  loginAdmin,
  getMe,
  getAllUsers,
  createUserByAdmin,
  updateUserByAdmin,
  deleteUserByAdmin,
} from '../controllers/authController.js';
import { protectUser, protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin/login', loginAdmin);
router.get('/me', protectUser, getMe);

// Admin User Management Routes
router.get('/users', protectAdmin, getAllUsers);
router.post('/users', protectAdmin, createUserByAdmin);
router.put('/users/:id', protectAdmin, updateUserByAdmin);
router.delete('/users/:id', protectAdmin, deleteUserByAdmin);

export default router;

