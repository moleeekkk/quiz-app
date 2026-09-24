import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, CheckCircle2, XCircle, X, Save, Tag } from 'lucide-react';

// Sub-component: Category Edit Modal
export function CategoryEditModal({ isOpen, category, onClose, onSave }) {
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setIsActive(category.is_active !== false);
      setErrorMsg('');
    }
  }, [category, isOpen]);

  if (!isOpen || !category) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Category name cannot be empty.');
      return;
    }

    const success = onSave(category.name, name.trim(), isActive);
    if (success !== false) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-[#D1FAE5] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#D1FAE5] flex items-center justify-between bg-[#ECFDF5]/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#064E3B]">Edit Category</h3>
              <p className="text-xs text-[#64748B] font-medium">Update category details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#064E3B] hover:bg-[#ECFDF5] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-xl text-xs text-[#DC2626] font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Category Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#064E3B]">Category Name</label>
            <input
              type="text"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D1FAE5] bg-[#F0FDF4]/40 focus:bg-white focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] text-[#064E3B]"
              placeholder="Enter category name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Category Status */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#064E3B]">Status</label>
            <select
              className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-[#D1FAE5] bg-[#F0FDF4]/40 focus:bg-white focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] text-[#064E3B] cursor-pointer"
              value={isActive ? 'Active' : 'Inactive'}
              onChange={(e) => setIsActive(e.target.value === 'Active')}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#D1FAE5] flex items-center justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#D1FAE5] text-[#334155] bg-white hover:bg-[#ECFDF5] transition-colors cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#059669] hover:bg-[#047857] text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main Module Component: Category Management
export default function CategoryManagement({
  categories = [],
  quizzes = [],
  onAddCategory,
  onOpenEditCategoryModal,
  onDeleteCategory,
}) {
  const [newCatName, setNewCatName] = useState('');

  const handleCreateCategorySubmit = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    onAddCategory(newCatName.trim());
    setNewCatName('');
  };

  return (
    <div className="bg-white rounded-xl border border-[#D1FAE5] shadow-xs overflow-hidden">
      <div className="p-5 border-b border-[#D1FAE5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[#064E3B] mb-0">Category Management</h3>
        </div>

        {/* Add Category Form */}
        <form
          onSubmit={handleCreateCategorySubmit}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto"
        >
          <input
            type="text"
            className="px-3 py-2 text-xs rounded-xl border border-[#D1FAE5] bg-[#F0FDF4]/30 focus:bg-white focus:outline-none focus:border-[#059669] text-[#064E3B] w-full sm:w-48"
            placeholder="New category name..."
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#059669] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 hover:bg-[#047857] transition-colors cursor-pointer shrink-0 shadow-2xs"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#ECFDF5]/50 border-b border-[#D1FAE5]">
              <th className="p-3 text-[11px] font-bold text-[#064E3B] uppercase">Category Name</th>
              <th className="p-3 text-[11px] font-bold text-[#064E3B] uppercase">Quiz Count</th>
              <th className="p-3 text-[11px] font-bold text-[#064E3B] uppercase">Status</th>
              <th className="p-3 text-[11px] font-bold text-[#064E3B] uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D1FAE5]">
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
                  <tr key={cat.name} className="hover:bg-[#F0FDF4] text-xs text-[#064E3B]">
                    <td className="p-3 font-bold">{cat.name}</td>
                    <td className="p-3 text-[#64748B] font-medium">{quizCount}</td>
                    <td className="p-3">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
                          <CheckCircle2 className="w-3 h-3 text-[#059669]" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]">
                          <XCircle className="w-3 h-3 text-[#DC2626]" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onOpenEditCategoryModal(cat)}
                          className="p-1.5 rounded-lg text-[#059669] hover:bg-[#ECFDF5] transition-colors cursor-pointer inline-flex"
                          title="Edit Category"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteCategory(cat.name)}
                          className="p-1.5 rounded-lg text-[#DC2626] hover:bg-[#FEF2F2] transition-colors cursor-pointer inline-flex"
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
  );
}
