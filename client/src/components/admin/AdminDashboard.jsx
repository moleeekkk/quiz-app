import { useState, useEffect } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  FileText,
  HelpCircle,
  Search,
  Tag,
  Shield,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Check,
  X,
} from 'lucide-react';
import { api } from '../../services/api';
import QuizQuestionModal from './QuizQuestionModal';
import CategoryEditModal from './CategoryEditModal';
import Sidebar from './Sidebar';

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
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  const getInitialModule = () => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/admin/quizzes')) return 'quizzes';
    if (path.includes('/admin/categories')) return 'categories';
    return 'dashboard';
  };

  const [activeModule, setActiveModule] = useState(getInitialModule); // 'dashboard' | 'quizzes' | 'categories'
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Selected Quiz for MCQ Management
  const [mcqQuiz, setMcqQuiz] = useState(null);
  const [isMcqModalOpen, setIsMcqModalOpen] = useState(false);

  // New Category Input state
  const [newCatName, setNewCatName] = useState('');

  // Category Edit Modal State
  const [editingCategory, setEditingCategory] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const handleOpenEditCategoryModal = (cat) => {
    setEditingCategory(cat);
    setIsCategoryModalOpen(true);
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
    }
  };

  const handleOpenMcqModal = (quiz) => {
    setMcqQuiz(quiz);
    setIsMcqModalOpen(true);
  };

  const handleCreateCategorySubmit = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    onAddCategory(newCatName.trim());
    setNewCatName('');
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
    <div className="flex min-h-screen bg-[#F8FAFC] w-full">
      {/* Separate Sidebar Component */}
      <Sidebar
        activeModule={activeModule}
        onModuleSelect={handleModuleSelect}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-6 space-y-6 overflow-y-auto min-w-0">


        {/* Dashboard Module */}
        {activeModule === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#1E293B]">Admin Dashboard</h2>
              </div>
            </div>
            {/* Metrics Cards Grid - Flexible & Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Total Quizzes</span>
                  <p className="text-2xl font-black text-[#1E293B]">{stats?.totalQuizzes || quizzes.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B]">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Total Categories</span>
                  <p className="text-2xl font-black text-[#1E293B]">{categories.length}</p>
                </div>
                <div className="p-3 -xl bg-[#2563EB]/10 text-[#2563EB]">
                  <Tag className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs flex items-center justify-between gap-4 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Total Questions</span>
                  <p className="text-2xl font-black text-[#1E293B]">{stats?.totalQuestions || 0}</p>
                </div>
                <div className="p-3 rounded-xl bg-[#22C55E]/10 text-[#22C55E]">
                  <HelpCircle className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Quick Actions Grid - Flexible & Responsive */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#2563EB]/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1E293B]">Quiz Management</h3>
                    <p className="text-xs text-[#64748B]">Manage quizzes & questions</p>
                  </div>
                </div>
                <button
                  onClick={() => handleModuleSelect('quizzes')}
                  className="w-full py-2 px-3 text-xs font-semibold rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#1E293B] flex items-center justify-center transition-colors cursor-pointer"
                >
                  Manage Quizzes
                </button>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#14B8A6]/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-[#14B8A6]/10 text-[#14B8A6]">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1E293B]">Category Management</h3>
                    <p className="text-xs text-[#64748B]">Organize quiz categories</p>
                  </div>
                </div>
                <button
                  onClick={() => handleModuleSelect('categories')}
                  className="w-full py-2 px-3 text-xs font-semibold rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#1E293B] flex items-center justify-center transition-colors cursor-pointer"
                >
                  Manage Categories
                </button>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#F59E0B]/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B]">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1E293B]">Create Quiz</h3>
                    <p className="text-xs text-[#64748B]">Add a new quiz</p>
                  </div>
                </div>
                <button
                  onClick={onAddQuiz}
                  className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-[#2563EB] text-white hover:bg-[#1D4ED8] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Create Quiz
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Management Module */}
        {activeModule === 'quizzes' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#1E293B]">Quiz Management</h2>
              </div>

              <button
                onClick={onAddQuiz}
                className="px-4 py-2 bg-[#2563EB] text-white hover:bg-[#1D4ED8] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Quiz</span>
              </button>
            </div>

            {loading ? (
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center text-xs text-[#64748B]">
                Loading Quizzes...
              </div>
            ) : filteredQuizzes.length === 0 ? (
              <div className="bg-white p-12 rounded-xl border border-[#E2E8F0] text-center space-y-4">
                <h3 className="text-sm font-bold text-[#1E293B]">No Quizzes Available</h3>
                <p className="text-xs text-[#64748B]">Get started by adding your first quiz.</p>
                <button
                  onClick={onAddQuiz}
                  className="px-4 py-2 bg-[#2563EB] text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Quiz
                </button>
              </div>
            ) : (
              /* Quiz Cards Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredQuizzes.map((quiz) => (
                  <div
                    key={quiz._id}
                    onClick={() => handleOpenMcqModal(quiz)}
                    className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F59E0B]/10 text-[#D97706] border border-[#F59E0B]/20">
                          {quiz.category}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${quiz.difficulty === 'Easy'
                            ? 'bg-[#22C55E]/10 text-[#22C55E]'
                            : quiz.difficulty === 'Medium'
                              ? 'bg-[#F59E0B]/10 text-[#D97706]'
                              : 'bg-[#EF4444]/10 text-[#EF4444]'
                            }`}
                        >
                          {quiz.difficulty}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-[#1E293B] group-hover:text-[#2563EB] transition-colors mb-1">{quiz.title}</h3>
                      <p className="text-xs text-[#64748B] line-clamp-2">{quiz.description}</p>
                    </div>

                    <div className="pt-3 border-t border-[#E2E8F0] space-y-3">
                      <div className="flex items-center justify-between text-xs text-[#64748B] font-medium">
                        <div className="flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-[#2563EB]" />
                          <span>{quiz.questions ? quiz.questions.length : 0} MCQs</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-[#64748B]" />
                          <span>{quiz.durationMinutes} Mins</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenMcqModal(quiz);
                          }}
                          className="flex-1 py-2 px-3 bg-[#2563EB]/10 hover:bg-[#2563EB]/20 text-[#2563EB] text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center"
                        >
                          ADD MCQs
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditQuiz(quiz);
                          }}
                          className="p-2 text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg transition-colors cursor-pointer"
                          title="Edit Quiz Metadata"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteQuiz(quiz);
                          }}
                          className="p-2 text-[#EF4444] hover:bg-[#EF4444]/10 border border-[#E2E8F0] rounded-lg transition-colors cursor-pointer"
                          title="Delete Quiz"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Category Management Module */}
        {activeModule === 'categories' && (
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-[#1E293B]">Category Management</h3>
                <p className="text-xs text-[#64748B]">Manage active categories for public quizzes</p>
              </div>

              {/* Add Category Form */}
              <form onSubmit={handleCreateCategorySubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  className="px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2563EB] text-[#1E293B] w-48"
                  placeholder="New category name..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-[#2563EB] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 hover:bg-[#1D4ED8] transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </form>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <th className="p-3 text-[11px] font-bold text-[#64748B] uppercase">Category Name</th>
                    <th className="p-3 text-[11px] font-bold text-[#64748B] uppercase">Quiz Count</th>
                    <th className="p-3 text-[11px] font-bold text-[#64748B] uppercase">Status</th>
                    <th className="p-3 text-[11px] font-bold text-[#64748B] uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center p-6 text-xs text-[#64748B]">
                        No categories found. Add a category above!
                      </td>
                    </tr>
                  ) : (
                    categories.map((cat) => {
                      const quizCount = quizzes.filter((q) => q.category === cat.name).length;
                      const isActive = cat.is_active !== false;

                      return (
                        <tr key={cat.name} className="hover:bg-[#F8FAFC]/50 text-xs text-[#1E293B]">
                          <td className="p-3 font-bold">{cat.name}</td>
                          <td className="p-3 text-[#64748B] font-medium">{quizCount} Quizzes</td>
                          <td className="p-3">
                            {isActive ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#22C55E]/10 text-[#22C55E]">
                                <CheckCircle2 className="w-3 h-3" /> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EF4444]/10 text-[#EF4444]">
                                <XCircle className="w-3 h-3" /> Inactive
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {/* Borderless Edit Button */}
                              <button
                                type="button"
                                onClick={() => handleOpenEditCategoryModal(cat)}
                                className="p-1.5 rounded-lg text-[#2563EB] hover:bg-[#2563EB]/10 transition-colors cursor-pointer inline-flex"
                                title="Edit Category"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              {/* Borderless Delete Button */}
                              <button
                                type="button"
                                onClick={() => onDeleteCategory(cat.name)}
                                className="p-1.5 rounded-lg text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors cursor-pointer inline-flex"
                                title="Delete Category"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
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
    </div>
  );
}
