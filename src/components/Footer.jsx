import React from 'react';
import { Home, Calendar, Globe, History, Rocket, Terminal } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const mobileNavItems = [
    { label: 'Home', id: 'root', icon: Home },
    { label: 'Manifests', id: 'upcoming', icon: Calendar },
    { label: 'Globe', id: 'globe', icon: Globe },
    { label: 'Vehicles', id: 'rockets', icon: Rocket },
    { label: 'Database', id: 'history', icon: History }
  ];

  const handleLinkClick = (id) => {
    if (id === 'root') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (onNavigate) {
      onNavigate(id);
    }
  };

  return (
    <>
      {/* Desktop & Standard Footer */}
      <footer className="w-full bg-[#04050a] border-t border-white/5 py-12 px-6 font-mono text-xs text-slate-500 select-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div className="text-left flex items-center gap-2">
            <span className="text-xl">🚀</span>
            <div>
              <div className="font-bold text-slate-300 font-display">OBSIDIAN HUNT</div>
              <span className="text-[10px] text-slate-600 block mt-0.5">Aerospace Command Console OS V4.8.1</span>
            </div>
          </div>

          {/* Core system stats */}
          <div className="flex gap-8 text-[10px] text-slate-600">
            <div>
              <span className="text-slate-500 font-bold block uppercase">DOWNLINK STATS</span>
              <span className="mt-0.5 block">RANGE // SECURE</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block uppercase">COGNITIVE ENGINE</span>
              <span className="mt-0.5 block">ANTIGRAVITY // DEEPMIND</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block uppercase">DATA COMPRESSION</span>
              <span className="mt-0.5 block">GZIP_LZMA // OK</span>
            </div>
          </div>

          {/* Copyright details */}
          <div className="text-right">
            <span>© {new Date().getFullYear()} Obsidian Hunt. Open-Source Flight Operations.</span>
            <span className="text-[9px] text-neon-cyan/40 mt-1 block">AUTHORIZED COMMAND CHANNEL ONLY</span>
          </div>
        </div>
      </footer>
    </>
  );
}
