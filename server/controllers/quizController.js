import Quiz from '../models/Quiz.js';
import User from '../models/User.js';
import QuizAttempt from '../models/QuizAttempt.js';
import { defaultAdmin } from '../utils/seedData.js';

// @desc    Get all quizzes (with search/filter)
// @route   GET /api/quizzes
// @access  Public
export const getAllQuizzes = async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    let filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }
    if (difficulty && difficulty !== 'All') {
      filter.difficulty = difficulty;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const quizzes = await Quiz.find(filter).sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single quiz by ID
// @route   GET /api/quizzes/:id
// @access  Public
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new quiz
// @route   POST /api/quizzes
// @access  Private Admin
export const createQuiz = async (req, res) => {
  try {
    const { title, description, category, difficulty, durationMinutes, passingScore, questions } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const quiz = new Quiz({
      title,
      description,
      category: category || 'General',
      difficulty: difficulty || 'Medium',
      durationMinutes: Number(durationMinutes) || 10,
      passingScore: Number(passingScore) || 60,
      questions: Array.isArray(questions) ? questions : [],
    });

    const createdQuiz = await quiz.save();
    res.status(201).json(createdQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update existing quiz
// @route   PUT /api/quizzes/:id
// @access  Private Admin
export const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const { title, description, category, difficulty, durationMinutes, passingScore, questions } = req.body;

    quiz.title = title !== undefined ? title : quiz.title;
    quiz.description = description !== undefined ? description : quiz.description;
    quiz.category = category !== undefined ? category : quiz.category;
    quiz.difficulty = difficulty !== undefined ? difficulty : quiz.difficulty;
    quiz.durationMinutes = durationMinutes !== undefined ? Number(durationMinutes) : quiz.durationMinutes;
    quiz.passingScore = passingScore !== undefined ? Number(passingScore) : quiz.passingScore;
    quiz.questions = questions !== undefined ? questions : quiz.questions;

    const updatedQuiz = await quiz.save();
    res.json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private Admin
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    await Quiz.deleteOne({ _id: req.params.id });
    res.json({ message: 'Quiz deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit user answers for a quiz
// @route   POST /api/quizzes/:id/submit
// @access  Public
export const submitQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const { answers, timeTakenSeconds } = req.body; // answers: object { [questionId or index]: selectedOptionIndex }

    let totalPoints = 0;
    let earnedPoints = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    const breakdown = quiz.questions.map((q, idx) => {
      const qPoints = q.points || 10;
      totalPoints += qPoints;

      const qIdStr = q._id ? q._id.toString() : null;

      let userChoice = undefined;
      if (answers) {
        if (qIdStr && answers[qIdStr] !== undefined && answers[qIdStr] !== null) {
          userChoice = answers[qIdStr];
        } else if (q._id && answers[q._id] !== undefined && answers[q._id] !== null) {
          userChoice = answers[q._id];
        } else if (answers[idx] !== undefined && answers[idx] !== null) {
          userChoice = answers[idx];
        } else if (answers[String(idx)] !== undefined && answers[String(idx)] !== null) {
          userChoice = answers[String(idx)];
        }
      }

      const isAttempted = userChoice !== undefined && userChoice !== null;
      const isCorrect = isAttempted && Number(userChoice) === Number(q.correctOptionIndex);

      if (isCorrect) {
        earnedPoints += qPoints;
        correctCount += 1;
      } else if (isAttempted) {
        incorrectCount += 1;
      } else {
        unattemptedCount += 1;
      }

      return {
        questionId: q._id,
        questionText: q.questionText,
        options: q.options,
        userChoice: isAttempted ? Number(userChoice) : null,
        correctOptionIndex: q.correctOptionIndex,
        isCorrect,
        points: qPoints,
      };
    });

    const percentage = Math.round((earnedPoints / (totalPoints || 1)) * 100);
    const passed = percentage >= quiz.passingScore;

    let savedAttempt = null;
    if (req.user && req.user._id) {
      savedAttempt = await QuizAttempt.create({
        userId: req.user._id,
        quizId: quiz._id,
        quizTitle: quiz.title,
        category: quiz.category,
        difficulty: quiz.difficulty,
        earnedPoints,
        totalPoints,
        percentage,
        passed,
        correctCount,
        incorrectCount,
        unattemptedCount,
        totalQuestions: quiz.questions.length,
        timeTakenSeconds: timeTakenSeconds || 0,
        breakdown,
      });
    }

    res.json({
      attemptId: savedAttempt ? savedAttempt._id : null,
      quizId: quiz._id,
      quizTitle: quiz.title,
      category: quiz.category,
      difficulty: quiz.difficulty,
      passingScore: quiz.passingScore,
      earnedPoints,
      totalPoints,
      percentage,
      passed,
      correctCount,
      incorrectCount,
      unattemptedCount,
      totalQuestions: quiz.questions.length,
      timeTakenSeconds: timeTakenSeconds || 0,
      breakdown,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get authenticated user given quiz history
// @route   GET /api/quizzes/user/history
// @access  Private User
export const getUserHistory = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get summary of user quiz attempts (for card badges)
// @route   GET /api/quizzes/user/summary
// @access  Private User
export const getUserAttemptsSummary = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ userId: req.user._id }).sort({ createdAt: -1 });

    const summaryMap = {};
    attempts.forEach((attempt) => {
      const qId = attempt.quizId.toString();
      if (!summaryMap[qId]) {
        summaryMap[qId] = {
          attemptsCount: 1,
          latestPercentage: attempt.percentage,
          latestEarnedPoints: attempt.earnedPoints,
          latestTotalPoints: attempt.totalPoints,
          latestPassed: attempt.passed,
          bestPercentage: attempt.percentage,
          bestEarnedPoints: attempt.earnedPoints,
          totalQuestions: attempt.totalQuestions,
          lastAttemptedAt: attempt.createdAt,
        };
      } else {
        summaryMap[qId].attemptsCount += 1;
        if (attempt.percentage > summaryMap[qId].bestPercentage) {
          summaryMap[qId].bestPercentage = attempt.percentage;
          summaryMap[qId].bestEarnedPoints = attempt.earnedPoints;
        }
      }
    });

    res.json(summaryMap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get dashboard statistics for Admin
// @route   GET /api/quizzes/admin/stats
// @access  Private Admin
export const getAdminStats = async (req, res) => {
  try {
    const totalQuizzes = await Quiz.countDocuments();
    const quizzes = await Quiz.find();

    let totalQuestions = 0;
    const categoriesSet = new Set();

    quizzes.forEach((quiz) => {
      totalQuestions += quiz.questions ? quiz.questions.length : 0;
      if (quiz.category) categoriesSet.add(quiz.category);
    });

    res.json({
      totalQuizzes,
      totalQuestions,
      totalCategories: categoriesSet.size,
      categories: Array.from(categoriesSet),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Seed initial database admin user
// @route   POST /api/seed
// @access  Public / Admin
export const seedDatabase = async (req, res) => {
  try {
    let admin = await User.findOne({ email: defaultAdmin.email });
    if (!admin) {
      admin = new User(defaultAdmin);
      await admin.save();
    }

    if (req.body.force) {
      await Quiz.deleteMany({});
    }

    res.json({
      message: 'Database initialized successfully',
      adminCredentials: {
        email: defaultAdmin.email,
        password: defaultAdmin.password,
      },
      quizzesCount: await Quiz.countDocuments(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
