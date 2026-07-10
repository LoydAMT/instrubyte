import React from 'react';
import { NAV_ITEMS } from '../data/navigation';

interface DotNavProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

const DotNav: React.FC<DotNavProps> = ({ activeSection, onNavigate }) => {
  return (
    <nav className="dot-nav" aria-label="Section navigation">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`dot-nav-item${activeSection === item.id ? ' active' : ''}`}
          onClick={() => onNavigate(item.id)}
          aria-label={`Go to ${item.dotLabel} section`}
          aria-current={activeSection === item.id ? 'true' : undefined}
        >
          <span className="dot-nav-label">{item.dotLabel}</span>
        </button>
      ))}
    </nav>
  );
};

export default DotNav;
