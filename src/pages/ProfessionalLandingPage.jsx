// src/pages/ProfessionalLandingPage.jsx

import { useRef, useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import LogoMarquee from '@/components/common/LogoMarquee';
import Footer from '@/components/layout/Footer';
import {
    FaMobileAlt, FaInfinity, FaStopCircle, FaMousePointer,
    FaArrowRight, FaAngleDoubleDown, FaGlobe, FaChild, FaUserFriends
} from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

// --- Optimized RealisticStarfield Component ---
const RealisticStarfield = memo(({
    starCountDesktop = 40,
    starCountMobile = 20,
    layerCount = 3,
    baseSpeed = 0.05
}) => {
    const starfieldRef = useRef(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
        const starCount = isMobile ? starCountMobile : starCountDesktop;
        const result = [];
        for (let i = 0; i < layerCount; i++) {
            const count = Math.floor(starCount / Math.pow(i + 1, 1.5));
            const speedFactor = baseSpeed * (i + 1);
            const opacity = 1 - i * 0.3;
            const stars = [];
            for (let j = 0; j < count; j++) {
                stars.push({
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    size: `${Math.random() * 1 + 0.3}px`,
                    delay: `${Math.random() * 5}s`,
                    duration: `${Math.random() * 4 + 3}s`
                });
            }
            result.push({ stars, speedFactor, opacity, zIndex: -50 - i });
        }
        return result;
    }, [isMobile, starCountDesktop, starCountMobile, layerCount, baseSpeed]);

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
                        scrub: 3 + i,
                        invalidateOnRefresh: false
                    }
                });
            });

            gsap.set(".realistic-star", {
                opacity: (i) => gsap.utils.random(0.4, 0.9)
            });
        });

        mm.add("(max-width: 767px)", () => {
            gsap.set(".realistic-star", {
                opacity: (i) => gsap.utils.random(0.3, 0.7)
            });
        });

        return () => mm.revert();
    }, { scope: starfieldRef, dependencies: [isMobile] });

    return (
        <div ref={starfieldRef} className="fixed inset-0 z-[-1] overflow-hidden bg-gradient-to-b from-[#020010] via-[#0b1226] to-[#020010]">
            <div className="absolute inset-0 opacity-20 mix-blend-soft-light pointer-events-none">
                <div className="absolute top-[-20%] left-[-15%] w-[60vw] h-[60vh] bg-gradient-radial from-primary/15 via-transparent to-transparent rounded-full blur-3xl will-change-transform" style={{ animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-[70vw] h-[70vh] bg-gradient-radial from-accent/10 via-transparent to-transparent rounded-full blur-3xl will-change-transform" style={{ animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite 2s' }}></div>
            </div>
            {layers.map((layer, i) => (
                <div
                    key={`layer-${i}`}
                    className="star-layer absolute inset-0 will-change-transform"
                    data-speed={layer.speedFactor}
                    style={{ zIndex: layer.zIndex, opacity: layer.opacity }}
                >
                    {layer.stars.map((star, j) => (
                        <div
                            key={`star-${i}-${j}`}
                            className="realistic-star absolute rounded-full bg-white"
                            style={{
                                top: star.top,
                                left: star.left,
                                width: star.size,
                                height: star.size,
                                animation: isMobile ? 'none' : `twinkle ${star.duration} infinite ease-in-out alternate`,
                                animationDelay: star.delay,
                                willChange: 'opacity, transform'
                            }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
});

RealisticStarfield.displayName = 'RealisticStarfield';

// --- Optimized ObstacleCard ---
const ObstacleCard = memo(({ icon, title, description, delay }) => {
    const cardRef = useRef(null);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);

    useGSAP(() => {
        gsap.from(cardRef.current, {
            scrollTrigger: {
                trigger: cardRef.current,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
                once: false
            },
            opacity: 0,
            y: 40,
            scale: 0.96,
            duration: 0.7,
            delay: delay * 0.08,
            ease: 'power2.out',
        });

        if (!isTouchDevice && cardRef.current) {
            const tl = gsap.timeline({ paused: true });
            tl.to(cardRef.current, {
                y: -6,
                scale: 1.02,
                boxShadow: '0 10px 25px rgba(239, 68, 68, 0.25)',
                borderColor: 'rgba(239, 68, 68, 0.7)',
                duration: 0.25,
                ease: 'power2.out',
            });
            tl.to(cardRef.current.querySelector('.obstacle-icon-wrapper'), {
                scale: 1.1,
                duration: 0.25,
                ease: 'power2.out'
            }, 0);

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
    }, { scope: cardRef, dependencies: [isTouchDevice, delay] });

    return (
        <div ref={cardRef} className="obstacle-card-enhanced group bg-card/60 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center shadow-lg transform-gpu transition-colors duration-300 relative overflow-hidden will-change-transform">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/10 via-transparent to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 pointer-events-none"></div>
            <div className="obstacle-icon-wrapper relative inline-block mb-4 p-3 bg-red-500/15 rounded-full border border-red-500/25 transition-transform duration-300 will-change-transform">
                <div className="text-red-500 text-3xl">{icon}</div>
            </div>
            <h3 className="font-heading text-xl text-text mb-2">{title}</h3>
            <p className="text-secondary-text text-sm leading-relaxed">{description}</p>
        </div>
    );
});

ObstacleCard.displayName = 'ObstacleCard';

// --- Optimized ImpactCard ---
const ImpactCard = memo(({ icon, title, description, buttonText, onClick, gradientClass, iconBgClass, shadowClass }) => {
    const cardRef = useRef(null);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);

    useGSAP(() => {
        gsap.from(cardRef.current, {
            scrollTrigger: {
                trigger: cardRef.current,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
                once: false
            },
            opacity: 0,
            y: 35,
            duration: 0.65,
            ease: 'power2.out',
        });

        if (!isTouchDevice && cardRef.current) {
            const tl = gsap.timeline({ paused: true });
            tl.to(cardRef.current, {
                y: -8,
                scale: 1.02,
                boxShadow: shadowClass ? `0 15px 30px ${shadowClass.replace('0.25)', '0.2)')}` : 'rgba(0,0,0,0.2)',
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
    }, { scope: cardRef, dependencies: [isTouchDevice, shadowClass] });

    return (
        <div ref={cardRef} className={`impact-card relative group p-8 rounded-3xl border border-white/10 overflow-hidden text-center transform-gpu ${gradientClass || 'bg-card/70 backdrop-blur-lg'} will-change-transform`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 pointer-events-none"></div>
            <div className="relative z-10 flex flex-col items-center h-full">
                <div className={`p-4 rounded-full border border-white/15 mb-5 inline-block transition-transform duration-300 group-hover:scale-110 will-change-transform ${iconBgClass || 'bg-primary/15'}`}>
                    <div className="text-3xl text-white">{icon}</div>
                </div>
                <h3 className="font-heading text-2xl text-text mb-3">{title}</h3>
                <p className="text-secondary-text text-sm mb-6 flex-grow leading-relaxed">{description}</p>
                <button
                    onClick={onClick}
                    className="impact-button-css mt-auto relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-white transition duration-300 ease-out border-2 border-white/20 rounded-full group w-full hover:border-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-white/50 will-change-transform"
                >
                    <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 transform -translate-x-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-left group-hover:translate-x-0 group-hover:bg-right ease">
                        <FaArrowRight className="text-xl ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
                        {buttonText}
                    </span>
                    <span className="relative invisible">{buttonText}</span>
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

    const allPortfolioImages = useMemo(() => [
        "/images/slider/i1.jpg", "/images/slider/i2.jpg", "/images/slider/i3.jpg",
        "/images/slider/i4.jpg", "/images/slider/i5.jpg", "/images/slider/i10.png",
        "/images/slider/i8.png", "/images/slider/i9.png", "/images/slider/i7.png",
        "/images/slider/i11.png"
    ], []);

    const { marqueeImages1, marqueeImages2 } = useMemo(() => {
        const shuffled = [...allPortfolioImages].sort(() => Math.random() - 0.5);
        const midpoint = Math.ceil(shuffled.length / 2);
        return {
            marqueeImages1: shuffled.slice(0, midpoint),
            marqueeImages2: shuffled.slice(midpoint)
        };
    }, [allPortfolioImages]);

    const obstacles = useMemo(() => [
        { icon: <FaMobileAlt />, title: "Screen Overload", description: "Hours lost in passive digital consumption." },
        { icon: <FaInfinity />, title: "Mindless Scrolling", description: "The endless feed trap stealing focus." },
        { icon: <FaMousePointer />, title: "Digital Distractions", description: "Focus shattered in a hyper-connected world." },
        { icon: <FaStopCircle />, title: "Passive Alternatives", description: "Lack of truly engaging developmental tools." },
    ], []);

    useGSAP(() => {
        gsap.from(".section-1 .animated-element", {
            opacity: 0,
            y: 25,
            stagger: 0.12,
            duration: 0.7,
            ease: "power2.out",
            delay: 0.2
        });

        gsap.from(".section-1 .scroll-indicator", {
            opacity: 0,
            y: 12,
            duration: 0.7,
            ease: "power2.out",
            delay: 0.8
        });

        const sectionsToAnimate = ['.section-2', '.section-3', '.section-4-intro', '.section-4 .v4-impact', '.section-5'];

        sectionsToAnimate.forEach(selector => {
            const elements = gsap.utils.toArray(`${selector} .animated-element, ${selector} > *`);
            if (elements.length > 0) {
                gsap.from(elements, {
                    scrollTrigger: {
                        trigger: selector,
                        start: "top 80%",
                        toggleActions: 'play none none reverse',
                        once: false
                    },
                    opacity: 0,
                    y: 25,
                    stagger: 0.08,
                    duration: 0.65,
                    ease: "power2.out"
                });
            }
        });

        return () => ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }, { scope: containerRef });

    const handleExternalLink = useCallback((url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    }, []);

    const handleWaitlist = useCallback(() => {
        handleExternalLink("https://docs.google.com/forms/d/1Hx5WA9eEEKGYv96UcotYh-t5ImBNvdO_WdD6IzftTD0/viewform?edit_requested=true");
    }, [handleExternalLink]);

    const handleCoreClick = useCallback(() => navigate('/chizel-core'), [navigate]);
    const handleKidsClick = useCallback(() => handleExternalLink('https://rajvansh-1.github.io/ChizelVerse/'), [handleExternalLink]);
    const handleParentsClick = useCallback(() => handleExternalLink('https://rajvansh-1.github.io/ParentPage-CV/'), [handleExternalLink]);

    return (
        <div ref={containerRef} className="professional-landing-wrapper">
            <div className="professional-landing bg-transparent text-text relative z-10">
                <RealisticStarfield />

                {/* Section 1: Intro */}
                <section className="section-1 min-h-screen flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
                    <div className="section-1-content relative z-10">
                        <h1 className="animated-element font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-text mb-6 leading-tight md:leading-tight"
                            style={{ textShadow: '0 4px 15px rgba(255, 255, 255, 0.3)' }}>
                            Ever Dreamt of <br className="hidden md:inline" /> Being Successful?
                        </h1>
                        <p className="animated-element text-secondary-text text-lg md:text-xl max-w-2xl mx-auto mb-8">
                            Ever Wondered When it all pays off
                        </p>
                    </div>
                    <div className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 text-secondary-text animate-bounce flex flex-col items-center gap-1 opacity-60">
                        <span>Scroll Down</span>
                        <FaAngleDoubleDown />
                    </div>
                </section>

                {/* Section 2: Obstacles */}
                <section className="section-2 min-h-screen flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
                    <div className="section-2-content relative z-10 w-full max-w-5xl text-center">
                        <h2 className="animated-element font-heading text-4xl md:text-5xl font-bold text-text mb-12 md:mb-16">
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

                {/* Section 3: Chizel Born */}
                <section className="section-3 min-h-screen flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
                    <div className="section-3-content relative z-10 flex flex-col items-center">
                        <div className="animated-element relative mb-6 md:mb-8">
                            <img src="/images/logo.png" alt="Chizel Logo" className="w-24 h-24 md:w-32 md:h-32 drop-shadow-lg" loading="lazy" />
                        </div>
                        <h2 className="animated-element font-heading text-4xl md:text-6xl font-bold text-text mb-4 drop-shadow-md">
                            That's Where <span className="animated-gradient-heading">Chizel</span> Was Born.
                        </h2>
                        <p className="animated-element text-secondary-text text-lg md:text-xl max-w-xl leading-relaxed">
                            Forged from the need to transform passive screen time into an active launchpad for brilliance and real-world skills.
                        </p>
                    </div>
                </section>

                {/* Section 4: Our Impact & Milestones */}
                <section className="section-4 min-h-screen flex flex-col items-center justify-center py-16 md:py-24 px-4 text-center relative overflow-hidden">
                    <div className="section-4-content relative z-10 w-full max-w-6xl">
                        <div className="section-4-intro mb-12 md:mb-16">
                            <h3 className="font-heading text-5xl md:text-6xl mb-4 animated-gradient-heading drop-shadow-lg">
                                Our Impact
                            </h3>
                        </div>
                        <div className="v4-impact mb-16 md:mb-20">
                            <div className="flex flex-col gap-5 md:gap-6">
                                <LogoMarquee images={marqueeImages1} speed={10} direction="left" />
                                <LogoMarquee images={marqueeImages2} speed={10} direction="right" />
                            </div>
                        </div>
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

                {/* Section 5: CTA */}
                <section className="section-5 flex flex-col items-center justify-center text-center p-4 relative overflow-hidden py-20 md:py-32">
                    <div className="section-5-content relative z-10 w-full max-w-3xl">
                        <h2 className="animated-element font-heading text-4xl md:text-6xl font-bold text-text mb-5 md:mb-6 drop-shadow-md">
                            Ready to Ignite <span className="animated-gradient-heading">Potential?</span>
                        </h2>
                        <p className="animated-element text-secondary-text text-lg md:text-xl mb-8 md:mb-10 leading-relaxed">
                            Be among the first explorers. Join the Chizel waitlist today for exclusive early access, special launch rewards, and updates on our mission to reshape learning.
                        </p>
                        <div className="animated-element relative inline-block group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-badge-bg rounded-full blur-md opacity-50 group-hover:opacity-75 transition duration-300 pointer-events-none will-change-transform" style={{ animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></div>
                            <Button
                                title="Secure Your Spot"
                                onClick={handleWaitlist}
                                rightIcon={<FaArrowRight />}
                                containerClass="relative !text-base md:!text-lg !py-3 !px-8 md:!py-4 md:!px-10 !bg-gradient-to-r !from-primary !to-accent hover:!shadow-[0_0_20px_rgba(31,111,235,0.5)] will-change-transform"
                            />
                        </div>
                    </div>
                </section>

                {/* Global Styles */}
                <style jsx global>{`
                    :root {
                        --color-primary-rgb: 31, 111, 235;
                        --color-primary: rgb(31, 111, 235);
                        --color-accent: rgb(147, 51, 234);
                        --color-badge-bg: rgb(239, 68, 68);
                    }

                    * {
                        -webkit-font-smoothing: antialiased;
                        -moz-osx-font-smoothing: grayscale;
                    }

                    .impact-button-css .bg-left {
                        background-position: 0% center;
                    }
                    .impact-button-css .bg-right {
                        background-position: 100% center;
                    }

                    section {
                        min-height: 80vh;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                        width: 100%;
                        overflow: hidden;
                        z-index: 1;
                        background-color: transparent;
                        padding-top: 5rem;
                        padding-bottom: 5rem;
                    }

                    .section-1,
                    .section-2,
                    .section-3,
                    .section-4 {
                        min-height: 100vh;
                    }

                    .section-5 {
                        min-height: auto;
                    }

                    .professional-landing {
                        background-color: transparent;
                    }

                    .animated-gradient-heading {
                        color: transparent;
                        background: linear-gradient(90deg, var(--color-primary), var(--color-accent), var(--color-badge-bg), var(--color-primary));
                        background-clip: text;
                        -webkit-background-clip: text;
                        background-size: 200% auto;
                        animation: gradient-animation 6s linear infinite;
                        font-weight: 800;
                    }

                    @keyframes gradient-animation {
                        0% {
                            background-position: 0% center;
                        }
                        100% {
                            background-position: 200% center;
                        }
                    }

                    @keyframes twinkle {
                        0% {
                            opacity: 0.3;
                            transform: scale(0.8);
                        }
                        100% {
                            opacity: 0.8;
                            transform: scale(1.1);
                        }
                    }

                    @keyframes pulse {
                        0%,
                        100% {
                            opacity: 1;
                        }
                        50% {
                            opacity: 0.5;
                        }
                    }

                    .animate-pulse {
                        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                    }

                    .animated-element,
                    .obstacle-card-enhanced,
                    .impact-card {
                        will-change: opacity, transform;
                    }

                    @media (prefers-reduced-motion: reduce) {
                        *,
                        *::before,
                        *::after {
                            animation-duration: 0.01ms !important;
                            animation-iteration-count: 1 !important;
                            transition-duration: 0.01ms !important;
                        }
                    }

                    img {
                        content-visibility: auto;
                    }
                `}</style>
            </div>
            <Footer />
        </div>
    );
};

export default ProfessionalLandingPage;