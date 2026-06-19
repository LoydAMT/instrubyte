import React from 'react';
import './App.css';
import headerLogo from './assets/TAGINST.jpg';

// Simple types for our structure (Updated to use ReactNode for TS strictness)
interface Service {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const App: React.FC = () => {
  const services: Service[] = [
    {
      id: 1,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2E699B"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 21h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2z" />
          <path d="M17 13m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
          <path d="M17 13v-5" />
          <path d="M17 5v-1" />
        </svg>
      ),
      title: 'Control Systems',
      description: 'Control systems, movement systems, with full control systems.',
    },
    {
      id: 2,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2E699B"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 19h-10a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2z" />
          <path d="M7 11l1 -1a1 1 0 0 1 1 0l1.5 1.5a1 1 0 0 0 1 0l3 -3a1 1 0 0 1 1 0l1 1" />
          <path d="M7 11v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1 -1v-3" />
        </svg>
      ),
      title: 'Circuit Design',
      description: 'Design design measurements and circuit design.',
    },
    {
      id: 3,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2E699B"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
          <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
          <path d="M16.5 7.5l-3 3" />
          <path d="M7.5 7.5l3 3" />
          <path d="M16.5 16.5l-3 -3" />
          <path d="M7.5 16.5l3 -3" />
        </svg>
      ),
      title: 'Industrial Automation',
      description: 'Industrial: automation and tooling improvement.',
    },
  ];

  return (
    <div className="App">
      {/* Header */}
      <header className="header-container">
        <div className="logo-container">
          <img src={headerLogo} alt="InstruByte Logo" className="header-logo" />
        </div>
        <nav className="navbar">
          {['HOME', 'SERVICES', 'PROJECTS', 'CONTACT'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="nav-link">
              {item}
            </a>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section */}
        <section id="home" className="hero-section">
          <h1 className="hero-title">
            POWERING YOUR PROJECTS WITH<br />
            <span className="blue-text">SMART ELECTRICAL SOLUTIONS</span>
          </h1>
          <button className="primary-button">DISCOVER OUR SERVICES</button>
        </section>

        {/* Services Section */}
        <section id="services" className="services-section">
          <h2 className="section-title">Key Services</h2>
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3 className="service-card-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About & Contact Grid */}
        <section className="about-contact-grid">
          <div id="about" className="info-block">
            <h2 className="section-title-left">About Us</h2>
            <p className="info-text">
              InstruByte is a simple-pagewebsite considering complete electrical
              engineering services, with control systems, automation innovations and
              mastering and solutions for s documentation reverids.
            </p>
          </div>
          <div id="contact" className="info-block">
            <h2 className="section-title-left">Contact Us</h2>
            <p className="info-text">
              Email info@instrubyte.com<br />
              Info +819-833-4750
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer-container">
        <p className="footer-text">© 2024 InstruByte. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;