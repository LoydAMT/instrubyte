import React from 'react';
import { brands } from '../data/brands';

const BrandsMarquee: React.FC = () => {
  return (
    <section className="brands-section" aria-label="Brands and manufacturers we work with">
      <p className="brands-eyebrow">Brands &amp; Manufacturers We Work With</p>
      <p className="brands-motto">Reputation First <span aria-hidden="true">&diams;</span> Selfless Altruism <span aria-hidden="true">&diams;</span> Win-Win Cooperation</p>
      <div className="brands-marquee">
        <div className="brands-track">
          {[...brands, ...brands].map((brand, index) => (
            <div className="brand-logo-card" key={`${brand.name}-${index}`}>
              <img src={brand.logo} alt={index < brands.length ? brand.name : ''} aria-hidden={index < brands.length ? undefined : true} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsMarquee;
