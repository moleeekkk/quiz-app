import { useState, useEffect } from 'react';
import { X, Save, Tag } from 'lucide-react';

export default function CategoryEditModal({ isOpen, category, onClose, onSave }) {
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
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#1E293B]">Edit Category</h3>
              <p className="text-xs text-[#64748B] font-medium">Update category details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl text-xs text-[#EF4444] font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Category Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1E293B]">Category Name</label>
            <input
              type="text"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2563EB] text-[#1E293B]"
              placeholder="Enter category name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Category Status */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1E293B]">Status</label>
            <select
              className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2563EB] text-[#1E293B] cursor-pointer"
              value={isActive ? 'Active' : 'Inactive'}
              onChange={(e) => setIsActive(e.target.value === 'Active')}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E2E8F0] text-[#1E293B] bg-white hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
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
