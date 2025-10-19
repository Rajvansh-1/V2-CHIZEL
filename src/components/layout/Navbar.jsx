import { useEffect, useRef, useState, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { navItems } from "@utils/constants";
import { useScrollDirection } from "@hooks/useScrollDirection";
import { useLocation, useNavigate } from "react-router-dom"; // Removed Link as direct navigation is handled
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
        // Navbar visibility animation
        gsap.to(navbarRef.current, {
            y: isVisible ? 0 : -96, // Moves up out of view when scrolling down
            autoAlpha: isVisible ? 1 : 0, // Fades out when scrolling down
            duration: 0.5,
            ease: "power3.out"
        });
    }, { dependencies: [isVisible], scope: containerRef }); // Rerun animation when `isVisible` changes

    useGSAP(() => {
        // Mobile menu open/close animations
        gsap.set(menuRef.current, { display: 'none' }); // Initially hide the menu
        menuTl.current = gsap.timeline({ paused: true, onReverseComplete: () => gsap.set(menuRef.current, { display: "none" }) }) // Hide again after closing
            .set(menuRef.current, { display: "flex" }) // Set display before animating in
            .fromTo(menuRef.current, { yPercent: -100 }, { yPercent: 0, duration: 0.6, ease: "expo.out" }) // Slide down
            .fromTo(".menu-item", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.07, ease: "power2.out" }, "-=0.2"); // Animate menu items

        // Hamburger icon animation (X shape when open)
        hamburgerTl.current = gsap.timeline({ paused: true })
            .to(".hamburger-line-1", { rotation: 45, y: 6 }, 0) // Rotate top line
            .to(".hamburger-line-2", { opacity: 0 }, 0)         // Hide middle line
            .to(".hamburger-line-3", { rotation: -45, y: -6 }, 0); // Rotate bottom line
    }, { scope: containerRef });

    // --- CALLBACKS ---
    // Function to update the position and width of the active link indicator
    const updateIndicator = useCallback(() => {
        const indicatorEl = gsap.utils.toArray(".active-indicator")[0];
        if (!indicatorEl) return;

        // If not on the main page with sections, hide the indicator
        if (location.pathname !== '/chizel-core') {
            gsap.to(indicatorEl, { width: 0, duration: 0.3 });
            return;
        }

        // Find the DOM element corresponding to the active section's link
        const activeLink = navLinksRef.current.find(link => link?.getAttribute("href") === activeSection);

        // Animate the indicator to the active link's position and width
        if (activeLink) {
            gsap.to(indicatorEl, {
                x: activeLink.offsetLeft,
                width: activeLink.offsetWidth,
                duration: 0.6,
                ease: "power3.inOut"
            });
        } else {
             gsap.to(indicatorEl, { width: 0, duration: 0.3 }); // Hide if no active link found (e.g., initial load)
        }
    }, [activeSection, location.pathname]); // Dependencies: reruns when activeSection or path changes

    // Handles clicks on navigation links (desktop and mobile)
    const handleLinkClick = (href) => {
        // Close mobile menu if it's open
        if (isMenuOpen) setIsMenuOpen(false);

        // Handle absolute internal page links (e.g., /about-us)
        if (href.startsWith("/")) {
            navigate(href); // Navigate using react-router
            window.scrollTo(0, 0); // Scroll to the top of the new page
            setActiveSection(""); // Clear section highlighting as we are on a new page
            return;
        }

        // Handle anchor links within the /chizel-core page (e.g., #home, #problem)
        const targetElement = document.querySelector(href);

        // If we are already on the /chizel-core page and the target section exists
        if (location.pathname === '/chizel-core' && targetElement) {
            isClickScrolling.current = true; // Set flag to prevent IntersectionObserver interference
            setActiveSection(href); // Update the active section state

            // Smoothly scroll the target section into view
            targetElement.scrollIntoView({ behavior: "smooth", block: "start" });

            // Reset the scrolling flag after a delay (allowing time for the scroll to finish)
            clearTimeout(scrollTimeout.current);
            scrollTimeout.current = setTimeout(() => {
                isClickScrolling.current = false;
            }, 1000); // 1 second delay might need adjustment based on scroll duration
        } else {
            // If we are on a different page OR the target doesn't exist (shouldn't happen with valid hrefs)
            // Navigate to the /chizel-core page, appending the hash if it's not #home
            // React Router will handle scrolling to the element with the ID on the new page load
            navigate(`/chizel-core${href === '#home' ? '' : href}`);
        }
    };


    // --- EFFECTS ---
    // Effect to play/reverse menu animations based on isMenuOpen state
    useEffect(() => {
        if (isMenuOpen) {
            menuTl.current?.play(); // Open menu animation
            hamburgerTl.current?.play(); // Transform hamburger to X
            document.body.style.overflow = "hidden"; // Prevent background scrolling
        } else {
            menuTl.current?.reverse(); // Close menu animation
            hamburgerTl.current?.reverse(); // Transform X back to hamburger
            document.body.style.overflow = ""; // Allow background scrolling
        }
    }, [isMenuOpen]); // Dependency: reruns when isMenuOpen changes

    // Effect to update the indicator on initial render and window resize
    useEffect(() => {
        updateIndicator(); // Update on mount
        window.addEventListener("resize", updateIndicator); // Update on resize
        return () => window.removeEventListener("resize", updateIndicator); // Cleanup listener
    }, [updateIndicator]); // Dependency: the memoized updateIndicator function

    // Effect to set up IntersectionObserver for tracking active section on scroll
    useEffect(() => {
        // Only run the observer logic if we are on the page with sections
        if (location.pathname !== "/chizel-core") {
            setActiveSection(""); // Clear active section if not on the main page
            return; // Exit effect early
        }

        // Create an IntersectionObserver
        const observer = new IntersectionObserver(
            (entries) => {
                // Ignore observer events triggered by programmatic scrolling (handleLinkClick)
                if (isClickScrolling.current) return;

                // Find the entry that is currently intersecting within the rootMargin bounds
                const intersectingEntry = entries.find(entry => entry.isIntersecting);

                // If an entry is intersecting, update the active section state
                if (intersectingEntry) {
                    setActiveSection(`#${intersectingEntry.target.id}`);
                }
            },
            {
                rootMargin: "-50% 0px -50% 0px" // Trigger when section is in the middle 50% of the viewport
            }
        );

        // Observe all <section> elements that have an ID
        const sections = document.querySelectorAll("section[id]");
        sections.forEach(section => observer.observe(section));

        // Cleanup function: unobserve all sections when the component unmounts or path changes
        return () => sections.forEach(section => observer.unobserve(section));

    }, [location.pathname]); // Dependency: rerun effect if the pathname changes

    // --- RENDER ---
    return (
        <div ref={containerRef}>
            {/* Desktop Navbar */}
            <nav
                ref={navbarRef}
                className="fixed top-3 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl z-50 bg-card/70 backdrop-blur-md rounded-full border border-white/10 shadow-lg invisible" // Starts invisible, GSAP makes it visible
            >
                <div className="px-4 py-2 flex items-center justify-between">
                    {/* Logo and Brand Name - Uses handleLinkClick to navigate to #home on /chizel-core */}
                    <div onClick={(e) => { e.preventDefault(); handleLinkClick("#home"); }} className="flex items-center gap-2 group cursor-pointer" aria-label="Go to homepage top">
                        <img src="/images/logo.png" alt="Chizel Logo" className="w-8 h-8 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                        <span className="text-base sm:text-lg font-heading font-bold text-text">CHIZEL</span>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex relative items-center gap-1 bg-background/30 px-2 py-1 rounded-full border border-white/5">
                        {/* Active Link Indicator (animated by GSAP) */}
                        <div className="active-indicator absolute h-[80%] bg-primary/60 rounded-full top-1/2 -translate-y-1/2 left-0 w-0" />
                        {/* Map through navItems from constants */}
                        {navItems.map((item, index) => (
                            <a
                                key={item.name}
                                ref={(el) => (navLinksRef.current[index] = el)} // Store ref for indicator calculation
                                href={item.href} // Standard href for accessibility/SEO
                                onClick={(e) => { e.preventDefault(); handleLinkClick(item.href); }} // Prevent default and use custom handler
                                className={clsx(
                                    "relative px-4 py-2 rounded-full text-sm font-ui font-medium transition-colors duration-300 z-10",
                                    // Apply active style only if on /chizel-core and the section matches
                                    activeSection === item.href && location.pathname === "/chizel-core" ? "text-text" : "text-secondary-text hover:text-text"
                                )}
                                aria-current={activeSection === item.href && location.pathname === "/chizel-core" ? "page" : undefined}
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>

                    {/* Mobile Menu Hamburger Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle menu state
                        className="relative w-8 h-8 flex flex-col justify-center items-center gap-1.5 md:hidden" // Hidden on medium screens and up
                        aria-label="Toggle Menu"
                        aria-expanded={isMenuOpen} // Accessibility attribute
                        aria-controls="mobile-menu" // Accessibility attribute
                    >
                        {/* Hamburger lines (animated by GSAP) */}
                        <div className="hamburger-line-1 w-6 h-0.5 bg-text rounded-full origin-center" />
                        <div className="hamburger-line-2 w-6 h-0.5 bg-text rounded-full origin-center" />
                        <div className="hamburger-line-3 w-6 h-0.5 bg-text rounded-full origin-center" />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                id="mobile-menu"
                ref={menuRef}
                className="fixed inset-0 z-40 hidden flex-col items-center justify-center bg-background/95 backdrop-blur-sm text-text overflow-hidden" // Starts hidden, GSAP controls display
                aria-hidden={!isMenuOpen} // Accessibility attribute
            >
                <div className="relative z-10 text-center space-y-6">
                    {/* Map through navItems for mobile */}
                    {navItems.map((item) => (
                        <div key={item.name} className="menu-item opacity-0"> {/* Starts invisible, GSAP animates in */}
                            <a
                                href={item.href} // Standard href
                                onClick={(e) => { e.preventDefault(); handleLinkClick(item.href); }} // Custom handler
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