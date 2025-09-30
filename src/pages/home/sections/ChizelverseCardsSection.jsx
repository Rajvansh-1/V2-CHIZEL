// src/pages/home/sections/ChizelverseCardsSection.jsx
import React, { useRef, useState, useEffect, useMemo, memo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/ui/Button";
import { chizelverseInfo, featuresData } from "@utils/constants";
import { trackEvent } from "@/utils/analytics";
import {
  FaGamepad, FaUsers, FaLightbulb, FaPaintBrush,
  FaQuoteLeft, FaStar, FaRocket,
  FaUserAstronaut, FaCube, FaComments,
} from "react-icons/fa";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const iconMap = {
  gamepad: <FaGamepad />,
  users: <FaUsers />,
  lightbulb: <FaLightbulb />,
  paintbrush: <FaPaintBrush />,
};

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setReduced(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  return reduced;
};

const CrystalCard = memo(({ children, className = "", padding = "p-6 md:p-8", tilt = true }) => {
    const cardRef = useRef(null);
    const prefersReducedMotion = usePrefersReducedMotion();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const checkIsMobile = () => setIsMobile(window.innerWidth <= 768);
      checkIsMobile();
      window.addEventListener('resize', checkIsMobile);
      return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    const handleMouseMove = (e) => {
        if (prefersReducedMotion || isMobile || !cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        gsap.to(cardRef.current, {
            '--mouse-x': `${x}px`,
            '--mouse-y': `${y}px`,
            '--opacity': '0.5',
            duration: 0.4,
            ease: 'power2.out'
        });
        
        if (tilt) {
            const rotateX = (y / rect.height - 0.5) * 15;
            const rotateY = (x / rect.width - 0.5) * -15;
            gsap.to(cardRef.current.querySelector('.crystal-card-inner'), {
                rotateX,
                rotateY,
                scale: 1.04,
                duration: 0.6,
                ease: 'power3.out'
            });
        }
    };

    const handleMouseLeave = () => {
        if (isMobile || !cardRef.current) return;
        gsap.to(cardRef.current, { '--opacity': '0', duration: 0.5, ease: 'power3.out' });
        if (tilt) {
            gsap.to(cardRef.current.querySelector('.crystal-card-inner'), {
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                duration: 0.8,
                ease: 'elastic.out(1, 0.5)'
            });
        }
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`crystal-card-base relative rounded-2xl w-full h-full transform-style-3d ${className}`}
            style={{ perspective: tilt && !isMobile ? '1000px' : 'none' }}
        >
            <div className={`crystal-card-inner relative w-full h-full rounded-2xl transition-transform duration-500 ease-out ${padding}`}>
                {children}
            </div>
        </div>
    );
});

const InfoCard = memo(({ card }) => (
    <CrystalCard className="h-full group verse-rest">
        <div className="relative z-10">
            <div className="flex items-center gap-4 mb-5 transform transition-transform duration-500 group-hover:-translate-y-1">
                <div className="text-4xl md:text-5xl text-cyan-400 shrink-0 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]">{iconMap[card.icon]}</div>
                <h3 className="font-heading text-2xl md:text-3xl font-bold text-white break-words">{card.title}</h3>
            </div>
            <ul className="space-y-3">
                {card.points.map((p, i) => (
                    <li key={i} className="font-body text-gray-300 text-base md:text-lg flex leading-relaxed transition-all duration-300 group-hover:text-white group-hover:pl-2">
                        <FaStar className="text-cyan-400 mt-1 mr-3 shrink-0 transition-colors duration-300 group-hover:text-amber-400" />
                        <span className="min-w-0 break-words">{p}</span>
                    </li>
                ))}
            </ul>
        </div>
    </CrystalCard>
));

const DemoPreview = memo(({ forKids }) => {
    const iframeRef = useRef(null);
    const containerRef = useRef(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const url = forKids ? "https://rajvansh-1.github.io/ChizelVerse/" : "https://rajvansh-1.github.io/ParentPage-CV/";

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data === 'closeChizelverseDemo') {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const handleInteract = () => {
        const eventLabel = forKids ? 'For Kids' : 'For Parents';
        
        trackEvent('interact_with_demo', 'ChizelVerse Demo', `Clicked to Interact - ${eventLabel}`);
        
        if (isMobile) {
            window.open(url, "_blank");
        } else if (iframeRef.current) {
            iframeRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                window.open(url, "_blank"); // Fallback to new tab
            });
        }
    };
    
    return (
        <div className="verse-rest">
            <CrystalCard padding="p-0" tilt={false}>
                <div
                    ref={containerRef}
                    className="relative w-full aspect-[16/9] rounded-xl overflow-hidden"
                >
                    <iframe
                        ref={iframeRef}
                        title={`ChizelVerse Demo - ${forKids ? 'For Kids' : 'For Parents'}`}
                        src={url}
                        loading="lazy"
                        className="w-full h-full"
                        allow="fullscreen; autoplay; clipboard-read; clipboard-write"
                    />
                    <div
                        className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md transition-opacity duration-500"
                    >
                        <h3 className="font-heading text-2xl md:text-4xl font-bold text-white mb-4 text-center">
                            INTERACT WITH CHIZEL<br/>
                            <span className="text-primary">{forKids ? "FOR KIDS" : "FOR PARENTS"}</span>
                        </h3>
                        <Button
                            title="CLICK HERE"
                            onClick={handleInteract}
                            containerClass="!bg-primary"
                        />
                    </div>
                </div>
            </CrystalCard>
        </div>
    );
});

const featureIconMap = {
  "Word Warriors": <FaUserAstronaut />,
  "Logic League": <FaCube />,
  "Chizel Club": <FaComments />,
};

const FeatureDisplay = memo(() => {
    const [activeIndex, setActiveIndex] = useState(0);
    const indicatorRef = useRef(null);
    const tabsRef = useRef([]);
    const contentRef = useRef(null);
    
    useGSAP(() => {
        const activeTab = tabsRef.current[activeIndex];
        if (activeTab && indicatorRef.current) {
            gsap.to(indicatorRef.current, {
                x: activeTab.offsetLeft,
                width: activeTab.offsetWidth,
                duration: 0.6,
                ease: 'power3.inOut'
            });
        }
    }, [activeIndex]);
    
    useGSAP(() => {
        gsap.to('.feature-content-item, .feature-asset-item', {
            opacity: 0,
            y: 15,
            duration: 0.3,
            ease: 'power2.in',
            stagger: 0.05,
            overwrite: true,
        });

        gsap.fromTo(
            `.feature-content-item[data-index="${activeIndex}"], .feature-asset-item[data-index="${activeIndex}"]`,
            { opacity: 0, y: -15 },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power2.out',
                delay: 0.2,
                stagger: 0.1
            }
        );
    }, { scope: contentRef, dependencies: [activeIndex] });

    return (
        <CrystalCard className="verse-rest flex flex-col" padding="p-0" tilt={false}>
            <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center p-6 md:p-8 flex-grow">
                
                <div className="relative rounded-xl overflow-hidden bg-black/30 border border-white/10 shadow-lg aspect-[16/10] w-full">
                    <div className="absolute inset-0 z-0 opacity-10 bg-[linear-gradient(to_right,rgba(0,255,255,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,0.2)_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
                    <div className="absolute inset-0 z-0 bg-gradient-to-br from-transparent via-transparent to-black/50"></div>
                    
                    <div className="relative w-full h-full">
                        {featuresData.map((f, i) => (
                            <div key={`asset-${i}`} data-index={i} className="feature-asset-item absolute inset-0 w-full h-full opacity-0">
                                <video 
                                    src={f.assetSrc} 
                                    autoPlay 
                                    loop 
                                    muted 
                                    playsInline
                                    className="w-full h-full object-contain p-2 sm:p-4"
                                />
                            </div>
                        ))}
                    </div>
                    
                    <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] animate-scanline"></div>
                </div>

                <div className="relative min-h-[280px] sm:min-h-[260px] lg:min-h-[300px]">
                    {featuresData.map((f, i) => (
                        <div key={`content-${i}`} data-index={i} className="feature-content-item absolute inset-0 flex flex-col justify-center opacity-0">
                            <p className="font-body text-gray-200 text-base md:text-lg leading-relaxed">{f.description}</p>
                            <div className="relative border-l-4 border-cyan-400/50 pl-4 mt-6 bg-white/5 p-4 rounded-r-lg shadow-inner shadow-black/30">
                                <FaQuoteLeft className="absolute -top-3 left-2 text-2xl text-cyan-400/30 opacity-70" />
                                <blockquote className="font-body text-gray-300 italic text-sm md:text-base">“{f.quote}”</blockquote>
                                <cite className="block text-right text-cyan-400/80 text-sm mt-2 not-italic">- {f.author}</cite>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative border-t border-white/10 bg-slate-900/40 rounded-b-[0.85rem] px-4 py-3 md:px-6">
                <div ref={indicatorRef} className="absolute top-0 h-full bg-cyan-500/10 rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all duration-500 ease-out"></div>
                <ul className="relative z-10 flex justify-around items-center gap-1 md:gap-4">
                    {featuresData.map((f, i) => (
                        <li
                            key={i}
                            ref={el => tabsRef.current[i] = el}
                            onMouseEnter={() => setActiveIndex(i)}
                            onClick={() => setActiveIndex(i)}
                            className="cursor-pointer flex-1 min-w-0 text-center px-2 py-2 rounded-lg transition-all duration-300"                            role="tab"
                            aria-selected={activeIndex === i}
                            tabIndex={0}
                        >
                            <div className={`flex items-center justify-center gap-2 transition-all duration-300 ${activeIndex === i ? "text-cyan-300 scale-105" : "text-gray-300 hover:text-white"}`}>                                <div className="text-xl sm:text-2xl">{featureIconMap[f.title] || <FaStar />}</div>
                                <h3 className="font-heading text-xs sm:text-base font-semibold">{f.title}</h3>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </CrystalCard>
    );
});

const ChizelverseCardsSection = () => {
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const prefersReducedMotion = usePrefersReducedMotion();

    useGSAP(() => {
        if (prefersReducedMotion) {
            gsap.set(".verse-rest", { opacity: 1, y: 0, scale: 1 });
            return;
        }

        gsap.from(".verse-rest", {
            scrollTrigger: {
                trigger: contentRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
            },
            y: 60,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.2,
        });

    }, { scope: containerRef, dependencies: [prefersReducedMotion] });

    const StarField = useMemo(() => {
        return ({ count = 100 }) => (
            <div className="cv-stars absolute inset-0" aria-hidden="true">
                {Array.from({ length: count }).map((_, i) => (
                    <div
                        key={i}
                        className="cv-star"
                        style={{
                            '--l': `${Math.random() * 100}%`,
                            '--t': `${Math.random() * 100}%`,
                            '--d': `${Math.random() * 4 + 2}s`,
                            '--s': `${Math.random() * 1.5 + 0.5}px`
                        }}
                    />
                ))}
            </div>
        );
    }, []);
    
    return (
        <div ref={containerRef} className="bg-space-dark">
            <section 
                id="chizelverse-cards"
                ref={contentRef} 
                className="relative w-full bg-space-dark overflow-hidden pb-16 md:pb-24 pt-16 md:pt-24" 
                aria-label="ChizelVerse Content"
            >
                <div className="absolute inset-0 bg-radial-nebula opacity-30" />
                <StarField count={100} />

                <div className="relative z-10 flex flex-col items-center p-4 sm:p-6 md:p-10 gap-8 md:gap-12">
                    <div className="w-full max-w-screen-xl mx-auto space-y-8 md:space-y-12">
                        <div className="relative w-full flex justify-center items-center group">
                            <h2 className="chizelverse-title relative font-heading text-4xl md:text-6xl font-bold 
                                bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 
                                bg-clip-text text-transparent overflow-hidden">
                                Welcome To The ChizelVerse
                                <div className="shine-effect absolute top-0 -left-full w-full h-full 
                                bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                            </h2>
                            <span className="text-3xl md:text-5xl ml-2 md:ml-4 animate-rocket-bounce" style={{ display: "inline-block" }}>🚀</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            <DemoPreview forKids={true} />
                            <DemoPreview forKids={false} />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                            {chizelverseInfo.map((card) => (
                                <InfoCard key={card.title} card={card} />
                            ))}
                        </div>

                        <FeatureDisplay />

                       <CrystalCard className="verse-rest" padding="p-8 md:p-10">
    {/* ... background elements ... */}
    <div className="relative z-10 text-center">
        <div className="mb-4">
            {/* Replaced the image/FaRocket with a colorful emoji */}
            <span
                role="img"
                aria-label="Rocket"
                className="text-5xl md:text-6xl mx-auto animate-float drop-shadow-[0_0_10px_rgba(0,255,255,0.6)] leading-none" // leading-none helps prevent extra line height
            >
                🚀
            </span>
        </div>
        <h3 className="font-heading text-3xl md:text-4xl text-white drop-shadow-lg">
            Did You Think This Was The Limit?
        </h3>
        <p className="text-gray-200 mt-3 md:mt-4 text-base md:text-lg font-body max-w-md mx-auto">
            We didn't. We shattered the boundaries. <br /> Stay tuned until next big drop!
        </p>
    </div>
</CrystalCard>
                    </div>
                </div>
            </section>

            <style jsx global>{`
                :root { --color-space-dark: #020010; --mouse-x: 50%; --mouse-y: 50%; --opacity: 0; }
                .bg-space-dark { background-color: var(--color-space-dark); }
                .bg-radial-nebula { background-image: radial-gradient(circle at 20% 80%, rgba(56, 189, 248, 0.15), transparent 40%), radial-gradient(circle at 80% 30%, rgba(129, 140, 248, 0.15), transparent 40%); }
                .cv-star {
                    position: absolute; left: var(--l); top: var(--t);
                    width: var(--s); height: var(--s);
                    background: white; border-radius: 50%;
                    animation: cv-twinkle var(--d) infinite ease-in-out;
                    will-change: opacity, transform;
                }
                .crystal-card-base {
                    background: #090e20;
                    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.07), 0 20px 50px rgba(0,0,0,0.5);
                    will-change: transform;
                }
                .crystal-card-inner {
                    background: rgba(15, 23, 42, 0.6);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.07);
                    border-radius: 0.9rem;
                    will-change: transform;
                    transform-style: preserve-3d;
                }
                .crystal-card-inner::before {
                    content: '';
                    position: absolute;
                    inset: -1px; /* The border shimmer */
                    border-radius: inherit;
                    background: radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), rgba(0, 255, 255, 0.25), transparent 40%);
                    opacity: var(--opacity);
                    transition: opacity 0.4s ease-out;
                    z-index: -1;
                    will-change: background;
                }
                .crystal-card-inner::after { /* The inner glow */
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: inherit;
                    background: radial-gradient(250px circle at var(--mouse-x) var(--mouse-y), rgba(0, 255, 255, 0.05), transparent 50%);
                    opacity: var(--opacity);
                    transition: opacity 0.4s ease-out;
                    z-index: 0;
                    will-change: background;
                }
                @keyframes cv-twinkle { 0%, 100% { opacity: 0.2; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
                @keyframes float { 0%, 100% { transform: translateY(0px) rotate(-5deg); } 50% { transform: translateY(-15px) rotate(5deg); } }
                .animate-float { animation: float 6s infinite ease-in-out; }
                @keyframes rocket-bounce { 0%, 100% { transform: translateY(0) rotate(-15deg); } 50% { transform: translateY(-10px) rotate(5deg); } }
                .animate-rocket-bounce { animation: rocket-bounce 2.5s infinite ease-in-out; }
                @keyframes shine-sweep { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
                .shine-effect { animation: shine-sweep 3s infinite linear; will-change: transform; }
                .group:hover .shine-effect { animation-duration: 1.5s; }
                /* Animation for the redesigned feature display */
                @keyframes scanline {
                  0% { background-position: 0 0; }
                  100% { background-position: 0 100%; }
                }
                .animate-scanline {
                    animation: scanline 10s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default ChizelverseCardsSection;