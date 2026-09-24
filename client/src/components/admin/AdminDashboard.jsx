import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileText,
  Tag,
  Users,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import QuizManagement, { QuizQuestionModal, QuizEditorModal } from './QuizManagement';
import CategoryManagement, { CategoryEditModal } from './CategoryManagement';
import UserManagement, { UserEditModal } from './UserManagement';

// Sub-component 1: Sidebar
export function Sidebar({
  activeModule,
  onModuleSelect,
  isCollapsed,
  onToggleCollapse,
  onLogout,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'quizzes', label: 'Quiz Management', icon: FileText },
    { id: 'categories', label: 'Category Management', icon: Tag },
    { id: 'users', label: 'User Management', icon: Users },
  ];

  const handleSelect = (id) => {
    onModuleSelect(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Top Bar (< 768px) */}
      <div className="md:hidden bg-white border-b border-[#D1FAE5] px-4 py-3 flex items-center justify-between sticky top-0 z-40 w-full shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-[#064E3B] mb-0">Admin Portal</h1>
            <p className="text-[10px] font-bold text-[#059669] uppercase tracking-wider mb-0">
              {sidebarItems.find((i) => i.id === activeModule)?.label || 'Dashboard'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl text-[#64748B] hover:text-[#064E3B] hover:bg-[#ECFDF5] border border-[#D1FAE5] transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Backdrop & Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs flex flex-col justify-start pt-16 px-4 pb-6"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="bg-white rounded-2xl border border-[#D1FAE5] shadow-xl p-4 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider px-2 mb-0">
              Navigation Menu
            </p>
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer
                      ${
                        isActive
                          ? 'bg-[#059669] text-white shadow-sm shadow-emerald-500/20'
                          : 'text-[#64748B] hover:bg-[#ECFDF5] hover:text-[#064E3B]'
                      }
                    `}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#059669]'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-2 border-t border-[#D1FAE5]">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs text-[#DC2626] font-semibold rounded-xl hover:bg-[#FEF2F2] transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar (>= 768px) */}
      <aside
        className={`
          hidden md:flex bg-white border-r border-[#D1FAE5] flex-col justify-between z-40
          transition-all duration-300 ease-in-out shrink-0 sticky top-0 h-screen
          ${isCollapsed ? 'w-16' : 'w-64'}
        `}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand Header */}
          <div
            className={`p-4 border-b border-[#D1FAE5] shrink-0 flex items-center min-h-[64px] ${
              isCollapsed ? 'justify-center flex-col gap-2' : 'justify-between'
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 rounded-xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] shrink-0" title="Admin Portal">
                <Shield className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <div className="truncate">
                  <span className="block text-[10px] tracking-wider uppercase font-extrabold text-[#059669]">
                    Admin Portal
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#064E3B] hover:bg-[#ECFDF5] border border-[#D1FAE5] transition-colors cursor-pointer"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation List */}
          <div className="px-2 py-4 overflow-y-auto flex-1 custom-scrollbar">
            {!isCollapsed && (
              <p className="px-3 text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-2">
                Portal Activities
              </p>
            )}
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onModuleSelect(item.id)}
                    title={isCollapsed ? item.label : ''}
                    className={`
                      w-full flex items-center rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer
                      ${isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'}
                      ${
                        isActive
                          ? 'bg-[#059669] text-white shadow-sm shadow-emerald-500/20'
                          : 'text-[#64748B] hover:bg-[#ECFDF5] hover:text-[#064E3B]'
                      }
                    `}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#059669]'}`} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Footer Sign Out */}
          <div className="p-2 border-t border-[#D1FAE5] shrink-0 bg-white">
            <button
              onClick={onLogout}
              title={isCollapsed ? 'Sign Out' : ''}
              className={`
                w-full flex items-center justify-center text-xs text-[#DC2626] font-semibold rounded-xl hover:bg-[#FEF2F2] transition-colors cursor-pointer
                ${isCollapsed ? 'p-2.5' : 'gap-2 px-3 py-2'}
              `}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

// Sub-component 2: Admin Overview
export function AdminOverview({
  stats,
  quizzesCount = 0,
  categoriesCount = 0,
  usersCount = 0,
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-[#D1FAE5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#064E3B] mb-0">Admin Dashboard</h2>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-[#D1FAE5] shadow-xs flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-0">Total Quizzes</span>
            <p className="text-2xl font-black text-[#064E3B] mb-0">{stats?.totalQuizzes || quizzesCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#D1FAE5] shadow-xs flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-0">Total Categories</span>
            <p className="text-2xl font-black text-[#064E3B] mb-0">{categoriesCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#D1FAE5] shadow-xs flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-0">Total Users</span>
            <p className="text-2xl font-black text-[#064E3B] mb-0">{usersCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#D1FAE5] shadow-xs flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-0">Total Questions</span>
            <p className="text-2xl font-black text-[#064E3B] mb-0">{stats?.totalQuestions || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component 3: Admin Login Modal
export function AdminLoginModal({ isOpen, onClose, onSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

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
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl border border-[#D1FAE5] shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#D1FAE5] bg-[#ECFDF5]/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#064E3B] mb-0">Admin Portal Sign In</h3>
          </div>
          <button
            className="p-1 rounded-lg text-[#64748B] hover:text-[#064E3B] hover:bg-[#ECFDF5] transition-colors cursor-pointer"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-4 sm:p-5 space-y-2.5">
            {error && (
              <div className="p-2.5 bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626] rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#064E3B] mb-0">Admin Email Address</label>
              <input
                type="email"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#D1FAE5] bg-[#F0FDF4]/30 focus:bg-white focus:outline-none focus:border-[#059669] text-[#064E3B]"
                placeholder="admin@quiz.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#064E3B] mb-0">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#D1FAE5] bg-[#F0FDF4]/30 focus:bg-white focus:outline-none focus:border-[#059669] text-[#064E3B]"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 sm:p-4 border-t border-[#D1FAE5] bg-[#ECFDF5]/50 flex justify-end gap-2">
            <button
              type="button"
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-[#D1FAE5] text-[#064E3B] hover:bg-white transition-colors cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-[#059669] hover:bg-[#047857] text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
              disabled={submitting}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main Dashboard Module Component
export default function AdminDashboard({
  categories = [],
  onAddCategory,
  onToggleCategoryActive,
  onUpdateCategory,
  onDeleteCategory,
  onAddQuiz,
  onEditQuiz,
  onDeleteQuiz,
  onSaveQuestions,
  onLogout,
}) {
  const [quizzes, setQuizzes] = useState([]);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  const getInitialModule = () => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/admin/quizzes')) return 'quizzes';
    if (path.includes('/admin/categories')) return 'categories';
    if (path.includes('/admin/users')) return 'users';
    return 'dashboard';
  };

  const [activeModule, setActiveModule] = useState(getInitialModule); // 'dashboard' | 'quizzes' | 'categories' | 'users'
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Selected Quiz for MCQ Management
  const [mcqQuiz, setMcqQuiz] = useState(null);
  const [isMcqModalOpen, setIsMcqModalOpen] = useState(false);

  // Category Edit Modal State
  const [editingCategory, setEditingCategory] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // User Edit Modal State
  const [userToEdit, setUserToEdit] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const userList = await api.getAllUsers();
      setUsers(userList || []);
    } catch (err) {
      console.warn('Failed to fetch user list:', err.message);
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const quizList = (await api.getAllQuizzes().catch(() => [])) || [];
      setQuizzes(quizList);

      let adminStats = null;
      try {
        adminStats = await api.getAdminStats();
      } catch (statsErr) {
        console.warn('Stats fetch fallback:', statsErr.message);
        const qQuestions = quizList.reduce((acc, q) => acc + (q.questions ? q.questions.length : 0), 0);
        adminStats = {
          totalQuizzes: quizList.length,
          totalQuestions: qQuestions,
          totalCategories: categories.length,
        };
      }
      setStats(adminStats);
      await fetchUsers();
    } catch (err) {
      console.error('Error loading admin dashboard:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Sync activeModule from URL path
    const syncModuleFromUrl = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('/admin/quizzes')) {
        setActiveModule('quizzes');
      } else if (path.includes('/admin/categories')) {
        setActiveModule('categories');
      } else if (path.includes('/admin/users')) {
        setActiveModule('users');
      } else if (path.includes('/admin/dashboard')) {
        setActiveModule('dashboard');
      }
    };

    const handleQuizUpdate = () => {
      fetchDashboardData();
    };

    syncModuleFromUrl();
    window.addEventListener('popstate', syncModuleFromUrl);
    window.addEventListener('quiz-updated', handleQuizUpdate);
    return () => {
      window.removeEventListener('popstate', syncModuleFromUrl);
      window.removeEventListener('quiz-updated', handleQuizUpdate);
    };
  }, []);

  const handleModuleSelect = (mod) => {
    setActiveModule(mod);
    if (mod === 'dashboard') {
      window.history.pushState({}, '', '/admin/dashboard');
    } else if (mod === 'quizzes') {
      window.history.pushState({}, '', '/admin/quizzes');
    } else if (mod === 'categories') {
      window.history.pushState({}, '', '/admin/categories');
    } else if (mod === 'users') {
      window.history.pushState({}, '', '/admin/users');
      fetchUsers();
    }
  };

  // User Actions
  const handleOpenAddUser = () => {
    setUserToEdit(null);
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (user) => {
    setUserToEdit(user);
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (userData) => {
    if (userData._id) {
      await api.updateUser(userData._id, userData);
    } else {
      await api.createUser(userData);
    }
    await fetchUsers();
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Are you sure you want to delete user account "${user.name}"?`)) {
      try {
        await api.deleteUser(user._id);
        await fetchUsers();
      } catch (err) {
        alert(err.message || 'Failed to delete user account');
      }
    }
  };

  const handleOpenMcqModal = (quiz) => {
    setMcqQuiz(quiz);
    setIsMcqModalOpen(true);
  };

  const handleOpenEditCategoryModal = (cat) => {
    setEditingCategory(cat);
    setIsCategoryModalOpen(true);
  };

  const filteredQuizzes = quizzes.filter((q) => {
    if (!searchFilter) return true;
    const term = searchFilter.toLowerCase();
    return (
      q.title.toLowerCase().includes(term) ||
      q.category.toLowerCase().includes(term) ||
      q.difficulty.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F0FDF4] w-full">
      {/* Sidebar Sub-component */}
      <Sidebar
        activeModule={activeModule}
        onModuleSelect={handleModuleSelect}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto min-w-0">
        {/* Dashboard Overview Module */}
        {activeModule === 'dashboard' && (
          <AdminOverview
            stats={stats}
            quizzesCount={quizzes.length}
            categoriesCount={categories.length}
            usersCount={users.filter((u) => u.role?.toLowerCase() !== 'admin').length}
            onModuleSelect={handleModuleSelect}
            onAddQuiz={onAddQuiz}
          />
        )}

        {/* Quiz Management Module */}
        {activeModule === 'quizzes' && (
          <QuizManagement
            filteredQuizzes={filteredQuizzes}
            loading={loading}
            onAddQuiz={onAddQuiz}
            onOpenMcqModal={handleOpenMcqModal}
            onEditQuiz={onEditQuiz}
            onDeleteQuiz={onDeleteQuiz}
          />
        )}

        {/* Category Management Module */}
        {activeModule === 'categories' && (
          <CategoryManagement
            categories={categories}
            quizzes={quizzes}
            onAddCategory={onAddCategory}
            onOpenEditCategoryModal={handleOpenEditCategoryModal}
            onDeleteCategory={onDeleteCategory}
          />
        )}

        {/* User Management Module */}
        {activeModule === 'users' && (
          <UserManagement
            users={users}
            loading={usersLoading}
            onAddUser={handleOpenAddUser}
            onEditUser={handleOpenEditUser}
            onDeleteUser={handleDeleteUser}
          />
        )}
      </main>

      {/* MCQ Manager Modal */}
      <QuizQuestionModal
        isOpen={isMcqModalOpen}
        quiz={mcqQuiz}
        onClose={() => setIsMcqModalOpen(false)}
        onSaveQuestions={async (quizId, questions) => {
          await onSaveQuestions(quizId, questions);
          setIsMcqModalOpen(false);
          fetchDashboardData();
        }}
      />

      {/* Category Edit Modal */}
      <CategoryEditModal
        isOpen={isCategoryModalOpen}
        category={editingCategory}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={(oldName, newName, isActive) => {
          if (onUpdateCategory) {
            return onUpdateCategory(oldName, newName, isActive);
          }
        }}
      />

      {/* User Edit / Create Modal */}
      <UserEditModal
        isOpen={isUserModalOpen}
        userToEdit={userToEdit}
        onClose={() => {
          setIsUserModalOpen(false);
          setUserToEdit(null);
        }}
        onSave={handleSaveUser}
      />
    </div>
  );
}
