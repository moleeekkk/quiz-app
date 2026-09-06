import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, title, message, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div 
        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#EF4444]/10 text-[#EF4444]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#1E293B]">{title || 'Confirm Action'}</h3>
          </div>
          <button 
            className="p-1 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            onClick={onCancel}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-xs text-[#64748B] leading-relaxed">{message}</p>
        </div>

        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-2">
          <button 
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E2E8F0] text-[#1E293B] hover:bg-white transition-colors cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
            onClick={onConfirm}
          >
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}
