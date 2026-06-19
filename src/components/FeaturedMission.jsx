import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, TrendingUp, Gauge, RefreshCw, Layers } from 'lucide-react';
import { UPCOMING_LAUNCHES } from '../data/mockLaunchData';

export default function FeaturedMission({ onSelectLaunch }) {
  const mission = UPCOMING_LAUNCHES[0]; // Starship Flight 7
  const canvasRef = useRef(null);
  const [speed, setSpeed] = useState(7200);
  const [altitude, setAltitude] = useState(115);

  // Simulated live telemetry numbers
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed(prev => {
        const drift = Math.random() * 8 - 4;
        return Math.max(7150, parseFloat((prev + drift).toFixed(1)));
      });
      setAltitude(prev => {
        const drift = Math.random() * 0.2 - 0.1;
        return Math.max(114, parseFloat((prev + drift).toFixed(2)));
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Telemetry Canvas Graph Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let t = 0;

    const render = () => {
      t += 0.05;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark background
      ctx.fillStyle = '#020204';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Cyber Grid lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.07)';
      ctx.lineWidth = 1;

      // Draw grid vertical lines
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw grid horizontal lines
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw trajectory line
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      
      const points = [];
      const totalPoints = 40;
      for (let i = 0; i <= totalPoints; i++) {
        const x = (i / totalPoints) * canvas.width;
        // Generate a parabolic flight path trajectory curve
        const baseHeight = Math.sin((i / totalPoints) * Math.PI) * (canvas.height * 0.6);
        // Add animated noise simulation
        const noise = i === totalPoints ? (Math.sin(t) * 3) : 0;
        const y = canvas.height - 40 - baseHeight + noise;
        points.push({ x, y });
      }

      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();

      // Draw outer pulse ring at the rocket tip
      const activePt = points[points.length - 1];
      ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.beginPath();
      ctx.arc(activePt.x - 2, activePt.y, 8 + Math.sin(t * 3) * 3, 0, Math.PI * 2);
      ctx.fill();

      // Draw core rocket dot
      ctx.fillStyle = '#ff6b00';
      ctx.beginPath();
      ctx.arc(activePt.x - 2, activePt.y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Draw axes details
      ctx.fillStyle = '#475569';
      ctx.font = '8px monospace';
      ctx.fillText('0', 5, canvas.height - 5);
      ctx.fillText('LAUNCH_PAD_T0', 5, canvas.height - 25);
      ctx.fillText('ORBITAL_APOGEE', canvas.width - 95, 20);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <section id="featured" className="py-20 px-6 max-w-7xl mx-auto select-none border-b border-white/5 relative">
      <div className="absolute inset-0 cyber-grid-dense opacity-5 pointer-events-none" />

      {/* Title */}
      <div className="text-left mb-10 relative z-10">
        <div className="text-[10px] text-rocket-orange font-bold tracking-widest uppercase mb-1">
          FLAGSHIP MISSION REPORT // 01
        </div>
        <h2 className="text-2xl md:text-3xl font-bold font-display text-white uppercase">
          FEATURED MISSION
        </h2>
      </div>

      {/* Widescreen Banner Card */}
      <div className="bg-cyber-slate/15 border border-white/10 rounded-lg overflow-hidden relative z-10 grid grid-cols-1 lg:grid-cols-12 shadow-2xl">
        {/* Parallax background panel */}
        <div 
          className="lg:col-span-7 h-80 lg:h-auto min-h-[300px] relative border-r border-white/5 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(2, 2, 4, 0.95) 10%, rgba(2, 2, 4, 0.3) 100%), url('${mission.image}')`,
          }}
        >
          {/* Logo brand marker */}
          <div className="absolute top-6 left-6 flex items-center gap-2 bg-space-black/75 px-3 py-1.5 rounded border border-white/10 text-[9px] text-slate-300 font-mono">
            <Layers size={10} className="text-rocket-orange animate-pulse" />
            <span>SYS_STAGE: S1/S2 HOOKED</span>
          </div>

          {/* Description Content */}
          <div className="absolute bottom-6 left-6 right-6 text-left">
            <span className="text-[9px] bg-rocket-orange/15 text-rocket-orange border border-rocket-orange/30 px-2 py-0.5 rounded uppercase font-bold tracking-wider font-mono">
              FLIGHT SYSTEM TEST
            </span>
            <h3 className="text-2xl md:text-4xl font-extrabold text-white mt-3 font-display uppercase tracking-tight">
              {mission.rocketName} • {mission.missionName}
            </h3>
            <p className="text-xs text-slate-300 font-sans max-w-md mt-3 leading-relaxed">
              Analyzing structural limits and booster re-entry dynamics. Equipped with real-time payload health sensors and structural vibration telemetry feeds.
            </p>
          </div>
        </div>

        {/* Live Telemetry Chart panel */}
        <div className="lg:col-span-5 p-6 bg-space-black/60 flex flex-col justify-between scanlines">
          {/* Telemetry metadata */}
          <div className="text-left font-mono mb-4">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold border-b border-white/5 pb-2">
              <span className="flex items-center gap-1"><TrendingUp size={12} className="text-neon-cyan" /> ORBITAL SIMULATOR // TR_LIVE</span>
              <span className="text-neon-cyan animate-pulse">● FEEDING_DATA</span>
            </div>

            {/* Numerical Values */}
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <span className="text-[9px] text-slate-500 block uppercase">VELOCITY</span>
                <span className="text-lg font-semibold text-slate-100 tabular-nums">
                  {speed.toLocaleString()} <span className="text-[10px] text-slate-500 font-normal">km/h</span>
                </span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 block uppercase">ALTITUDE</span>
                <span className="text-lg font-semibold text-slate-100 tabular-nums">
                  {altitude.toLocaleString()} <span className="text-[10px] text-slate-500 font-normal">km</span>
                </span>
              </div>
            </div>
          </div>

          {/* HTML Canvas Graph */}
          <div className="relative border border-white/5 bg-space-black rounded overflow-hidden h-40">
            <canvas 
              ref={canvasRef} 
              width={400} 
              height={160} 
              className="w-full h-full block"
            />
          </div>

          {/* Banner Action Buttons */}
          <div className="mt-5 flex gap-3">
            <button
              onClick={() => onSelectLaunch(mission)}
              className="flex-1 flex items-center justify-center gap-2 bg-neon-cyan hover:bg-neon-cyan/90 text-space-black font-display font-extrabold text-xs py-3 rounded transition-all cursor-pointer glow-cyan"
            >
              <Play size={12} /> ENTER MISSION CONTROL
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
