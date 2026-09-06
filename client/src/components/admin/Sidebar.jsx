import {
  LayoutDashboard,
  FileText,
  Tag,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';

export default function Sidebar({
  activeModule,
  onModuleSelect,
  isCollapsed,
  onToggleCollapse,
  onLogout,
}) {
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'quizzes', label: 'Quiz Management', icon: FileText },
    { id: 'categories', label: 'Category Management', icon: Tag },
  ];

  return (
    <aside
      className={`
        bg-white border-r border-[#E2E8F0] flex flex-col justify-between z-40
        transition-all duration-300 ease-in-out shrink-0 sticky top-0 h-screen
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Brand Header */}
        <div
          className={`p-4 border-b border-[#E2E8F0] shrink-0 flex items-center min-h-[64px] ${
            isCollapsed ? 'justify-center flex-col gap-2' : 'justify-between'
          }`}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 rounded-xl bg-[#2563EB]/10 text-[#2563EB] shrink-0" title="Admin Portal">
              <Shield className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <span className="block text-[10px] tracking-wider uppercase font-extrabold text-[#14B8A6]">
                  Admin Portal
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] border border-[#E2E8F0] transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <div className="px-2 py-4 overflow-y-auto flex-1 custom-scrollbar">
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-2">
              Portal Activities
            </p>
          )}
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onModuleSelect(item.id)}
                  title={isCollapsed ? item.label : ''}
                  className={`
                    w-full flex items-center rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer
                    ${isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'}
                    ${
                      isActive
                        ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/20'
                        : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#64748B]'}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Sign Out */}
        <div className="p-2 border-t border-[#E2E8F0] shrink-0 bg-white">
          <button
            onClick={onLogout}
            title={isCollapsed ? 'Sign Out' : ''}
            className={`
              w-full flex items-center justify-center text-xs text-[#EF4444] font-semibold rounded-xl hover:bg-[#EF4444]/10 transition-colors cursor-pointer
              ${isCollapsed ? 'p-2.5' : 'gap-2 px-3 py-2'}
            `}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
