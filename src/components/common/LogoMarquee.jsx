// src/components/common/LogoMarquee.jsx
import React from 'react';

const LogoMarquee = ({ images, speed = 20, direction = 'left' }) => {
  // The animation duration is now controlled by the speed prop
  const animationDuration = `${speed}s`;

  return (
    <div className="logo-marquee" data-direction={direction}>
      <ul className="marquee-content" style={{ animationDuration }}>
        {[...images, ...images].map((src, index) => (
          <li className="marquee-item" key={`marquee-item-${index}`}>
            <img src={src} alt={`Brand portfolio image ${index + 1}`} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LogoMarquee;