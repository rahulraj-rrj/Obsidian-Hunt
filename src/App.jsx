import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Loader from './components/Loader';
import Hero from './components/Hero';
import Stats from './components/Stats';
import UpcomingLaunches from './components/UpcomingLaunches';
import FeaturedMission from './components/FeaturedMission';
import Globe3D from './components/Globe3D';
import Timeline from './components/Timeline';
import RocketGallery from './components/RocketGallery';
import LaunchHistory from './components/LaunchHistory';
import SearchOverlay from './components/SearchOverlay';
import ConsoleModal from './components/ConsoleModal';
import Footer from './components/Footer';
import ShaderBackground from './components/ShaderBackground';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedLaunch, setSelectedLaunch] = useState(null);
  const [activeSection, setActiveSection] = useState('upcoming');

  // Track scroll position to update active navbar highlight
  useEffect(() => {
    if (loading) return;

    const handleScroll = () => {
      const sections = ['upcoming', 'featured', 'globe', 'timeline', 'rockets', 'history'];
      const scrollPosition = window.scrollY + 180; // offset

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  const handleSelectLaunch = (launch) => {
    setSelectedLaunch(launch);
  };

  const handleCloseConsole = () => {
    setSelectedLaunch(null);
  };

  if (loading) {
    return <Loader onComplete={() => setLoading(false)} />;
  }

  const handleScrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative bg-[#020204] text-slate-100 min-h-screen selection:bg-orange-500/30 selection:text-white overflow-x-hidden">
      {/* Interactive WebGL Shader Background underlay */}
      <ShaderBackground />

      {/* Dark overlay to ensure perfect readability of text */}
      <div className="fixed inset-0 bg-[#020204]/80 backdrop-blur-[1px] pointer-events-none z-0" />

      <div className="relative z-10 w-full">
        {/* Top navbar */}
        <Navbar 
          onSearchClick={() => setSearchOpen(true)} 
          activeSection={activeSection}
          onNavigate={handleScrollToSection}
        />

        {/* Main Mission Control sections */}
        <main className="pb-16 md:pb-0">
          <Hero 
            onExploreClick={() => handleScrollToSection('upcoming')} 
            onWatchMission={handleSelectLaunch}
          />
          <Stats />
          <UpcomingLaunches onSelectLaunch={handleSelectLaunch} />
          <FeaturedMission onSelectLaunch={handleSelectLaunch} />
          <Globe3D />
          <Timeline onSelectLaunch={handleSelectLaunch} />
          <RocketGallery />
          <LaunchHistory onSelectLaunch={handleSelectLaunch} />
        </main>

        {/* Standard footer & mobile docks */}
        <Footer onNavigate={handleScrollToSection} />
      </div>

      {/* Modals & Overlays */}
      <SearchOverlay 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)} 
        onSelectLaunch={handleSelectLaunch}
      />
      
      {selectedLaunch && (
        <ConsoleModal 
          launch={selectedLaunch} 
          onClose={handleCloseConsole} 
        />
      )}
    </div>
  );
}
