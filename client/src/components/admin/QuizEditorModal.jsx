import { useState, useEffect } from 'react';
import { X, Save, FileText } from 'lucide-react';

export default function QuizEditorModal({
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
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#1E293B]">
              {formData._id ? 'Edit Quiz Details' : 'Create New Practice Quiz'}
            </h3>
          </div>
          <button 
            className="p-1 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {/* Practice Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1E293B]">
                Quiz Title
              </label>
              <input
                type="text"
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2563EB] text-[#1E293B]"
                placeholder="e.g. React Router & State Management"
                value={formData.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1E293B]">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2563EB] text-[#1E293B]"
                rows="3"
                placeholder="Enter practice objective or instructions..."
                value={formData.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1E293B]">
                Category
              </label>
              {categories.length > 0 ? (
                <select
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2563EB] text-[#1E293B]"
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
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2563EB] text-[#1E293B]"
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
                <label className="block text-xs font-bold text-[#1E293B]">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2563EB] text-[#1E293B]"
                  value={formData.durationMinutes}
                  onChange={(e) => handleFieldChange('durationMinutes', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1E293B]">
                  Difficulty
                </label>
                <select
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2563EB] text-[#1E293B]"
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
          <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E2E8F0] text-[#1E293B] hover:bg-white transition-colors cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
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
