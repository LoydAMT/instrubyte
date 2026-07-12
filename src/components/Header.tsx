import React, { useState } from 'react';
import headerLogo from '../assets/TAGINST.jpg';
import { NAV_ITEMS } from '../data/navigation';

interface HeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigate = (id: string) => {
    onNavigate(id);
    setIsMenuOpen(false);
  };

  return (
    <header className="header-container">
      <div className="logo-container">
        <img src={headerLogo} alt="InstruByte Logo" className="header-logo" />
      </div>

      <button
        type="button"
        className={`mobile-menu-toggle${isMenuOpen ? ' open' : ''}`}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-nav-panel"
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        <span />
        <span />
        <span />
      </button>

      <div id="mobile-nav-panel" className={`nav-panel${isMenuOpen ? ' open' : ''}`}>
        <nav className="navbar" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              onClick={(e) => {
                e.preventDefault();
                handleNavigate(item.id);
              }}
              href={`#${item.id}`}
              className={`nav-link${activeSection === item.id ? ' active' : ''}`}
              aria-current={activeSection === item.id ? 'true' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <button className="header-cta" onClick={() => handleNavigate('contact')}>
          Request a Quote
        </button>
      </div>
    </header>
  );
};

export default Header;
