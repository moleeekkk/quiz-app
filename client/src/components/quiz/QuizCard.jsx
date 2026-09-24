import { Clock, ArrowRight, CheckCircle2, Award, RotateCcw } from 'lucide-react';

export default function QuizCard({ quiz, attemptSummary, onStartQuiz }) {
  const { title, description, category, difficulty, durationMinutes, questions } = quiz;
  const hasAttempted = attemptSummary && attemptSummary.attemptsCount > 0;

  return (
    <div className={`bg-white p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-2.5 relative overflow-hidden ${
      hasAttempted ? 'border-[#10B981]/40 shadow-2xs bg-gradient-to-b from-white to-[#ECFDF5]/50' : 'border-[#D1FAE5] hover:border-[#059669] hover:shadow-md'
    }`}>
      {/* Top badges */}
      <div>
        <div className="flex items-center justify-between gap-1.5 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
            {category}
          </span>
          <div className="flex items-center gap-1">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                difficulty === 'Easy'
                  ? 'bg-[#10B981]/10 text-[#059669]'
                  : difficulty === 'Medium'
                  ? 'bg-[#F59E0B]/10 text-[#D97706]'
                  : 'bg-[#EF4444]/10 text-[#DC2626]'
              }`}
            >
              {difficulty}
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-sm sm:text-base font-extrabold text-[#064E3B] mb-0.5">{title}</h3>
        <p className="text-xs text-[#64748B] line-clamp-2 mb-0">{description}</p>
      </div>

      {/* Attempt Score Banner if Given */}
      {hasAttempted && (
        <div className="bg-[#ECFDF5] border border-[#A7F3D0] p-2 rounded-xl flex items-center justify-between text-xs my-0.5">
          <div className="flex items-center gap-1.5 font-bold text-[#047857]">
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            <span>Already Given</span>
          </div>
          <div className="font-extrabold text-[#065F46]">
            Score: {attemptSummary.bestPercentage}%
          </div>
        </div>
      )}

      {/* Footer Info & Start Button */}
      <div className="pt-2 border-t border-[#D1FAE5] space-y-2">
        <div className="flex items-center justify-between text-xs text-[#64748B] font-medium">
          <div className="flex items-center gap-1">
            <span>{questions ? questions.length : 0} Questions</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#64748B]" />
            <span>{durationMinutes} Minutes</span>
          </div>
        </div>

        <button
          className={`w-full py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
            hasAttempted
              ? 'bg-[#059669] hover:bg-[#047857] text-white'
              : 'bg-[#059669] hover:bg-[#047857] text-white'
          }`}
          onClick={() => onStartQuiz(quiz)}
        >
          {hasAttempted ? (
            <>
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </>
          ) : (
            <>
              <span>Start Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
