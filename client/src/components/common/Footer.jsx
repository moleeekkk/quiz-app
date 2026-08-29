import React from 'react';
import { Heart, Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
          <span>Crafted with</span>
          <Heart size={15} color="var(--wrong)" fill="var(--wrong)" />
          <span>for Full-Stack & MCA Web Developers</span>
        </p>
        <p className="footer-sub">
          <Code2 size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
          MERN Stack Architecture • React 19 • Express • Node.js • MongoDB
        </p>
      </div>
    </footer>
  );
}
