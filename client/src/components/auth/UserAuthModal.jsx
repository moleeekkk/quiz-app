import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Lock, Mail, User, ArrowRight, AlertCircle, LogIn, UserPlus } from 'lucide-react';

export default function UserAuthModal({ isOpen, onClose, onSuccess }) {
  const { loginUser, registerUser } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      if (!name.trim()) {
        setError('Please enter your full name');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 4) {
        setError('Password must be at least 4 characters');
        return;
      }
    }

    setLoading(true);
    try {
      if (isRegister) {
        await registerUser(name.trim(), email.trim(), password);
      } else {
        await loginUser(email.trim(), password);
      }
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setError('');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-[#D1FAE5] shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden relative my-auto">
        {/* Header Bar */}
        <div className="px-5 sm:px-6 py-3.5 border-b border-[#D1FAE5] flex items-center justify-between bg-[#ECFDF5]/50 shrink-0">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-[#064E3B] flex items-center gap-2 mb-0">
              {isRegister ? (
                <>
                  <UserPlus className="w-5 h-5 text-[#059669]" />
                  Create User Account
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 text-[#059669]" />
                  User Sign In
                </>
              )}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#94A3B8] hover:text-[#064E3B] hover:bg-[#D1FAE5]/50 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="p-1 bg-[#ECFDF5] mx-5 sm:mx-6 mt-3 rounded-xl flex items-center gap-1 shrink-0">
          <button
            type="button"
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${!isRegister
                ? 'bg-white text-[#059669] shadow-2xs'
                : 'text-[#64748B] hover:text-[#064E3B]'
              }`}
            onClick={() => {
              setIsRegister(false);
              setError('');
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${isRegister
                ? 'bg-white text-[#059669] shadow-2xs'
                : 'text-[#64748B] hover:text-[#064E3B]'
              }`}
            onClick={() => {
              setIsRegister(true);
              setError('');
            }}
          >
            Register
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-2.5 overflow-y-auto flex-1">
          {error && (
            <div className="p-2.5 bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs font-semibold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isRegister && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#064E3B] mb-0">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="text"
                  required
                  className="w-full pl-9 pr-3.5 py-2 text-xs font-semibold bg-[#F0FDF4]/30 border border-[#D1FAE5] rounded-xl text-[#064E3B] focus:bg-white focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/10 transition-all"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#064E3B] mb-0">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="email"
                required
                className="w-full pl-9 pr-3.5 py-2 text-xs font-semibold bg-[#F0FDF4]/30 border border-[#D1FAE5] rounded-xl text-[#064E3B] focus:bg-white focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/10 transition-all"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#064E3B] mb-0">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="password"
                required
                className="w-full pl-9 pr-3.5 py-2 text-xs font-semibold bg-[#F0FDF4]/30 border border-[#D1FAE5] rounded-xl text-[#064E3B] focus:bg-white focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/10 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {isRegister && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#064E3B] mb-0">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="password"
                  required
                  className="w-full pl-9 pr-3.5 py-2 text-xs font-semibold bg-[#F0FDF4]/30 border border-[#D1FAE5] rounded-xl text-[#064E3B] focus:bg-white focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/10 transition-all"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#059669] hover:bg-[#047857] disabled:bg-[#A7F3D0] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer mt-2"
          >
            <span>{loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center pt-2 border-t border-[#D1FAE5]">
            <p className="text-xs text-[#64748B] mb-0">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                className="text-[#059669] font-bold hover:underline cursor-pointer"
                onClick={toggleMode}
              >
                {isRegister ? 'Sign In' : 'Register now'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
