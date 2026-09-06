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

  const answeredCount = Object.keys(answers).length;

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

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      {/* Top Full Width Header */}
      <header className="bg-white border-b border-[#E2E8F0] shadow-xs px-4 sm:px-8 py-3.5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
          {/* Back Arrow & Quiz Information */}
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="p-2 rounded-xl text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] border border-[#E2E8F0] transition-colors cursor-pointer flex items-center justify-center shrink-0"
              title="Back to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-[#1E293B] tracking-tight">
                {quiz.title}
              </h1>
              <p className="text-[11px] text-[#64748B] font-medium">
                Question {currentIndex + 1} of {questions.length} | {answeredCount} Answered
              </p>
            </div>
          </div>

          {/* Countdown Timer */}
          <div
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border shadow-xs shrink-0 ${timeLeft < 120
              ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20'
              : 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]'
              }`}
          >
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
      </header>

      {/* Main MCQ Content Area - Compact to fit within viewport height */}
      <main className="flex-1 flex flex-col justify-center max-w-4xl w-full mx-auto px-4 py-6">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-6">
          {/* Question Text */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#64748B]">
              <span className="text-[#2563EB]">Question {currentIndex + 1} of {questions.length}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#2563EB]/10 text-[#2563EB]">
                +{currentQuestion.points || 10} Points
              </span>
            </div>
            <h2 className="text-base sm:text-xl font-extrabold text-[#1E293B] leading-snug">
              {currentIndex + 1}. {currentQuestion.questionText}
            </h2>
          </div>

          {/* 2-Column Options Grid (A, B on top | C, D on bottom) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {currentQuestion.options.map((option, optIdx) => {
              const selectedOpt = answers[currentQuestion._id || currentIndex];
              const isSelected = selectedOpt === optIdx;

              return (
                <button
                  key={optIdx}
                  className={`w-full p-4 rounded-xl border transition-all flex items-center gap-3 text-xs sm:text-sm text-left cursor-pointer ${isSelected
                    ? 'border-2 border-[#2563EB] bg-[#2563EB]/10 text-[#2563EB] font-bold shadow-xs'
                    : 'border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white hover:border-[#2563EB] text-[#1E293B] font-semibold'
                    }`}
                  onClick={() => handleSelectOption(optIdx)}
                >
                  <div
                    className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#2563EB] text-white' : 'bg-white border border-[#E2E8F0] text-[#64748B]'
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
          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-4">
            <button
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl border border-[#E2E8F0] bg-white text-[#1E293B] hover:bg-[#F8FAFC] flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={handlePrev}
              disabled={currentIndex === 0 || isSubmitting}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentIndex === questions.length - 1 ? (
              <button
                className="px-6 py-2.5 bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
              >
                <CheckCircle className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Quiz'}</span>
              </button>
            ) : (
              <button
                className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
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
