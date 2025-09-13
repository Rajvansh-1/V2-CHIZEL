import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-background py-8">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 sm:px-8 md:flex-row">
        {/* COPYRIGHT INFO */}
        <p className="font-ui text-sm text-secondary-text">
          © {new Date().getFullYear()} Chizel. All Rights Reserved.
        </p>

        {/* PATENT APPLIED */}
        <p className="font-ui text-sm font-bold text-badge-bg tracking-wider">
          PATENT APPLIED
        </p>

        {/* LEGAL LINKS */}
        <div className="flex flex-wrap justify-center gap-4 font-ui text-sm text-secondary-text">
          {/* v-- ADD YOUR NEW "ABOUT US" LINK HERE --v */}
          <Link to="/about-us" className="transition-colors hover:text-primary hover:underline">
            About Us
          </Link>
          <Link to="/privacy-policy" className="transition-colors hover:text-primary hover:underline">
            Privacy Policy
          </Link>
          <Link to="/terms-of-service" className="transition-colors hover:text-primary hover:underline">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;