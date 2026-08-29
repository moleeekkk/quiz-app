import React from 'react';
import { Search, Sparkles, Filter, Award, Zap } from 'lucide-react';

export default function Hero({
  onExploreClick,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedDifficulty,
  setSelectedDifficulty,
  categories = [],
}) {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-tag">
          <Sparkles size={14} />
          <span>Interactive MERN Quiz Platform</span>
        </div>

        <h1 className="hero-title">
          Test & Elevate Your <span className="gradient-text">Developer Skills</span>
        </h1>

        <p className="hero-subtitle">
          Master Full-Stack JavaScript, React 19, Node.js, MongoDB, and System Architecture with instant feedback and deep answer breakdowns.
        </p>

        {/* Hero Features Bar */}
        <div className="hero-badges-row">
          <div className="hero-badge-item">
            <Zap size={16} color="var(--accent)" />
            <span>Instant Results</span>
          </div>
          <div className="hero-badge-item">
            <Award size={16} color="var(--secondary-accent)" />
            <span>Real-time Scoring</span>
          </div>
          <div className="hero-badge-item">
            <Sparkles size={16} color="var(--primary)" />
            <span>Full Explanations</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="search-filter-card">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Search quiz topic or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <div className="select-wrapper">
              <Filter size={16} className="select-icon" />
              <select
                className="filter-select"
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

            <div className="select-wrapper">
              <select
                className="filter-select"
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
      </div>
    </section>
  );
}
