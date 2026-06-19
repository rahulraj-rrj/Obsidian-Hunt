import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Info, Gauge, Zap } from 'lucide-react';
import { ROCKETS } from '../data/mockLaunchData';

export default function RocketGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ROCKETS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + ROCKETS.length) % ROCKETS.length);
  };

  const activeRocket = ROCKETS[currentIndex];

  return (
    <section id="rockets" className="py-20 px-6 max-w-7xl mx-auto select-none border-b border-white/5 relative font-mono">
      <div className="absolute inset-0 cyber-grid-dense opacity-5 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 text-left relative z-10">
        <div>
          <div className="text-[10px] text-rocket-orange font-bold tracking-widest uppercase mb-1">
            ACTIVE FLEET SPECIFICATIONS
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-white uppercase">
            LAUNCH VEHICLES
          </h2>
        </div>
        <div className="text-slate-500 text-[10px] mt-2 md:mt-0">
          INDEX RANGE // {currentIndex + 1} OF {ROCKETS.length} FLEETS ACTIVE
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Rocket Image Card (col-5) */}
        <div className="lg:col-span-5 relative h-[380px] md:h-[480px] bg-cyber-slate/15 border border-white/10 rounded-lg overflow-hidden flex items-center justify-center group shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeRocket.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              src={activeRocket.image}
              alt={activeRocket.name}
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-space-black via-space-black/30 to-transparent" />

          {/* Navigation Overlay Buttons */}
          <div className="absolute inset-x-4 bottom-6 flex justify-between items-center z-20">
            <button
              onClick={handlePrev}
              className="p-2 bg-space-black/80 hover:bg-neon-cyan/20 border border-white/10 hover:border-neon-cyan/30 rounded text-slate-300 hover:text-neon-cyan transition-all cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-[10px] bg-space-black/75 px-3 py-1.5 rounded border border-white/10 text-slate-300 uppercase tracking-widest">
              {activeRocket.name}
            </span>
            <button
              onClick={handleNext}
              className="p-2 bg-space-black/80 hover:bg-neon-cyan/20 border border-white/10 hover:border-neon-cyan/30 rounded text-slate-300 hover:text-neon-cyan transition-all cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Right Side: Engineering specs HUD Panel (col-7) */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRocket.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-cyber-slate/20 border border-neon-cyan/20 backdrop-blur-md p-6 rounded-lg relative overflow-hidden scanlines flex-1"
            >
              {/* Top metadata tags */}
              <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight font-display">{activeRocket.name}</h3>
                  <span className="text-[9px] text-slate-500 block uppercase mt-0.5">MANUFACTURER: {activeRocket.manufacturer}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block uppercase">SUCCESS RATING</span>
                  <span className="text-sm font-bold text-emerald-400 font-display tabular-nums mt-0.5">{activeRocket.successRate}%</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 font-sans leading-relaxed mb-6">
                {activeRocket.description}
              </p>

              {/* Specifications HUD Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-space-black/55 p-3 border border-white/5 rounded">
                  <span className="text-[9px] text-slate-500 block uppercase">HEIGHT</span>
                  <span className="text-sm font-bold text-slate-200 mt-1 block tabular-nums">{activeRocket.height}</span>
                </div>
                <div className="bg-space-black/55 p-3 border border-white/5 rounded">
                  <span className="text-[9px] text-slate-500 block uppercase">DIAMETER</span>
                  <span className="text-sm font-bold text-slate-200 mt-1 block tabular-nums">{activeRocket.diameter}</span>
                </div>
                <div className="bg-space-black/55 p-3 border border-white/5 rounded">
                  <span className="text-[9px] text-slate-500 block uppercase">LIFT MASS</span>
                  <span className="text-sm font-bold text-slate-200 mt-1 block truncate tabular-nums">{activeRocket.mass}</span>
                </div>
                <div className="bg-space-black/55 p-3 border border-white/5 rounded">
                  <span className="text-[9px] text-slate-500 block uppercase">PROPULSION THRUST</span>
                  <span className="text-sm font-bold text-neon-cyan mt-1 block tabular-nums">{activeRocket.thrust}</span>
                </div>
                <div className="bg-space-black/55 p-3 border border-white/5 rounded col-span-1 sm:col-span-2">
                  <span className="text-[9px] text-slate-500 block uppercase">PAYLOAD TO LEO</span>
                  <span className="text-sm font-bold text-slate-200 mt-1 block truncate tabular-nums">{activeRocket.payloadLeo}</span>
                </div>
              </div>

              {/* Extra specifications telemetry values */}
              <div className="border-t border-white/5 pt-4 text-[10px] text-slate-400 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1"><Gauge size={10} /> PROPELLANT TYPE</span>
                  <span className="text-slate-300 font-bold truncate max-w-xs">{activeRocket.propellant}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1"><Zap size={10} /> STAGING ARCHITECTURE</span>
                  <span className="text-slate-300 font-bold">{activeRocket.stages}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
