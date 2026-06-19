import React from 'react';
import { motion } from 'framer-motion';
import { Target, Milestone, Clock, Calendar } from 'lucide-react';
import { UPCOMING_LAUNCHES } from '../data/mockLaunchData';

export default function Timeline({ onSelectLaunch }) {
  // Sort launches by date ascending
  const sortedLaunches = [...UPCOMING_LAUNCHES].sort(
    (a, b) => new Date(a.launchDate) - new Date(b.launchDate)
  );

  return (
    <section id="timeline" className="py-20 px-6 max-w-4xl mx-auto select-none border-b border-white/5 relative">
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-16 relative z-10">
        <div className="text-[10px] text-neon-cyan font-bold tracking-widest uppercase mb-1">
          TRAJECTORY ANALYSIS & SCHEDULE
        </div>
        <h2 className="text-2xl md:text-3xl font-bold font-display text-white uppercase">
          LAUNCH TIMELINE
        </h2>
        <div className="h-[1px] w-20 bg-neon-cyan mx-auto mt-4 shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
      </div>

      {/* Vertical Timeline Track */}
      <div className="relative border-l border-white/10 ml-4 md:ml-32 py-4 relative z-10">
        {/* Visual Line Glow Overlay */}
        <div className="absolute left-[-1px] top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-neon-cyan via-rocket-orange to-transparent opacity-60 shadow-[0_0_8px_rgba(0,240,255,0.4)]" />

        {sortedLaunches.map((launch, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div key={launch.id} className="mb-16 relative pl-8 md:pl-12">
              {/* Pulsing Timeline Node Dot */}
              <div className="absolute left-[-8.5px] top-1.5 z-20 flex items-center justify-center">
                <span className={`absolute h-4 w-4 rounded-full opacity-70 animate-ping ${
                  idx === 0 ? 'bg-neon-cyan' : 'bg-white/40'
                }`} />
                <span className={`h-4.5 w-4.5 rounded-full border border-space-black ${
                  idx === 0 
                    ? 'bg-neon-cyan shadow-[0_0_12px_rgba(0,240,255,0.8)]' 
                    : 'bg-cyber-slate border-white/20'
                }`} />
              </div>

              {/* Year/Time tag on left (Only visible on MD/large viewports) */}
              <div className="hidden md:block absolute left-[-140px] top-1 text-right w-24">
                <span className="text-[10px] font-mono text-slate-500 block uppercase">TARGET TIME</span>
                <span className="text-xs font-bold font-mono text-slate-200 mt-1 block">
                  {new Date(launch.launchDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>

              {/* Content Panel Box */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-cyber-slate/15 hover:bg-cyber-slate/30 border border-white/5 hover:border-neon-cyan/20 backdrop-blur-md p-5 rounded-lg text-left transition-all duration-300 relative group cursor-pointer"
                onClick={() => onSelectLaunch(launch)}
              >
                {/* Visual grid inside box */}
                <div className="absolute inset-0 cyber-grid-dense opacity-5 pointer-events-none rounded-lg" />

                {/* Subtitle / Status */}
                <div className="flex items-center justify-between gap-4 mb-2 text-[10px] font-mono text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={10} className="text-neon-cyan" />
                    {new Date(launch.launchDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-neon-cyan/60">{launch.rocketName} // {launch.targetOrbit.split('/')[0]}</span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white group-hover:text-neon-cyan transition-colors font-display uppercase tracking-tight">
                  {launch.missionName}
                </h3>

                {/* Description */}
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed mt-2.5">
                  {launch.description}
                </p>

                {/* Footer specs */}
                <div className="border-t border-white/5 pt-3 mt-4 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>SITE: {launch.launchSite.split(',')[0]}</span>
                  <span className="text-neon-cyan flex items-center gap-1">
                    <Target size={10} /> DETAILS_CONSOLE
                  </span>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
