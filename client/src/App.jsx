import React, { useState, useEffect } from 'react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ConfirmModal from './components/common/ConfirmModal';

import Hero from './components/quiz/Hero';
import QuizCard from './components/quiz/QuizCard';
import QuizRunner from './components/quiz/QuizRunner';
import QuizResult from './components/quiz/QuizResult';

import AdminDashboard from './components/admin/AdminDashboard';
import AdminLoginModal from './components/admin/AdminLoginModal';
import QuizEditorModal from './components/admin/QuizEditorModal';

import { AuthProvider, useAuth } from './context/AuthContext';
import { api } from './services/api';
import { CheckCircle2, AlertCircle } from 'lucide-react';

function MainApp() {
  const { isAdmin } = useAuth();

  // Navigation State
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'runner' | 'result' | 'admin'
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected Quiz & Results
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizResult, setQuizResult] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [categories, setCategories] = useState([]);

  // Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [quizToEdit, setQuizToEdit] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);

  // Toast message
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const data = await api.getAllQuizzes({
        category: selectedCategory,
        difficulty: selectedDifficulty,
        search: searchQuery,
      });
      setQuizzes(data);

      // Extract unique categories
      const cats = Array.from(new Set(data.map((q) => q.category).filter(Boolean)));
      setCategories(cats);
    } catch (err) {
      console.error('Error fetching quizzes:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  // Quiz Runner Handlers
  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setActiveTab('runner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuizComplete = (resultData) => {
    setQuizResult(resultData);
    setActiveTab('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin Actions
  const handleOpenAddQuiz = () => {
    setQuizToEdit(null);
    setIsEditorModalOpen(true);
  };

  const handleOpenEditQuiz = (quiz) => {
    setQuizToEdit(quiz);
    setIsEditorModalOpen(true);
  };

  const handleOpenDeleteQuiz = (quiz) => {
    setQuizToDelete(quiz);
    setIsConfirmModalOpen(true);
  };

  const handleSaveQuiz = async (quizData) => {
    try {
      if (quizData._id) {
        await api.updateQuiz(quizData._id, quizData);
        showToast('Quiz updated successfully!', 'success');
      } else {
        await api.createQuiz(quizData);
        showToast('New quiz created successfully!', 'success');
      }
      setIsEditorModalOpen(false);
      fetchQuizzes();
    } catch (err) {
      showToast(err.message || 'Failed to save quiz', 'error');
    }
  };

  const handleConfirmDeleteQuiz = async () => {
    if (!quizToDelete) return;
    try {
      await api.deleteQuiz(quizToDelete._id);
      showToast('Quiz deleted from database.', 'success');
      setIsConfirmModalOpen(false);
      setQuizToDelete(null);
      fetchQuizzes();
    } catch (err) {
      showToast(err.message || 'Failed to delete quiz', 'error');
    }
  };

  const handleSeedData = async (force = false) => {
    try {
      const res = await api.seedData(force);
      showToast(res.message || 'Database seeded!', 'success');
      fetchQuizzes();
    } catch (err) {
      showToast(err.message || 'Seeding failed', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Main View Router */}
      {activeTab === 'home' && (
        <>
          <Hero
            onExploreClick={() => {
              const el = document.getElementById('quiz-grid-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={setSelectedDifficulty}
            categories={categories}
          />

          <main className="main-content" id="quiz-grid-section">
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>
                Available Quizzes ({quizzes.length})
              </h2>
            </div>

            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <span>Loading Available Quizzes...</span>
              </div>
            ) : quizzes.length === 0 ? (
              <div className="empty-state">
                <p>No quizzes found matching your search filter criteria.</p>
                <button
                  className="btn-secondary"
                  style={{ marginTop: '1rem' }}
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedDifficulty('All');
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="quiz-grid">
                {quizzes.map((quiz) => (
                  <QuizCard
                    key={quiz._id}
                    quiz={quiz}
                    onStartQuiz={handleStartQuiz}
                  />
                ))}
              </div>
            )}
          </main>
        </>
      )}

      {activeTab === 'runner' && activeQuiz && (
        <QuizRunner
          quiz={activeQuiz}
          onComplete={handleQuizComplete}
          onCancel={() => setActiveTab('home')}
        />
      )}

      {activeTab === 'result' && quizResult && (
        <QuizResult
          result={quizResult}
          onRetake={() => {
            if (activeQuiz) {
              setActiveTab('runner');
            } else {
              setActiveTab('home');
            }
          }}
          onBackHome={() => setActiveTab('home')}
        />
      )}

      {activeTab === 'admin' && (
        isAdmin ? (
          <AdminDashboard
            onAddQuiz={handleOpenAddQuiz}
            onEditQuiz={handleOpenEditQuiz}
            onDeleteQuiz={handleOpenDeleteQuiz}
            onSeedData={handleSeedData}
          />
        ) : (
          <div className="empty-state">
            <h3>Admin Authentication Required</h3>
            <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              Please sign in with admin credentials to access management features.
            </p>
            <button className="btn-primary" onClick={() => setIsLoginModalOpen(true)}>
              Admin Login
            </button>
          </div>
        )
      )}

      <Footer />

      {/* Modals */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          showToast('Successfully logged in as Admin!', 'success');
          setActiveTab('admin');
        }}
      />

      <QuizEditorModal
        isOpen={isEditorModalOpen}
        quizToEdit={quizToEdit}
        onClose={() => setIsEditorModalOpen(false)}
        onSave={handleSaveQuiz}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title="Delete Quiz"
        message={`Are you sure you want to delete "${quizToDelete?.title}"? This action cannot be undone.`}
        onCancel={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDeleteQuiz}
      />

      {/* Toast Notification Banner */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            {toast.type === 'success' ? (
              <CheckCircle2 size={18} color="var(--correct)" />
            ) : (
              <AlertCircle size={18} color="var(--wrong)" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
