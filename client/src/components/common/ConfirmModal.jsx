import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, title, message, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div 
        className="bg-white rounded-2xl border border-[#D1FAE5] shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#D1FAE5] flex items-center justify-between bg-[#ECFDF5]/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-[#DC2626]/10 text-[#DC2626]">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-[#064E3B] mb-0">{title || 'Confirm Action'}</h3>
          </div>
          <button 
            className="p-1 rounded-lg text-[#64748B] hover:text-[#064E3B] hover:bg-[#ECFDF5] transition-colors cursor-pointer"
            onClick={onCancel}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4">
          <p className="text-xs text-[#334155] leading-relaxed mb-0">{message}</p>
        </div>

        <div className="p-3 border-t border-[#D1FAE5] bg-[#F0FDF4]/50 flex justify-end gap-2">
          <button 
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-[#D1FAE5] text-[#334155] bg-white hover:bg-[#ECFDF5] transition-colors cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className="px-3.5 py-1.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-2xs"
            onClick={onConfirm}
          >
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}
