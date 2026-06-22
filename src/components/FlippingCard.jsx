import React, { useState } from 'react';

/**
 * FlippingCard - A premium 3D flipping card component.
 * Allows switching between front and back views with smooth 3D rotations.
 * Automatically handles hover, focus, and tap (mobile) actions.
 */
export default function FlippingCard({ front, back, className = '' }) {
  const [isTapped, setIsTapped] = useState(false);

  const handleTap = () => {
    setIsTapped(!isTapped);
  };

  return (
    <div 
      className={`flip-card w-full h-full cursor-pointer select-none ${isTapped ? 'is-flipped' : ''} ${className}`}
      onClick={handleTap}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleTap();
        }
      }}
    >
      <div className="flip-card-inner w-full h-full">
        {/* Front Face */}
        <div className="flip-card-front w-full h-full">
          {front}
        </div>
        
        {/* Back Face */}
        <div className="flip-card-back w-full h-full">
          {back}
        </div>
      </div>
    </div>
  );
}
