import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <p className="footer-text">&copy; 2025 InstruByte. All Rights Reserved. Based in Cebu, serving clients across the globe.</p>
      <nav className="footer-links" aria-label="Legal">
        <a href="/privacy-policy/">Privacy Policy</a>
        <span aria-hidden="true">&middot;</span>
        <a href="/terms-of-service/">Terms of Service</a>
      </nav>
    </footer>
  );
};

export default Footer;
