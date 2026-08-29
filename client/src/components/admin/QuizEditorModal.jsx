import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, FileText, CheckCircle2 } from 'lucide-react';

const EMPTY_QUESTION = {
  questionText: '',
  options: ['', '', '', ''],
  correctOptionIndex: 0,
  explanation: '',
  points: 10,
};

export default function QuizEditorModal({ isOpen, quizToEdit, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'JavaScript',
    difficulty: 'Medium',
    durationMinutes: 10,
    passingScore: 70,
    questions: [{ ...EMPTY_QUESTION }],
  });

  const [activeQIndex, setActiveQIndex] = useState(0);

  useEffect(() => {
    if (quizToEdit) {
      setFormData({
        _id: quizToEdit._id,
        title: quizToEdit.title || '',
        description: quizToEdit.description || '',
        category: quizToEdit.category || 'JavaScript',
        difficulty: quizToEdit.difficulty || 'Medium',
        durationMinutes: quizToEdit.durationMinutes || 10,
        passingScore: quizToEdit.passingScore || 70,
        questions: quizToEdit.questions && quizToEdit.questions.length > 0
          ? quizToEdit.questions
          : [{ ...EMPTY_QUESTION }],
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'JavaScript',
        difficulty: 'Medium',
        durationMinutes: 10,
        passingScore: 70,
        questions: [{ ...EMPTY_QUESTION }],
      });
    }
    setActiveQIndex(0);
  }, [quizToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (field, value) => {
    const updated = [...formData.questions];
    updated[activeQIndex] = { ...updated[activeQIndex], [field]: value };
    setFormData((prev) => ({ ...prev, questions: updated }));
  };

  const handleOptionChange = (optIndex, value) => {
    const updatedQuestions = [...formData.questions];
    const updatedOptions = [...updatedQuestions[activeQIndex].options];
    updatedOptions[optIndex] = value;
    updatedQuestions[activeQIndex] = {
      ...updatedQuestions[activeQIndex],
      options: updatedOptions,
    };
    setFormData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleAddQuestion = () => {
    const updated = [...formData.questions, { ...EMPTY_QUESTION, options: ['', '', '', ''] }];
    setFormData((prev) => ({ ...prev, questions: updated }));
    setActiveQIndex(updated.length - 1);
  };

  const handleRemoveQuestion = (indexToRemove) => {
    if (formData.questions.length <= 1) return;
    const updated = formData.questions.filter((_, idx) => idx !== indexToRemove);
    setFormData((prev) => ({ ...prev, questions: updated }));
    if (activeQIndex >= updated.length) {
      setActiveQIndex(updated.length - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const currentQ = formData.questions[activeQIndex] || EMPTY_QUESTION;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileText color="var(--primary)" size={22} />
            <h3>{formData._id ? 'Edit Quiz' : 'Create New Quiz'}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
            {/* General Quiz Meta Fields */}
            <div className="form-grid-2">
              <div className="form-group">
                <label>Quiz Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. React 19 Modern Hooks"
                  value={formData.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. React, JavaScript, Node.js"
                  value={formData.category}
                  onChange={(e) => handleFieldChange('category', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Short overview of what skills are tested..."
                value={formData.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                required
              />
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label>Difficulty</label>
                <select
                  className="form-control"
                  value={formData.difficulty}
                  onChange={(e) => handleFieldChange('difficulty', e.target.value)}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="form-group">
                <label>Duration (Minutes)</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={formData.durationMinutes}
                  onChange={(e) => handleFieldChange('durationMinutes', parseInt(e.target.value) || 1)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Passing Score (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  className="form-control"
                  value={formData.passingScore}
                  onChange={(e) => handleFieldChange('passingScore', parseInt(e.target.value) || 60)}
                  required
                />
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

            {/* Questions Section */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700' }}>
                Questions ({formData.questions.length})
              </h4>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleAddQuestion}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              >
                <Plus size={15} />
                <span>Add Question</span>
              </button>
            </div>

            {/* Question Selector Tabs */}
            <div className="editor-q-tabs">
              {formData.questions.map((q, idx) => (
                <div
                  key={idx}
                  className={`editor-q-tab ${idx === activeQIndex ? 'active' : ''}`}
                  onClick={() => setActiveQIndex(idx)}
                >
                  <span>Q{idx + 1}</span>
                  {formData.questions.length > 1 && (
                    <span
                      className="tab-delete-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveQuestion(idx);
                      }}
                      title="Remove question"
                    >
                      ×
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Current Active Question Editor */}
            <div className="active-q-box">
              <div className="form-group">
                <label>Question Text</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter question prompt..."
                  value={currentQ.questionText || ''}
                  onChange={(e) => handleQuestionChange('questionText', e.target.value)}
                  required
                />
              </div>

              {/* Options */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Multiple Choice Options (Select radio for correct answer)
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {(currentQ.options || ['', '', '', '']).map((opt, optIdx) => (
                    <div key={optIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <input
                        type="radio"
                        name={`correct_opt_${activeQIndex}`}
                        checked={currentQ.correctOptionIndex === optIdx}
                        onChange={() => handleQuestionChange('correctOptionIndex', optIdx)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--correct)' }}
                        title="Mark as correct answer"
                      />
                      <span style={{ fontWeight: '700', width: '20px', color: 'var(--text-secondary)' }}>
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(optIdx, e.target.value)}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Explanation / Rationale (Shown after submission)</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Explain why the correct answer is correct..."
                  value={currentQ.explanation || ''}
                  onChange={(e) => handleQuestionChange('explanation', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Save size={16} />
              <span>Save Quiz to Database</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
