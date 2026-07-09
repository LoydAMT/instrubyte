import React, { useState } from 'react';
import './App.css';
import { useReveal } from './useReveal';
import { useActiveSection } from './useActiveSection';
import headerLogo from './assets/TAGINST.jpg';
import heroImage from './assets/hero-electrician.jpg';
import teamImage from './assets/team-engineers.jpg';
import robotArmImage from './assets/robot-arm.jpg';
import industrialPlantImage from './assets/industrial-plant.jpg';

const NAV_ITEMS = [
  { id: 'home', label: 'HOME', dotLabel: 'Home' },
  { id: 'services', label: 'SERVICES', dotLabel: 'Services' },
  { id: 'industries', label: 'INDUSTRIES', dotLabel: 'Industries' },
  { id: 'why-us', label: 'WHY US', dotLabel: 'Why Us' },
  { id: 'contact', label: 'CONTACT', dotLabel: 'Contact' },
];
const NAV_IDS = NAV_ITEMS.map((item) => item.id);

interface Service {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface WhyUsPoint {
  title: string;
  description: string;
}

interface FormState {
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const CONTACT_ENDPOINT = 'https://formsubmit.co/ajax/khentlloyd3@gmail.com';

const App: React.FC = () => {
  const services: Service[] = [
    {
      id: 1,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      ),
      title: 'Electrical Engineering',
      description: 'Design and implementation of power distribution systems, motor control centers, cable routing, grounding systems, lighting, and electrical infrastructure.',
    },
    {
      id: 2,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
        </svg>
      ),
      title: 'Industrial Networking',
      description: 'Implementation of Profinet, Modbus, Profibus, Ethernet/IP, fiber optic networks, and IT-OT integration for smart and autonomous systems.',
    },
    {
      id: 6,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 9.36l-7.19 7.19a2 2 0 0 1-2.83-2.83l7.19-7.19a6 6 0 0 1 9.36-7.94l-3.76 3.76z"></path>
        </svg>
      ),
      title: 'Commissioning & Support',
      description: 'Site commissioning, troubleshooting, system optimization, FAT/SAT support, and remote technical assistance.',
    }
  ];

  const industries: string[] = [
    'Industrial Facilities',
    'Fuel Terminals',
    'Airports',
    'Mining Operations',
    'Water & Wastewater Treatment',
    'Process Industries',
  ];

  const stats: { value: string; label: string }[] = [
    { value: '10+', label: 'Years of Experience' },
    { value: '6', label: 'Core Engineering Disciplines' },
    { value: 'Global', label: 'Project Experience' },
    { value: 'End-to-End', label: 'Design to Commissioning' },
  ];

  const whyUsPoints: WhyUsPoint[] = [
    {
      title: '10+ Years of Experience',
      description: 'Our team brings over a decade of hands-on experience in electrical, instrumentation, and automation engineering.',
    },
    {
      title: 'Specialized Expertise',
      description: 'We are specialists in PLC & SCADA integration, industrial networking, and control panel design.',
    },
    {
      title: 'Global Project Experience',
      description: 'We have a proven track record of successful project delivery for both local and international clients.',
    },
    {
      title: 'End-to-End Support',
      description: 'From initial design to final commissioning and ongoing support, we provide comprehensive engineering services.',
    },
  ];

  const serviceOptions = ['General Inquiry', 'Request a Quotation', ...services.map((s) => s.title)];

  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    company: '',
    service: serviceOptions[1],
    message: '',
  });
  const [status, setStatus] = useState<SubmitStatus>('idle');

  const servicesReveal = useReveal<HTMLElement>();
  const industriesReveal = useReveal<HTMLElement>();
  const whyUsReveal = useReveal<HTMLElement>();
  const ctaReveal = useReveal<HTMLElement>();
  const contactReveal = useReveal<HTMLElement>();

  const activeSection = useActiveSection(NAV_IDS);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const honeypot = (e.currentTarget.elements.namedItem('_honey') as HTMLInputElement | null)?.value;
    if (honeypot) {
      return;
    }

    setStatus('submitting');

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company || 'Not provided',
          service_needed: formData.service,
          message: formData.message,
          _subject: `New website inquiry from ${formData.name}`,
          _template: 'table',
          _captcha: 'false',
        }),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      setStatus('success');
      setFormData({ name: '', email: '', company: '', service: serviceOptions[1], message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="App">
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Header */}
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
                scrollToSection(item.id);
              }}
              href={`#${item.id}`}
              className={`nav-link${activeSection === item.id ? ' active' : ''}`}
              aria-current={activeSection === item.id ? 'true' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <button className="header-cta" onClick={() => scrollToSection('contact')}>
          Request a Quote
        </button>
      </header>

      {/* Side dot navigation */}
      <nav className="dot-nav" aria-label="Section navigation">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`dot-nav-item${activeSection === item.id ? ' active' : ''}`}
            onClick={() => scrollToSection(item.id)}
            aria-label={`Go to ${item.dotLabel} section`}
            aria-current={activeSection === item.id ? 'true' : undefined}
          >
            <span className="dot-nav-label">{item.dotLabel}</span>
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main id="main-content" className="main-content">
        {/* Hero Section */}
        <section id="home" className="hero-section">
          <div className="hero-grid">
            <div className="hero-content">
              <span className="hero-eyebrow">Electrical &bull; Instrumentation &bull; Automation</span>
              <h1 className="hero-title">
                POWERING INDUSTRY THROUGH<br />
                <span className="blue-text">ELECTRICAL, INSTRUMENTATION &amp; AUTOMATION SOLUTIONS</span>
              </h1>
              <p className="hero-subtitle">
                Delivering reliable engineering, design, integration, and commissioning services for industrial facilities, fuel terminals, airports, mining operations, water and waste water treatment plants, and process industries.
              </p>
              <div className="hero-actions">
                <button className="primary-button" onClick={() => scrollToSection('services')}>
                  DISCOVER OUR SERVICES
                </button>
                <button className="secondary-button" onClick={() => scrollToSection('contact')}>
                  REQUEST A QUOTATION
                </button>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-image-frame">
                <img src={heroImage} alt="Electrical engineer testing an industrial control panel with a multimeter" />
              </div>
              <div className="hero-badge-card">
                <span className="hero-badge-value">10+</span>
                <span className="hero-badge-label">Years of Engineering Experience</span>
              </div>
            </div>
            <div className="hero-stats">
              {stats.map((stat) => (
                <div key={stat.label} className="hero-stat">
                  <span className="hero-stat-value">{stat.value}</span>
                  <span className="hero-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section
          id="services"
          ref={servicesReveal.ref}
          className={`services-section panel-reveal${servicesReveal.visible ? ' is-visible' : ''}`}
        >
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

        {/* Industries Section */}
        <section
          id="industries"
          ref={industriesReveal.ref}
          className={`industries-section panel-reveal${industriesReveal.visible ? ' is-visible' : ''}`}
        >
          <img src={industrialPlantImage} className="industries-bg" alt="" aria-hidden="true" />
          <div className="industries-scrim" />
          <div className="industries-content">
            <h2 className="section-title section-title-light">Industries We Serve</h2>
            <p className="industries-text">
              We deliver dependable engineering solutions across a wide range of critical infrastructure and industrial environments.
            </p>
            <div className="industry-tags">
              {industries.map((industry) => (
                <span key={industry} className="industry-tag">{industry}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section
          id="why-us"
          ref={whyUsReveal.ref}
          className={`why-us-section panel-reveal${whyUsReveal.visible ? ' is-visible' : ''}`}
        >
          <div className="why-us-split">
            <div className="why-us-image-col">
              <img src={teamImage} alt="InstruByte engineers reviewing a project on the shop floor" className="why-us-image" />
              <div className="why-us-floating-badge">
                <span className="badge-number">10+</span>
                <span className="badge-text">Years of Experience</span>
              </div>
            </div>
            <div className="why-us-content-col">
              <h2 className="section-title-left">Why Choose InstruByte?</h2>
              <div className="why-us-list">
                {whyUsPoints.map((point, index) => (
                  <div key={point.title} className="why-us-row">
                    <span className="why-us-index">{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className="why-us-row-title">{point.title}</h3>
                      <p className="why-us-row-description">{point.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Band */}
        <section
          ref={ctaReveal.ref}
          className={`cta-section panel-reveal${ctaReveal.visible ? ' is-visible' : ''}`}
        >
          <img src={robotArmImage} className="cta-bg" alt="" aria-hidden="true" />
          <div className="cta-scrim" />
          <div className="cta-content">
            <h2 className="cta-title">Ready to Power Your Next Project?</h2>
            <p className="cta-text">
              Tell us about your requirements and our engineering team will get back to you with a tailored proposal.
            </p>
            <button className="primary-button" onClick={() => scrollToSection('contact')}>
              REQUEST A QUOTATION
            </button>
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          ref={contactReveal.ref}
          className={`contact-section panel-reveal${contactReveal.visible ? ' is-visible' : ''}`}
        >
          <h2 className="section-title">Request a Quotation</h2>
          <p className="contact-text">
            Have a project in mind or need expert advice? Fill out the form below and our team will get back to you shortly.
          </p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <input type="text" name="_honey" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Juan Dela Cruz"
                />
              </div>
              <div className="form-field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="company">Company / Organization</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>
              <div className="form-field">
                <label htmlFor="service">Service Needed</label>
                <select id="service" name="service" value={formData.service} onChange={handleChange}>
                  {serviceOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="message">Project Details</label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your project or request a quotation..."
              />
            </div>

            <button type="submit" className="primary-button form-submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'SENDING...' : 'SEND REQUEST'}
            </button>

            {status === 'success' && (
              <p className="form-status form-status-success" role="status">
                Thank you! Your request has been sent. We&apos;ll get back to you soon.
              </p>
            )}
            {status === 'error' && (
              <p className="form-status form-status-error" role="alert">
                Something went wrong. Please try again in a moment.
              </p>
            )}
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer-container">
        <p className="footer-text">&copy; 2024 InstruByte. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;
