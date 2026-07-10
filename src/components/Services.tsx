import React from 'react';
import { useReveal } from '../useReveal';
import { services } from '../data/services';

const Services: React.FC = () => {
  const servicesReveal = useReveal<HTMLElement>();

  return (
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
            {service.details && (
              <ul className="service-details-list">
                {service.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
