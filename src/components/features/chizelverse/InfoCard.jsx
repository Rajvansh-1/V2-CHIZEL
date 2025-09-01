// src/components/features/chizelverse/InfoCard.jsx
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { FaGamepad, FaUsers, FaLightbulb, FaPaintBrush } from 'react-icons/fa';

const iconMap = {
  gamepad: <FaGamepad />,
  users: <FaUsers />,
  lightbulb: <FaLightbulb />,
  paintbrush: <FaPaintBrush />,
};

const InfoCard = ({ icon, text }) => {
  const cardRef = useRef(null);

  useGSAP(() => {
    const card = cardRef.current;
    const tl = gsap.timeline({ paused: true });

    tl.to(card.querySelector('.card-glow'), { opacity: 0.7, duration: 0.3 })
      .to(card.querySelector('.card-icon'), { scale: 1.1, color: '#ffb347', duration: 0.3 }, 0);

    card.addEventListener('mouseenter', () => tl.play());
    card.addEventListener('mouseleave', () => tl.reverse());
  }, { scope: cardRef });

  return (
    <div ref={cardRef} className="relative verse-card p-6 rounded-2xl bg-card/70 backdrop-blur-lg border border-white/10 overflow-hidden cursor-pointer">
      <div className="card-glow absolute inset-0 bg-primary/20 opacity-0 transition-opacity duration-300" />
      <div className="relative flex items-center gap-4">
        <div className="card-icon text-2xl text-primary transition-all duration-300">
          {iconMap[icon]}
        </div>
        <p className="font-body text-secondary-text">{text}</p>
      </div>
    </div>
  );
};

export default InfoCard;