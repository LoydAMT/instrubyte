import React from 'react';
import './App.css';
import headerLogo from './assets/TAGINST.jpg'; 

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
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2E699B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      ),
      title: 'Electrical Engineering',
      description: 'Design and implementation of power distribution systems, motor control centers, cable routing, grounding systems, lighting, and electrical infrastructure.',
    },
    {
      id: 2,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2E699B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      ),
      title: 'Instrumentation Engineering',
      description: 'Design, installation, calibration, and commissioning of field instruments including pressure, temperature, flow, and level measurement systems.',
    },
    {
      id: 3,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2E699B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      ),
      title: 'Industrial Automation',
      description: 'PLC, SCADA, HMI, VFD, and industrial communication systems integration for efficient process monitoring and control.',
    },
    {
      id: 4,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2E699B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="3" x2="9" y2="21"></line>
          <circle cx="14" cy="9" r="2"></circle>
          <circle cx="14" cy="15" r="2"></circle>
        </svg>
      ),
      title: 'Control Panel Design',
      description: 'Design, fabrication, testing, and commissioning of PLC panels, marshalling panels, remote I/O panels, and motor control panels.',
    },
    {
      id: 5,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2E699B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
        </svg>
      ),
      title: 'Industrial Networking',
      description: 'Implementation of Profinet, Modbus, Profibus, Ethernet/IP, fiber optic networks, and IT-OT integration for smart and autonomous systems.',
    },
    {
      id: 6,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2E699B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 9.36l-7.19 7.19a2 2 0 0 1-2.83-2.83l7.19-7.19a6 6 0 0 1 9.36-7.94l-3.76 3.76z"></path>
        </svg>
      ),
      title: 'Commissioning & Support',
      description: 'Site commissioning, troubleshooting, system optimization, FAT/SAT support, and remote technical assistance.',
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="header-container">
        <div className="logo-container">
          <img src={headerLogo} alt="InstruByte Logo" className="header-logo" />
        </div>
        <nav className="navbar">
          {['HOME', 'SERVICES', 'WHY US', 'CONTACT'].map((item) => (
            <a
              key={item}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item.toLowerCase().replace(' ', '-'));
              }}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className="nav-link"
            >
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
            POWERING INDUSTRY THROUGH<br />
            <span className="blue-text">ELECTRICAL, INSTRUMENTATION & AUTOMATION SOLUTIONS</span>
          </h1>
          <p className="hero-subtitle">
            Delivering reliable engineering, design, integration, and commissioning services for industrial facilities, fuel terminals, airports, mining operations, water and waste water treatment plants, and process industries.
          </p>
          <button
            className="primary-button"
            onClick={() => scrollToSection('services')}
          >
            DISCOVER OUR SERVICES
          </button>
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

        {/* Why Choose Us Section */}
        <section id="why-us" className="why-us-section">
          <h2 className="section-title">Why Choose InstruByte?</h2>
          <div className="why-us-grid">
            <div className="why-us-card">
              <h3 className="why-us-card-title">10+ Years of Experience</h3>
              <p className="why-us-card-description">Our team brings over a decade of hands-on experience in electrical, instrumentation, and automation engineering.</p>
            </div>
            <div className="why-us-card">
              <h3 className="why-us-card-title">Specialized Expertise</h3>
              <p className="why-us-card-description">We are specialists in PLC & SCADA integration, industrial networking, and control panel design.</p>
            </div>
            <div className="why-us-card">
              <h3 className="why-us-card-title">Global Project Experience</h3>
              <p className="why-us-card-description">We have a proven track record of successful project delivery for both local and international clients.</p>
            </div>
            <div className="why-us-card">
              <h3 className="why-us-card-title">End-to-End Support</h3>
              <p className="why-us-card-description">From initial design to final commissioning and ongoing support, we provide comprehensive engineering services.</p>
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section id="contact" className="contact-section">
          <h2 className="section-title">Get in Touch</h2>
          <div className="contact-content">
            <p className="contact-text">
              Have a project in mind or need expert advice? Reach out to us to discover how our engineering solutions can drive your success.
            </p>
            <div className="contact-details">
              <div className="contact-info-item">
                <strong>Email:</strong> <a href="mailto:info@instrubyte.com" className="contact-link">info@instrubyte.com</a>
              </div>
              <div className="contact-info-item">
                <strong>Phone:</strong> <a href="tel:+8198334750" className="contact-link">+819-833-4750</a>
              </div>
            </div>
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