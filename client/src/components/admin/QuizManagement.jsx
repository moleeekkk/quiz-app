import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, HelpCircle, Clock, X, Save, FileText } from 'lucide-react';

// Sub-component 1: Quiz Editor Modal
export function QuizEditorModal({
  isOpen,
  quizToEdit,
  categories = [],
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'Medium',
    durationMinutes: 10,
  });

  useEffect(() => {
    if (quizToEdit) {
      setFormData({
        _id: quizToEdit._id,
        title: quizToEdit.title || '',
        description: quizToEdit.description || '',
        category: quizToEdit.category || (categories[0] ? categories[0].name : ''),
        difficulty: quizToEdit.difficulty || 'Medium',
        durationMinutes: quizToEdit.durationMinutes || 10,
        questions: quizToEdit.questions || [],
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: categories[0] ? categories[0].name : '',
        difficulty: 'Medium',
        durationMinutes: 10,
        questions: [],
      });
    }
  }, [quizToEdit, isOpen, categories]);

  if (!isOpen) return null;

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      durationMinutes: Math.max(1, Number(formData.durationMinutes) || 10),
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl border border-[#D1FAE5] shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#D1FAE5] flex items-center justify-between shrink-0 bg-[#ECFDF5]/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#064E3B]">
              {formData._id ? 'Edit Quiz Details' : 'Create New Practice Quiz'}
            </h3>
          </div>
          <button 
            className="p-1 rounded-lg text-[#64748B] hover:text-[#064E3B] hover:bg-[#ECFDF5] transition-colors cursor-pointer"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden flex-1">
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {/* Quiz Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#064E3B]">
                Quiz Title
              </label>
              <input
                type="text"
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#D1FAE5] bg-[#F0FDF4]/40 focus:bg-white focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] text-[#064E3B]"
                placeholder="e.g. React Router & State Management"
                value={formData.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#064E3B]">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#D1FAE5] bg-[#F0FDF4]/40 focus:bg-white focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] text-[#064E3B]"
                rows="3"
                placeholder="Enter practice objective or instructions..."
                value={formData.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#064E3B]">
                Category
              </label>
              {categories.length > 0 ? (
                <select
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#D1FAE5] bg-[#F0FDF4]/40 focus:bg-white focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] text-[#064E3B]"
                  value={formData.category}
                  onChange={(e) => handleFieldChange('category', e.target.value)}
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.name || cat} value={cat.name || cat}>
                      {cat.name || cat}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#D1FAE5] bg-[#F0FDF4]/40 focus:bg-white focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] text-[#064E3B]"
                  placeholder="Enter category name..."
                  value={formData.category}
                  onChange={(e) => handleFieldChange('category', e.target.value)}
                  required
                />
              )}
            </div>

            {/* Duration & Difficulty */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#064E3B]">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#D1FAE5] bg-[#F0FDF4]/40 focus:bg-white focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] text-[#064E3B]"
                  value={formData.durationMinutes}
                  onChange={(e) => handleFieldChange('durationMinutes', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#064E3B]">
                  Difficulty
                </label>
                <select
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#D1FAE5] bg-[#F0FDF4]/40 focus:bg-white focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] text-[#064E3B]"
                  value={formData.difficulty}
                  onChange={(e) => handleFieldChange('difficulty', e.target.value)}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#D1FAE5] bg-[#F0FDF4]/50 flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#D1FAE5] text-[#334155] bg-white hover:bg-[#ECFDF5] transition-colors cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save Quiz</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Sub-component 2: Quiz Question (MCQ) Modal
const EMPTY_QUESTION_FORM = {
  questionText: '',
  options: ['', '', '', ''],
  correctOptionIndex: 0,
  points: 10,
};

export function QuizQuestionModal({ isOpen, quiz, onClose, onSaveQuestions }) {
  const [questions, setQuestions] = useState([]);
  const [newQ, setNewQ] = useState(EMPTY_QUESTION_FORM);
  const [editingIndex, setEditingIndex] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (quiz && quiz.questions) {
      setQuestions(quiz.questions);
    } else {
      setQuestions([]);
    }
    setNewQ(EMPTY_QUESTION_FORM);
    setEditingIndex(null);
    setErrorMsg('');
  }, [quiz, isOpen]);

  if (!isOpen || !quiz) return null;

  const handleEditQuestion = (idx) => {
    setEditingIndex(idx);
    setNewQ({
      ...questions[idx],
      options: [...(questions[idx].options || ['', '', '', ''])],
    });
    setErrorMsg('');
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setNewQ(EMPTY_QUESTION_FORM);
    setErrorMsg('');
  };

  const handleAddQuestionToList = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!newQ.questionText.trim()) {
      setErrorMsg('Please enter question text.');
      return;
    }
    const emptyOptionExists = newQ.options.some((opt) => !opt.trim());
    if (emptyOptionExists) {
      setErrorMsg('Please fill in options A, B, C, and D.');
      return;
    }

    if (editingIndex !== null) {
      setQuestions((prev) => {
        const updated = [...prev];
        updated[editingIndex] = { ...newQ };
        return updated;
      });
      setEditingIndex(null);
    } else {
      setQuestions((prev) => [...prev, { ...newQ }]);
    }

    setNewQ(EMPTY_QUESTION_FORM);
  };

  const handleRemoveQuestion = (idxToRemove) => {
    setQuestions((prev) => prev.filter((_, idx) => idx !== idxToRemove));
    if (editingIndex === idxToRemove) {
      handleCancelEdit();
    } else if (editingIndex !== null && editingIndex > idxToRemove) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const handleSaveAll = (e) => {
    e.preventDefault();
    onSaveQuestions(quiz._id, questions);
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-[#D1FAE5] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#D1FAE5] flex items-start justify-between bg-[#ECFDF5]/50 shrink-0">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-[#064E3B] leading-snug">
              Manage Practice Questions (MCQs)
            </h3>
            <p className="text-xs text-[#64748B] font-medium mt-0.5">{quiz.description || quiz.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#064E3B] hover:bg-[#ECFDF5] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* CURRENT PRACTICE QUESTIONS Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-[#064E3B] uppercase tracking-wider">
              CURRENT PRACTICE QUESTIONS ({questions.length})
            </h4>

            {questions.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-[#D1FAE5] bg-[#F0FDF4]/50 text-center text-xs text-[#94A3B8]">
                No practice questions added yet. Use the form below to add MCQs!
              </div>
            ) : (
              <div className="space-y-3">
                {questions.map((q, idx) => {
                  const optionLabels = ['A', 'B', 'C', 'D'];
                  const correctLabel = optionLabels[q.correctOptionIndex] || 'A';
                  const isBeingEdited = editingIndex === idx;

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border space-y-1.5 relative transition-all ${
                        isBeingEdited
                          ? 'bg-[#ECFDF5] border-[#059669] shadow-xs'
                          : 'bg-[#F0FDF4]/40 border-[#D1FAE5] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 pr-16">
                        <h5 className="text-xs sm:text-sm font-bold text-[#064E3B]">
                          {idx + 1}. {q.questionText}
                        </h5>

                        {/* Action Buttons: Edit & Delete */}
                        <div className="flex items-center gap-1 shrink-0 absolute top-3 right-3">
                          <button
                            type="button"
                            onClick={() => handleEditQuestion(idx)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isBeingEdited
                                ? 'bg-[#059669] text-white shadow-xs'
                                : 'text-[#64748B] hover:text-[#059669] hover:bg-[#ECFDF5]'
                            }`}
                            title="Edit question"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(idx)}
                            className="p-1.5 text-[#DC2626] hover:bg-[#DC2626]/10 rounded-lg transition-colors cursor-pointer"
                            title="Delete question"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-[#64748B] font-medium">
                        A: {q.options[0] || '-'} | B: {q.options[1] || '-'} | C: {q.options[2] || '-'} | D: {q.options[3] || '-'}
                      </p>

                      <div className="text-xs font-bold text-[#16A34A]">
                        Correct: Option {correctLabel}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <hr className="border-[#D1FAE5]" />

          {/* ADD / EDIT QUESTION Form Section */}
          <div className="space-y-4">
            <div className="text-xs font-extrabold text-[#059669] uppercase tracking-wider flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {editingIndex !== null ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{editingIndex !== null ? `EDIT QUESTION #${editingIndex + 1}` : 'ADD NEW QUESTION (MCQS)'}</span>
              </div>
              {editingIndex !== null && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-xs font-bold text-[#64748B] hover:text-[#DC2626] normal-case cursor-pointer underline"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {errorMsg && (
              <div className="p-3 bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-xl text-xs text-[#DC2626] font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAddQuestionToList} className="space-y-4">
              {/* Question Text */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#64748B]">
                  Question Text (question)
                </label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D1FAE5] bg-[#F0FDF4]/40 focus:bg-white focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] text-[#064E3B]"
                  placeholder="Enter question text..."
                  value={newQ.questionText}
                  onChange={(e) => setNewQ({ ...newQ, questionText: e.target.value })}
                />
              </div>

              {/* Option A & Option B */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#64748B]">Option A</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#D1FAE5] bg-[#F0FDF4]/40 focus:bg-white focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] text-[#064E3B]"
                    placeholder="Enter Option A..."
                    value={newQ.options[0]}
                    onChange={(e) => {
                      const opts = [...newQ.options];
                      opts[0] = e.target.value;
                      setNewQ({ ...newQ, options: opts });
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#64748B]">Option B</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#D1FAE5] bg-[#F0FDF4]/40 focus:bg-white focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] text-[#064E3B]"
                    placeholder="Enter Option B..."
                    value={newQ.options[1]}
                    onChange={(e) => {
                      const opts = [...newQ.options];
                      opts[1] = e.target.value;
                      setNewQ({ ...newQ, options: opts });
                    }}
                  />
                </div>
              </div>

              {/* Option C & Option D */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#64748B]">Option C</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#D1FAE5] bg-[#F0FDF4]/40 focus:bg-white focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] text-[#064E3B]"
                    placeholder="Enter Option C..."
                    value={newQ.options[2]}
                    onChange={(e) => {
                      const opts = [...newQ.options];
                      opts[2] = e.target.value;
                      setNewQ({ ...newQ, options: opts });
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#64748B]">Option D</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#D1FAE5] bg-[#F0FDF4]/40 focus:bg-white focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] text-[#064E3B]"
                    placeholder="Enter Option D..."
                    value={newQ.options[3]}
                    onChange={(e) => {
                      const opts = [...newQ.options];
                      opts[3] = e.target.value;
                      setNewQ({ ...newQ, options: opts });
                    }}
                  />
                </div>
              </div>

              {/* Correct Answer & Submit Button */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#64748B]">
                    Correct Answer (correct_answer)
                  </label>
                  <select
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-[#D1FAE5] bg-[#F0FDF4]/40 focus:bg-white focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] text-[#064E3B] cursor-pointer"
                    value={newQ.correctOptionIndex}
                    onChange={(e) =>
                      setNewQ({ ...newQ, correctOptionIndex: parseInt(e.target.value, 10) })
                    }
                  >
                    <option value={0}>Option A</option>
                    <option value={1}>Option B</option>
                    <option value={2}>Option C</option>
                    <option value={3}>Option D</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2 bg-[#059669] text-white hover:bg-[#047857] text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    {editingIndex !== null ? (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Update Question</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Add Question to List</span>
                      </>
                    )}
                  </button>

                  {editingIndex !== null && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="w-full sm:w-auto px-3 py-2 border border-[#D1FAE5] hover:bg-[#ECFDF5] text-[#64748B] text-xs font-semibold rounded-xl transition-colors cursor-pointer text-center"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 border-t border-[#D1FAE5] bg-[#F0FDF4]/50 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#D1FAE5] text-[#334155] bg-white hover:bg-[#ECFDF5] transition-colors cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-5 py-2 bg-[#059669] hover:bg-[#047857] text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            onClick={handleSaveAll}
          >
            <Save className="w-4 h-4" />
            <span>Save Questions</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Module Component: Quiz Management
export default function QuizManagement({
  filteredQuizzes = [],
  loading = false,
  onAddQuiz,
  onOpenMcqModal,
  onEditQuiz,
  onDeleteQuiz,
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-[#D1FAE5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#064E3B] mb-0">Quiz Management</h2>
        </div>

        <button
          onClick={onAddQuiz}
          className="px-4 py-2 bg-[#059669] text-white hover:bg-[#047857] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Quiz</span>
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-[#D1FAE5] p-12 text-center text-xs text-[#64748B]">
          Loading Quizzes...
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-[#D1FAE5] text-center space-y-4">
          <h3 className="text-sm font-bold text-[#064E3B] mb-0">No Quizzes Available</h3>
          <p className="text-xs text-[#64748B] mb-0">Get started by adding your first quiz.</p>
          <button
            onClick={onAddQuiz}
            className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2"
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
              onClick={() => onOpenMcqModal(quiz)}
              className="bg-white p-5 rounded-xl border border-[#D1FAE5] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
                    {quiz.category}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      quiz.difficulty === 'Easy'
                        ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                        : quiz.difficulty === 'Medium'
                        ? 'bg-[#FEF3C7] text-[#D97706]'
                        : 'bg-[#FEF2F2] text-[#DC2626]'
                    }`}
                  >
                    {quiz.difficulty}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#064E3B] group-hover:text-[#059669] transition-colors mb-1">
                  {quiz.title}
                </h3>
                <p className="text-xs text-[#64748B] line-clamp-2 mb-0">{quiz.description}</p>
              </div>

              <div className="pt-3 border-t border-[#D1FAE5] space-y-3">
                <div className="flex items-center justify-between text-xs text-[#64748B] font-medium">
                  <div className="flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-[#059669]" />
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
                      onOpenMcqModal(quiz);
                    }}
                    className="flex-1 py-2 px-3 bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#047857] text-xs font-semibold rounded-lg border border-[#A7F3D0] transition-colors cursor-pointer text-center"
                  >
                    ADD MCQs
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditQuiz(quiz);
                    }}
                    className="p-2 text-[#64748B] hover:text-[#064E3B] hover:bg-[#ECFDF5] border border-[#D1FAE5] rounded-lg transition-colors cursor-pointer"
                    title="Edit Quiz Metadata"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteQuiz(quiz);
                    }}
                    className="p-2 text-[#DC2626] hover:bg-[#FEF2F2] border border-[#D1FAE5] rounded-lg transition-colors cursor-pointer"
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
  );
}
