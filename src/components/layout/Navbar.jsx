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

  // Logic to track active section on scroll
  useEffect(() => {
    if (location.pathname !== '/') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px" } // Activates when the middle of the section is in the middle of the viewport
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [location.pathname]);

  // Logic to handle navigation clicks
  const handleLinkClick = (href) => {
    setIsMenuOpen(false);
    if (href.startsWith("/")) {
      navigate(href);
      window.scrollTo(0, 0);
    } else {
      if (location.pathname !== '/') {
        navigate('/');
        // Wait for the navigation to complete before scrolling
        setTimeout(() => {
          document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      } else {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Logic to prevent body scroll when mobile menu is open
  useEffect(() => {
    const html = document.documentElement;
    if (isMenuOpen) {
      html.style.overflow = "hidden";
    } else {
      html.style.overflow = "";
    }
    return () => {
      html.style.overflow = ""; // Cleanup on component unmount
    };
  }, [isMenuOpen]);

  // GSAP Animations
  useGSAP(() => {
    // Mobile menu timeline
    menuTl.current = gsap
      .timeline({
        paused: true,
        onReverseComplete: () => {
          gsap.set(menuRef.current, { display: "none" });
        },
      })
      .set(menuRef.current, { display: "flex" })
      .fromTo(
        menuRef.current,
        { y: "-100%" },
        { y: "0%", duration: 0.7, ease: "expo.out" }
      )
      .fromTo(
        ".menu-item",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" },
        "-=0.3"
      );

    // Navbar show/hide on scroll
    gsap.to(navbarRef.current, {
      y: isVisible ? 0 : -120,
      duration: 0.5,
      ease: "power2.out",
    });
    
    // Hamburger icon animation
    const duration = 0.4, ease = "power2.out";
    gsap.to(".hamburger-line-1", { rotation: isMenuOpen ? 45 : 0, y: isMenuOpen ? 5 : 0, duration, ease });
    gsap.to(".hamburger-line-2", { opacity: isMenuOpen ? 0 : 1, duration: 0.2, ease });
    gsap.to(".hamburger-line-3", { rotation: isMenuOpen ? -45 : 0, y: isMenuOpen ? -5 : 0, duration, ease });

  }, { dependencies: [isMenuOpen, isVisible] });

  useEffect(() => {
    if (isMenuOpen) {
      menuTl.current.play();
    } else {
      menuTl.current.reverse();
    }
  }, [isMenuOpen]);

  return (
    <>
      <nav
        ref={navbarRef}
        className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50 bg-card/70 backdrop-blur-xl rounded-full border border-text/10 shadow-lg"
      >
        <div className="px-4 sm:px-6 py-2 flex items-center justify-between gap-4">
          <Link to="/" onClick={() => handleLinkClick("#home")} className="flex items-center gap-2 group cursor-pointer">
            <img src="/images/logo.png" alt="Chizel Logo" className="w-10 h-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
            <span className="hidden sm:block text-xl font-heading font-bold text-text">
              CHIZEL
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-background/30 p-1 rounded-full border border-white/5">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.href);
                }}
                className={clsx(
                  "relative px-4 py-2 rounded-full text-sm font-ui font-medium transition-colors duration-300 cursor-pointer",
                  activeSection === item.href && location.pathname === '/' ? "text-text" : "text-secondary-text hover:text-text"
                )}
              >
                {item.name}
                {activeSection === item.href && location.pathname === '/' && (
                  <span className="absolute inset-0 bg-primary/80 rounded-full -z-10" style={{'viewTransitionName': `nav-active`}}></span>
                )}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative w-8 h-8 flex-center flex-col gap-1.5 cursor-pointer group z-50 md:hidden"
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
        className="fixed inset-0 z-40 hidden flex-col items-center justify-center bg-overlay text-text overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-24 h-24 bg-accent/50 rounded-full blur-2xl" />
          <div className="absolute top-[60%] right-[15%] w-20 h-20 bg-primary/50 rounded-lg rotate-45 blur-2xl" />
        </div>
        <div className="relative z-10 text-center space-y-5">
          {navItems.map((item) => (
            <div key={item.name} className="menu-item opacity-0">
              <a
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.href);
                }}
                className="block text-4xl font-heading uppercase tracking-wider relative group cursor-pointer hover:text-primary transition-colors duration-300"
              >
                {item.name}
                <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-0 h-1 bg-primary transition-all duration-500 group-hover:w-full" />
              </a>
            </div>
          ))}
        </div>
        <div className="absolute bottom-6 text-center menu-item opacity-0 w-full px-4">
          <p className="text-sm font-ui text-secondary-text">
            Chizel © {new Date().getFullYear()} — All Rights Reserved
          </p>
        </div>
      </div>
    </>
  );
};

export default Navbar;

