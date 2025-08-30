// src/components/layout/Footer.jsx

import { FaInstagram, FaDiscord, FaYoutube, FaLinkedin } from "react-icons/fa";
import { socialLinks } from "@utils/constants";

const iconMap = {
  Instagram: <FaInstagram size="1.2em" />,
  Discord: <FaDiscord size="1.2em" />,
  YouTube: <FaYoutube size="1.2em" />,
  LinkedIn: <FaLinkedin size="1.2em" />,
};

const Footer = () => {
  return (
    <footer className="relative w-screen border-t border-hsla bg-background py-8 overflow-hidden">
      {/* VFX Artist's Note: The "Earthrise" effect and starfield background. */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-32 bg-primary/30 rounded-[100%] blur-3xl opacity-40" />
      <div className="absolute inset-0 opacity-40">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-px bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${Math.random() * 5 + 3}s infinite alternate`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 sm:px-8 md:flex-row relative z-10">
        {/* COPYRIGHT INFO */}
        <p className="font-ui text-sm text-secondary-text" style={{ textShadow: "0 0 5px rgba(255, 255, 255, 0.3)" }}>
          © Chizel {new Date().getFullYear()}. All rights reserved.
        </p>

        {/* SOCIAL MEDIA LINKS */}
        <div className="flex justify-center gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow Chizel on ${link.name}`}
              className="text-secondary-text transition-all duration-300 hover:text-accent hover:scale-110"
              style={{ textShadow: "0 0 10px rgba(93, 63, 211, 0.5)" }}
            >
              {iconMap[link.name]}
            </a>
          ))}
        </div>

        {/* LEGAL LINKS */}
        <a
          href="#privacy-policy"
          className="font-ui text-sm text-secondary-text hover:text-accent hover:underline"
          style={{ textShadow: "0 0 5px rgba(255, 255, 255, 0.3)" }}
        >
          Privacy Policy
        </a>
      </div>
       <style>{`
            @keyframes twinkle {
                from { opacity: 0.1; }
                to { opacity: 0.8; }
            }
        `}</style>
    </footer>
  );
};

export default Footer;