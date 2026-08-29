import React from 'react';
import { Clock, HelpCircle, Play, ArrowRight } from 'lucide-react';

export default function QuizCard({ quiz, onStartQuiz }) {
  const { title, description, category, difficulty, durationMinutes, questions } = quiz;

  return (
    <div className="quiz-card">
      <div className="card-top">
        <span className="tag-category">{category}</span>
        <span className={`tag-difficulty difficulty-${difficulty}`}>{difficulty}</span>
      </div>

      <h3 className="card-title">{title}</h3>
      <p className="card-desc">{description}</p>

      <div className="card-meta">
        <div className="meta-item">
          <HelpCircle size={15} />
          <span>{questions ? questions.length : 0} Questions</span>
        </div>
        <div className="meta-item">
          <Clock size={15} />
          <span>{durationMinutes} Minutes</span>
        </div>
      </div>

      <button className="btn-start-quiz" onClick={() => onStartQuiz(quiz)}>
        <span>Start Challenge</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
