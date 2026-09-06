import { Search, Filter, Layers } from 'lucide-react';

export default function Hero({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedDifficulty,
  setSelectedDifficulty,
  categories = [],
}) {
  return (
    <section className="max-h-[60px] md:h-[100px] bg-white border-b border-[#E2E8F0] shadow-xs flex items-center px-4 sm:px-6 lg:px-8 sticky top-0 z-20 transition-all py-3 md:py-0">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 items-center gap-3 sm:gap-4">
        {/* Left: Brand / Logo Title */}
        <div className="flex items-center justify-center md:justify-start">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E293B] tracking-tight leading-tight">Quiz App</h1>
        </div>

        {/* Center: Search Bar */}
        <div className="relative w-full max-w-md mx-auto">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#1E293B] placeholder-[#94A3B8] focus:bg-white focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all"
            placeholder="Search quizzes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Right: Category Selection & Difficulty Selection */}
        <div className="flex items-center justify-center md:justify-end gap-2 sm:gap-3">
          {/* Category Selection */}
          <div className="relative flex-1 md:flex-none w-full md:w-40">
            <Filter className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
            <select
              className="w-full pl-8 pr-3 py-2 text-xs font-semibold rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 cursor-pointer transition-all"
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
          </div>

          {/* Difficulty Selection */}
          <div className="relative flex-1 md:flex-none w-full md:w-36">
            <Layers className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
            <select
              className="w-full pl-8 pr-3 py-2 text-xs font-semibold rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 cursor-pointer transition-all"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}

