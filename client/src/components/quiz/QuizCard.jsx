import { Clock, ArrowRight } from 'lucide-react';

export default function QuizCard({ quiz, onStartQuiz }) {
  const { title, description, category, difficulty, durationMinutes, questions } = quiz;

  return (
    <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F59E0B]/10 text-[#D97706] border border-[#F59E0B]/20">
            {category}
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${difficulty === 'Easy'
              ? 'bg-[#22C55E]/10 text-[#22C55E]'
              : difficulty === 'Medium'
                ? 'bg-[#F59E0B]/10 text-[#D97706]'
                : 'bg-[#EF4444]/10 text-[#EF4444]'
              }`}
          >
            {difficulty}
          </span>
        </div>

        <h3 className="text-base font-bold text-[#1E293B] mb-1">{title}</h3>
        <p className="text-xs text-[#64748B] line-clamp-2">{description}</p>
      </div>

      <div className="pt-3 border-t border-[#E2E8F0] space-y-3">
        <div className="flex items-center justify-between text-xs text-[#64748B] font-medium">
          <div className="flex items-center gap-1.5">

            <span>{questions ? questions.length : 0} Questions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#64748B]" />
            <span>{durationMinutes} Minutes</span>
          </div>
        </div>

        <button
          className="w-full py-2.5 px-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
          onClick={() => onStartQuiz(quiz)}
        >
          <span>Start Quiz</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
