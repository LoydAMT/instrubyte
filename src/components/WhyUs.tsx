import React from 'react';
import { useReveal } from '../useReveal';
import teamImage from '../assets/team-engineers.jpg';
import { whyUsPoints } from '../data/whyUs';

const WhyUs: React.FC = () => {
  const whyUsReveal = useReveal<HTMLElement>();

  return (
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
  );
};

export default WhyUs;
