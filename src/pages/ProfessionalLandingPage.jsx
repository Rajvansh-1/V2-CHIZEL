// src/pages/ProfessionalLandingPage.jsx

import { useRef, useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import LogoMarquee from '@/components/common/LogoMarquee';
// Footer is handled by MainLayout, no import needed here

import {
    FaMobileAlt, FaInfinity, FaStopCircle, FaMousePointer,
    FaArrowRight, FaAngleDoubleDown, FaGlobe, FaChild, FaUserFriends, FaStar, FaPlane, FaRegLightbulb, FaChevronDown
} from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

// --- Ultra-Optimized RealisticStarfield Component ---
const RealisticStarfield = memo(() => {
    const starfieldRef = useRef(null);
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768); // Initial state check

    useEffect(() => {
        let timeoutId;
        const checkMobile = () => {
            clearTimeout(timeoutId);
            // Debounce resize check
            timeoutId = setTimeout(() => setIsMobile(window.innerWidth < 768), 150);
        };
        window.addEventListener('resize', checkMobile, { passive: true });
        return () => {
            window.removeEventListener('resize', checkMobile);
            clearTimeout(timeoutId);
        };
    }, []);

    const layers = useMemo(() => {
        const starCountDesktop = 40, starCountMobile = 15, layerCount = 3, baseSpeed = 0.05;
        const starCount = isMobile ? starCountMobile : starCountDesktop;
        const result = [];
        for (let i = 0; i < layerCount; i++) {
            const count = Math.floor(starCount / Math.pow(i + 1, 1.5));
            const speedFactor = baseSpeed * (i + 1);
            const opacity = 1 - i * 0.3;
            const stars = Array.from({ length: count }, () => ({
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                size: `${Math.random() * 1 + 0.3}px`,
                delay: `${Math.random() * 5}s`,
                duration: `${Math.random() * 4 + 3}s`
            }));
            result.push({ stars, speedFactor, opacity, zIndex: -50 - i });
        }
        return result;
    }, [isMobile]);

    useGSAP(() => {
         const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
            gsap.utils.toArray('.star-layer').forEach((layer, i) => {
                gsap.to(layer, {
                    yPercent: -15 * (i + 1),
                    ease: "none",
                    scrollTrigger: {
                        trigger: "body",
                        start: "top top",
                        end: "bottom top",
                        scrub: 4 + i, // Slower scrub for smoother parallax
                        invalidateOnRefresh: false // Performance optimization
                    }
                });
            });
            // Set initial opacity slightly higher on desktop
             gsap.set(".realistic-star", { opacity: () => gsap.utils.random(0.4, 0.9) });
        });

        mm.add("(max-width: 767px)", () => {
            // Lower opacity on mobile for performance/visual clarity
             gsap.set(".realistic-star", { opacity: () => gsap.utils.random(0.3, 0.7) });
             // Optionally disable parallax on mobile if performance is an issue
             // ScrollTrigger.getAll().forEach(st => st.disable());
        });


        return () => mm.revert(); // Cleanup GSAP MatchMedia
    }, { scope: starfieldRef, dependencies: [isMobile] }); // Re-run if isMobile changes

    return (
         <div ref={starfieldRef} className="fixed inset-0 z-[-1] overflow-hidden bg-gradient-to-b from-[#020010] via-[#0b1226] to-[#020010]" aria-hidden="true">
            {layers.map((layer, i) => (
                <div
                    key={`layer-${i}`}
                    className="star-layer absolute inset-0"
                    data-speed={layer.speedFactor}
                    style={{ zIndex: layer.zIndex, opacity: layer.opacity }}
                >
                    {layer.stars.map((star, j) => (
                        <div
                            key={`star-${i}-${j}`}
                            className="realistic-star absolute rounded-full bg-white will-change-transform" // Added will-change
                            style={{
                                top: star.top,
                                left: star.left,
                                width: star.size,
                                height: star.size,
                                // Apply animation conditionally based on isMobile state
                                animation: isMobile ? 'none' : `twinkle ${star.duration} infinite ease-in-out alternate`,
                                animationDelay: star.delay
                            }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
});
RealisticStarfield.displayName = 'RealisticStarfield';

// --- ObstacleCard Component ---
const ObstacleCard = memo(({ icon, title, description, delay }) => {
    const cardRef = useRef(null);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

     useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
         const checkMobile = () => setIsMobile(window.innerWidth < 768);
         window.addEventListener('resize', checkMobile, { passive: true });
         return () => window.removeEventListener('resize', checkMobile);
    }, []);

     useGSAP(() => {
         if (!cardRef.current) return;
        const mm = gsap.matchMedia();
         // Desktop animation setup
         mm.add("(min-width: 768px)", () => {
            gsap.fromTo(cardRef.current,
                { opacity: 0, y: 40, scale: 0.96 },
                {
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: 'top 90%', // Trigger earlier on desktop
                        toggleActions: 'play none none reverse',
                        fastScrollEnd: true // Snaps animation end if scrolling fast
                    },
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    delay: delay * 0.06, // Stagger effect
                    ease: 'power2.out',
                    willChange: 'transform, opacity' // Performance hint
                }
            );
             // Hover effect only for non-touch devices
             if (!isTouchDevice) {
                  const tl = gsap.timeline({ paused: true });
                tl.to(cardRef.current, {
                    y: -6,
                    scale: 1.02,
                    boxShadow: '0 10px 25px rgba(239, 68, 68, 0.25)', // Red shadow
                    borderColor: 'rgba(239, 68, 68, 0.7)',
                    duration: 0.25,
                    ease: 'power2.out',
                });
                 const handleMouseEnter = () => tl.play();
                const handleMouseLeave = () => tl.reverse();
                 cardRef.current.addEventListener('mouseenter', handleMouseEnter);
                cardRef.current.addEventListener('mouseleave', handleMouseLeave);
                 // Cleanup hover listeners
                 return () => {
                    if (cardRef.current) { // Check if ref still exists
                        cardRef.current.removeEventListener('mouseenter', handleMouseEnter);
                        cardRef.current.removeEventListener('mouseleave', handleMouseLeave);
                    }
                };
            }
        });
         // Mobile animation setup (simpler, triggers later, no hover)
         mm.add("(max-width: 767px)", () => {
            gsap.fromTo(cardRef.current,
                { opacity: 0, y: 15 },
                {
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: 'top 98%', // Trigger very close to bottom on mobile
                        toggleActions: 'play none none none', // Only play once
                        fastScrollEnd: true,
                        once: true // Ensure it runs only once
                    },
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    ease: 'power1.out',
                    willChange: 'transform, opacity'
                }
            );
        });
         return () => mm.revert(); // Cleanup GSAP MatchMedia
    }, { scope: cardRef, dependencies: [isTouchDevice, isMobile, delay] });

    return (
        // Added will-change for performance
         <div ref={cardRef} className="obstacle-card-enhanced group bg-card/60 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center shadow-lg transform-gpu transition-colors duration-300 relative overflow-hidden will-change-transform" style={{ opacity: 0 }}> {/* Start hidden */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/10 via-transparent to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 pointer-events-none"></div>
            <div className="obstacle-icon-wrapper relative inline-block mb-4 p-3 bg-red-500/15 rounded-full border border-red-500/25 transition-transform duration-300">
                <div className="text-red-500 text-3xl">{icon}</div>
            </div>
            <h3 className="font-heading text-xl text-text mb-2">{title}</h3>
            <p className="text-secondary-text text-sm leading-relaxed">{description}</p>
        </div>
    );
});
ObstacleCard.displayName = 'ObstacleCard';


// --- ImpactCard Component ---
const ImpactCard = memo(({ id, icon, title, description, buttonText, onClick, gradientClass, iconBgClass, shadowClass }) => {
     const cardRef = useRef(null);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

     useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
         const checkMobile = () => setIsMobile(window.innerWidth < 768);
         window.addEventListener('resize', checkMobile, { passive: true });
         return () => window.removeEventListener('resize', checkMobile);
    }, []);

     useGSAP(() => {
        if (!cardRef.current) return;
        const mm = gsap.matchMedia();
         mm.add("(min-width: 768px)", () => {
             gsap.fromTo(cardRef.current,
                { opacity: 0, y: 35 },
                {
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse',
                        fastScrollEnd: true
                    },
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power2.out',
                    willChange: 'transform, opacity'
                }
            );
             if (!isTouchDevice) {
                  const tl = gsap.timeline({ paused: true });
                 // Use the provided shadowClass for the hover shadow color
                tl.to(cardRef.current, {
                    y: -8,
                    scale: 1.02,
                    boxShadow: shadowClass ? `0 15px 30px ${shadowClass.replace('0.25)', '0.2)')}` : '0 15px 30px rgba(0,0,0,0.2)', // Adjusted shadow intensity
                    duration: 0.25,
                    ease: 'power2.out'
                });
                 const handleMouseEnter = () => tl.play();
                const handleMouseLeave = () => tl.reverse();
                 cardRef.current.addEventListener('mouseenter', handleMouseEnter);
                cardRef.current.addEventListener('mouseleave', handleMouseLeave);
                 return () => {
                    if (cardRef.current) {
                        cardRef.current.removeEventListener('mouseenter', handleMouseEnter);
                        cardRef.current.removeEventListener('mouseleave', handleMouseLeave);
                    }
                };
            }
        });
         mm.add("(max-width: 767px)", () => {
             gsap.fromTo(cardRef.current,
                { opacity: 0, y: 15 },
                {
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: 'top 98%',
                        toggleActions: 'play none none none',
                        fastScrollEnd: true,
                        once: true
                    },
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    ease: 'power1.out',
                    willChange: 'transform, opacity'
                }
            );
        });
         return () => mm.revert();
    }, { scope: cardRef, dependencies: [isTouchDevice, isMobile, shadowClass] });

    return (
        <div
            id={id} // Ensure id is passed
            ref={cardRef}
            className={`impact-card relative group p-8 rounded-3xl border border-white/10 overflow-hidden text-center transform-gpu will-change-transform ${gradientClass || 'bg-card/70 backdrop-blur-lg'}`}
            style={{ opacity: 0 }} // Start hidden
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 pointer-events-none"></div>
            <div className="relative z-10 flex flex-col items-center h-full">
                <div className={`p-4 rounded-full border border-white/15 mb-5 inline-block transition-transform duration-300 group-hover:scale-110 ${iconBgClass || 'bg-primary/15'}`}>
                    <div className="text-3xl text-white">{icon}</div>
                </div>
                <h3 className="font-heading text-2xl text-text mb-3">{title}</h3>
                <p className="text-secondary-text text-sm mb-6 flex-grow leading-relaxed">{description}</p>
                {/* Button uses specific ID-based styles from the main component */}
                <button
                    onClick={onClick}
                    className="impact-button-css mt-auto relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-white transition duration-300 ease-out border-2 border-white/20 rounded-full group w-full hover:border-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-white/50"
                >
                    <span className="button-hover-fill absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 transform -translate-x-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-left group-hover:translate-x-0 group-hover:bg-right ease">
                        <FaArrowRight className="text-xl ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    <span className="button-text-default absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
                        {buttonText}
                    </span>
                    <span className="relative invisible">{buttonText}</span> {/* For layout spacing */}
                </button>
            </div>
        </div>
    );
});
ImpactCard.displayName = 'ImpactCard';


// --- Main Landing Page Component ---
const ProfessionalLandingPage = () => {
    const containerRef = useRef(null);
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
         window.addEventListener('resize', checkMobile, { passive: true });
         return () => window.removeEventListener('resize', checkMobile);
    }, []);

     const allPortfolioImages = useMemo(() => [
        "/images/slider/i1.jpg", "/images/slider/i2.jpg", "/images/slider/i3.jpg",
        "/images/slider/i4.jpg", "/images/slider/i5.jpg", "/images/slider/i10.png",
        "/images/slider/i8.png", "/images/slider/i9.png", "/images/slider/i7.png",
        "/images/slider/i11.png"
    ].filter(Boolean), []); // Filter out any potentially undefined paths


     const { marqueeImages1, marqueeImages2, marqueeImagesMobile } = useMemo(() => {
         if (!allPortfolioImages || allPortfolioImages.length === 0) {
             return { marqueeImages1: [], marqueeImages2: [], marqueeImagesMobile: [] };
         }
        const shuffled = [...allPortfolioImages].sort(() => Math.random() - 0.5);
        const midpoint = Math.ceil(shuffled.length / 2);
        return {
            marqueeImages1: shuffled.slice(0, midpoint),
            marqueeImages2: shuffled.slice(midpoint),
            marqueeImagesMobile: shuffled // Use all for mobile single row
        };
    }, [allPortfolioImages]);

     const obstacles = useMemo(() => [
        { icon: <FaMobileAlt />, title: "Screen Overload", description: "Hours lost in passive digital consumption." },
        { icon: <FaInfinity />, title: "Mindless Scrolling", description: "The endless feed trap stealing focus." },
        { icon: <FaMousePointer />, title: "Digital Distractions", description: "Focus shattered in a hyper-connected world." },
        { icon: <FaStopCircle />, title: "Passive Alternatives", description: "Lack of truly engaging developmental tools." },
    ], []);

    useGSAP(() => {
        const mm = gsap.matchMedia();

        const plane1 = ".plane-1";
        const plane2 = ".plane-2";
        const line1 = ".intro-heading-line-1";
        const line2 = ".intro-heading-line-2";

         // Ensure elements start in the correct state for animation
        gsap.set([line1, line2], { opacity: 1, visibility: 'visible' }); // Use visibility
        gsap.set(line1, { clipPath: 'inset(0 100% 0 0)' });
        gsap.set(line2, { clipPath: 'inset(0 0 0 100%)' });
        gsap.set(plane1, { x: '-100%', opacity: 1 }); // Start off-screen left
        gsap.set(plane2, { x: '100%', opacity: 1 }); // Start off-screen right
        gsap.set(".section-1 .animated-element", { opacity: 0, y: 20 });
        gsap.set(".section-1 .scroll-indicator", { opacity: 0 });


        const tl = gsap.timeline({ delay: 0.5 }); // Start animation slightly sooner

        // Plane animations revealing text
        tl.to(plane1, { x: "100vw", duration: 2, ease: "power2.inOut", onUpdate: function() { gsap.set(line1, { clipPath: `inset(0 ${100 - this.progress() * 100}% 0 0)` }); } }, 0);
        tl.to(plane2, { x: "-100vw", duration: 2, ease: "power2.inOut", onUpdate: function() { gsap.set(line2, { clipPath: `inset(0 0 0 ${100 - this.progress() * 100}%)` }); } }, 0.5);

        // Fade in text and button after planes have moved sufficiently
        tl.to(".section-1 .animated-element", { opacity: 1, y: 0, stagger: 0.1, duration: isMobile ? 0.4 : 0.6, ease: "power2.out" }, 1.5);

        // Fade in scroll indicator
         tl.to(".section-1 .scroll-indicator", { opacity: 1, duration: isMobile ? 0.3 : 0.5, ease: "power2.out" }, 2);

        // --- Scroll-Triggered Animations for Sections ---
        const animateSectionElements = (selector, start = "top 85%") => {
             const elements = gsap.utils.toArray(`${selector} .animated-element, ${selector} > h2, ${selector} > h3, ${selector} > p:not(.v4-subtitle)`); // Avoid double animating subtitle
             if (elements.length > 0) {
                 gsap.fromTo(elements,
                    { opacity: 0, y: isMobile ? 10 : 20 },
                    {
                        scrollTrigger: {
                            trigger: selector,
                            start: start,
                             toggleActions: isMobile ? 'play none none none' : 'play none none reverse', // Play once on mobile
                             once: isMobile, // Ensure it runs only once on mobile
                             fastScrollEnd: true
                        },
                        opacity: 1,
                        y: 0,
                         stagger: isMobile ? 0.03 : 0.07,
                         duration: isMobile ? 0.3 : 0.6,
                         ease: isMobile ? "power1.out" : "power2.out",
                         willChange: 'transform, opacity' // Performance hint
                    }
                );
            }
        };

         // Apply animations to sections
         animateSectionElements('.section-2');
         animateSectionElements('.section-3');
         animateSectionElements('.section-4-intro'); // Animate intro text separately
         // Target marquee section specifically
         gsap.fromTo(['.section-4 .v4-impact .logo-marquee', '.section-4 .v4-impact .v4-subtitle'], // Also animate the subtitle here
             { opacity: 0, y: isMobile ? 15 : 30 },
             {
                 scrollTrigger: {
                     trigger: '.section-4 .v4-impact',
                     start: "top 90%", // Trigger marquee slightly earlier
                     toggleActions: isMobile ? 'play none none none' : 'play none none reverse',
                     once: isMobile,
                     fastScrollEnd: true
                 },
                 opacity: 1,
                 y: 0,
                 stagger: 0.1,
                 duration: isMobile ? 0.4 : 0.7,
                 ease: isMobile ? "power1.out" : "power2.out",
                 willChange: 'transform, opacity'
             }
         );
         animateSectionElements('.section-5');


        return () => {
            tl.kill(); // Kill the main timeline
            mm.revert(); // Revert MatchMedia setups
            ScrollTrigger.getAll().forEach(trigger => trigger.kill()); // Kill all scroll triggers
        };
    }, { scope: containerRef, dependencies: [isMobile] }); // Re-run GSAP setup if mobile status changes

     // --- Event Handlers ---
     const handleExternalLink = useCallback((url) => {
         if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }, []);

    const handleWaitlist = useCallback(() => {
        handleExternalLink("https://docs.google.com/forms/d/1Hx5WA9eEEKGYv96UcotYh-t5ImBNvdO_WdD6IzftTD0/viewform?edit_requested=true");
    }, [handleExternalLink]);

    const handleCoreClick = useCallback(() => navigate('/chizel-core'), [navigate]);
    const handleKidsClick = useCallback(() => handleExternalLink('https://rajvansh-1.github.io/ChizelVerse/'), [handleExternalLink]);
    const handleParentsClick = useCallback(() => handleExternalLink('https://rajvansh-1.github.io/ParentPage-CV/'), [handleExternalLink]);

    // --- Render ---
    return (
        // Let MainLayout handle the overall page structure (min-h-screen, flex-grow etc.)
        <div ref={containerRef} className="professional-landing bg-transparent text-text relative z-10">
            <RealisticStarfield />

             <section className="section-1 min-h-screen flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
                <FaPlane className="plane-1 absolute top-1/2 left-0 text-3xl md:text-4xl text-white opacity-80 will-change-transform" aria-hidden="true"/>
                <FaPlane className="plane-2 absolute top-1/2 right-0 text-3xl md:text-4xl text-white opacity-80 scale-x-[-1] will-change-transform" aria-hidden="true"/>

                <div className="section-1-content relative z-10">
                    <h1 className="intro-heading font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight md:leading-tight">
                         <div className="intro-heading-line-1 inline-block">Ever Dreamt of </div>
                         <div className="intro-heading-line-2 inline-block mt-1 md:mt-2">Being Successful?</div>
                    </h1>
                    <p className="animated-element text-secondary-text text-lg md:text-xl max-w-2xl mx-auto mb-8">
                        Ever Wondered When it all pays off
                    </p>
                </div>

                 <div className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 z-30 pointer-events-none">
                    <div className="relative text-lg text-yellow-300">
                        <div className="absolute -inset-1 rounded-full bg-yellow-400 opacity-50 blur-md animate-pulse"></div>
                        <FaRegLightbulb className="relative"/>
                    </div>
                    <span className="font-ui text-sm text-secondary-text">Scroll Down</span>
                    <FaChevronDown className="text-secondary-text text-xs scroll-chevron" />
                </div>
            </section>

             <section className="section-2 min-h-screen flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
                <div className="section-2-content relative z-10 w-full max-w-5xl text-center">
                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-text mb-12 md:mb-16">
                        What's <span className="text-red-500">Holding</span> You Back?
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {obstacles.map((obstacle, index) => (
                            <ObstacleCard
                                key={obstacle.title}
                                icon={obstacle.icon}
                                title={obstacle.title}
                                description={obstacle.description}
                                delay={index}
                            />
                        ))}
                    </div>
                </div>
            </section>

             <section className="section-3 min-h-screen flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
                <div className="section-3-content relative z-10 flex flex-col items-center">
                    <div className="relative mb-6 md:mb-8 animated-element">
                        <img src="/images/logo.png" alt="Chizel Logo" className="w-24 h-24 md:w-32 md:h-32 drop-shadow-lg" loading="lazy" />
                    </div>
                    <h2 className="font-heading text-4xl md:text-6xl font-bold text-text mb-4 drop-shadow-md animated-element">
                        That's Where <span className="animated-gradient-heading">Chizel</span> Was Born.
                    </h2>
                    <p className="text-secondary-text text-lg md:text-xl max-w-xl leading-relaxed animated-element">
                        Forged from the need to transform passive screen time into an active launchpad for brilliance and real-world skills.
                    </p>
                </div>
            </section>

             <section className="section-4 min-h-screen flex flex-col items-center justify-center py-16 md:py-24 px-4 text-center relative overflow-hidden">
                <div className="section-4-content relative z-10 w-full max-w-6xl">
                    <div className="section-4-intro mb-12 md:mb-16">
                        <h3 className="font-heading text-5xl md:text-6xl mb-4 animated-gradient-heading drop-shadow-lg">
                            Our Impact
                        </h3>
                         <p className="v4-subtitle text-secondary-text text-lg md:text-xl max-w-3xl mx-auto">
                             A glimpse into the vibrant, engaging world we're building.
                         </p>
                    </div>
                     {/* Marquee Section */}
                     <div className="v4-impact mb-16 md:mb-20"> {/* Wrapper for marquee */}
                         {isMobile ? (
                            <div className="flex flex-col">
                                <LogoMarquee images={marqueeImagesMobile} speed={15} direction="left" />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-5 md:gap-6">
                                <LogoMarquee images={marqueeImages1} speed={10} direction="left" />
                                <LogoMarquee images={marqueeImages2} speed={10} direction="right" />
                            </div>
                        )}
                    </div>
                     {/* Explore Universe Section */}
                     <div className="section-4-intro mt-16 md:mt-20">
                        <h2 className="font-heading text-4xl md:text-5xl font-bold text-text mb-5 md:mb-6">
                            Explore the <span className="animated-gradient-heading">Chizel Universe</span>
                        </h2>
                        <p className="text-secondary-text text-lg md:text-xl max-w-3xl mx-auto mb-10 md:mb-12">
                            Dive into the core platform or experience tailored journeys designed for kids and parents.
                        </p>
                    </div>
                    <div className="impact-card-container grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
                       <ImpactCard
                            id="chizel-core-card"
                            icon={<FaGlobe />}
                            title="Chizel Core"
                            description="Discover the foundation of our learning ecosystem, technology, and vision."
                            buttonText="Explore Core"
                            onClick={handleCoreClick}
                            gradientClass="bg-gradient-to-br from-blue-900/40 via-card/60 to-blue-900/40 backdrop-blur-lg"
                            iconBgClass="bg-blue-500/25"
                            shadowClass="rgba(31, 111, 235, 0.25)"
                        />
                        <ImpactCard
                             id="chizel-kids-card"
                            icon={<FaChild />}
                            title="Chizel for Kids"
                            description="Step into the interactive ChizelVerse designed for fun, skill-building adventures."
                            buttonText="Enter Kids Verse"
                            onClick={handleKidsClick}
                            gradientClass="bg-gradient-to-br from-purple-900/40 via-card/60 to-purple-900/40 backdrop-blur-lg"
                            iconBgClass="bg-purple-500/25"
                            shadowClass="rgba(93, 63, 211, 0.25)"
                        />
                        <ImpactCard
                             id="chizel-parents-card"
                            icon={<FaUserFriends />}
                            title="Chizel for Parents"
                            description="Monitor progress, discover resources, and connect with the parent community."
                            buttonText="View Parent Portal"
                            onClick={handleParentsClick}
                            gradientClass="bg-gradient-to-br from-orange-900/40 via-card/60 to-orange-900/40 backdrop-blur-lg"
                            iconBgClass="bg-orange-500/25"
                            shadowClass="rgba(255, 179, 71, 0.25)"
                        />
                    </div>
                </div>
            </section>

             {/* Removed min-h-screen from the last section */}
             <section className="section-5 flex flex-col items-center justify-center text-center p-4 relative overflow-hidden py-20 md:py-32">
                <div className="section-5-content relative z-10 w-full max-w-3xl">
                    <h2 className="font-heading text-4xl md:text-6xl font-bold text-text mb-5 md:mb-6 drop-shadow-md animated-element">
                        Ready to Ignite <span className="animated-gradient-heading">Potential?</span>
                    </h2>
                    <p className="text-secondary-text text-lg md:text-xl mb-8 md:mb-10 leading-relaxed animated-element">
                        Be among the first explorers. Join the Chizel waitlist today for exclusive early access, special launch rewards, and updates on our mission to reshape learning.
                    </p>
                    <div className="relative inline-block group animated-element">
                         {/* Pulse animation applied here */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-orange rounded-full blur-md opacity-50 group-hover:opacity-75 transition duration-300 pointer-events-none" style={{ animation: isMobile ? 'none' : 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></div>
                        <Button
                            title="Secure Your Spot"
                            onClick={handleWaitlist}
                            rightIcon={<FaArrowRight />}
                            // Use more specific button classes if Button component styles conflict
                            containerClass="final-cta-button relative !text-base md:!text-lg !py-3 !px-8 md:!py-4 md:!px-10 !bg-gradient-to-r !from-primary !to-accent hover:!shadow-[0_0_20px_rgba(31,111,235,0.5)]"
                        />
                    </div>
                </div>
            </section>
             {/* Footer is rendered by MainLayout */}

            <style jsx global>{`
                :root {
                     --color-primary: rgb(31, 111, 235);      /* Blue */
                    --color-primary-rgb: 31, 111, 235;
                    --color-accent: rgb(93, 63, 211);       /* Purple */
                    --color-accent-rgb: 93, 63, 211;
                     --color-orange: rgb(255, 179, 71);      /* Orange/Amber */
                     --color-orange-rgb: 255, 179, 71;
                     --color-primary-alpha: rgba(31, 111, 235, 0.25);
                    --color-accent-alpha: rgba(93, 63, 211, 0.25);
                     --color-orange-alpha: rgba(255, 179, 71, 0.25);
                     --color-text: #e6f1ff;
                     --color-secondary-text: #8fa5c6;
                     --color-border: rgba(230, 241, 255, 0.1);
                     --color-background: #0b1226;
                     --color-card: #16213e;
                     --color-red: rgb(239, 68, 68); /* Explicit red for obstacles */
                     --color-yellow: rgb(250, 204, 21); /* Explicit yellow for scroll indicator */
                }

                /* Base Styles & Font Smoothing */
                * {
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    -webkit-tap-highlight-color: transparent;
                }
                html { scroll-behavior: smooth; overflow-x: hidden; }
                body { overflow-x: hidden; }

                /* Layout & Section Styling */
                 section {
                     /* min-height: 100vh; */ /* Use this carefully, removed from last section */
                     display: flex; flex-direction: column; align-items: center; justify-content: center;
                     position: relative; width: 100%; overflow: hidden; /* Prevent content overflow */
                     z-index: 1; background-color: transparent; /* Rely on starfield */
                     padding-top: 5rem; padding-bottom: 5rem; /* Standard padding */
                 }
                /* Ensure first 4 sections take full viewport height */
                 .section-1, .section-2, .section-3, .section-4 { min-height: 100vh; }
                 .section-5 { min-height: auto; padding-top: 5rem; padding-bottom: 8rem; } /* Less min-height, more bottom padding */

                /* Typography & Gradients */
                .intro-heading { color: var(--color-text); text-shadow: 0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px var(--color-primary-alpha), 0 0 35px var(--color-accent-alpha); will-change: transform; }
                 .animated-gradient-heading { color: transparent; background: linear-gradient(90deg, var(--color-primary), var(--color-accent), var(--color-orange), var(--color-primary)); background-clip: text; -webkit-background-clip: text; background-size: 200% auto; animation: gradient-flow 6s linear infinite; font-weight: 800; }

                /* Animations */
                @keyframes gradient-flow { 0% { background-position: 0% center; } 100% { background-position: 200% center; } }
                @keyframes twinkle { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 0.8; transform: scale(1.1); } }
                @keyframes pulse { 0%, 100% { opacity: 0.7; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.95); } }
                .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                .animate-bounce { animation: bounce 2s infinite; }
                @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

                /* Scroll Indicator Specific Animations */
                .scroll-indicator { animation: fadeInScroll 1.5s 2s ease-out forwards; } /* Fade in after intro animation */
                @keyframes fadeInScroll { from { opacity: 0; } to { opacity: 1; } }
                .scroll-chevron { animation: bounceSlight 2s infinite ease-in-out; }
                @keyframes bounceSlight { 0%, 100% { transform: translateY(0); opacity: 0.7; } 50% { transform: translateY(4px); opacity: 1; } }

                /* Performance & Accessibility */
                @media (min-width: 768px) { .animated-element, .obstacle-card-enhanced, .impact-card { will-change: opacity, transform; } }
                @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; } }
                img { content-visibility: auto; } /* Helps browser rendering performance */

                /* Mobile Specific Adjustments */
                @media (max-width: 767px) {
                    html { -webkit-overflow-scrolling: touch; } /* Smoother scrolling on iOS */
                    body { overscroll-behavior-y: none; } /* Prevent pull-to-refresh */
                    .backdrop-blur-lg { backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); } /* Slightly less blur on mobile */
                    .intro-heading { font-size: clamp(2.5rem, 10vw, 3.5rem); } /* Adjust heading size */
                    section { padding-top: 4rem; padding-bottom: 4rem; } /* Reduce section padding */
                     .section-5 { padding-bottom: 6rem; }
                     .impact-card-container { grid-template-columns: 1fr; max-width: 350px; } /* Stack cards on mobile */
                }

                 /* --- Impact Card Button Base Styles --- */
                 .impact-button-css { position: relative; overflow: hidden; /* Ensure pseudo-elements are contained */ }
                 .impact-button-css .button-hover-fill { background-size: 200% auto; background-position: 0% center; }
                 .impact-button-css:hover .button-hover-fill { transform: translateX(0%); background-position: 100% center; }
                 .impact-button-css:hover .button-text-default { transform: translateX(100%); }
                 .impact-button-css .button-hover-fill, .impact-button-css .button-text-default { transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); /* Smooth transition */ }

                /* --- CORE BUTTON (Blue/Purple Theme) --- */
                #chizel-core-card .impact-button-css {
                    background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
                    border-color: transparent;
                    box-shadow: 0 0 15px 0px var(--color-primary-alpha), 0 0 30px 0px var(--color-accent-alpha);
                    animation: pulse-glow-core 2.5s infinite ease-in-out;
                }
                 #chizel-core-card .impact-button-css::before { content: ''; position: absolute; top: 0; left: -75%; width: 50%; height: 100%; background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 100%); transform: skewX(-25deg); animation: shine 4s infinite linear; }
                #chizel-core-card .impact-button-css:hover { transform: scale(1.05); box-shadow: 0 0 25px 5px var(--color-primary-alpha), 0 0 40px 10px var(--color-accent-alpha); border-color: rgba(255, 255, 255, 0.5); }
                 #chizel-core-card .impact-button-css .button-hover-fill { background-image: linear-gradient(90deg, var(--color-accent), var(--color-primary), var(--color-accent)); }
                 @keyframes pulse-glow-core { 0%, 100% { transform: scale(1); box-shadow: 0 0 15px 0px var(--color-primary-alpha), 0 0 30px 0px var(--color-accent-alpha); } 50% { transform: scale(1.03); box-shadow: 0 0 25px 5px var(--color-primary-alpha), 0 0 40px 10px var(--color-accent-alpha); } }

                 /* --- KIDS BUTTON (Purple Theme) --- */
                #chizel-kids-card .impact-button-css {
                    background: var(--color-accent); border-color: transparent; box-shadow: 0 0 15px 0px var(--color-accent-alpha); animation: pulse-glow-kids 2.5s infinite ease-in-out;
                }
                 #chizel-kids-card .impact-button-css::before { content: ''; position: absolute; top: 0; left: -75%; width: 50%; height: 100%; background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.25) 100%); transform: skewX(-25deg); animation: shine 4.5s infinite linear 0.5s; }
                #chizel-kids-card .impact-button-css:hover { transform: scale(1.05); box-shadow: 0 0 25px 5px var(--color-accent-alpha); border-color: rgba(255, 255, 255, 0.4); }
                 #chizel-kids-card .impact-button-css .button-hover-fill { background-image: linear-gradient(90deg, rgb(110, 20, 180), var(--color-accent), rgb(110, 20, 180)); }
                 @keyframes pulse-glow-kids { 0%, 100% { transform: scale(1); box-shadow: 0 0 15px 0px var(--color-accent-alpha); } 50% { transform: scale(1.03); box-shadow: 0 0 25px 5px var(--color-accent-alpha); } }

                 /* --- PARENTS BUTTON (Orange Theme) --- */
                 #chizel-parents-card .impact-button-css {
                    background: var(--color-orange); border-color: transparent; box-shadow: 0 0 15px 0px var(--color-orange-alpha); animation: pulse-glow-parents 2.5s infinite ease-in-out;
                 }
                 #chizel-parents-card .impact-button-css::before { content: ''; position: absolute; top: 0; left: -75%; width: 50%; height: 100%; background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 100%); transform: skewX(-25deg); animation: shine 4.2s infinite linear 1s; }
                #chizel-parents-card .impact-button-css:hover { transform: scale(1.05); box-shadow: 0 0 25px 5px var(--color-orange-alpha); border-color: rgba(255, 255, 255, 0.5); }
                 #chizel-parents-card .impact-button-css .button-hover-fill { background-image: linear-gradient(90deg, rgb(255, 150, 40), var(--color-orange), rgb(255, 150, 40)); }
                 @keyframes pulse-glow-parents { 0%, 100% { transform: scale(1); box-shadow: 0 0 15px 0px var(--color-orange-alpha); } 50% { transform: scale(1.03); box-shadow: 0 0 25px 5px var(--color-orange-alpha); } }

                 /* General Shine Animation */
                 @keyframes shine { 100% { left: 125%; } }

            `}</style>
        </div>
    );
};

export default ProfessionalLandingPage;