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
    <div className="relative bg-[#020204] text-slate-100 min-h-screen selection:bg-neon-cyan/30 selection:text-white">
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
