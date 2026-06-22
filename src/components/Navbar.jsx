import React from 'react';
import { Calendar, Star, Globe, Clock, Layers, Compass, Search } from 'lucide-react';

export default function Navbar({ onSearchClick, activeSection, onNavigate }) {
  const navItems = [
    { label: 'Upcoming', id: 'upcoming', icon: Calendar },
    { label: 'Featured', id: 'featured', icon: Star },
    { label: 'Globe', id: 'globe', icon: Globe },
    { label: 'Timeline', id: 'timeline', icon: Clock },
    { label: 'Vehicles', id: 'rockets', icon: Layers },
    { label: 'Database', id: 'history', icon: Compass }
  ];

  const handleLinkClick = (id) => {
    if (onNavigate) {
      onNavigate(id);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 scale-90 sm:scale-100 select-none">
      {/* uimix inspired Dock Navigation */}
      <div className="flex items-center gap-2 rounded-[24px] bg-neutral-950/85 px-3 py-2 border border-white/10 backdrop-blur-lg shadow-[0_15px_50px_rgba(0,0,0,0.8)]">
        
        {/* Brand Icon Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-b from-neutral-800/60 to-neutral-900/70 border border-white/5 shadow-md transition-all duration-200 hover:-translate-y-1.5 hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Home"
        >
          <span className="text-lg transition-transform duration-200 group-hover:scale-110">🚀</span>
          <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded bg-space-black/90 border border-white/10 px-2 py-1 text-[9px] font-mono uppercase text-slate-300 opacity-0 transition-opacity duration-200 group-hover:opacity-100 whitespace-nowrap z-50">
            HOME
          </span>
        </button>
        
        <span className="h-6 w-px bg-white/15 mx-1" />

        {/* Scroll items */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleLinkClick(item.id)}
              className={`group relative flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-200 hover:-translate-y-1.5 hover:scale-105 active:scale-95 cursor-pointer ${
                isActive
                  ? 'bg-neon-cyan/20 border-neon-cyan/50 text-neon-cyan shadow-[0_0_15px_rgba(255,158,0,0.2)]'
                  : 'bg-gradient-to-b from-neutral-800/40 to-neutral-900/50 border-white/5 text-slate-400 hover:text-white'
              }`}
              aria-label={item.label}
            >
              <Icon size={16} className="transition-transform duration-200 group-hover:scale-110" />
              <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded bg-space-black/90 border border-white/10 px-2 py-1 text-[9px] font-mono uppercase text-slate-300 opacity-0 transition-opacity duration-200 group-hover:opacity-100 whitespace-nowrap z-50">
                {item.label}
              </span>
            </button>
          );
        })}

        <span className="h-6 w-px bg-white/15 mx-1" />

        {/* Search trigger */}
        <button
          onClick={onSearchClick}
          className="group relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-b from-neutral-800/40 to-neutral-900/50 border border-white/5 text-slate-400 hover:text-white transition-all duration-200 hover:-translate-y-1.5 hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Search Telemetry"
        >
          <Search size={16} className="transition-transform duration-200 group-hover:scale-110" />
          <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded bg-space-black/90 border border-white/10 px-2 py-1 text-[9px] font-mono uppercase text-slate-300 opacity-0 transition-opacity duration-200 group-hover:opacity-100 whitespace-nowrap z-50">
            SEARCH [⌘K]
          </span>
        </button>

      </div>
    </div>
  );
}
