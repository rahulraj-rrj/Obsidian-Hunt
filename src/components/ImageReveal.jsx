import React, { useRef, useState, useEffect } from 'react';

const getResponsiveValues = () => {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
  let baseRadius;
  
  if (width < 768) {
    baseRadius = 60 + (width / 768) * 20;
  } else if (width < 1440) {
    baseRadius = 80 + ((width - 768) / (1440 - 768)) * 20;
  } else {
    baseRadius = 100 + ((Math.min(width, 2560) - 1440) / (2560 - 1440)) * 20;
  }
  
  const multiplier = baseRadius / 100;
  
  return {
    MAX_RADIUS: Math.round(baseRadius),
    MIN_RADIUS: 0,
    SOFT_EDGE: Math.round(50 * multiplier),
    LERP_SPEED: 0.18,
    RADIUS_LERP_SPEED: 0.13
  };
};

export default function ImageReveal({ src, alt, className = "" }) {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState(null);
  const [lerpedPos, setLerpedPos] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [radius, setRadius] = useState(0);
  const [targetRadius, setTargetRadius] = useState(0);
  const [values, setValues] = useState(getResponsiveValues());
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setValues(getResponsiveValues());
    };
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Smooth position lerping
  useEffect(() => {
    if (!hovered || !mousePos || isTouchDevice) {
      setLerpedPos(null);
      return;
    }
    let frame;
    const animate = () => {
      setLerpedPos(prev => {
        if (!prev) return mousePos;
        const dx = mousePos.x - prev.x;
        const dy = mousePos.y - prev.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 0.5) return mousePos;
        return {
          x: prev.x + dx * values.LERP_SPEED,
          y: prev.y + dy * values.LERP_SPEED,
        };
      });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [mousePos, hovered, isTouchDevice, values.LERP_SPEED]);

  // Target radius animation
  useEffect(() => {
    setTargetRadius(hovered ? values.MAX_RADIUS : values.MIN_RADIUS);
  }, [hovered, values.MAX_RADIUS, values.MIN_RADIUS]);

  // Radius lerping
  useEffect(() => {
    let frame;
    const animateRadius = () => {
      setRadius(prev => {
        if (Math.abs(prev - targetRadius) < 1) return targetRadius;
        return prev + (targetRadius - prev) * values.RADIUS_LERP_SPEED;
      });
      frame = requestAnimationFrame(animateRadius);
    };
    frame = requestAnimationFrame(animateRadius);
    return () => cancelAnimationFrame(frame);
  }, [targetRadius, values.RADIUS_LERP_SPEED]);

  const handleMouseMove = (e) => {
    if (isTouchDevice) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });
    }
  };

  const handleTouchMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect && e.touches[0]) {
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      setMousePos({ x, y });
      setLerpedPos({ x, y }); // Skip lerp on mobile touch
      setHovered(true);
    }
  };

  const handleMouseEnter = () => !isTouchDevice && setHovered(true);
  
  const handleMouseLeave = () => {
    setHovered(false);
    setMousePos(null);
    setLerpedPos(null);
  };

  const maskStyle = lerpedPos && radius > 0
    ? {
        WebkitMaskImage: `radial-gradient(circle ${radius}px at ${lerpedPos.x}px ${lerpedPos.y}px, transparent 0 ${(radius - values.SOFT_EDGE - 15)}px, rgba(0,0,0,0.12) ${(radius - values.SOFT_EDGE)}px, rgba(0,0,0,0.65) ${radius}px, black 100%)`,
        maskImage: `radial-gradient(circle ${radius}px at ${lerpedPos.x}px ${lerpedPos.y}px, transparent 0 ${(radius - values.SOFT_EDGE - 15)}px, rgba(0,0,0,0.12) ${(radius - values.SOFT_EDGE)}px, rgba(0,0,0,0.65) ${radius}px, black 100%)`,
        transition: 'WebkitMaskImage 0.3s, maskImage 0.3s, opacity 0.3s',
        opacity: 1,
      }
    : {
        WebkitMaskImage: 'none',
        maskImage: 'none',
        opacity: 1,
        transition: 'WebkitMaskImage 0.3s, maskImage 0.3s, opacity 0.3s',
      };

  const overlayOpacity = hovered && lerpedPos && radius > 0 ? 'opacity-90' : 'opacity-100';

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden w-full h-full select-none ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchMove}
      onTouchEnd={handleMouseLeave}
    >
      {/* Target Image (will be revealed sharp on hover) */}
      <img
        src={src}
        alt={alt}
        className="absolute w-full h-full object-cover"
      />
      
      {/* Overlay panel: blurred and dark, masked out by coordinates */}
      <div
        className={`absolute inset-0 bg-neutral-950/70 backdrop-blur-[6px] transition-all duration-300 pointer-events-none ${overlayOpacity}`}
        style={maskStyle}
      />
      
      {/* Light leak glow follower */}
      {lerpedPos && radius > 0 && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle ${radius + 20}px at ${lerpedPos.x}px ${lerpedPos.y}px, rgba(255,158,0,0.12) 0%, rgba(255,158,0,0.06) 60%, transparent 100%)`,
            mixBlendMode: 'screen',
            transition: 'background 0.3s',
          }}
        />
      )}
    </div>
  );
}
