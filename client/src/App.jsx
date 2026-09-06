import { useState, useEffect } from 'react';
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

const INITIAL_CATEGORIES = [];

function MainApp() {
  const { isAdmin, loading: authLoading, logout } = useAuth();

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

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  // Categories State (Name & is_active status) - populated from MongoDB Category collection
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

  // URL Route listener for /admin/... and /quiz/... (waits for authLoading to complete before evaluating redirects)
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
      } else if (path.startsWith('/admin') || hash.startsWith('#admin')) {
        setActiveTab('admin');

        if (!isAdmin) {
          setIsLoginModalOpen(true);
        } else {
          // Admin is authenticated
          setIsLoginModalOpen(false);
          if (path === '/admin/create' || hash === '#admin/create') {
            setQuizToEdit(null);
            setIsEditorModalOpen(true);
          } else if (path.startsWith('/admin/edit') || hash.startsWith('#admin/edit')) {
            setIsEditorModalOpen(true);
          } else if (path === '/admin/login' || path === '/admin' || path === '/admin/') {
            window.history.replaceState({}, '', '/admin/dashboard');
          }
          // Note: Sub-routes like /admin/quizzes and /admin/categories are preserved as is
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

  // Category Management Handlers - Synced with Database Collection
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

  // Quiz Runner Handlers
  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    sessionStorage.setItem('active_quiz_data', JSON.stringify(quiz));
    window.history.pushState({}, '', `/quiz/${quiz._id || ''}`);
    setActiveTab('runner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
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
            categories={categories.filter((c) => c.is_active !== false).map((c) => c.name)}
          />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 w-full flex-1" id="quiz-grid-section">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1E293B]">
                Available Quizzes ({publicVisibleQuizzes.length})
              </h2>
            </div>

            {loading ? (
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center text-xs text-[#64748B]">
                Loading Available Quizzes...
              </div>
            ) : publicVisibleQuizzes.length === 0 ? (
              <div className="bg-white p-12 rounded-xl border border-[#E2E8F0] text-center space-y-4 max-w-md mx-auto">
                <p className="text-xs text-[#64748B]">No active quizzes found matching your criteria.</p>
                <button
                  className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#1E293B] text-xs font-semibold rounded-xl hover:bg-[#F8FAFC]"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {publicVisibleQuizzes.map((quiz) => (
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
          <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs text-center space-y-4">
            <h3 className="text-base font-bold text-[#1E293B]">Admin Authentication Required</h3>
            <p className="text-xs text-[#64748B]">
              Please sign in with admin credentials to access the management portal.
            </p>
            <button
              className="px-5 py-2.5 bg-[#2563EB] text-white text-xs font-semibold rounded-xl hover:bg-[#1D4ED8] transition-colors cursor-pointer"
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
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="bg-white border border-[#E2E8F0] shadow-lg rounded-2xl p-4 flex items-center gap-3 text-xs font-semibold text-[#1E293B]">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
            ) : (
              <AlertCircle className="w-5 h-5 text-[#EF4444]" />
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
