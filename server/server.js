import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import User from './models/User.js';
import Quiz from './models/Quiz.js';
import Category from './models/Category.js';
import { defaultAdmin, initialQuizzes } from './utils/seedData.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'MERN Quiz App API is running smoothly.' });
});

// Auto-seed function on server startup - ensures admin user exists
const autoSeed = async () => {
  try {
    let admin = await User.findOne({ email: defaultAdmin.email });
    if (!admin) {
      admin = new User(defaultAdmin);
      await admin.save();
      console.log(`[Seed] Initial admin created: ${defaultAdmin.email}`);
    }
  } catch (err) {
    console.error('[Seed Error]', err.message);
  }
};

const PORT = process.env.PORT || 5000;

// Connect Database and Start Server
connectDB().then(async () => {
  await autoSeed();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
