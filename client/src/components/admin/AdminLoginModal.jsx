import React, { useState } from 'react';
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
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid admin credentials');
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck color="var(--primary)" size={22} />
            <h3>Admin Portal Sign In</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div
                style={{
                  background: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  color: 'var(--wrong)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                }}
              >
                {error}
              </div>
            )}

            {/* Quick credentials hint */}
            <div className="credential-hint">
              <div>
                <strong>Default Credentials:</strong> admin@quiz.com / admin123
              </div>
              <button
                type="button"
                className="btn-quick-fill"
                onClick={handleQuickFill}
              >
                Fill Credentials
              </button>
            </div>

            <div className="form-group">
              <label>Admin Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="admin@quiz.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
            >
              <Lock size={16} />
              <span>{submitting ? 'Authenticating...' : 'Sign In as Admin'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
