import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Globe, MapPin, Shield, Layers } from 'lucide-react';
import { LAUNCH_SITES } from '../data/mockLaunchData';

export default function Globe3D() {
  const mountRef = useRef(null);
  const [selectedSite, setSelectedSite] = useState(LAUNCH_SITES[0]); // Default to Kennedy Space Center
  const [hoveredSiteName, setHoveredSiteName] = useState(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Dimensions
    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 220;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Procedural Glowing wireframe Sphere (Earth Base)
    const globeGeo = new THREE.SphereGeometry(60, 32, 32);
    
    // Core dark solid sphere for depth
    const globeCoreMat = new THREE.MeshBasicMaterial({
      color: 0x050a15,
      transparent: true,
      opacity: 0.8
    });
    const coreMesh = new THREE.Mesh(globeGeo, globeCoreMat);
    globeGroup.add(coreMesh);

    // Grid Overlay Sphere
    const globeMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    globeGroup.add(globeMesh);

    // Equatorial Ring
    const ringGeo = new THREE.RingGeometry(65, 66, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    globeGroup.add(ringMesh);

    // Helper: Convert Lat/Lng to Vector3
    const latLngToVector3 = (lat, lng, radius) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);

      const x = -(radius * Math.sin(phi) * Math.sin(theta));
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.cos(theta);

      return new THREE.Vector3(x, y, z);
    };

    // Plot pins for all sites
    const pinsGroup = new THREE.Group();
    globeGroup.add(pinsGroup);

    LAUNCH_SITES.forEach((site) => {
      const position = latLngToVector3(site.lat, site.lng, 60);

      // Create glowing pin dot
      const pinGeo = new THREE.SphereGeometry(1.8, 8, 8);
      const pinMat = new THREE.MeshBasicMaterial({
        color: site.id === 'starbase' ? 0xff6b00 : 0x00f0ff,
        transparent: true,
        opacity: 0.9
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(position);
      
      // Save metadata on mesh for raycasting
      pinMesh.userData = { site };
      pinsGroup.add(pinMesh);

      // Trajectory paths: Draw Bezier arches emerging from the launch sites
      const destination = latLngToVector3(site.lat + 15, site.lng + 40, 75); // Target space point
      
      // Control point for curve arch height
      const midPoint = new THREE.Vector3().addVectors(position, destination).multiplyScalar(0.5).normalize().multiplyScalar(80);
      
      const curve = new THREE.QuadraticBezierCurve3(position, midPoint, destination);
      const curvePoints = curve.getPoints(30);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
      
      const curveMat = new THREE.LineBasicMaterial({
        color: site.id === 'starbase' ? 0xff6b00 : 0x00f0ff,
        transparent: true,
        opacity: 0.35
      });
      
      const line = new THREE.Line(curveGeo, curveMat);
      globeGroup.add(line);
    });

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00f0ff, 0.8);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);

    // Mouse Interaction / Rotation control
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      isDragging = true;
    };

    const handleMouseMove = (e) => {
      const deltaMove = {
        x: e.offsetX - previousMousePosition.x,
        y: e.offsetY - previousMousePosition.y
      };

      if (isDragging) {
        // Rotate globe group based on mouse drag movement
        globeGroup.rotation.y += deltaMove.x * 0.005;
        globeGroup.rotation.x += deltaMove.y * 0.005;
      }

      previousMousePosition = {
        x: e.offsetX,
        y: e.offsetY
      };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    // Add event listeners to container
    const canvasContainer = renderer.domElement;
    canvasContainer.addEventListener('mousedown', handleMouseDown);
    canvasContainer.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Auto slow rotation when not dragging
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (!isDragging) {
        globeGroup.rotation.y += 0.001; // slow spin
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      canvasContainer.removeEventListener('mousedown', handleMouseDown);
      canvasContainer.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      
      globeGeo.dispose();
      globeMat.dispose();
      globeCoreMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section id="globe" className="py-20 px-6 max-w-7xl mx-auto select-none border-b border-white/5 relative">
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />

      {/* Title */}
      <div className="text-left mb-12 relative z-10">
        <div className="text-[10px] text-neon-cyan font-bold tracking-widest uppercase mb-1">
          GLOBAL REACH TELEMETRY
        </div>
        <h2 className="text-2xl md:text-3xl font-bold font-display text-white uppercase">
          INTERACTIVE EARTH GLOBE
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Side: Three.js Canvas Container */}
        <div className="col-span-1 lg:col-span-7 bg-space-black/45 border border-white/5 rounded-lg overflow-hidden flex items-center justify-center relative min-h-[400px] md:min-h-[500px]">
          <div className="absolute top-4 left-4 text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
            <Globe size={12} className="text-neon-cyan animate-spin-slow" />
            <span>DRAG GLOBE TO ROTATE</span>
          </div>

          {/* Mount point for ThreeJS */}
          <div ref={mountRef} className="w-full h-[400px] md:h-[500px] cursor-grab active:cursor-grabbing" />
        </div>

        {/* Right Side: Site Info details HUD */}
        <div className="col-span-1 lg:col-span-5 flex flex-col gap-5 text-left font-mono">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-slate-500">SELECT DATA STREAM:</span>
            
            {/* Site selector buttons */}
            <div className="flex flex-wrap gap-2">
              {LAUNCH_SITES.map((site) => (
                <button
                  key={site.id}
                  onClick={() => setSelectedSite(site)}
                  className={`px-3 py-1.5 border text-xs rounded transition-all cursor-pointer ${
                    selectedSite.id === site.id
                      ? 'bg-neon-cyan/15 text-neon-cyan border-neon-cyan/40 shadow-[0_0_10px_rgba(0,240,255,0.1)]'
                      : 'bg-cyber-slate/20 text-slate-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  {site.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Active Site Data Card */}
          <motion.div
            key={selectedSite.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-cyber-slate/25 border border-neon-cyan/20 backdrop-blur-md p-6 rounded-lg relative overflow-hidden scanlines"
          >
            {/* Corner glows */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-neon-cyan/5 rounded-full blur-xl pointer-events-none" />

            {/* Site Name and Location */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-1.5">
                  <MapPin size={14} className="text-neon-cyan" /> {selectedSite.name}
                </h3>
                <span className="text-[10px] text-slate-400 mt-1 block">{selectedSite.location}</span>
              </div>
              <span className={`text-[9px] px-2 py-0.5 rounded ${
                selectedSite.status === 'GO'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/20 animate-pulse'
              }`}>
                SYS_{selectedSite.status}
              </span>
            </div>

            {/* Main Stats of Site */}
            <div className="grid grid-cols-2 gap-4 mb-5 text-xs text-slate-400">
              <div className="bg-space-black/55 p-3 border border-white/5 rounded">
                <span className="text-[9px] text-slate-500 uppercase block mb-1">Success Rate</span>
                <span className="text-lg font-bold text-emerald-400 font-display tabular-nums">
                  {selectedSite.successRate}%
                </span>
              </div>
              <div className="bg-space-black/55 p-3 border border-white/5 rounded">
                <span className="text-[9px] text-slate-500 uppercase block mb-1">Total Launches</span>
                <span className="text-lg font-bold text-slate-200 font-display tabular-nums">
                  {selectedSite.totalLaunches}
                </span>
              </div>
            </div>

            {/* Description details */}
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed mb-5">
              {selectedSite.description}
            </p>

            {/* Active scheduled missions */}
            <div className="border-t border-white/5 pt-4 text-[10px]">
              <span className="text-slate-500 block mb-2 uppercase font-bold flex items-center gap-1">
                <Layers size={10} className="text-neon-cyan" /> Active Manifests from pad
              </span>
              <div className="flex flex-col gap-1.5">
                {selectedSite.activeMissions.map((m, idx) => (
                  <div key={idx} className="bg-space-black/40 border border-white/5 p-2 rounded flex items-center justify-between text-slate-300">
                    <span>{m}</span>
                    <span className="text-neon-cyan/70 text-[8px]">ACTIVE TELEMETRY</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
