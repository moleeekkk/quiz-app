import { useState, useEffect } from 'react';
import ConfirmModal from './components/common/ConfirmModal';

import Hero from './components/quiz/Hero';
import QuizCard from './components/quiz/QuizCard';
import QuizRunner from './components/quiz/QuizRunner';
import QuizResult from './components/quiz/QuizResult';

import UserAuthModal from './components/auth/UserAuthModal';
import HistoryView from './components/user/HistoryView';
import ProfileView from './components/user/ProfileView';

import AdminDashboard, { AdminLoginModal } from './components/admin/AdminDashboard';
import { QuizEditorModal } from './components/admin/QuizManagement';

import { AuthProvider, useAuth } from './context/AuthContext';
import { api } from './services/api';
import { CheckCircle2, AlertCircle } from 'lucide-react';

function MainApp() {
  const { user, isUserLoggedIn, isAdmin, loading: authLoading, logout } = useAuth();

  // Selected Quiz & Results - initialized from sessionStorage if present
  const [activeQuiz, setActiveQuiz] = useState(() => {
    const saved = sessionStorage.getItem('active_quiz_data');
    return saved ? JSON.parse(saved) : null;
  });
  const [quizResult, setQuizResult] = useState(() => {
    const saved = sessionStorage.getItem('active_quiz_result');
    return saved ? JSON.parse(saved) : null;
  });

  // Navigation State - derived from URL pathname on page mount / reload
  const [activeTab, setActiveTab] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path.startsWith('/admin') || hash.startsWith('#admin')) {
      return 'admin';
    }
    if (path.startsWith('/history') || hash.startsWith('#history')) {
      return 'history';
    }
    if (path.startsWith('/profile') || hash.startsWith('#profile')) {
      return 'profile';
    }
    if (path.startsWith('/quiz') || hash.startsWith('#quiz')) {
      if (path.includes('/result') || hash.includes('/result')) {
        return 'result';
      }
      return 'runner';
    }
    return 'home';
  });

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // User Quiz Attempt summary map (for quiz card badges)
  const [userAttemptsMap, setUserAttemptsMap] = useState({});

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  // Categories State
  const [categories, setCategories] = useState([]);

  // Modals
  const [isUserAuthModalOpen, setIsUserAuthModalOpen] = useState(false);
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

  // Fetch User Attempts Summary Map
  const fetchUserAttemptsSummary = async () => {
    if (isUserLoggedIn) {
      try {
        const summary = await api.getUserAttemptsSummary();
        setUserAttemptsMap(summary || {});
      } catch (e) {
        setUserAttemptsMap({});
      }
    } else {
      setUserAttemptsMap({});
    }
  };

  useEffect(() => {
    fetchUserAttemptsSummary();
  }, [isUserLoggedIn]);

  // URL Route listener
  useEffect(() => {
    if (authLoading) return;

    const handleUrlSubRoutes = async () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      if (path.startsWith('/quiz') || hash.startsWith('#quiz')) {
        const fullPath = path.startsWith('/quiz') ? path : hash.replace('#', '');
        const segments = fullPath.split('/').filter(Boolean);
        const quizId = segments[1];
        const isResult = segments[2] === 'result';

        if (isResult) {
          const savedResult = sessionStorage.getItem('active_quiz_result');
          if (savedResult) {
            try {
              setQuizResult(JSON.parse(savedResult));
              setActiveTab('result');
              return;
            } catch (e) { }
          }
        }

        // Restore active quiz from sessionStorage
        const savedQuiz = sessionStorage.getItem('active_quiz_data');
        if (savedQuiz) {
          try {
            const parsed = JSON.parse(savedQuiz);
            if (!quizId || parsed._id === quizId) {
              setActiveQuiz(parsed);
              setActiveTab(isResult ? 'result' : 'runner');
              return;
            }
          } catch (e) { }
        }

        // Fetch quiz by ID from API if missing from session
        if (quizId) {
          try {
            const quizData = await api.getQuizById(quizId);
            if (quizData && quizData._id) {
              setActiveQuiz(quizData);
              sessionStorage.setItem('active_quiz_data', JSON.stringify(quizData));
              setActiveTab(isResult ? 'result' : 'runner');
              return;
            }
          } catch (err) {
            console.warn('Could not load quiz route:', err.message);
          }
        }

        // Fallback to home
        window.history.replaceState({}, '', '/');
        setActiveTab('home');
      } else if (path.startsWith('/history') || hash.startsWith('#history')) {
        setActiveTab('history');
      } else if (path.startsWith('/profile') || hash.startsWith('#profile')) {
        setActiveTab('profile');
      } else if (path.startsWith('/admin') || hash.startsWith('#admin')) {
        setActiveTab('admin');

        if (!isAdmin) {
          setIsLoginModalOpen(true);
        } else {
          setIsLoginModalOpen(false);
          if (path === '/admin/create' || hash === '#admin/create') {
            setQuizToEdit(null);
            setIsEditorModalOpen(true);
          } else if (path.startsWith('/admin/edit') || hash.startsWith('#admin/edit')) {
            setIsEditorModalOpen(true);
          } else if (path === '/admin/login' || path === '/admin' || path === '/admin/') {
            window.history.replaceState({}, '', '/admin/dashboard');
          }
        }
      }
    };

    handleUrlSubRoutes();
    window.addEventListener('popstate', handleUrlSubRoutes);
    return () => window.removeEventListener('popstate', handleUrlSubRoutes);
  }, [isAdmin, authLoading]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'admin') {
      const targetUrl = isAdmin ? '/admin/dashboard' : '/admin/login';
      window.history.pushState({}, '', targetUrl);
      if (!isAdmin) {
        setIsLoginModalOpen(true);
      }
    } else if (tab === 'history') {
      window.history.pushState({}, '', '/history');
    } else if (tab === 'profile') {
      window.history.pushState({}, '', '/profile');
    } else if (tab === 'home') {
      if (activeQuiz?._id) {
        sessionStorage.removeItem(`quiz_progress_${activeQuiz._id}`);
      }
      sessionStorage.removeItem('active_quiz_data');
      sessionStorage.removeItem('active_quiz_result');
      setActiveQuiz(null);
      setQuizResult(null);
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const [quizData, categoryData] = await Promise.all([
        api.getAllQuizzes({
          category: selectedCategory,
          difficulty: selectedDifficulty,
          search: searchQuery,
        }).catch(() => []),
        api.getAllCategories().catch(() => []),
      ]);

      setQuizzes(quizData);
      setCategories(categoryData);
    } catch (err) {
      console.error('Error fetching data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  // Active Category Filtering Rule for Main Screen:
  const activeCategoryNames = new Set(
    categories.filter((c) => c.is_active !== false).map((c) => c.name)
  );

  const publicVisibleQuizzes = quizzes.filter((q) => {
    const catName = q.category || 'General';
    return activeCategoryNames.has(catName);
  });

  // Category Management Handlers
  const handleAddCategory = async (name) => {
    if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      showToast('Category already exists!', 'error');
      return;
    }

    try {
      const created = await api.createCategory({ name, is_active: true });
      setCategories((prev) => [...prev, created._id ? created : { name, is_active: true }]);
      showToast(`Category "${name}" saved to database!`, 'success');
    } catch (err) {
      setCategories((prev) => [...prev, { name, is_active: true }]);
      showToast(`Category "${name}" added!`, 'success');
    }
  };

  const handleToggleCategoryActive = async (name) => {
    const targetCat = categories.find((c) => c.name === name);
    const newStatus = targetCat ? !targetCat.is_active : false;

    setCategories((prev) =>
      prev.map((c) => (c.name === name ? { ...c, is_active: newStatus } : c))
    );

    try {
      await api.updateCategory(targetCat?._id || name, { is_active: newStatus });
      showToast(`Category status updated.`, 'success');
    } catch (err) {
      showToast(`Category status updated.`, 'success');
    }
  };

  const handleDeleteCategory = async (name) => {
    const targetCat = categories.find((c) => c.name === name);
    setCategories((prev) => prev.filter((c) => c.name !== name));

    try {
      await api.deleteCategory(targetCat?._id || name);
      showToast(`Category "${name}" deleted from database.`, 'success');
    } catch (err) {
      showToast(`Category "${name}" removed.`, 'success');
    }
  };

  const handleUpdateCategory = async (oldName, newName, isActive) => {
    if (
      oldName.toLowerCase() !== newName.toLowerCase() &&
      categories.some((c) => c.name.toLowerCase() === newName.toLowerCase())
    ) {
      showToast('A category with that name already exists!', 'error');
      return false;
    }

    const targetCat = categories.find((c) => c.name === oldName);

    setCategories((prev) =>
      prev.map((c) => (c.name === oldName ? { ...c, name: newName, is_active: isActive } : c))
    );

    try {
      await api.updateCategory(targetCat?._id || oldName, { name: newName, is_active: isActive });
      showToast(`Category updated in database!`, 'success');
    } catch (err) {
      showToast(`Category updated!`, 'success');
    }
    return true;
  };

  // Quiz Runner Handlers - RESTRICTED TO LOGGED IN USERS
  const handleStartQuiz = (quiz) => {
    if (!isUserLoggedIn) {
      showToast('Please sign in or register to take any quiz!', 'error');
      setIsUserAuthModalOpen(true);
      return;
    }
    setActiveQuiz(quiz);
    sessionStorage.setItem('active_quiz_data', JSON.stringify(quiz));
    window.history.pushState({}, '', `/quiz/${quiz._id || ''}`);
    setActiveTab('runner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetakeQuizById = async (quizId) => {
    try {
      const quizData = await api.getQuizById(quizId);
      if (quizData) {
        handleStartQuiz(quizData);
      }
    } catch (err) {
      showToast('Could not load target quiz', 'error');
    }
  };

  const handleQuizComplete = (resultData) => {
    setQuizResult(resultData);
    sessionStorage.setItem('active_quiz_result', JSON.stringify(resultData));
    if (activeQuiz?._id) {
      sessionStorage.removeItem(`quiz_progress_${activeQuiz._id}`);
      window.history.pushState({}, '', `/quiz/${activeQuiz._id}/result`);
    } else {
      window.history.pushState({}, '', '/result');
    }
    setActiveTab('result');
    fetchUserAttemptsSummary(); // Update summary map immediately
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin Actions
  const handleOpenAddQuiz = () => {
    window.history.pushState({}, '', '/admin/create');
    setQuizToEdit(null);
    setIsEditorModalOpen(true);
  };

  const handleOpenEditQuiz = (quiz) => {
    window.history.pushState({}, '', `/admin/edit/${quiz._id || ''}`);
    setQuizToEdit(quiz);
    setIsEditorModalOpen(true);
  };

  const handleOpenDeleteQuiz = (quiz) => {
    setQuizToDelete(quiz);
    setIsConfirmModalOpen(true);
  };

  const handleCloseEditorModal = () => {
    setIsEditorModalOpen(false);
    if (activeTab === 'admin') {
      window.history.pushState({}, '', '/admin/dashboard');
    }
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
      handleCloseEditorModal();
      await fetchQuizzes();
      window.dispatchEvent(new Event('quiz-updated'));
    } catch (err) {
      showToast(err.message || 'Failed to save quiz', 'error');
    }
  };

  const handleSaveQuestions = async (quizId, questions) => {
    try {
      await api.updateQuiz(quizId, { questions });
      showToast('MCQs updated successfully!', 'success');
      await fetchQuizzes();
      window.dispatchEvent(new Event('quiz-updated'));
    } catch (err) {
      showToast(err.message || 'Failed to save questions', 'error');
    }
  };

  const handleConfirmDeleteQuiz = async () => {
    if (!quizToDelete) return;
    try {
      await api.deleteQuiz(quizToDelete._id);
      showToast('Quiz deleted from database.', 'success');
      setIsConfirmModalOpen(false);
      setQuizToDelete(null);
      await fetchQuizzes();
      window.dispatchEvent(new Event('quiz-updated'));
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
    <div className="min-h-screen bg-[#F0FDF4] flex flex-col font-sans">
      {/* Top Navbar Header */}
      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        categories={categories.filter((c) => c.is_active !== false).map((c) => c.name)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenUserLogin={() => setIsUserAuthModalOpen(true)}
      />

      {/* Main View Router */}
      {activeTab === 'home' && (
        <main className="max-w-7xl mx-auto px-3 sm:px-5 pt-4 pb-8 w-full flex-1" id="quiz-grid-section">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#064E3B] mb-0">
              Available Quizzes ({publicVisibleQuizzes.length})
            </h2>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-[#D1FAE5] p-8 text-center text-xs text-[#64748B]">
              Loading Available Quizzes...
            </div>
          ) : publicVisibleQuizzes.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-[#D1FAE5] text-center space-y-3 max-w-md mx-auto">
              <p className="text-xs text-[#64748B] mb-0">No active quizzes found matching your criteria.</p>
              <button
                className="px-3.5 py-1.5 bg-white border border-[#D1FAE5] text-[#064E3B] text-xs font-semibold rounded-xl hover:bg-[#ECFDF5]"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {publicVisibleQuizzes.map((quiz) => (
                <QuizCard
                  key={quiz._id}
                  quiz={quiz}
                  attemptSummary={userAttemptsMap[quiz._id]}
                  onStartQuiz={handleStartQuiz}
                />
              ))}
            </div>
          )}
        </main>
      )}

      {activeTab === 'history' && (
        <HistoryView
          onRetakeQuiz={handleRetakeQuizById}
          onGoHome={() => handleTabChange('home')}
        />
      )}

      {activeTab === 'profile' && (
        <ProfileView
          onGoToHistory={() => handleTabChange('history')}
          onGoHome={() => handleTabChange('home')}
        />
      )}

      {activeTab === 'runner' && activeQuiz && (
        <QuizRunner
          quiz={activeQuiz}
          onComplete={handleQuizComplete}
          onCancel={() => handleTabChange('home')}
        />
      )}

      {activeTab === 'result' && quizResult && (
        <QuizResult
          result={quizResult}
          onRetake={() => {
            if (activeQuiz) {
              handleTabChange('runner');
            } else {
              handleTabChange('home');
            }
          }}
          onBackHome={() => handleTabChange('home')}
        />
      )}

      {activeTab === 'admin' && (
        isAdmin ? (
          <AdminDashboard
            categories={categories}
            onAddCategory={handleAddCategory}
            onToggleCategoryActive={handleToggleCategoryActive}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
            onAddQuiz={handleOpenAddQuiz}
            onEditQuiz={handleOpenEditQuiz}
            onDeleteQuiz={handleOpenDeleteQuiz}
            onSaveQuestions={handleSaveQuestions}
            onSeedData={handleSeedData}
            onLogout={() => {
              logout();
              handleTabChange('home');
            }}
          />
        ) : (
          <div className="max-w-md mx-auto my-6 p-6 bg-white rounded-2xl border border-[#D1FAE5] shadow-2xs text-center space-y-3">
            <h3 className="text-sm font-bold text-[#064E3B] mb-0">Admin Authentication Required</h3>
            <p className="text-xs text-[#64748B] mb-0">
              Please sign in with admin credentials to access the management portal.
            </p>
            <button
              className="px-4 py-2 bg-[#059669] text-white text-xs font-semibold rounded-xl hover:bg-[#047857] transition-colors cursor-pointer"
              onClick={() => {
                window.history.pushState({}, '', '/admin/login');
                setIsLoginModalOpen(true);
              }}
            >
              Admin Sign In
            </button>
          </div>
        )
      )}

      {/* Modals */}
      <UserAuthModal
        isOpen={isUserAuthModalOpen}
        onClose={() => setIsUserAuthModalOpen(false)}
        onSuccess={() => {
          setIsUserAuthModalOpen(false);
          showToast('Successfully signed in!', 'success');
          fetchUserAttemptsSummary();
        }}
      />

      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          if (!isAdmin) {
            handleTabChange('home');
          }
        }}
        onSuccess={() => {
          setIsLoginModalOpen(false);
          showToast('Successfully logged in as Admin!', 'success');
          window.history.pushState({}, '', '/admin/dashboard');
          setActiveTab('admin');
        }}
      />

      <QuizEditorModal
        isOpen={isEditorModalOpen}
        quizToEdit={quizToEdit}
        categories={categories}
        onClose={handleCloseEditorModal}
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
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-5 sm:w-auto z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="bg-white border border-[#D1FAE5] shadow-lg rounded-2xl p-3 flex items-center gap-2.5 text-xs font-semibold text-[#064E3B]">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
            ) : (
              <AlertCircle className="w-4 h-4 text-[#DC2626]" />
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
