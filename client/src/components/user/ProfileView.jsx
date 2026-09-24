import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { User, Mail, Calendar, ShieldCheck, LogOut, Award, Trophy, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';

export default function ProfileView({ onGoToHistory, onGoHome }) {
  const { user, logoutUser } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const data = await api.getUserHistory();
        setHistory(data);
      } catch (err) {
        console.warn('Could not fetch stats for profile:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  const totalQuizzes = history.length;
  const passedQuizzes = history.filter((h) => h.passed).length;
  const passRate = totalQuizzes > 0 ? Math.round((passedQuizzes / totalQuizzes) * 100) : 0;
  const totalEarnedPoints = history.reduce((acc, h) => acc + (h.earnedPoints || 0), 0);
  const avgScore = totalQuizzes > 0
    ? Math.round(history.reduce((acc, h) => acc + (h.percentage || 0), 0) / totalQuizzes)
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-5 py-4 space-y-3.5 w-full flex-1">
      {/* Profile Info Header Card */}
      <div className="bg-white border border-[#D1FAE5] rounded-3xl p-4 sm:p-5 shadow-2xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          {/* Avatar Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-[#059669] to-[#047857] rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-md shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          {/* User Details */}
          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-black text-[#064E3B] mb-0">{user?.name || 'User'}</h2>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-[#64748B] font-medium">
              <div className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span>{user?.email || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Logout Action */}
          <button
            onClick={() => {
              logoutUser();
              onGoHome();
            }}
            className="px-3.5 py-2 bg-[#FEF2F2] border border-[#FCA5A5] hover:bg-[#FEE2E2] text-[#991B1B] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer self-center sm:self-start shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Performance Dashboard */}
      <div className="space-y-2.5">
        <h3 className="text-sm font-extrabold text-[#064E3B] mb-0">Performance Dashboard</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white p-3.5 rounded-2xl border border-[#D1FAE5] shadow-2xs flex items-center gap-3">
            <div className="p-2.5 bg-[#ECFDF5] rounded-xl text-[#059669]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#64748B] mb-0">Quizzes Given</p>
              <p className="text-lg font-black text-[#064E3B] mb-0">{totalQuizzes}</p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-[#D1FAE5] shadow-2xs flex items-center gap-3">
            <div className="p-2.5 bg-[#ECFDF5] rounded-xl text-[#059669]">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#64748B] mb-0">Pass Rate</p>
              <p className="text-lg font-black text-[#059669] mb-0">{passRate}%</p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-[#D1FAE5] shadow-2xs flex items-center gap-3">
            <div className="p-2.5 bg-[#FEF3C7] rounded-xl text-[#D97706]">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#64748B] mb-0">Avg Score</p>
              <p className="text-lg font-black text-[#D97706] mb-0">{avgScore}%</p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-[#D1FAE5] shadow-2xs flex items-center gap-3">
            <div className="p-2.5 bg-[#ECFDF5] rounded-xl text-[#047857]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#64748B] mb-0">Total Points</p>
              <p className="text-lg font-black text-[#047857] mb-0">{totalEarnedPoints}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Footer Card */}
      <div className="bg-gradient-to-r from-[#059669] to-[#047857] rounded-2xl p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div>
          <h4 className="text-sm font-extrabold mb-0.5 text-white">Ready for another challenge?</h4>
          <p className="text-xs text-emerald-100 mb-0">
            Review your past answers in history or attempt a new quiz right now.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={onGoToHistory}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-all cursor-pointer"
          >
            View History
          </button>
          <button
            onClick={onGoHome}
            className="px-3.5 py-2 bg-white text-[#059669] hover:bg-emerald-50 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <span>Take Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
