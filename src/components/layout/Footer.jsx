import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="relative z-10 w-full bg-background/95 backdrop-blur-md">
    {/* Gradient top border */}
    <div className="h-px w-full" style={{
      background: 'linear-gradient(90deg, transparent, rgba(31,111,235,0.7) 30%, rgba(124,77,255,0.8) 50%, rgba(31,111,235,0.7) 70%, transparent)'
    }} />

    <div className="container mx-auto px-6 py-8 flex flex-col items-center gap-5">

      {/* Logo + wordmark */}
      <Link to="/" className="flex items-center gap-2.5 group">
        <img
          src="/images/logo.png"
          alt="Chizel"
          className="w-9 h-9 object-contain drop-shadow-[0_0_12px_rgba(31,111,235,0.6)]
                     group-hover:drop-shadow-[0_0_18px_rgba(124,77,255,0.85)] transition-all duration-300"
        />
        <span className="font-heading text-lg font-black tracking-widest text-text
                         group-hover:text-primary transition-colors duration-300">
          CHIZEL
        </span>
      </Link>

      {/* Legal links */}
      <div className="flex items-center gap-5 text-secondary-text/50 text-xs font-ui">
        <Link to="/privacy-policy" className="hover:text-primary transition-colors duration-200">Privacy</Link>
        <span className="opacity-30">·</span>
        <Link to="/terms-of-service" className="hover:text-primary transition-colors duration-200">Terms</Link>
        <span className="opacity-30">·</span>
        <Link to="/about-us" className="hover:text-primary transition-colors duration-200">About</Link>
      </div>

      {/* Copyright */}
      <p className="text-secondary-text/35 text-xs font-ui">
        © {new Date().getFullYear()} Chizel — Turning Screen Time Into Skill Time.
      </p>
    </div>
  </footer>
);

export default Footer;