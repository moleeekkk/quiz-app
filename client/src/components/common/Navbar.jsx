import React from 'react';
import { HelpCircle, LayoutDashboard, LogIn, LogOut, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab, onOpenLoginModal }) {
  const { isAdmin, user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Brand Logo */}
        <div className="nav-logo" onClick={() => setActiveTab('home')}>
          <div className="logo-badge">
            <Sparkles size={20} color="#FFFFFF" />
          </div>
          <span>Quizify</span>
        </div>

        {/* Navigation Items */}
        <nav>
          <ul className="nav-links">
            <li>
              <button
                className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => setActiveTab('home')}
              >
                <HelpCircle size={17} />
                <span>Explore Quizzes</span>
              </button>
            </li>

            <li>
              <button
                className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`}
                onClick={() => setActiveTab('admin')}
              >
                <LayoutDashboard size={17} />
                <span>Admin Portal</span>
              </button>
            </li>

            {/* Auth Actions */}
            <li>
              {isAdmin ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="admin-badge">
                    <ShieldCheck size={14} />
                    <span>{user?.name || 'Admin'}</span>
                  </div>
                  <button className="btn-logout" onClick={logout} title="Sign Out">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button className="btn-nav-login" onClick={onOpenLoginModal}>
                  <LogIn size={16} />
                  <span>Admin Login</span>
                </button>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
