// src/pages/ProfessionalLandingPage.jsx

import { useRef, useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import LogoMarquee from '@/components/common/LogoMarquee';
import clsx from 'clsx'; 

import {
    FaMobileAlt, FaInfinity, FaStopCircle, FaMousePointer,
    FaArrowRight, FaAngleDoubleDown, FaGlobe, FaChild, FaUserFriends, FaStar,
    FaPlane, FaRegLightbulb, FaChevronDown,
    FaBrain, 
    FaInstagram, FaYoutube, FaLinkedin, FaFacebook
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { socialLinks, principles } from '@utils/constants';

gsap.registerPlugin(ScrollTrigger);

// --- Offer Block Component (MINIMALIST & PREMIUM) ---
const OfferBlock = memo(({ title, ctaText, ctaOnClick, ctaGradientClass, ctaRightIcon, className }) => (
    <div className={`offer-block-content flex flex-col items-center justify-center space-y-8 ${className}`}>
        <div className="relative text-center">
            <h3 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-text font-bold drop-shadow-md leading-tight">
                {title}
            </h3>
        </div>
        <Button
            title={ctaText}
            onClick={ctaOnClick}
            rightIcon={ctaRightIcon || <FaArrowRight />}
            containerClass={clsx("!text-lg !py-4 !px-12 relative z-20", ctaGradientClass)}
        />
    </div>
));
OfferBlock.displayName = 'OfferBlock';


// --- RealisticStarfield Component ---
const RealisticStarfield = memo(() => {
    const starfieldRef = useRef(null);
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768); 

    useEffect(() => {
        let timeoutId;
        const checkMobile = () => {
            clearTimeout(timeoutId);
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
                        scrub: 4 + i,
                        invalidateOnRefresh: false
                    }
                });
            });
             gsap.set(".realistic-star", { opacity: () => gsap.utils.random(0.4, 0.9) });
        });

        mm.add("(max-width: 767px)", () => {
             gsap.set(".realistic-star", { opacity: () => gsap.utils.random(0.3, 0.7) });
        });


        return () => mm.revert();
    }, { scope: starfieldRef, dependencies: [isMobile] });

    return (
         <div 
        ref={starfieldRef} 
        // ADD "pointer-events-none" to this class list:
        className="fixed inset-0 z-[-1] overflow-hidden bg-gradient-to-b from-[#020010] via-[#0b1226] to-[#020010] pointer-events-none" 
        aria-hidden="true"
    >
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
                            className="realistic-star absolute rounded-full bg-white will-change-transform"
                            style={{
                                top: star.top,
                                left: star.left,
                                width: star.size,
                                height: star.size,
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
                        start: 'top 90%',
                        toggleActions: 'play none none reverse',
                        fastScrollEnd: true
                    },
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    delay: delay * 0.06,
                    ease: 'power2.out',
                    willChange: 'transform, opacity'
                }
            );
             // Hover effect only for non-touch devices
             if (!isTouchDevice) {
                  const tl = gsap.timeline({ paused: true });
                tl.to(cardRef.current, {
                    y: -6,
                    scale: 1.02,
                    boxShadow: '0 10px 25px rgba(239, 68, 68, 0.25)',
                    borderColor: 'rgba(239, 68, 68, 0.7)',
                    duration: 0.25,
                    ease: 'power2.out',
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
         // Mobile animation setup (simpler, triggers later, no hover)
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
    }, { scope: cardRef, dependencies: [isTouchDevice, isMobile, delay] });

    return (
         <div ref={cardRef} className="obstacle-card-enhanced group bg-card/60 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center shadow-lg transform-gpu transition-colors duration-300 relative overflow-hidden will-change-transform" style={{ opacity: 0 }}>
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


// --- Main Landing Page Component ---
const ProfessionalLandingPage = () => {
    const containerRef = useRef(null);
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

    // --- ADDED: Icon Map for Socials ---
    const iconMap = {
      Instagram: <FaInstagram size="1.5em" />,
      YouTube: <FaYoutube size="1.5em" />,
      LinkedIn: <FaLinkedin size="1.5em" />,
      Twitter: <FaXTwitter size="1.5em" />,
      Facebook: <FaFacebook size="1.5em" />,
    };

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
         window.addEventListener('resize', checkMobile, { passive: true });
         return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // --- UPDATED: Image Slider Logic (Refined) ---
     const allPortfolioImages = useMemo(() => {
        const standardImages = [
            "/images/slider/i1.jpg", 
            "/images/slider/i2.jpg", 
            "/images/slider/i3.jpg",
            "/images/slider/i4.jpg", 
            "/images/slider/i5.jpg", 
            "/images/slider/i6.png", 
            "/images/slider/i7.png",
            "/images/slider/i8.png", 
            "/images/slider/i9.png", 
            "/images/slider/i10.png",
            "/images/slider/i11.png",
            "/images/slider/i12.png" 
        ];

        const frequentImages = [
            "/images/slider/i13.JPG",
            "/images/slider/i14.JPG",
            "/images/slider/i15.jpeg",
            "/images/slider/i16.jpeg",
            "/images/slider/i17.jpeg",
            "/images/slider/i18.jpeg"
        ];

        // 1. Combine: Standard + Frequent (2x only, as requested)
        const combined = [
            ...standardImages,
            ...frequentImages,
            ...frequentImages
            // removed 3rd occurrence
        ].filter(Boolean);
        
        // 2. Fisher-Yates Shuffle
        for (let i = combined.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [combined[i], combined[j]] = [combined[j], combined[i]];
        }
        
        // 3. Horizontal Neighbor Check (Prevent [A, A])
        for (let i = 0; i < combined.length - 1; i++) {
             if (combined[i] === combined[i + 1]) {
                 let swapIdx = -1;
                 // Look forward
                 for (let j = i + 2; j < combined.length; j++) {
                     if (combined[j] !== combined[i]) {
                         swapIdx = j;
                         break;
                     }
                 }
                 // If no forward, look backward
                 if (swapIdx === -1) {
                     for (let j = i - 1; j >= 0; j--) {
                         if (combined[j] !== combined[i] && (j === 0 || combined[j-1] !== combined[i])) {
                             swapIdx = j;
                             break;
                         }
                     }
                 }
                 
                 if (swapIdx !== -1) {
                     [combined[i + 1], combined[swapIdx]] = [combined[swapIdx], combined[i + 1]];
                 }
             }
        }

        // 4. Vertical Split Check (Optional but good)
        // Ensure index 0 of first half != index 0 of second half to prevent initial stacking
        const mid = Math.ceil(combined.length / 2);
        if (combined.length > 2 && combined[0] === combined[mid]) {
            // Swap [0] with [1] if safe, or any other safe index
            if (combined[1] !== combined[mid]) {
                [combined[0], combined[1]] = [combined[1], combined[0]];
            }
        }

        return combined;
    }, []);


     const { marqueeImages1, marqueeImages2, marqueeImagesMobile } = useMemo(() => {
         if (!allPortfolioImages || allPortfolioImages.length === 0) {
             return { marqueeImages1: [], marqueeImages2: [], marqueeImagesMobile: [] };
         }
        const midpoint = Math.ceil(allPortfolioImages.length / 2);
        
        return {
            marqueeImages1: allPortfolioImages.slice(0, midpoint),
            marqueeImages2: allPortfolioImages.slice(midpoint),
            marqueeImagesMobile: allPortfolioImages 
        };
    }, [allPortfolioImages]);

     const obstacles = useMemo(() => [
        { icon: <FaMobileAlt />, title: "Screen Overload", description: "Hours lost in passive digital consumption." },
        { icon: <FaInfinity />, title: "Mindless Scrolling", description: "The endless feed trap stealing focus." },
        { icon: <FaMousePointer />, title: "Digital Distractions", description: "Focus shattered in a hyper-connected world." },
        { icon: <FaStopCircle />, title: "Passive Alternatives", description: "Lack of truly engaging developmental tools." },
    ], []);

    // --- HANDLERS (Unchanged) ---
    const handleBrainrotCure = useCallback(() => {
        navigate('/brainrot-cure');
    }, [navigate]);

    const handleExternalLink = useCallback((url) => { 
        if (!url) return;
        if (document.body.requestFullscreen) {
            document.body.requestFullscreen().catch(err => {
                console.error("Fullscreen failed:", err);
            });
        } else if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error("Fullscreen failed:", err);
            });
        }
        window.location.href = url;
    }, []);
    
    const handleWaitlist = useCallback(() => handleExternalLink("https://docs.google.com/forms/d/1Hx5WA9eEEKGYv96UcotYh-t5ImBNvdO_WdD6IzftTD0/viewform?edit_requested=true"), [handleExternalLink]);
    const handleCoreClick = useCallback(() => navigate('/chizel-core'), [navigate]);
    const handleKidsClick = useCallback(() => handleExternalLink('https://rajvansh-1.github.io/ChizelVerse/'), [handleExternalLink]);
    const handleParentsClick = useCallback(() => handleExternalLink('https://rajvansh-1.github.io/ParentPage-CV/'), [handleExternalLink]);
    const handleSocialClick = (socialName) => { console.log(`Clicked ${socialName}`); };

    useGSAP(() => {
        // --- UPDATED INTRO ANIMATION (Unchanged from previous step) ---
        const mm = gsap.matchMedia();
        const plane1 = ".plane-1"; 
        const plane2 = ".plane-2";
        const line1 = ".intro-heading-line-1";
        const line2 = ".intro-heading-line-2";

        gsap.set(line1, { clipPath: 'inset(0 100% 0 0)', opacity: 1 }); 
        gsap.set(line2, { clipPath: 'inset(0 0 0 100%)', opacity: 1 }); 
        gsap.set(plane1, { xPercent: -120, opacity: 1, yPercent: -50 }); 
        gsap.set(plane2, { xPercent: 120, opacity: 1, yPercent: -50, scaleX: -1 });
        
        gsap.set(".section-1 .animated-element", { opacity: 0, y: 20 });
        gsap.set(".section-1 .scroll-indicator", { opacity: 0 });

        const introTl = gsap.timeline({ delay: 0.5 });
        const flyDuration = 2.2;
        const flyEase = "power2.inOut";

        introTl.to(plane1, { 
            x: "110vw", 
            duration: flyDuration, 
            ease: flyEase,
            onUpdate: function() {
                const progress = this.progress();
                const insetVal = 100 - (progress * 100);
                gsap.set(line1, { clipPath: `inset(0 ${insetVal}% 0 0)` });
            }
        }, 0);

        introTl.to(plane2, { 
            x: "-110vw", 
            duration: flyDuration, 
            ease: flyEase,
            onUpdate: function() {
                const progress = this.progress();
                const insetVal = 100 - (progress * 100);
                gsap.set(line2, { clipPath: `inset(0 0 0 ${insetVal}%)` });
            }
        }, 0); 

        introTl.to(".section-1 .animated-element", { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power2.out" }, 1.8);
        introTl.to(".section-1 .scroll-indicator", { opacity: 1, duration: 0.6, ease: "power2.out" }, 2.2);

        // --- Scroll-Triggered Animations ---
         const animateSectionElements = (selector, start = "top 85%") => {
             const elements = gsap.utils.toArray(`${selector} .animated-element, ${selector} > h2, ${selector} > h3, ${selector} > p:not(.v4-subtitle)`);
             if (elements.length > 0) {
                 gsap.fromTo(elements,
                    { opacity: 0, y: isMobile ? 10 : 20 },
                    {
                        scrollTrigger: {
                            trigger: selector,
                            start: start,
                             toggleActions: isMobile ? 'play none none none' : 'play none none reverse',
                             once: isMobile,
                             fastScrollEnd: true
                        },
                        opacity: 1, y: 0,
                         stagger: isMobile ? 0.03 : 0.07,
                         duration: isMobile ? 0.3 : 0.6,
                         ease: isMobile ? "power1.out" : "power2.out",
                         willChange: 'transform, opacity'
                    }
                );
            }
        };

         animateSectionElements('.section-2');
         animateSectionElements('.section-3');
         animateSectionElements('.section-4-intro');

          gsap.fromTo(['.section-4 .v4-impact .logo-marquee', '.section-4 .v4-impact .v4-subtitle'],
            { opacity: 0, y: isMobile ? 15 : 30 },
            {
                scrollTrigger: {
                    trigger: '.section-4 .v4-impact',
                    start: "top 90%",
                    toggleActions: isMobile ? 'play none none none' : 'play none none reverse',
                    once: isMobile,
                    fastScrollEnd: true
                },
                opacity: 1, y: 0,
                stagger: 0.1,
                duration: isMobile ? 0.4 : 0.7,
                ease: isMobile ? "power1.out" : "power2.out",
                willChange: 'transform, opacity'
            }
        );

         animateSectionElements('.section-offers-content', "top 90%");
         animateSectionElements('.section-5', "top 90%");
         animateSectionElements('.section-socials', "top 95%"); 

        // --- Social Icon Hover Animations ---
        const icons = gsap.utils.toArray(".social-icon-link");
        icons.forEach((iconLink) => {
            const iconWrapper = iconLink.querySelector(".social-icon-wrapper");
            const iconItself = iconWrapper.querySelector("span");
            const pingEffect = iconLink.querySelector(".ping-effect");
            const tl = gsap.timeline({ paused: true });
            tl.to(iconWrapper, { scale: 1.2, rotate: 10, backgroundColor: 'var(--color-primary)', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 0 30px 5px rgba(31, 111, 235, 0.5)', duration: 0.3, ease: 'power2.out' })
              .to(iconItself, { color: '#FFFFFF', scale: 1.1, duration: 0.3, ease: 'power2.out' }, 0)
              .fromTo(pingEffect, { scale: 0.5, opacity: 0.8 }, { scale: 1.8, opacity: 0, duration: 0.4, ease: 'power1.out' }, 0);
            iconLink.addEventListener("mouseenter", () => tl.play());
            iconLink.addEventListener("mouseleave", () => tl.reverse());
            return () => { if (iconLink) { iconLink.removeEventListener("mouseenter", () => tl.play()); iconLink.removeEventListener("mouseleave", () => tl.reverse()); } };
        });

        return () => {
            introTl.kill();
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, { scope: containerRef, dependencies: [isMobile] });

    // --- Render ---
    return (
        <div ref={containerRef} className="professional-landing bg-transparent text-text relative z-10 flex-grow">
            <RealisticStarfield />

             <section className="section-1 min-h-screen flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
                <div className="plane-1 absolute top-[42%] left-0 text-3xl md:text-5xl text-primary drop-shadow-[0_0_15px_rgba(31,111,235,0.8)] z-20 will-change-transform">
                    <FaPlane aria-hidden="true"/>
                </div>

                <div className="plane-2 absolute top-[52%] right-0 text-3xl md:text-5xl text-accent drop-shadow-[0_0_15px_rgba(93,63,211,0.8)] z-20 will-change-transform">
                    <FaPlane aria-hidden="true"/>
                </div>

                <div className="section-1-content relative z-10">
                    <h1 className="intro-heading font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight md:leading-tight">
                        <div className="intro-heading-line-1 relative inline-block py-2">
                            Ever Dreamt of
                        </div>
                        <br />
                        <div className="intro-heading-line-2 mt-1 md:mt-2 relative inline-block py-2">
                            Being Successful?
                        </div>
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

             <section className="section-4 flex flex-col items-center justify-center py-16 md:py-24 px-4 text-center relative overflow-hidden">
                <div className="section-4-content relative z-10 w-full max-w-6xl">
                    <div className="section-4-intro mb-12 md:mb-16">
                        <h3 className="font-heading text-5xl md:text-6xl mb-4 animated-gradient-heading drop-shadow-lg">
                            Our Impact
                        </h3>
                         <p className="v4-subtitle text-secondary-text text-lg md:text-xl max-w-3xl mx-auto">
                             A glimpse into the vibrant, engaging world we're building.
                         </p>
                    </div>
                     <div className="v4-impact mb-16 md:mb-20">
                         {isMobile ? (
                            <div className="flex flex-col">
                                <LogoMarquee images={marqueeImagesMobile} speed={30} direction="left" className="will-change-transform" />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-5 md:gap-6">
                                <LogoMarquee images={marqueeImages1} speed={20} direction="left" className="will-change-transform" />
                                <LogoMarquee images={marqueeImages2} speed={20} direction="right" className="will-change-transform" />
                            </div>
                        )}
                    </div>
                    
                    {/* >>> START UPDATED OFFER SECTION CONTENT (MINIMALIST & PREMIUM) <<< */}
                    <div className="section-offers-content pt-12 md:pt-16 max-w-5xl mx-auto">
                        <h2 className="animated-element font-heading text-6xl md:text-7xl font-black text-white mb-20 md:mb-28 drop-shadow-lg">
                            <span className="animated-gradient-heading">What We Offer</span>
                        </h2>

                        <div className="space-y-20 md:space-y-32">
                            
                            {/* Block 1: The Brainrot Cure -> NAVIGATES TO NEW PAGE */}
                            <OfferBlock
                                title="STEPS TO CURE BRAINROT"
                                ctaText="CLICK HERE"
                                ctaOnClick={handleBrainrotCure} // Internal route navigation
                                ctaGradientClass="!bg-gradient-to-r !from-red-600 !to-orange-500 !text-white !font-bold"
                                className="pb-10 border-b border-white/10"
                            />

                            {/* Block 2: Brain Detox Games -> NAVIGATES TO KIDS DEMO (Fullscreen Attempt) */}
                            <OfferBlock
                                title="TRY OUR BRAINROT DETOX GAMES"
                                ctaText="PLAY THE DEMO"
                                ctaOnClick={handleKidsClick} // Uses Fullscreen logic
                                ctaGradientClass="!bg-gradient-to-r !from-accent !to-purple-600 !text-white !font-bold"
                                className="pb-10 border-b border-white/10"
                            />

                            {/* Block 3: Chizel for Parents -> NAVIGATES TO PARENTS DEMO (Fullscreen Attempt) */}
                            <OfferBlock
                                title="CHIZEL FOR PARENTS"
                                ctaText="VIEW PARENTAL PORTAL"
                                ctaOnClick={handleParentsClick} // Uses Fullscreen logic
                                ctaGradientClass="!bg-gradient-to-r !from-cyan-500 !to-blue-500 !text-white !font-bold"
                                className="pb-10 border-b border-white/10"
                            />

                            {/* Block 4: Explore The Chizel Core -> NAVIGATES TO /chizel-core */}
                            <OfferBlock
                                title="EXPLORE THE CHIZEL CORE"
                                ctaText="EXPLORE THE CORE"
                                ctaOnClick={handleCoreClick}
                                ctaGradientClass="!bg-gradient-to-r !from-primary !to-cyan-500 !text-white !font-bold"
                                className="pb-10 border-b border-white/0" // No border on the last one
                            />

                        </div>
                    </div>
                    {/* >>> END UPDATED OFFER SECTION CONTENT HERE <<< */}
                </div>
            </section>

             <section className="section-5 flex flex-col items-center justify-center text-center p-4 relative overflow-hidden py-20 md:py-32">
                <div className="section-5-content relative z-10 w-full max-w-3xl">
                    <h2 className="font-heading text-4xl md:text-6xl font-bold text-text mb-5 md:mb-6 drop-shadow-md animated-element">
                        Ready to Ignite <span className="animated-gradient-heading">Potential?</span>
                    </h2>
                    <p className="text-secondary-text text-lg md:text-xl mb-8 md:mb-10 leading-relaxed animated-element">
                        Be among the first explorers. Join the Chizel waitlist today for exclusive early access, special launch rewards, and updates on our mission to reshape learning.
                    </p>
                    <div className="relative inline-block group animated-element">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-orange rounded-full blur-md opacity-50 group-hover:opacity-75 transition duration-300 pointer-events-none" style={{ animation: isMobile ? 'none' : 'pulse-border 3s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></div>
                        <Button
                            title="SECURE YOUR SPOT"
                            onClick={handleWaitlist}
                            rightIcon={<FaArrowRight />}
                            containerClass="final-cta-button relative !text-base md:!text-lg !py-3 !px-8 md:!py-4 md:!px-10 !bg-gradient-to-r !from-primary !to-accent hover:!shadow-[0_0_20px_rgba(31,111,235,0.5)]" // Kept hover shadow for CTA
                        />
                    </div>
                </div>
            </section>

            {/* ============== NEW SOCIAL LINKS SECTION (KEPT CLEAN) ============== */}
            <section className="section-socials flex flex-col items-center justify-center text-center p-4 relative overflow-hidden pt-10 pb-20 md:pt-16 md:pb-32">
                <div className="relative z-10 w-full max-w-lg">
                    <h4 className="animated-element font-ui uppercase tracking-widest text-secondary-text mb-8">
                        FOLLOW OUR JOURNEY
                    </h4>
                    <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                    {socialLinks.map((link) => (
                        <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Follow Chizel on ${link.name}`}
                        className="social-icon-link relative"
                        onClick={() => handleSocialClick(link.name)}
                        >
                        <div className="social-icon-float" >
                            <div className="social-icon-wrapper w-16 h-16 relative flex-center bg-card/60 border-2 border-primary/20 rounded-full backdrop-blur-md transition-colors duration-300">
                            <div className="ping-effect absolute inset-0 rounded-full border-2 border-primary opacity-0"/>
                            <span className="relative z-10 text-primary transition-colors duration-300">
                                {iconMap[link.name]}
                            </span>
                            </div>
                        </div>
                        </a>
                    ))}
                    </div>
                </div>
            </section>


            <style jsx global>{`
                /* --- Root Variables (Consolidated) --- */
                :root {
                     --color-primary: rgb(31, 111, 235); --color-primary-rgb: 31, 111, 235; --color-primary-alpha: rgba(31, 111, 235, 0.25);
                    --color-accent: rgb(93, 63, 211); --color-accent-rgb: 93, 63, 211; --color-accent-alpha: rgba(93, 63, 211, 0.25);
                     --color-orange: rgb(255, 179, 71); --color-orange-rgb: 255, 179, 71; --color-orange-alpha: rgba(255, 179, 71, 0.25);
                     --color-red: rgb(239, 68, 68);
                     --color-yellow: rgb(250, 204, 21);
                     --color-text: #e6f1ff; --color-secondary-text: #8fa5c6;
                     --color-border: rgba(230, 241, 255, 0.1);
                     --color-background: #0b1226; --color-card: #16213e;
                }

                /* --- Base & Reset --- */
                * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; -webkit-tap-highlight-color: transparent; }
               

                /* --- Layout & Section Styling --- */
                 section { display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; width: 100%; overflow: hidden; z-index: 1; background-color: transparent; padding: 5rem 1rem; }
                 .section-1, .section-2, .section-3, .section-4 { min-height: 100vh; }
                 .section-5 { min-height: auto; padding-top: 5rem; padding-bottom: 8rem; }

                /* --- Typography & Gradients --- */
                .intro-heading { color: var(--color-text); text-shadow: 0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px var(--color-primary-alpha), 0 0 35px var(--color-accent-alpha); will-change: transform; }
                 .animated-gradient-heading { color: transparent; background: linear-gradient(90deg, var(--color-primary), var(--color-accent), var(--color-orange), var(--color-primary)); background-clip: text; -webkit-background-clip: text; background-size: 200% auto; animation: gradient-flow 6s linear infinite; font-weight: 800; }

                /* --- Logo Marquee Performance --- */
                 .logo-marquee { will-change: transform; }
                 .marquee-content { will-change: transform; }
                 .marquee-item img { will-change: opacity, transform; }

                /* --- Animations --- */
                @keyframes gradient-flow { 0% { background-position: 0% center; } 100% { background-position: 200% center; } }
                @keyframes twinkle { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 0.8; transform: scale(1.1); } }
                @keyframes pulse { 0%, 100% { opacity: 0.7; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.95); } }
                 @keyframes pulse-border { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 0.75; transform: scale(1.02); } }
                 .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                 .animate-bounce { animation: bounce 2s infinite; }
                 @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                 /* Scroll Indicator */
                 .scroll-indicator { animation: fadeInScroll 1.5s 2s ease-out forwards; }
                 @keyframes fadeInScroll { from { opacity: 0; } to { opacity: 1; } }
                 .scroll-chevron { animation: bounceSlight 2s infinite ease-in-out; }
                 @keyframes bounceSlight { 0%, 100% { transform: translateY(0); opacity: 0.7; } 50% { transform: translateY(4px); opacity: 1; } }
                 /* Shine */
                 @keyframes shine { 100% { left: 125%; } }

                /* --- Mobile Specific Adjustments --- */
                @media (max-width: 767px) {
                    html { -webkit-overflow-scrolling: touch; }
                   
                    .backdrop-blur-lg { backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
                     .intro-heading { font-size: clamp(2.5rem, 10vw, 3.5rem); }
                     section { padding: 4rem 1rem; }
                     .section-5 { padding-bottom: 6rem; }
                     .impact-card-container { grid-template-columns: 1fr; max-width: 350px; }
                }

                 /* --- Impact Card Button Base Styles --- */
                 .impact-button-css { position: relative; overflow: hidden; transform: translateZ(0); }
                 .impact-button-css .button-hover-fill { background-size: 200% auto; background-position: 0% center; will-change: transform; }
                 .impact-button-css .button-text-default { will-change: transform; }
                 .impact-button-css:hover .button-hover-fill { transform: translateX(0%); background-position: 100% center; }
                 .impact-button-css:hover .button-text-default { transform: translateX(100%); }
                 .impact-button-css .button-hover-fill, .impact-button-css .button-text-default { transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); }

                /* --- CORE BUTTON Theme --- */
                #chizel-core-card .impact-button-css { background: linear-gradient(90deg, var(--color-primary), var(--color-accent)); border-color: transparent; box-shadow: 0 0 15px 0px var(--color-primary-alpha), 0 0 30px 0px var(--color-accent-alpha); animation: pulse-glow-core 2.5s infinite ease-in-out; }
                 #chizel-core-card .impact-button-css::before { content: ''; position: absolute; top: 0; left: -75%; width: 50%; height: 100%; background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 100%); transform: skewX(-25deg); animation: shine 4s infinite linear; }
                #chizel-core-card .impact-button-css:hover { transform: scale(1.05); box-shadow: 0 0 25px 5px var(--color-primary-alpha), 0 0 40px 10px var(--color-accent-alpha); border-color: rgba(255, 255, 255, 0.5); }
                 #chizel-core-card .impact-button-css .button-hover-fill { background-image: linear-gradient(90deg, var(--color-accent), var(--color-primary), var(--color-accent)); }
                 @keyframes pulse-glow-core { 0%, 100% { transform: scale(1); box-shadow: 0 0 15px 0px var(--color-primary-alpha), 0 0 30px 0px var(--color-accent-alpha); } 50% { transform: scale(1.03); box-shadow: 0 0 25px 5px var(--color-primary-alpha), 0 0 40px 10px var(--color-accent-alpha); } }

                 /* --- KIDS BUTTON Theme (Used for Brain Detox Games) --- */
                #chizel-kids-card .impact-button-css { background: var(--color-accent); border-color: transparent; box-shadow: 0 0 15px 0px var(--color-accent-alpha); animation: pulse-glow-kids 2.5s infinite ease-in-out; }
                 #chizel-kids-card .impact-button-css::before { content: ''; position: absolute; top: 0; left: -75%; width: 50%; height: 100%; background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.25) 100%); transform: skewX(-25deg); animation: shine 4.5s infinite linear 0.5s; }
                #chizel-kids-card .impact-button-css:hover { transform: scale(1.05); box-shadow: 0 0 25px 5px var(--color-accent-alpha); border-color: rgba(255, 255, 255, 0.4); }
                 #chizel-kids-card .button-hover-fill { background-image: linear-gradient(90deg, rgb(110, 20, 180), var(--color-accent), rgb(110, 20, 180)); }
                 @keyframes pulse-glow-kids { 0%, 100% { transform: scale(1); box-shadow: 0 0 15px 0px var(--color-accent-alpha); } 50% { transform: scale(1.03); box-shadow: 0 0 25px 5px var(--color-accent-alpha); } }

                 /* --- PARENTS BUTTON Theme --- */
                 #chizel-parents-card .impact-button-css { background: var(--color-orange); border-color: transparent; box-shadow: 0 0 15px 0px var(--color-orange-alpha); animation: pulse-glow-parents 2.5s infinite ease-in-out; }
                 #chizel-parents-card .impact-button-css::before { content: ''; position: absolute; top: 0; left: -75%; width: 50%; height: 100%; background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 100%); transform: skewX(-25deg); animation: shine 4.2s infinite linear 1s; }
                #chizel-parents-card .impact-button-css:hover { transform: scale(1.05); box-shadow: 0 0 25px 5px var(--color-orange-alpha); border-color: rgba(255, 255, 255, 0.5); }
                 #chizel-parents-card .button-hover-fill { background-image: linear-gradient(90deg, rgb(255, 150, 40), var(--color-orange), rgb(255, 150, 40)); }
                 @keyframes pulse-glow-parents { 0%, 100% { transform: scale(1); box-shadow: 0 0 15px 0px var(--color-orange-alpha); } 50% { transform: scale(1.03); box-shadow: 0 0 25px 5px var(--color-orange-alpha); } }

                {/* --- ADDED: SOCIAL ICON STYLES --- */}
                @keyframes gentleFloat {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-6px); }
                }
                .social-icon-float {
                  animation: gentleFloat 4s infinite ease-in-out;
                }
                .social-icon-link:nth-child(2) .social-icon-float { animation-delay: 0.3s; }
                .social-icon-link:nth-child(3) .social-icon-float { animation-delay: 0.6s; }
                .social-icon-link:nth-child(4) .social-icon-float { animation-delay: 0.9s; }
                .social-icon-link:nth-child(5) .social-icon-float { animation-delay: 1.2s; }
            `}</style>
        </div>
    );
};

export default ProfessionalLandingPage;