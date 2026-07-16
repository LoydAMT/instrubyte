import React from 'react';
import './App.css';
import { useActiveSection } from './useActiveSection';
import { NAV_IDS } from './data/navigation';
import { scrollToSection } from './utils/scrollToSection';

import Header from './components/Header';
import DotNav from './components/DotNav';
import Hero from './components/Hero';
import Services from './components/Services';
import BrandsMarquee from './components/BrandsMarquee';
// import OurWork from './components/OurWork';
import Industries from './components/Industries';
import WhyUs from './components/WhyUs';
import CtaBand from './components/CtaBand';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';

const App: React.FC = () => {
  const activeSection = useActiveSection(NAV_IDS);

  return (
    <div className="App">
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <Header activeSection={activeSection} onNavigate={scrollToSection} />
      <DotNav activeSection={activeSection} onNavigate={scrollToSection} />

      {/* To hide a section, comment out its line below. */}
      <main id="main-content" className="main-content">

        <Hero onNavigate={scrollToSection} />
        <Services />
        <BrandsMarquee />
        {/* <OurWork /> */}
        <Industries />
        <WhyUs />
        <CtaBand onNavigate={scrollToSection} />
        <Contact />
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
};

export default App;
