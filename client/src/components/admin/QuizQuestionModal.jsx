import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit3, Save } from 'lucide-react';

const EMPTY_QUESTION_FORM = {
  questionText: '',
  options: ['', '', '', ''],
  correctOptionIndex: 0,
  explanation: '',
  points: 10,
};

export default function QuizQuestionModal({ isOpen, quiz, onClose, onSaveQuestions }) {
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
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-start justify-between bg-white shrink-0">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-[#1E293B] leading-snug">
              Manage Practice Questions (MCQs)
            </h3>
            <p className="text-xs text-[#64748B] font-medium mt-0.5">{quiz.description || quiz.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* CURRENT PRACTICE QUESTIONS Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-[#1E293B] uppercase tracking-wider">
              CURRENT PRACTICE QUESTIONS ({questions.length})
            </h4>

            {questions.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC] text-center text-xs text-[#94A3B8]">
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
                          ? 'bg-[#2563EB]/5 border-[#2563EB] shadow-xs'
                          : 'bg-[#F8FAFC]/70 border-[#E2E8F0] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 pr-16">
                        <h5 className="text-xs sm:text-sm font-bold text-[#1E293B]">
                          {idx + 1}. {q.questionText}
                        </h5>

                        {/* Action Buttons: Edit & Delete */}
                        <div className="flex items-center gap-1 shrink-0 absolute top-3 right-3">
                          <button
                            type="button"
                            onClick={() => handleEditQuestion(idx)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isBeingEdited
                                ? 'bg-[#2563EB] text-white shadow-xs'
                                : 'text-[#64748B] hover:text-[#2563EB] hover:bg-[#2563EB]/10'
                            }`}
                            title="Edit question"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(idx)}
                            className="p-1.5 text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors cursor-pointer"
                            title="Delete question"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-[#64748B] font-medium">
                        A: {q.options[0] || '-'} | B: {q.options[1] || '-'} | C: {q.options[2] || '-'} | D: {q.options[3] || '-'}
                      </p>

                      <div className="text-xs font-bold text-[#22C55E]">
                        Correct: Option {correctLabel}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <hr className="border-[#E2E8F0]" />

          {/* ADD / EDIT QUESTION Form Section */}
          <div className="space-y-4">
            <div className="text-xs font-extrabold text-[#2563EB] uppercase tracking-wider flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {editingIndex !== null ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{editingIndex !== null ? `EDIT QUESTION #${editingIndex + 1}` : 'ADD NEW QUESTION (MCQS)'}</span>
              </div>
              {editingIndex !== null && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-xs font-bold text-[#64748B] hover:text-[#EF4444] normal-case cursor-pointer underline"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {errorMsg && (
              <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl text-xs text-[#EF4444] font-semibold">
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
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2563EB] text-[#1E293B]"
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
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2563EB] text-[#1E293B]"
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
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2563EB] text-[#1E293B]"
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
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2563EB] text-[#1E293B]"
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
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2563EB] text-[#1E293B]"
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
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2563EB] text-[#1E293B] cursor-pointer"
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

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2 bg-[#2563EB] text-white hover:bg-[#1D4ED8] text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
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
                      className="px-3 py-2 border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#64748B] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
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
        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E2E8F0] text-[#1E293B] bg-white hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
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
