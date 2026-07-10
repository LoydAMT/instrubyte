import React from 'react';
import { useReveal } from '../useReveal';
import industrialPlantImage from '../assets/industrial-plant.jpg';
import { industries } from '../data/industries';

const Industries: React.FC = () => {
  const industriesReveal = useReveal<HTMLElement>();

  return (
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
          From our base in Cebu, we deliver dependable engineering solutions across the Philippines, serving critical infrastructure and industrial environments nationwide.
        </p>
        <div className="industry-tags">
          {industries.map((industry) => (
            <span key={industry} className="industry-tag">{industry}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Industries;
