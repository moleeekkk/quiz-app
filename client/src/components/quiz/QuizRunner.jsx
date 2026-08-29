import React, { useState, useEffect } from 'react';
import { Clock, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { api } from '../../services/api';

export default function QuizRunner({ quiz, onComplete, onCancel }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId or index]: selectedOptionIndex }
  const [timeLeft, setTimeLeft] = useState((quiz.durationMinutes || 10) * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = quiz.questions || [];
  const currentQuestion = questions[currentIndex];

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinalSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion._id || currentIndex]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleFinalSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const timeTaken = (quiz.durationMinutes || 10) * 60 - timeLeft;
      const result = await api.submitQuiz(quiz._id, {
        answers,
        timeTakenSeconds: timeTaken > 0 ? timeTaken : 0,
      });
      onComplete(result);
    } catch (err) {
      console.error('Quiz submission error:', err.message);
      alert('Error submitting quiz: ' + err.message);
      setIsSubmitting(false);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  if (!currentQuestion) {
    return (
      <div className="empty-state">
        <p>No questions found in this quiz.</p>
        <button className="btn-secondary" onClick={onCancel} style={{ marginTop: '1rem' }}>
          Back to Quizzes
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-runner-container">
      {/* Top Header */}
      <div className="quiz-runner-header">
        <div className="runner-title-info">
          <h2>{quiz.title}</h2>
          <span>
            Question {currentIndex + 1} of {questions.length} • {answeredCount} Answered
          </span>
        </div>

        <div className={`quiz-timer-badge ${timeLeft < 120 ? 'warning' : ''}`}>
          <Clock size={18} />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="quiz-progress-bar-wrap">
        <div className="quiz-progress-fill" style={{ width: `${progressPercent}%` }}></div>
      </div>

      {/* Question Card */}
      <div className="question-card">
        <div className="question-meta">
          <span className="question-step">Question {currentIndex + 1}</span>
          <span className="question-points">+{currentQuestion.points || 10} Points</span>
        </div>

        <h3 className="question-text">{currentQuestion.questionText}</h3>

        <div className="options-list">
          {currentQuestion.options.map((option, optIdx) => {
            const selectedOpt = answers[currentQuestion._id || currentIndex];
            const isSelected = selectedOpt === optIdx;

            return (
              <button
                key={optIdx}
                className={`option-button ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelectOption(optIdx)}
              >
                <div className="option-index-badge">
                  {String.fromCharCode(65 + optIdx)}
                </div>
                <span>{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="runner-nav-footer">
        <button
          className="btn-secondary"
          onClick={handlePrev}
          disabled={currentIndex === 0 || isSubmitting}
        >
          <ChevronLeft size={18} />
          <span>Previous</span>
        </button>

        {currentIndex === questions.length - 1 ? (
          <button
            className="btn-success"
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
          >
            <CheckCircle size={18} />
            <span>{isSubmitting ? 'Submitting...' : 'Submit Quiz'}</span>
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={handleNext}
            disabled={isSubmitting}
          >
            <span>Next Question</span>
            <ChevronRight size={18} />
          </button>
        )}
      </div>

      {/* Question Quick-Jump Matrix */}
      <div className="question-matrix">
        {questions.map((q, idx) => {
          const isAnswered = answers[q._id || idx] !== undefined;
          const isCurrent = idx === currentIndex;

          return (
            <button
              key={idx}
              className={`matrix-btn ${isCurrent ? 'current' : isAnswered ? 'answered' : ''}`}
              onClick={() => setCurrentIndex(idx)}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
