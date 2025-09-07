import { useEffect, useRef, useState, useCallback } from "react";
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

    // Refs
    const containerRef = useRef(null);
    const navbarRef = useRef(null);
    const menuRef = useRef(null);
    const navLinksRef = useRef([]);
    const menuTl = useRef(null);
    const hamburgerTl = useRef(null);
    
    // Ref to manage observer state during programmatic scrolls
    const isClickScrolling = useRef(false);
    const scrollTimeout = useRef(null);

    // --- GSAP ANIMATION SETUP ---
    useGSAP(() => {
        gsap.to(navbarRef.current, { 
            y: isVisible ? 0 : -96, 
            autoAlpha: isVisible ? 1 : 0, 
            duration: 0.5, 
            ease: "power3.out" 
        });
    }, { dependencies: [isVisible], scope: containerRef });

    useGSAP(() => {
        // Mobile menu animations
        gsap.set(menuRef.current, { display: 'none' });
        menuTl.current = gsap.timeline({ paused: true, onReverseComplete: () => gsap.set(menuRef.current, { display: "none" }) })
            .set(menuRef.current, { display: "flex" })
            .fromTo(menuRef.current, { yPercent: -100 }, { yPercent: 0, duration: 0.6, ease: "expo.out" })
            .fromTo(".menu-item", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.07, ease: "power2.out" }, "-=0.2");

        hamburgerTl.current = gsap.timeline({ paused: true })
            .to(".hamburger-line-1", { rotation: 45, y: 6 }, 0)
            .to(".hamburger-line-2", { opacity: 0 }, 0)
            .to(".hamburger-line-3", { rotation: -45, y: -6 }, 0);
    }, { scope: containerRef });

    // --- CALLBACKS ---
    const updateIndicator = useCallback(() => {
        const indicatorEl = gsap.utils.toArray(".active-indicator")[0];
        if (location.pathname !== '/') {
            gsap.to(indicatorEl, { width: 0, duration: 0.3 });
            return;
        }
        const activeLink = navLinksRef.current.find(link => link?.getAttribute("href") === activeSection);
        if (activeLink) {
            gsap.to(indicatorEl, {
                x: activeLink.offsetLeft,
                width: activeLink.offsetWidth,
                duration: 0.6,
                ease: "power3.inOut"
            });
        }
    }, [activeSection, location.pathname]);

    const handleLinkClick = (href) => {
        setIsMenuOpen(false);

        if (href.startsWith("/")) {
            navigate(href);
            window.scrollTo(0, 0);
            return;
        }

        const targetElement = document.querySelector(href);
        if (!targetElement) return;

        isClickScrolling.current = true;
        setActiveSection(href);
        
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });

        clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => {
            isClickScrolling.current = false;
        }, 1000);
    };

    // --- EFFECTS ---
    useEffect(() => {
        if (isMenuOpen) {
            menuTl.current?.play();
            hamburgerTl.current?.play();
            document.body.style.overflow = "hidden";
        } else {
            menuTl.current?.reverse();
            hamburgerTl.current?.reverse();
            document.body.style.overflow = "";
        }
    }, [isMenuOpen]);

    useEffect(() => {
        updateIndicator();
        window.addEventListener("resize", updateIndicator);
        return () => window.removeEventListener("resize", updateIndicator);
    }, [updateIndicator]);

    useEffect(() => {
        if (location.pathname !== "/") {
            setActiveSection("");
            return;
        }
        
        const observer = new IntersectionObserver(
            (entries) => {
                if (isClickScrolling.current) return;
                
                const intersectingEntry = entries.find(entry => entry.isIntersecting);
                if (intersectingEntry) {
                    setActiveSection(`#${intersectingEntry.target.id}`);
                }
            },
            { rootMargin: "-50% 0px -50% 0px" } 
        );

        const sections = document.querySelectorAll("section[id]");
        sections.forEach(section => observer.observe(section));

        return () => sections.forEach(section => observer.unobserve(section));
    }, [location.pathname]);

    // --- RENDER ---
    return (
        <div ref={containerRef}>
            <nav
                ref={navbarRef}
                className="fixed top-3 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl z-50 bg-card/70 backdrop-blur-md rounded-full border border-white/10 shadow-lg invisible"
            >
                <div className="px-4 py-2 flex items-center justify-between">
                    <Link to="/" onClick={() => handleLinkClick("#home")} className="flex items-center gap-2 group cursor-pointer">
                        <img src="/images/logo.png" alt="Chizel Logo" className="w-8 h-8 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                        <span className="text-base sm:text-lg font-heading font-bold text-text">CHIZEL</span>
                    </Link>

                    <div className="hidden md:flex relative items-center gap-1 bg-background/30 px-2 py-1 rounded-full border border-white/5">
                        <div className="active-indicator absolute h-[80%] bg-primary/60 rounded-full top-1/2 -translate-y-1/2 left-0" />
                        {navItems.map((item, index) => (
                            <a
                                key={item.name}
                                ref={(el) => (navLinksRef.current[index] = el)}
                                href={item.href}
                                onClick={(e) => { e.preventDefault(); handleLinkClick(item.href); }}
                                className={clsx(
                                    "relative px-4 py-2 rounded-full text-sm font-ui font-medium transition-colors duration-300 z-10",
                                    activeSection === item.href && location.pathname === "/" ? "text-text" : "text-secondary-text hover:text-text"
                                )}
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>

                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="relative w-8 h-8 flex flex-col justify-center items-center gap-1.5 md:hidden" aria-label="Toggle Menu">
                        <div className="hamburger-line-1 w-6 h-0.5 bg-text rounded-full origin-center" />
                        <div className="hamburger-line-2 w-6 h-0.5 bg-text rounded-full origin-center" />
                        <div className="hamburger-line-3 w-6 h-0.5 bg-text rounded-full origin-center" />
                    </button>
                </div>
            </nav>

            <div ref={menuRef} className="fixed inset-0 z-40 hidden flex-col items-center justify-center bg-background/95 backdrop-blur-sm text-text overflow-hidden">
                <div className="relative z-10 text-center space-y-6">
                    {navItems.map((item) => (
                        <div key={item.name} className="menu-item opacity-0">
                            <a
                                href={item.href}
                                onClick={(e) => { e.preventDefault(); handleLinkClick(item.href); }}
                                className="block text-2xl font-heading uppercase tracking-wide relative group cursor-pointer hover:text-primary transition-colors duration-300"
                            >
                                {item.name}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Navbar;