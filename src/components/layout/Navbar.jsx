import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { navItems } from "@utils/constants";
import { useScrollDirection } from "@hooks/useScrollDirection";
import { useLocation, useNavigate, Link } from "react-router-dom";
import clsx from "clsx";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");
  const isVisible = useScrollDirection();
  const navigate = useNavigate();
  const location = useLocation();

  const navbarRef = useRef(null);
  const menuRef = useRef(null);
  const menuTl = useRef();

  // Track active section
  useEffect(() => {
    if (location.pathname !== "/") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [location.pathname]);

  // Smooth navigation
  const handleLinkClick = (href) => {
    setIsMenuOpen(false);
    if (href.startsWith("/")) {
      navigate(href);
      window.scrollTo(0, 0);
    } else {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      } else {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Prevent body scroll when menu open
  useEffect(() => {
    const html = document.documentElement;
    html.style.overflow = isMenuOpen ? "hidden" : "";
    return () => (html.style.overflow = "");
  }, [isMenuOpen]);

  // GSAP animations
  useGSAP(() => {
    menuTl.current = gsap
      .timeline({
        paused: true,
        onReverseComplete: () => gsap.set(menuRef.current, { display: "none" }),
      })
      .set(menuRef.current, { display: "flex" })
      .fromTo(menuRef.current, { y: "-100%" }, { y: "0%", duration: 0.6, ease: "expo.out" })
      .fromTo(
        ".menu-item",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.07, ease: "power2.out" },
        "-=0.2"
      );

    // Show/hide navbar on scroll
    gsap.to(navbarRef.current, {
      y: isVisible ? 0 : -80,
      duration: 0.4,
      ease: "power2.out",
    });

    // Hamburger to Close animation
    const duration = 0.3,
      ease = "power2.out";
    gsap.to(".hamburger-line-1", {
      rotation: isMenuOpen ? 45 : 0,
      y: isMenuOpen ? 6 : 0,
      duration,
      ease,
    });
    gsap.to(".hamburger-line-2", { opacity: isMenuOpen ? 0 : 1, duration: 0.2, ease });
    gsap.to(".hamburger-line-3", {
      rotation: isMenuOpen ? -45 : 0,
      y: isMenuOpen ? -6 : 0,
      duration,
      ease,
    });
  }, { dependencies: [isMenuOpen, isVisible] });

  useEffect(() => {
    if (isMenuOpen) menuTl.current.play();
    else menuTl.current.reverse();
  }, [isMenuOpen]);

  return (
    <>
      {/* Compact Navbar */}
      <nav
        ref={navbarRef}
        className="fixed top-3 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl z-50 
        bg-card/70 backdrop-blur-md rounded-full border border-white/10 shadow-md"
      >
        <div className="px-4 py-2 flex items-center justify-between">
          {/* Logo + Brand */}
          <Link
            to="/"
            onClick={() => handleLinkClick("#home")}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <img
              src="/images/logo.png"
              alt="Chizel Logo"
              className="w-8 h-8 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
            />
            <span className="text-base sm:text-lg font-heading font-bold text-text">
              CHIZEL
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 bg-background/30 px-2 py-1 rounded-full border border-white/5">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.href);
                }}
                className={clsx(
                  "relative px-4 py-2 rounded-full text-sm font-ui font-medium transition-all duration-300",
                  activeSection === item.href && location.pathname === "/"
                    ? "text-text"
                    : "text-secondary-text hover:text-text"
                )}
              >
                {item.name}
                {activeSection === item.href && location.pathname === "/" && (
                  <span className="absolute inset-0 bg-primary/60 rounded-full -z-10" />
                )}
              </a>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative w-8 h-8 flex flex-col justify-center items-center gap-1.5 md:hidden"
            aria-label="Toggle Menu"
          >
            <div className="hamburger-line-1 w-6 h-0.5 bg-text rounded-full" />
            <div className="hamburger-line-2 w-6 h-0.5 bg-text rounded-full" />
            <div className="hamburger-line-3 w-6 h-0.5 bg-text rounded-full" />
          </button>
        </div>
      </nav>

      {/* Fullscreen Mobile Menu */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-40 hidden flex-col items-center justify-center bg-background/95 text-text overflow-hidden"
      >
        {/* Glow Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-[25%] left-[15%] w-28 h-28 bg-accent/40 rounded-full blur-2xl" />
          <div className="absolute top-[65%] right-[20%] w-20 h-20 bg-primary/40 rounded-full blur-2xl" />
        </div>

        {/* Menu Links */}
        <div className="relative z-10 text-center space-y-6">
          {navItems.map((item) => (
            <div key={item.name} className="menu-item opacity-0">
              <a
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.href);
                }}
                className="block text-2xl font-heading uppercase tracking-wide relative group cursor-pointer hover:text-primary transition-colors duration-300"
              >
                {item.name}
                <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-500 group-hover:w-full" />
              </a>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="absolute bottom-5 text-center menu-item opacity-0 w-full px-4">
          <p className="text-xs font-ui text-secondary-text">
            Chizel © {new Date().getFullYear()} — All Rights Reserved
          </p>
        </div>
      </div>
    </>
  );
};

export default Navbar;
