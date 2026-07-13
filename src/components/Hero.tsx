import React from 'react';
import heroImage from '../assets/hero-electrician.jpg';
import { stats } from '../data/stats';
import { trackEvent } from '../utils/analytics';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section id="home" className="hero-section">
      <div className="hero-grid">
        <div className="hero-content">
          <span className="hero-eyebrow">Electrical &bull; Instrumentation &bull; Automation</span>
          <h1 className="hero-title">
            POWERING INDUSTRY THROUGH<br />
            <span className="blue-text">ELECTRICAL, INSTRUMENTATION &amp; AUTOMATION SOLUTIONS</span>
          </h1>
          <p className="hero-subtitle">
            Based in Cebu, delivering reliable electrical, instrumentation, and automation engineering services across the Philippines — for industrial facilities, fuel terminals, airports, mining operations, water and wastewater treatment plants, and process industries nationwide.
          </p>
          <div className="hero-actions">
            <button
              className="primary-button"
              onClick={() => {
                trackEvent('cta_click', { cta_location: 'hero', cta_label: 'Discover Our Services' });
                onNavigate('services');
              }}
            >
              DISCOVER OUR SERVICES
            </button>
            <button
              className="secondary-button"
              onClick={() => {
                trackEvent('cta_click', { cta_location: 'hero', cta_label: 'Request a Quotation' });
                onNavigate('contact');
              }}
            >
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
  );
};

export default Hero;
