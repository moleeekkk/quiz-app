import { useState } from 'react';
import { Lock, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginModal({ isOpen, onClose, onSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleQuickFill = () => {
    setEmail('admin@quiz.com');
    setPassword('admin123');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      setSubmitting(false);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Invalid admin credentials');
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#1E293B]">Admin Portal Sign In</h3>
          </div>
          <button
            className="p-1 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}



            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1E293B]">Admin Email Address</label>
              <input
                type="email"
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2563EB] text-[#1E293B]"
                placeholder="admin@quiz.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1E293B]">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2563EB] text-[#1E293B]"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E2E8F0] text-[#1E293B] hover:bg-white transition-colors cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              disabled={submitting}
            >
              <Lock className="w-4 h-4" />
              <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
