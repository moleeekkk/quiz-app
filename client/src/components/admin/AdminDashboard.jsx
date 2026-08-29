import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  FileText,
  HelpCircle,
  Folder,
  Search,
  Database,
} from 'lucide-react';
import { api } from '../../services/api';

export default function AdminDashboard({
  onAddQuiz,
  onEditQuiz,
  onDeleteQuiz,
  onSeedData,
}) {
  const [quizzes, setQuizzes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const quizList = await api.getAllQuizzes();
      setQuizzes(quizList);
      const adminStats = await api.getAdminStats();
      setStats(adminStats);
    } catch (err) {
      console.error('Error loading admin dashboard:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
    <div className="admin-container">
      {/* Header Bar */}
      <div className="admin-header-bar">
        <div className="admin-title-wrap">
          <h1>Admin Management Portal</h1>
          <p>Read, Add, Update, and Delete quizzes stored in MongoDB</p>
        </div>

        <div className="admin-action-group">
          <button className="btn-secondary" onClick={() => onSeedData(true)}>
            <Database size={16} />
            <span>Reset Seed Data</span>
          </button>

          <button className="btn-primary" onClick={onAddQuiz}>
            <Plus size={18} />
            <span>Create New Quiz</span>
          </button>
        </div>
      </div>

      {/* Analytics Summary Stats Cards */}
      <div className="stats-cards-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <FileText size={28} />
          </div>
          <div>
            <div className="admin-stat-val">{stats?.totalQuizzes || quizzes.length}</div>
            <div className="admin-stat-lbl">Total Quizzes</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <HelpCircle size={28} />
          </div>
          <div>
            <div className="admin-stat-val">{stats?.totalQuestions || 0}</div>
            <div className="admin-stat-lbl">Total Questions</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <Folder size={28} />
          </div>
          <div>
            <div className="admin-stat-val">{stats?.totalCategories || 0}</div>
            <div className="admin-stat-lbl">Categories</div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="table-card">
        <div className="table-header-toolbar">
          <h3>All Quizzes ({filteredQuizzes.length})</h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="search-box" style={{ minWidth: '220px' }}>
              <Search size={16} />
              <input
                type="text"
                className="search-input"
                placeholder="Filter table..."
                style={{ padding: '0.5rem 0.8rem 0.5rem 2.4rem', fontSize: '0.85rem' }}
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
            </div>

            <button
              className="btn-icon"
              title="Refresh"
              onClick={fetchDashboardData}
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        <div className="quiz-table-responsive">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <span>Fetching MongoDB records...</span>
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="empty-state">
              <p>No quizzes found in database.</p>
              <button
                className="btn-primary"
                onClick={onAddQuiz}
                style={{ marginTop: '1rem' }}
              >
                Create First Quiz
              </button>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th>Questions</th>
                  <th>Duration</th>
                  <th>Pass Score</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuizzes.map((quiz) => (
                  <tr key={quiz._id}>
                    <td>
                      <strong style={{ color: 'var(--text-main)' }}>{quiz.title}</strong>
                    </td>
                    <td>
                      <span className="tag-category">{quiz.category}</span>
                    </td>
                    <td>
                      <span className={`tag-difficulty difficulty-${quiz.difficulty}`}>
                        {quiz.difficulty}
                      </span>
                    </td>
                    <td>{quiz.questions ? quiz.questions.length : 0} Qs</td>
                    <td>{quiz.durationMinutes} mins</td>
                    <td>{quiz.passingScore}%</td>
                    <td>
                      <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="btn-icon edit"
                          title="Edit Quiz"
                          onClick={() => onEditQuiz(quiz)}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          className="btn-icon delete"
                          title="Delete Quiz"
                          onClick={() => onDeleteQuiz(quiz)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
