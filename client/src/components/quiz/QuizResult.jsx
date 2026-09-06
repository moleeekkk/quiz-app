import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Home,
  HelpCircle,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export default function QuizResult({ result, onRetake, onBackHome }) {
  const {
    quizTitle,
    percentage,
    passed,
    earnedPoints,
    totalPoints,
    correctCount,
    incorrectCount,
    unattemptedCount,
    timeTakenSeconds,
    breakdown = [],
  } = result;

  const formatSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  return (
    <div className="w-full sm:w-[85%] max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Top Hero Score Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-xs text-center space-y-6">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${passed
              ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20'
              : 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20'
            }`}
        >
          {passed ? <Trophy className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{passed ? 'Passed - Excellent Job!' : 'Needs Practice - Try Again!'}</span>
        </div>

        {/* Big Score Number */}
        <div className="space-y-1">
          <div className={`text-4xl sm:text-5xl font-extrabold ${passed ? 'text-[#2563EB]' : 'text-[#EF4444]'}`}>
            {percentage}%
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Final Score</div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#1E293B]">{quizTitle}</h2>
          <p className="text-xs text-[#64748B] mt-1">
            You earned <strong className="text-[#1E293B]">{earnedPoints}</strong> out of <strong className="text-[#1E293B]">{totalPoints}</strong> total points!
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] text-center space-y-1">
            <CheckCircle2 className="w-5 h-5 text-[#22C55E] mx-auto" />
            <div className="text-lg font-bold text-[#1E293B]">{correctCount}</div>
            <div className="text-[10px] font-semibold text-[#64748B] uppercase">Correct</div>
          </div>

          <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] text-center space-y-1">
            <XCircle className="w-5 h-5 text-[#EF4444] mx-auto" />
            <div className="text-lg font-bold text-[#1E293B]">{incorrectCount}</div>
            <div className="text-[10px] font-semibold text-[#64748B] uppercase">Incorrect</div>
          </div>

          <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] text-center space-y-1">
            <Sparkles className="w-5 h-5 text-[#F59E0B] mx-auto" />
            <div className="text-lg font-bold text-[#1E293B]">{unattemptedCount}</div>
            <div className="text-[10px] font-semibold text-[#64748B] uppercase">Unattempted</div>
          </div>

          <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] text-center space-y-1">
            <Clock className="w-5 h-5 text-[#2563EB] mx-auto" />
            <div className="text-lg font-bold text-[#1E293B]">{formatSeconds(timeTakenSeconds)}</div>
            <div className="text-[10px] font-semibold text-[#64748B] uppercase">Time Spent</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-[#E2E8F0] text-[#1E293B] hover:bg-[#F8FAFC] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            onClick={onBackHome}
          >
            <Home className="w-4 h-4" />
            <span>Back to All Quizzes</span>
          </button>
          <button
            className="w-full sm:w-auto px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            onClick={onRetake}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Quiz</span>
          </button>
        </div>
      </div>

      {/* Detailed Question Review Breakdown */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#1E293B] flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#2563EB]" />
          <span>Answer Review ({breakdown.length} Questions)</span>
        </h3>

        <div className="space-y-3">
          {breakdown.map((item, idx) => {
            return (
              <div
                key={idx}
                className={`bg-white p-4 rounded-xl border space-y-3 ${item.isCorrect ? 'border-[#22C55E]/30 bg-[#22C55E]/5' : 'border-[#EF4444]/30 bg-[#EF4444]/5'
                  }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-xs font-bold text-[#1E293B]">
                    Q{idx + 1}. {item.questionText}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 self-start sm:self-auto ${item.isCorrect ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#EF4444]/10 text-[#EF4444]'
                      }`}
                  >
                    {item.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> Correct (+{item.points} pts)
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" /> Incorrect (0 pts)
                      </>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {item.options.map((optText, optIdx) => {
                    const isUserChoice = item.userChoice === optIdx;
                    const isCorrectChoice = item.correctOptionIndex === optIdx;

                    let bgStyle = 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]';
                    if (isUserChoice && isCorrectChoice) {
                      bgStyle = 'bg-[#22C55E]/10 border-[#22C55E] text-[#15803D] font-bold';
                    } else if (isUserChoice && !isCorrectChoice) {
                      bgStyle = 'bg-[#EF4444]/10 border-[#EF4444] text-[#B91C1C] font-bold';
                    } else if (isCorrectChoice) {
                      bgStyle = 'bg-[#22C55E]/10 border-[#22C55E] text-[#15803D] font-semibold';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2 ${bgStyle}`}
                      >
                        <span>
                          {String.fromCharCode(65 + optIdx)}. {optText}
                        </span>
                        {isUserChoice && (
                          <span className="text-[10px] font-bold uppercase shrink-0">
                            (Your Choice)
                          </span>
                        )}
                        {isCorrectChoice && !isUserChoice && (
                          <span className="text-[10px] font-bold uppercase shrink-0">
                            (Correct Answer)
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
