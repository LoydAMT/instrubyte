import React from 'react';
import { useReveal } from '../useReveal';
import robotArmImage from '../assets/robot-arm.jpg';
import { trackEvent } from '../utils/analytics';

interface CtaBandProps {
  onNavigate: (sectionId: string) => void;
}

const CtaBand: React.FC<CtaBandProps> = ({ onNavigate }) => {
  const ctaReveal = useReveal<HTMLElement>();

  return (
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
        <button
          className="primary-button"
          onClick={() => {
            trackEvent('cta_click', { cta_location: 'cta_band', cta_label: 'Request a Quotation' });
            onNavigate('contact');
          }}
        >
          REQUEST A QUOTATION
        </button>
      </div>
    </section>
  );
};

export default CtaBand;
