import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: [arrayLimit, 'Question must have at least 2 options'],
  },
  correctOptionIndex: {
    type: Number,
    required: true,
  },
  explanation: {
    type: String,
    default: '',
  },
  points: {
    type: Number,
    default: 10,
  },
});

function arrayLimit(val) {
  return val.length >= 2;
}

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      default: 'General',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    durationMinutes: {
      type: Number,
      default: 10,
    },
    passingScore: {
      type: Number,
      default: 60, // percentage
    },
    questions: [questionSchema],

  },
  { timestamps: true }
);

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
