import { useState, useEffect, useCallback } from 'react';
import { Clock, ArrowLeft, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { api } from '../../services/api';

export default function QuizRunner({ quiz, onComplete, onCancel }) {
  const sessionKey = `quiz_progress_${quiz?._id || 'temp'}`;

  const [currentIndex, setCurrentIndex] = useState(() => {
    const saved = sessionStorage.getItem(sessionKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.currentIndex === 'number') return parsed.currentIndex;
      } catch {
        /* ignore invalid session data */
      }
    }
    return 0;
  });

  const [answers, setAnswers] = useState(() => {
    const saved = sessionStorage.getItem(sessionKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.answers) return parsed.answers;
      } catch {
        /* ignore invalid session data */
      }
    }
    return {};
  });

  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = sessionStorage.getItem(sessionKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.timeLeft === 'number' && parsed.timeLeft > 0) return parsed.timeLeft;
      } catch {
        /* ignore invalid session data */
      }
    }
    return (quiz.durationMinutes || 10) * 60;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-save quiz runner state to sessionStorage
  useEffect(() => {
    if (quiz?._id) {
      sessionStorage.setItem(
        sessionKey,
        JSON.stringify({
          currentIndex,
          answers,
          timeLeft,
        })
      );
    }
  }, [quiz?._id, sessionKey, currentIndex, answers, timeLeft]);

  const questions = quiz.questions || [];
  const currentQuestion = questions[currentIndex];

  const handleFinalSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const timeTaken = (quiz.durationMinutes || 10) * 60 - timeLeft;
      const result = await api.submitQuiz(quiz._id, {
        answers,
        timeTakenSeconds: timeTaken > 0 ? timeTaken : 0,
      });
      sessionStorage.removeItem(sessionKey);
      onComplete(result);
    } catch (err) {
      console.error('Quiz submission error:', err.message);
      alert('Error submitting quiz: ' + err.message);
      setIsSubmitting(false);
    }
  }, [isSubmitting, quiz, timeLeft, answers, sessionKey, onComplete]);

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
  }, [timeLeft, handleFinalSubmit]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionIndex) => {
    const qId = currentQuestion && currentQuestion._id ? currentQuestion._id.toString() : null;
    setAnswers((prev) => {
      const updated = {
        ...prev,
        [currentIndex]: optionIndex,
        [String(currentIndex)]: optionIndex,
      };
      if (qId) {
        updated[qId] = optionIndex;
      }
      return updated;
    });
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

  const answeredCount = questions.filter((q, idx) => {
    const qId = q._id ? q._id.toString() : null;
    const choice = (qId && answers[qId] !== undefined)
      ? answers[qId]
      : (answers[idx] !== undefined ? answers[idx] : answers[String(idx)]);
    return choice !== undefined && choice !== null;
  }).length;

  if (!currentQuestion) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-xl border border-[#E2E8F0] text-center space-y-4">
        <p className="text-xs text-[#64748B]">No questions found in this quiz.</p>
        <button
          className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#1E293B] text-xs font-semibold rounded-xl hover:bg-[#F8FAFC]"
          onClick={onCancel}
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  const currentQId = currentQuestion._id ? currentQuestion._id.toString() : null;
  const currentSelectedOpt = (currentQId && answers[currentQId] !== undefined)
    ? answers[currentQId]
    : (answers[currentIndex] !== undefined ? answers[currentIndex] : answers[String(currentIndex)]);

  return (
    <div className="min-h-screen bg-[#F0FDF4] flex flex-col justify-between">
      {/* Top Full Width Header */}
      <header className="bg-white border-b border-[#D1FAE5] shadow-2xs px-3 sm:px-6 py-2 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
          {/* Back Arrow & Quiz Information */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onCancel}
              className="p-1.5 rounded-xl text-[#64748B] hover:text-[#064E3B] hover:bg-[#ECFDF5] border border-[#D1FAE5] transition-colors cursor-pointer flex items-center justify-center shrink-0"
              title="Back to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <h1 className="text-xs sm:text-sm font-extrabold text-[#064E3B] tracking-tight mb-0">
                {quiz.title}
              </h1>
              <p className="text-[10px] text-[#64748B] font-medium mb-0">
                Question {currentIndex + 1} of {questions.length} | {answeredCount} Answered
              </p>
            </div>
          </div>

          {/* Countdown Timer */}
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border shadow-2xs shrink-0 ${timeLeft < 120
              ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]'
              : 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]'
              }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
      </header>

      {/* Main MCQ Content Area - Compact to fit within viewport height */}
      <main className="flex-1 flex flex-col justify-center max-w-4xl w-full mx-auto px-3 sm:px-4 py-2.5 sm:py-4">
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-[#D1FAE5] shadow-2xs space-y-3 sm:space-y-4">
          {/* Question Text */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#64748B]">
              <span className="text-[#059669]">Question {currentIndex + 1} of {questions.length}</span>
              <span className="px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
                +{currentQuestion.points || 10} Points
              </span>
            </div>
            <h2 className="text-sm sm:text-lg font-extrabold text-[#064E3B] leading-snug mb-0">
              {currentIndex + 1}. {currentQuestion.questionText}
            </h2>
          </div>

          {/* 2-Column Options Grid (A, B on top | C, D on bottom) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
            {currentQuestion.options.map((option, optIdx) => {
              const isSelected = currentSelectedOpt === optIdx;

              return (
                <button
                  key={optIdx}
                  className={`w-full p-2.5 sm:p-3 rounded-xl border transition-all flex items-center gap-2.5 text-xs text-left cursor-pointer ${isSelected
                    ? 'border-2 border-[#059669] bg-[#ECFDF5] text-[#047857] font-bold shadow-2xs'
                    : 'border-[#D1FAE5] bg-[#F0FDF4]/40 hover:bg-white hover:border-[#059669] text-[#334155] font-semibold'
                    }`}
                  onClick={() => handleSelectOption(optIdx)}
                >
                  <div
                    className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#059669] text-white' : 'bg-white border border-[#D1FAE5] text-[#64748B]'
                      }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </div>
                  <span className="break-words">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls: Previous / Next */}
          <div className="pt-2.5 border-t border-[#D1FAE5] flex items-center justify-between gap-2.5 sm:gap-3">
            <button
              className="px-3.5 sm:px-4 py-2 text-xs font-semibold rounded-xl border border-[#D1FAE5] bg-white text-[#334155] hover:bg-[#ECFDF5] flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={handlePrev}
              disabled={currentIndex === 0 || isSubmitting}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentIndex === questions.length - 1 ? (
              <button
                className="px-4 sm:px-5 py-2 bg-[#059669] hover:bg-[#047857] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
              >
                <CheckCircle className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Quiz'}</span>
              </button>
            ) : (
              <button
                className="px-4 sm:px-5 py-2 bg-[#059669] hover:bg-[#047857] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
                onClick={handleNext}
                disabled={isSubmitting}
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
