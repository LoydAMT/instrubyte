import React, { useState } from 'react';
import { useReveal } from '../useReveal';
import { ourWorkPhotos } from '../data/ourWorkPhotos';
import type { GalleryPhoto } from '../types';
import Lightbox from './Lightbox';

const OurWork: React.FC = () => {
  const ourWorkReveal = useReveal<HTMLElement>();
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhoto | null>(null);

  return (
    <section
      id="our-work"
      ref={ourWorkReveal.ref}
      className={`our-work-section panel-reveal${ourWorkReveal.visible ? ' is-visible' : ''}`}
    >
      <h2 className="section-title">Our Work</h2>
      <p className="our-work-text">
        A look at completed control panel builds — from PLC racks and power supplies to fully wired, tested, and commissioned Siemens-based automation panels.
      </p>
      <div className="our-work-gallery">
        {ourWorkPhotos.map((photo) => (
          <button
            key={photo.src}
            type="button"
            className="our-work-item"
            onClick={() => setLightboxPhoto(photo)}
            aria-label={`View full image: ${photo.alt}`}
          >
            <img src={photo.src} alt={photo.alt} />
            <span className="our-work-zoom-hint" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
              View Full Image
            </span>
          </button>
        ))}
      </div>

      {lightboxPhoto && (
        <Lightbox photo={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />
      )}
    </section>
  );
};

export default OurWork;
