import { socialLinks } from "@utils/constants";

const Footer = () => {
  return (
    <footer className="relative w-full border-t border-primary/20 bg-background/50 backdrop-blur-sm py-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]"></div>
        <div className="absolute top-0 left-0 w-1/2 h-px bg-gradient-to-r from-primary to-transparent"></div>
        <div className="absolute top-0 right-0 w-1/2 h-px bg-gradient-to-l from-primary to-transparent"></div>
      </div>

      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 sm:px-8 md:flex-row relative z-10">
        {/* COPYRIGHT INFO */}
        <p className="font-ui text-sm text-secondary-text">
          © {new Date().getFullYear()} Chizel. All Rights Reserved.
        </p>

        {/* PATENT APPLIED */}
        <p className="font-ui text-sm font-bold text-badge-bg tracking-wider" style={{ textShadow: "0 0 10px rgba(255, 179, 71, 0.5)" }}>
          PATENT APPLIED
        </p>

        {/* LEGAL LINKS */}
        <div className="flex gap-4 font-ui text-sm text-secondary-text">
            <a href="#privacy-policy" className="hover:text-primary hover:underline">Privacy Policy</a>
            <a href="#terms-of-service" className="hover:text-primary hover:underline">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;