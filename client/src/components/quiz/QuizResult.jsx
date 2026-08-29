import React from 'react';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Home,
  HelpCircle,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export default function QuizResult({ result, onRetake, onBackHome }) {
  const {
    quizTitle,
    percentage,
    passed,
    earnedPoints,
    totalPoints,
    correctCount,
    incorrectCount,
    unattemptedCount,
    timeTakenSeconds,
    breakdown = [],
  } = result;

  const formatSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  const strokeDashoffset = 440 - (440 * percentage) / 100;

  return (
    <div className="result-container">
      {/* Top Hero Score Card */}
      <div className="result-card-hero">
        <div className={`result-status-badge ${passed ? 'passed' : 'failed'}`}>
          {passed ? <Trophy size={18} /> : <AlertCircle size={18} />}
          <span>{passed ? 'Passed - Excellent Job!' : 'Needs Practice - Try Again!'}</span>
        </div>

        {/* Circular SVG Score Wheel */}
        <div className="score-circle-wrap">
          <svg className="score-circle-svg" viewBox="0 0 160 160">
            <circle className="score-circle-bg" cx="80" cy="80" r="70" />
            <circle
              className="score-circle-val"
              cx="80"
              cy="80"
              r="70"
              style={{
                strokeDasharray: 440,
                strokeDashoffset: strokeDashoffset,
                stroke: passed ? 'var(--primary)' : 'var(--wrong)',
              }}
            />
          </svg>
          <div className="score-circle-text">
            <span className="score-percentage">{percentage}%</span>
            <span className="score-label">Final Score</span>
          </div>
        </div>

        <h2 className="result-headline">{quizTitle}</h2>
        <p className="result-subhead">
          You earned {earnedPoints} out of {totalPoints} total points!
        </p>

        {/* Key Metrics Grid */}
        <div className="result-stats-grid">
          <div className="stat-box">
            <div className="stat-icon correct">
              <CheckCircle2 size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-number">{correctCount}</div>
              <div className="stat-desc">Correct Answers</div>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon incorrect">
              <XCircle size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-number">{incorrectCount}</div>
              <div className="stat-desc">Incorrect Answers</div>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon highlight">
              <Sparkles size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-number">{unattemptedCount}</div>
              <div className="stat-desc">Unattempted</div>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon score">
              <Clock size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-number">{formatSeconds(timeTakenSeconds)}</div>
              <div className="stat-desc">Time Spent</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="result-action-buttons">
          <button className="btn-secondary" onClick={onBackHome}>
            <Home size={18} />
            <span>Back to All Quizzes</span>
          </button>
          <button className="btn-primary" onClick={onRetake}>
            <RotateCcw size={18} />
            <span>Retake Quiz</span>
          </button>
        </div>
      </div>

      {/* Detailed Question Review Breakdown */}
      <div className="breakdown-section">
        <h3 className="breakdown-title">
          <HelpCircle size={20} color="var(--primary)" />
          <span>Detailed Answer Review ({breakdown.length} Questions)</span>
        </h3>

        <div className="breakdown-list">
          {breakdown.map((item, idx) => {
            return (
              <div
                key={idx}
                className={`breakdown-item ${item.isCorrect ? 'is-correct' : 'is-incorrect'}`}
              >
                <div className="breakdown-item-header">
                  <div className="breakdown-q-title">
                    Q{idx + 1}. {item.questionText}
                  </div>
                  <span className={`breakdown-status-tag ${item.isCorrect ? 'correct' : 'incorrect'}`}>
                    {item.isCorrect ? (
                      <>
                        <CheckCircle2 size={14} /> Correct (+{item.points} pts)
                      </>
                    ) : (
                      <>
                        <XCircle size={14} /> Incorrect (0 pts)
                      </>
                    )}
                  </span>
                </div>

                <div className="breakdown-options-grid">
                  {item.options.map((optText, optIdx) => {
                    const isUserChoice = item.userChoice === optIdx;
                    const isCorrectChoice = item.correctOptionIndex === optIdx;

                    let pillClass = 'breakdown-option-pill';
                    if (isUserChoice && isCorrectChoice) {
                      pillClass += ' user-correct';
                    } else if (isUserChoice && !isCorrectChoice) {
                      pillClass += ' user-wrong';
                    } else if (isCorrectChoice) {
                      pillClass += ' actual-correct';
                    }

                    return (
                      <div key={optIdx} className={pillClass}>
                        <span>
                          {String.fromCharCode(65 + optIdx)}. {optText}
                        </span>
                        {isUserChoice && (
                          <span style={{ fontSize: '0.75rem', fontWeight: '800' }}>
                            (Your Choice)
                          </span>
                        )}
                        {isCorrectChoice && !isUserChoice && (
                          <span style={{ fontSize: '0.75rem', fontWeight: '800' }}>
                            (Correct Answer)
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {item.explanation && (
                  <div className="explanation-box">
                    <Sparkles size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>
                      <strong>Explanation:</strong> {item.explanation}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
