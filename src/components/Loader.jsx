import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Terminal, Shield, Cpu, Compass, Wifi } from 'lucide-react';

const BOOT_LOGS = [
  { text: 'INITIALIZING MISSION CONTROL HUB...', icon: Cpu },
  { text: 'ESTABLISHING DOWNLINK WITH Cape Canaveral...', icon: Wifi },
  { text: 'SYNCHRONIZING ORBITAL TRAJECTORY ENGINES...', icon: Compass },
  { text: 'SECURING TERMINAL DATA STREAM (SSL/TLS)...', icon: Shield },
  { text: 'INTEGRATING SPACEX TELEMETRY FEED... RETRYING...', icon: Terminal },
  { text: 'API TIMEOUT (FALLING BACK TO SYSTEM BACKUP DATA)...', icon: Shield },
  { text: 'OBSIDIAN HUNT OS V4.8.1 ONLINE. GO FOR FLIGHT.', icon: Cpu },
];

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [activeLogIndex, setActiveLogIndex] = useState(0);
  
  const containerRef = useRef(null);
  const sceneRef = useRef(null);

  // Loading progress ticking
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 800);
          return 100;
        }
        const increment = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + increment, 100);
      });
    }, 120);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Log prints ticking
  useEffect(() => {
    if (activeLogIndex < BOOT_LOGS.length) {
      const logThreshold = (activeLogIndex + 1) * (100 / BOOT_LOGS.length);
      if (progress >= logThreshold || progress === 100) {
        setLogs((prev) => [...prev, BOOT_LOGS[activeLogIndex]]);
        setActiveLogIndex((prev) => prev + 1);
      }
    }
  }, [progress, activeLogIndex]);

  // Shader animation loader background
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Vertex shader
    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `;

    // Fragment shader (Ali Imam shader modified for fire-orange/gold theme)
    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time * 0.05;
        float lineWidth = 0.002;

        vec3 color = vec3(0.0);
        for(int j = 0; j < 3; j++) {
          for(int i = 0; i < 5; i++) {
            color[j] += lineWidth * float(i * i) / abs(fract(t - 0.01 * float(j) + float(i) * 0.01) * 5.0 - length(uv) + mod(uv.x + uv.y, 0.2));
          }
        }
        
        // Color mapping to solar-fire orange/gold
        float r = color[0] * 1.6;
        float g = color[1] * 0.9;
        float b = color[2] * 0.25;

        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `;

    // Initialize Three.js scene
    const camera = new THREE.Camera();
    camera.position.z = 1;

    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      time: { type: "f", value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2() },
    };

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    // Optimize pixel ratio for shader processing
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Resize handler
    const onWindowResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    };

    onWindowResize();
    window.addEventListener('resize', onWindowResize, false);

    // Animation loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      uniforms.time.value += 0.03;
      renderer.render(scene, camera);
    };
    animate();

    sceneRef.current = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId,
    };

    // Cleanup
    return () => {
      window.removeEventListener('resize', onWindowResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        if (container && sceneRef.current.renderer.domElement) {
          container.removeChild(sceneRef.current.renderer.domElement);
        }
        sceneRef.current.renderer.dispose();
        geometry.dispose();
        material.dispose();
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#020204] z-50 flex flex-col items-center justify-center p-6 font-mono scanlines select-none overflow-hidden">
      
      {/* Three.js Shader Ripple Loader Background */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40" 
      />
      
      {/* Screen corners HUD layout */}
      <div className="absolute top-6 left-6 text-xs text-neon-cyan/45 z-10">SYS_BOOT // LV-426</div>
      <div className="absolute top-6 right-6 text-xs text-neon-cyan/45 z-10">TIME_REF_UTC // {new Date().toISOString().substring(11, 19)}</div>
      <div className="absolute bottom-6 left-6 text-xs text-neon-cyan/45 z-10">COORD_LOCK // 28.5721 N 80.6480 W</div>
      <div className="absolute bottom-6 right-6 text-xs text-neon-cyan/45 z-10">MODE_OPERATIONAL // SECURE_DOWNLINK</div>

      {/* Main Console Box */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-neutral-950/65 border border-neon-cyan/20 backdrop-blur-md p-8 rounded-lg relative overflow-hidden z-10"
      >
        {/* Glow Header */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent animate-pulse" />

        {/* Brand Icon Display */}
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            animate={{ 
              y: [0, -10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-6xl mb-3 filter drop-shadow-[0_0_15px_rgba(255,158,0,0.45)]"
          >
            🚀
          </motion.div>
          <h2 className="text-xl font-bold tracking-widest text-slate-100 font-display">OBSIDIAN HUNT</h2>
          <div className="text-[10px] text-neon-cyan/60 mt-1 uppercase tracking-widest">MISSION CONTROL OPERATING SYSTEM</div>
        </div>

        {/* Shell Boot Logs */}
        <div className="h-44 bg-space-black/85 border border-white/5 rounded p-4 mb-6 overflow-y-auto text-[11px] leading-relaxed flex flex-col gap-1 text-emerald-400">
          <div className="text-slate-500 mb-2 border-b border-white/5 pb-1 flex items-center justify-between">
            <span>CONSOLE STATUS MONITOR</span>
            <span className="animate-pulse text-neon-cyan">● FEED ACTIVE</span>
          </div>
          {logs.map((log, idx) => {
            const Icon = log.icon;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <Icon size={12} className="text-neon-cyan" />
                <span>{log.text}</span>
              </motion.div>
            );
          })}
          {progress < 100 && (
            <div className="flex items-center gap-1 text-neon-cyan">
              <span className="animate-ping font-bold">_</span>
            </div>
          )}
        </div>

        {/* Loading Progress Percentage bar */}
        <div className="flex items-center justify-between mb-2 text-xs">
          <span className="text-neon-cyan/80">INITIALIZATION PROGRAM</span>
          <span className="text-neon-cyan font-bold tabular-nums">{progress}%</span>
        </div>
        <div className="h-[10px] bg-space-black border border-neon-cyan/20 rounded-full overflow-hidden p-[2px]">
          <motion.div 
            className="h-full bg-gradient-to-r from-neon-cyan/50 to-neon-cyan rounded-full glow-cyan"
            style={{ width: `${progress}%` }}
            transition={{ ease: "easeOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
}
