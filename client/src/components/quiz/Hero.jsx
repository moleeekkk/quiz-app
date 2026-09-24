import { Search, Filter, Layers, History, User, LogIn, Sparkles, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Hero({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedDifficulty,
  setSelectedDifficulty,
  categories = [],
  activeTab,
  onTabChange,
  onOpenUserLogin,
}) {
  const { user, isUserLoggedIn } = useAuth();

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-[#D1FAE5] shadow-xs sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-2.5 sm:py-3">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-2.5">

          {/* Left: Brand / Logo Title */}
          <div
            className="flex items-center gap-3 cursor-pointer group shrink-0"
            onClick={() => onTabChange('home')}
          >

            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#064E3B] tracking-tight leading-none transition-colors mb-0">
                Quiz<span className="text-[#059669]">App</span>
              </h1>

            </div>
          </div>

          {/* Center: Combined Search & Filter Bar */}
          <div className="w-full lg:max-w-2xl">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 p-1 bg-[#ECFDF5]/50 rounded-2xl border border-[#D1FAE5] transition-all shadow-2xs">

              {/* Search Input */}
              <div className="relative flex-1 flex items-center min-w-0">
                <Search className="w-4 h-4 absolute left-3 text-[#94A3B8] pointer-events-none" />
                <input
                  type="text"
                  className="w-full pl-9 pr-7 py-1.5 text-xs font-medium bg-transparent text-[#064E3B] placeholder-[#94A3B8] focus:outline-none rounded-xl"
                  placeholder="Search quizzes by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 text-[#94A3B8] hover:text-[#064E3B] p-1 rounded-full cursor-pointer transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filters integrated inside Search Bar */}
              {activeTab === 'home' && (
                <>
                  <div className="hidden sm:block h-5 w-[1px] bg-[#A7F3D0]" />

                  <div className="flex items-center gap-1.5 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-[#D1FAE5]">
                    {/* Category Filter Dropdown */}
                    <div className="relative flex-1 sm:flex-initial">
                      <Filter className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#059669] pointer-events-none" />
                      <select
                        className="w-full sm:w-auto pl-7 pr-6 py-1.5 text-xs font-semibold rounded-xl bg-white border border-[#D1FAE5] text-[#064E3B] hover:border-[#A7F3D0] focus:outline-none focus:border-[#059669] cursor-pointer transition-all appearance-none shadow-2xs"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option value="All">All Categories</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[#94A3B8]">
                        ▼
                      </div>
                    </div>

                    {/* Difficulty Filter Dropdown */}
                    <div className="relative flex-1 sm:flex-initial">
                      <Layers className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#059669] pointer-events-none" />
                      <select
                        className="w-full sm:w-auto pl-7 pr-6 py-1.5 text-xs font-semibold rounded-xl bg-white border border-[#D1FAE5] text-[#064E3B] hover:border-[#A7F3D0] focus:outline-none focus:border-[#059669] cursor-pointer transition-all appearance-none shadow-2xs"
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                      >
                        <option value="All">All Levels</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                      <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[#94A3B8]">
                        ▼
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right: Navigation Links */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-center lg:justify-end shrink-0">
            {activeTab === 'admin' || (typeof window !== 'undefined' && window.location.pathname.toLowerCase().startsWith('/admin')) ? (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] text-xs font-bold rounded-xl flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
                  <span>Admin Portal</span>
                </span>
              </div>
            ) : isUserLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onTabChange('history')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'history'
                    ? 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] shadow-2xs'
                    : 'text-[#475569] hover:text-[#064E3B] hover:bg-[#ECFDF5]'
                    }`}
                >
                  <History className="w-4 h-4 text-[#059669]" />
                  <span>History</span>
                </button>

                <button
                  onClick={() => onTabChange('profile')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'profile'
                    ? 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] shadow-2xs'
                    : 'text-[#475569] hover:text-[#064E3B] hover:bg-[#ECFDF5]'
                    }`}
                >
                  <User className="w-4 h-4 text-[#059669]" />
                  <span>Profile ({user?.name ? user.name.split(' ')[0] : 'User'})</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenUserLogin}
                className="flex items-center gap-2 px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Login / Register</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}

