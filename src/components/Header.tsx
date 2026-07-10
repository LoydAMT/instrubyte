import React from 'react';
import headerLogo from '../assets/TAGINST.jpg';
import { NAV_ITEMS } from '../data/navigation';

interface HeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection, onNavigate }) => {
  return (
    <header className="header-container">
      <div className="logo-container">
        <img src={headerLogo} alt="InstruByte Logo" className="header-logo" />
      </div>
      <nav className="navbar" aria-label="Primary">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(item.id);
            }}
            href={`#${item.id}`}
            className={`nav-link${activeSection === item.id ? ' active' : ''}`}
            aria-current={activeSection === item.id ? 'true' : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <button className="header-cta" onClick={() => onNavigate('contact')}>
        Request a Quote
      </button>
    </header>
  );
};

export default Header;
