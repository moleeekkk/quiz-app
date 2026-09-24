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
    <div className="w-full sm:w-[85%] max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 space-y-4">
      {/* Top Hero Score Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#D1FAE5] shadow-2xs text-center space-y-4">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${passed
              ? 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]'
              : 'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]'
            }`}
        >
          {passed ? <Trophy className="w-4 h-4 text-[#059669]" /> : <AlertCircle className="w-4 h-4 text-[#DC2626]" />}
          <span>{passed ? 'Passed - Excellent Job!' : 'Needs Practice - Try Again!'}</span>
        </div>

        {/* Big Score Number */}
        <div className="space-y-0.5">
          <div className={`text-3xl sm:text-4xl font-extrabold ${passed ? 'text-[#059669]' : 'text-[#DC2626]'}`}>
            {percentage}%
          </div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Final Score</div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#064E3B] mb-0.5">{quizTitle}</h2>
          <p className="text-xs text-[#64748B] mt-0.5 mb-0">
            You earned <strong className="text-[#064E3B]">{earnedPoints}</strong> out of <strong className="text-[#064E3B]">{totalPoints}</strong> total points!
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <div className="bg-[#ECFDF5]/50 p-2.5 rounded-xl border border-[#D1FAE5] text-center space-y-0.5">
            <CheckCircle2 className="w-4 h-4 text-[#059669] mx-auto" />
            <div className="text-base font-bold text-[#064E3B]">{correctCount}</div>
            <div className="text-[10px] font-semibold text-[#64748B] uppercase">Correct</div>
          </div>

          <div className="bg-[#ECFDF5]/50 p-2.5 rounded-xl border border-[#D1FAE5] text-center space-y-0.5">
            <XCircle className="w-4 h-4 text-[#DC2626] mx-auto" />
            <div className="text-base font-bold text-[#064E3B]">{incorrectCount}</div>
            <div className="text-[10px] font-semibold text-[#64748B] uppercase">Incorrect</div>
          </div>

          <div className="bg-[#ECFDF5]/50 p-2.5 rounded-xl border border-[#D1FAE5] text-center space-y-0.5">
            <Sparkles className="w-4 h-4 text-[#D97706] mx-auto" />
            <div className="text-base font-bold text-[#064E3B]">{unattemptedCount}</div>
            <div className="text-[10px] font-semibold text-[#64748B] uppercase">Unattempted</div>
          </div>

          <div className="bg-[#ECFDF5]/50 p-2.5 rounded-xl border border-[#D1FAE5] text-center space-y-0.5">
            <Clock className="w-4 h-4 text-[#059669] mx-auto" />
            <div className="text-base font-bold text-[#064E3B]">{formatSeconds(timeTakenSeconds)}</div>
            <div className="text-[10px] font-semibold text-[#64748B] uppercase">Time Spent</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
          <button
            className="w-full sm:w-auto px-4 py-2 bg-white border border-[#D1FAE5] text-[#064E3B] hover:bg-[#ECFDF5] text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            onClick={onBackHome}
          >
            <Home className="w-4 h-4 text-[#059669]" />
            <span>Back to All Quizzes</span>
          </button>
          <button
            className="w-full sm:w-auto px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            onClick={onRetake}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Quiz</span>
          </button>
        </div>
      </div>

      {/* Detailed Question Review Breakdown */}
      <div className="space-y-3">
        <h3 className="text-xs sm:text-sm font-bold text-[#064E3B] flex items-center gap-2 mb-0">
          <HelpCircle className="w-4 h-4 text-[#059669]" />
          <span>Answer Review ({breakdown.length} Questions)</span>
        </h3>

        <div className="space-y-2.5">
          {breakdown.map((item, idx) => {
            return (
              <div
                key={idx}
                className={`bg-white p-3 rounded-xl border space-y-2 ${item.isCorrect ? 'border-[#A7F3D0] bg-[#ECFDF5]/60' : 'border-[#FCA5A5] bg-[#FEF2F2]/60'
                  }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="text-xs font-bold text-[#064E3B]">
                    Q{idx + 1}. {item.questionText}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 self-start sm:self-auto ${item.isCorrect ? 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]' : 'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]'
                      }`}
                  >
                    {item.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-[#059669]" /> Correct (+{item.points} pts)
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 text-[#DC2626]" /> Incorrect (0 pts)
                      </>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-0.5">
                  {item.options.map((optText, optIdx) => {
                    const isUserChoice = item.userChoice === optIdx;
                    const isCorrectChoice = item.correctOptionIndex === optIdx;

                    let bgStyle = 'bg-[#F0FDF4]/30 border-[#D1FAE5] text-[#64748B]';
                    if (isUserChoice && isCorrectChoice) {
                      bgStyle = 'bg-[#ECFDF5] border-[#A7F3D0] text-[#047857] font-bold';
                    } else if (isUserChoice && !isCorrectChoice) {
                      bgStyle = 'bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B] font-bold';
                    } else if (isCorrectChoice) {
                      bgStyle = 'bg-[#ECFDF5] border-[#A7F3D0] text-[#047857] font-semibold';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-2 rounded-lg border text-xs flex items-center justify-between gap-1.5 ${bgStyle}`}
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
