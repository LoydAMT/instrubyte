import React, { useEffect, useState } from 'react';
import { useReveal } from '../useReveal';
import { industrySlides } from '../data/industries';

const AUTO_ADVANCE_MS = 5000;

const Industries: React.FC = () => {
  const industriesReveal = useReveal<HTMLElement>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % industrySlides.length);
    }, AUTO_ADVANCE_MS);

    return () => clearInterval(timer);
  }, [isPaused]);

  const goToPrev = () => {
    setActiveIndex((prev) => (prev - 1 + industrySlides.length) % industrySlides.length);
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % industrySlides.length);
  };

  return (
    <section
      id="industries"
      ref={industriesReveal.ref}
      className={`industries-section panel-reveal${industriesReveal.visible ? ' is-visible' : ''}`}
    >
      <div className="industries-content">
        <h2 className="section-title section-title-light">Industries We Serve</h2>
        <p className="industries-text">
          From our base in Cebu, we deliver dependable engineering solutions across the globe, serving critical infrastructure and industrial environments nationwide.
        </p>

        <div
          className="industries-slideshow"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {industrySlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`industry-slide${index === activeIndex ? ' active' : ''}`}
              aria-hidden={index !== activeIndex}
            >
              <img src={slide.image} alt={slide.name} />
              <div className="industry-slide-scrim" />
              <div className="industry-slide-content">
                <h3 className="industry-slide-name">{slide.name}</h3>
                <p className="industry-slide-desc">{slide.description}</p>
              </div>
            </div>
          ))}

          <button type="button" className="slideshow-arrow prev" onClick={goToPrev} aria-label="Previous industry">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button type="button" className="slideshow-arrow next" onClick={goToNext} aria-label="Next industry">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          <div className="slideshow-dots">
            {industrySlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                className={`slideshow-dot${index === activeIndex ? ' active' : ''}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to ${slide.name}`}
                aria-current={index === activeIndex ? 'true' : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Industries;
