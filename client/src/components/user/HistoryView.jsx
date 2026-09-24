import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { History, Award, CheckCircle2, XCircle, Clock, Calendar, RefreshCw, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

export default function HistoryView({ onRetakeQuiz, onGoHome }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getUserHistory();
      setHistory(data);
    } catch (err) {
      setError(err.message || 'Failed to load quiz history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Compute Statistics
  const totalAttempts = history.length;
  const passedCount = history.filter((h) => h.passed).length;
  const passRate = totalAttempts > 0 ? Math.round((passedCount / totalAttempts) * 100) : 0;
  const totalEarned = history.reduce((acc, h) => acc + (h.earnedPoints || 0), 0);
  const avgPercentage = totalAttempts > 0
    ? Math.round(history.reduce((acc, h) => acc + (h.percentage || 0), 0) / totalAttempts)
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-5 py-4 space-y-3.5 w-full flex-1">
      {/* Header Banner */}
      <div className="bg-white border border-[#D1FAE5] rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#ECFDF5] rounded-xl text-[#059669]">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#064E3B] mb-0">My Quiz History</h2>
            </div>
          </div>
        </div>
        <button
          onClick={fetchHistory}
          className="px-3.5 py-1.5 bg-[#ECFDF5] border border-[#A7F3D0] hover:bg-[#D1FAE5] text-[#047857] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh History</span>
        </button>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-[#D1FAE5] shadow-2xs">
          <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-0">Quizzes Attempted</p>
          <p className="text-xl font-black text-[#064E3B] mt-0.5 mb-0">{totalAttempts}</p>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-[#D1FAE5] shadow-2xs">
          <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-0">Passed Quizzes</p>
          <p className="text-xl font-black text-[#059669] mt-0.5 mb-0">{passedCount}</p>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-[#D1FAE5] shadow-2xs">
          <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-0">Pass Rate</p>
          <p className="text-xl font-black text-[#059669] mt-0.5 mb-0">{passRate}%</p>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-[#D1FAE5] shadow-2xs">
          <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-0">Average Score</p>
          <p className="text-xl font-black text-[#059669] mt-0.5 mb-0">{avgPercentage}%</p>
        </div>
      </div>

      {/* History List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-[#D1FAE5] p-8 text-center text-xs text-[#64748B]">
          Loading your quiz history...
        </div>
      ) : error ? (
        <div className="bg-[#FEF2F2] border border-[#FCA5A5] p-4 rounded-2xl text-center text-xs text-[#991B1B]">
          {error}
        </div>
      ) : history.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-[#D1FAE5] text-center space-y-3 max-w-md mx-auto">
          <div className="w-10 h-10 bg-[#ECFDF5] rounded-full flex items-center justify-center mx-auto text-[#059669]">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#064E3B] mb-0">No Quizzes Given Yet</h3>
          <p className="text-xs text-[#64748B] mb-0">
            You haven't completed any quizzes yet. Explore available quizzes and test your knowledge!
          </p>
          <button
            onClick={onGoHome}
            className="px-4 py-2 bg-[#059669] text-white text-xs font-semibold rounded-xl hover:bg-[#047857] transition-colors cursor-pointer"
          >
            Explore Quizzes
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {history.map((attempt) => {
            const isExpanded = expandedId === attempt._id;
            const dateStr = attempt.createdAt
              ? new Date(attempt.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
              : 'Recently';

            return (
              <div
                key={attempt._id}
                className="bg-white border border-[#D1FAE5] rounded-2xl shadow-2xs overflow-hidden transition-all"
              >
                <div className="p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Left info */}
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
                        {attempt.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                        {attempt.difficulty}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${attempt.passed
                          ? 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]'
                          : 'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]'
                          }`}
                      >
                        {attempt.passed ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-[#059669]" /> Passed
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-[#DC2626]" /> Failed
                          </>
                        )}
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-[#064E3B] mb-0">{attempt.quizTitle}</h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B] font-medium">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#94A3B8]" />
                        <span>{dateStr}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#94A3B8]" />
                        <span>
                          {Math.floor(attempt.timeTakenSeconds / 60)}m {attempt.timeTakenSeconds % 60}s
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Score & Actions */}
                  <div className="flex items-center gap-3 border-t md:border-t-0 pt-2 md:pt-0 border-[#ECFDF5]">
                    <div className="text-right">
                      <div className="text-[11px] text-[#64748B] font-medium">Score Given</div>
                      <div className="text-base font-black text-[#064E3B]">
                        {attempt.earnedPoints} / {attempt.totalPoints}{' '}
                        <span
                          className={`text-xs font-bold ${attempt.passed ? 'text-[#059669]' : 'text-[#DC2626]'
                            }`}
                        >
                          ({attempt.percentage}%)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {attempt.quizId && (
                        <button
                          onClick={() => onRetakeQuiz(attempt.quizId)}
                          className="px-3 py-1.5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-2xs"
                        >
                          Retake
                        </button>
                      )}

                      {attempt.breakdown && attempt.breakdown.length > 0 && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : attempt._id)}
                          className="p-1.5 border border-[#D1FAE5] hover:bg-[#ECFDF5] text-[#64748B] rounded-xl transition-colors cursor-pointer"
                          title="Toggle Question Details"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Question Breakdown */}
                {isExpanded && attempt.breakdown && (
                  <div className="bg-[#ECFDF5]/40 p-3.5 border-t border-[#D1FAE5] space-y-2">
                    <h4 className="text-[11px] font-bold text-[#064E3B] uppercase tracking-wider mb-0">
                      Question Breakdown ({attempt.breakdown.length})
                    </h4>
                    <div className="space-y-2">
                      {attempt.breakdown.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-2.5 rounded-xl border border-[#D1FAE5] text-xs space-y-1"
                        >
                          <div className="flex items-start justify-between gap-2 font-bold text-[#064E3B]">
                            <span>
                              {idx + 1}. {item.questionText}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] ${item.isCorrect
                                ? 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]'
                                : 'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]'
                                }`}
                            >
                              {item.isCorrect ? 'Correct' : 'Incorrect'}
                            </span>
                          </div>

                          <div className="text-[#64748B] space-y-0.5">
                            <div>
                              Your answer:{' '}
                              <span className="font-semibold text-[#064E3B]">
                                {item.userChoice !== null && item.options ? item.options[item.userChoice] : 'Unattempted'}
                              </span>
                            </div>
                            {!item.isCorrect && item.options && (
                              <div className="text-[#059669] font-semibold">
                                Correct answer: {item.options[item.correctOptionIndex]}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
