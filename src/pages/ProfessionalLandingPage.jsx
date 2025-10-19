// src/pages/ProfessionalLandingPage.jsx
import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import LogoMarquee from '@/components/common/LogoMarquee';
import {
    FaMobileAlt, FaInfinity, FaStopCircle, FaMousePointer,
    FaArrowRight, FaAngleDoubleDown, FaGlobe, FaChild, FaUserFriends
} from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

// --- RealisticStarfield Component (No changes needed) ---
const RealisticStarfield = ({
    starCount = 150,
    layerCount = 3,
    baseSpeed = 0.05
}) => {
    const starfieldRef = useRef(null);
    const layers = [];
    for (let i = 0; i < layerCount; i++) {
        const count = Math.floor(starCount / Math.pow(i + 1, 1.5));
        const speedFactor = baseSpeed * (i + 1);
        const opacity = 1 - i * 0.3;
        const stars = [];
        for (let j = 0; j < count; j++) {
            stars.push({
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                size: `${Math.random() * 1.2 + 0.3}px`,
                animationDuration: `${Math.random() * 4 + 4}s`,
                animationDelay: `${Math.random() * 6}s`
            });
        }
        layers.push({ stars, speedFactor, opacity, zIndex: -50 - i });
    }

    useGSAP(() => {
        gsap.utils.toArray('.star-layer').forEach((layer, i) => {
            const speed = layer.dataset.speed;
            gsap.to(layer, {
                yPercent: -20 * speed,
                ease: "none",
                scrollTrigger: {
                    trigger: "body",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 2
                }
            });
        });

        gsap.fromTo(".realistic-star",
           { opacity: 0, scale: 0.5 },
           {
             opacity: () => gsap.utils.random(0.4, 0.9),
             scale: 1,
             duration: 1.5,
             stagger: {
                each: 0.01,
                from: "random"
             },
             ease: "power2.out",
             onComplete: function() {
                gsap.to(this.targets(), {
                    opacity: () => gsap.utils.random(0.3, 0.7),
                    scale: () => gsap.utils.random(0.8, 1.2),
                    duration: () => gsap.utils.random(3, 6),
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: () => gsap.utils.random(0, 3)
                });
             }
           }
        );

    }, { scope: starfieldRef });

    return (
        <div ref={starfieldRef} className="fixed inset-0 z-[-1] overflow-hidden bg-gradient-to-b from-[#020010] via-[#0b1226] to-[#020010]">
            <div className="absolute inset-0 opacity-25 mix-blend-soft-light">
                <div className="absolute top-[-30%] left-[-20%] w-[70vw] h-[70vh] bg-gradient-radial from-primary/20 via-transparent to-transparent rounded-full animate-pulse blur-3xl animation-delay-1000"></div>
                <div className="absolute bottom-[-25%] right-[-25%] w-[80vw] h-[80vh] bg-gradient-radial from-accent/15 via-transparent to-transparent rounded-full animate-pulse blur-3xl animation-delay-3000"></div>
            </div>
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
                            className="realistic-star absolute rounded-full bg-white opacity-0"
                            style={{
                                top: star.top,
                                left: star.left,
                                width: star.size,
                                height: star.size,
                            }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};


// --- ObstacleCard Component (No changes needed) ---
const ObstacleCard = ({ icon, title, description, delay }) => {
    const cardRef = useRef(null);

    useGSAP(() => {
        gsap.from(cardRef.current, {
            scrollTrigger: {
                trigger: cardRef.current,
                start: 'top 90%',
                toggleActions: 'play none none reverse',
            },
            opacity: 0,
            y: 60,
            scale: 0.9,
            duration: 1,
            delay: delay * 0.15,
            ease: 'power3.out',
        });

        const tl = gsap.timeline({ paused: true });
        tl.to(cardRef.current, {
            y: -8,
            scale: 1.03,
            boxShadow: '0 15px 35px rgba(239, 68, 68, 0.3)',
            borderColor: 'rgb(239, 68, 68)',
            duration: 0.4,
            ease: 'power2.out',
        });
        tl.to(cardRef.current.querySelector('.obstacle-icon-wrapper'), {
            scale: 1.15,
            y: -5,
            rotate: -8,
            duration: 0.4,
            ease: 'power2.out'
        }, 0);

        cardRef.current.addEventListener('mouseenter', () => tl.play());
        cardRef.current.addEventListener('mouseleave', () => tl.reverse());

    }, { scope: cardRef });

    return (
        <div ref={cardRef} className="obstacle-card-enhanced group bg-card/60 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center shadow-xl transform-gpu transition-colors duration-300 relative overflow-hidden">
             <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/15 via-transparent to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            <div className="obstacle-icon-wrapper relative inline-block mb-4 p-3 bg-red-500/20 rounded-full border border-red-500/30 transition-colors duration-300">
                 <div className="text-red-500 text-3xl">{icon}</div>
            </div>
             <h3 className="font-heading text-xl text-text mb-2">{title}</h3>
             <p className="text-secondary-text text-sm leading-relaxed">{description}</p>
        </div>
    );
};

// --- ImpactCard Component (No changes needed) ---
const ImpactCard = ({ icon, title, description, buttonText, onClick, gradientClass, iconBgClass, shadowClass }) => {
    const cardRef = useRef(null);

    useGSAP(() => {
        gsap.from(cardRef.current, {
            scrollTrigger: {
                trigger: cardRef.current,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power3.out',
        });

        const tl = gsap.timeline({ paused: true });
        tl.to(cardRef.current, {
            y: -10,
            scale: 1.03,
            boxShadow: `0 20px 40px ${shadowClass || 'rgba(0,0,0,0.3)'}`,
            duration: 0.4,
            ease: 'power2.out'
        });

         cardRef.current.addEventListener('mouseenter', () => tl.play());
         cardRef.current.addEventListener('mouseleave', () => tl.reverse());

    }, { scope: cardRef });

    return (
        <div ref={cardRef} className={`impact-card relative group p-8 rounded-3xl border border-white/10 overflow-hidden text-center transform-gpu ${gradientClass || 'bg-card/70 backdrop-blur-lg'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            <div className="relative z-10 flex flex-col items-center h-full">
                <div className={`p-4 rounded-full border-2 border-white/20 mb-5 inline-block transition-transform duration-300 group-hover:scale-110 ${iconBgClass || 'bg-primary/20'}`}>
                    <div className="text-3xl text-white">{icon}</div>
                </div>
                <h3 className="font-heading text-2xl text-text mb-3">{title}</h3>
                <p className="text-secondary-text text-sm mb-6 flex-grow leading-relaxed">{description}</p>
                 <button
                    onClick={onClick}
                    className="impact-button mt-auto relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-white transition duration-300 ease-out border-2 border-white/30 rounded-full group w-full hover:border-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-white/50"
                >
                    <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-gradient-to-r from-primary via-accent to-primary bg-size-200 bg-pos-0 group-hover:translate-x-0 group-hover:bg-pos-100 ease">
                        <FaArrowRight className="text-xl ml-1 transform transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
                        {buttonText}
                    </span>
                    <span className="relative invisible">{buttonText}</span>
                 </button>
            </div>
        </div>
    );
};


// --- Main Landing Page Component ---
const ProfessionalLandingPage = () => {
    const containerRef = useRef(null);
    const navigate = useNavigate();

     const portfolioImages = [
         "/images/slider/i1.jpg", "/images/slider/i2.jpg", "/images/slider/i3.jpg",
         "/images/slider/i4.jpg", "/images/slider/i5.jpg", "/images/slider/i7.png",
         "/images/slider/i8.png",
         "/images/slider/i1.jpg", "/images/slider/i2.jpg", "/images/slider/i3.jpg",
         "/images/slider/i4.jpg", "/images/slider/i5.jpg", "/images/slider/i7.png",
         "/images/slider/i8.png",
     ];

    const obstacles = [
        { icon: <FaMobileAlt />, title: "Screen Overload", description: "Hours lost in passive digital consumption." },
        { icon: <FaInfinity />, title: "Mindless Scrolling", description: "The endless feed trap stealing focus." },
        { icon: <FaMousePointer />, title: "Digital Distractions", description: "Focus shattered in a hyper-connected world." },
        { icon: <FaStopCircle />, title: "Passive Alternatives", description: "Lack of truly engaging developmental tools." },
    ];

    useGSAP(() => {
        gsap.from(".section-1 .animated-element", { opacity: 0, y: 50, stagger: 0.2, duration: 1, ease: "power3.out", delay: 0.5 });
        gsap.from(".section-1 .scroll-indicator", { opacity: 0, y: 20, duration: 1, ease: "power3.out", delay: 1.5 });
        gsap.from(".section-2 .animated-element", {
            scrollTrigger: { trigger: ".section-2", start: "top 75%", toggleActions: 'play none none reverse' },
            opacity: 0, y: 50, stagger: 0.1, duration: 0.8, ease: "power3.out"
        });
        gsap.from(".section-3 .animated-element", {
            scrollTrigger: { trigger: ".section-3", start: "top 75%", toggleActions: 'play none none reverse' },
            opacity: 0, scale: 0.8, stagger: 0.15, duration: 1, ease: "elastic.out(1, 0.7)"
        });
        gsap.from(".section-4-intro > *", {
            scrollTrigger: { trigger: ".section-4-intro", start: "top 75%", toggleActions: 'play none none reverse' },
            opacity: 0, y: 50, stagger: 0.1, duration: 0.8, ease: "power3.out"
        });
        gsap.from(".section-4 .v4-impact", {
            scrollTrigger: { trigger: ".section-4 .v4-impact", start: "top 80%", toggleActions: 'play none none reverse' },
            opacity: 0, y: 50, duration: 0.8, ease: "power3.out"
        });
        gsap.from(".section-5 .animated-element", {
            scrollTrigger: { trigger: ".section-5", start: "top 75%", toggleActions: 'play none none reverse' },
            opacity: 0, y: 50, stagger: 0.15, duration: 0.8, ease: "power3.out"
        });
    }, { scope: containerRef });

    const handleExternalLink = (url) => window.open(url, '_blank', 'noopener,noreferrer');
    const handleWaitlist = () => handleExternalLink("https://docs.google.com/forms/d/1Hx5WA9eEEKGYv96UcotYh-t5ImBNvdO_WdD6IzftTD0/viewform?edit_requested=true");


    return (
        <div ref={containerRef} className="professional-landing bg-transparent text-text relative z-10">
            <RealisticStarfield starCount={200} layerCount={3} baseSpeed={0.04} />

            {/* Section 1: Intro */}
            <section className="snap-section section-1 h-screen flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
                 <div className="section-1-content relative z-10">
                    <h1 className="animated-element font-heading text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-primary via-accent to-badge-bg bg-clip-text text-transparent mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] leading-tight md:leading-tight">
                        Ever Dreamt of <br className="hidden md:inline" /> Being Successful?
                    </h1>
                     <p className="animated-element text-secondary-text text-lg md:text-xl max-w-2xl mx-auto mb-8">
                         Unlocking potential in a universe saturated with digital noise.
                     </p>
                </div>
               <div className="scroll-indicator absolute bottom-12 left-1/2 -translate-x-1/2 text-secondary-text animate-bounce flex flex-col items-center gap-1 opacity-70">
                     <span>Scroll Down</span>
                     <FaAngleDoubleDown />
                 </div>
            </section>

            {/* Section 2: Obstacles */}
            <section className="snap-section section-2 min-h-screen flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
                 <div className="section-2-content relative z-10 w-full max-w-5xl text-center">
                    <h2 className="animated-element font-heading text-4xl md:text-5xl font-bold text-text mb-16">
                        What's <span className="text-red-500">Holding</span> You Back?
                    </h2>
                    <div className="animated-element grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
                 <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-secondary-text animate-bounce flex flex-col items-center gap-1 opacity-70">
                     <span>Continue Journey</span>
                     <FaAngleDoubleDown />
                 </div>
            </section>

            {/* Section 3: Chizel Born */}
            <section className="snap-section section-3 h-screen flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
                 <div className="section-3-content relative z-10 flex flex-col items-center">
                     <div className="animated-element relative mb-8 p-2 border-2 border-primary/30 rounded-full shadow-[0_0_30px_rgba(var(--color-primary-rgb,31,111,235),0.4)]">
                         <img src="/images/logo.png" alt="Chizel Logo" className="w-24 h-24 md:w-32 md:h-32 drop-shadow-lg"/>
                     </div>
                    <h2 className="animated-element font-heading text-4xl md:text-6xl font-bold text-text mb-4 drop-shadow-md">
                        That's Where <span className="animated-gradient-heading">Chizel</span> Was Born.
                    </h2>
                    <p className="animated-element text-secondary-text text-lg md:text-xl max-w-xl leading-relaxed">
                        Forged from the need to transform passive screen time into an active launchpad for brilliance and real-world skills.
                    </p>
                 </div>
                 <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-secondary-text animate-bounce flex flex-col items-center gap-1 opacity-70">
                     <span>Discover More</span>
                     <FaAngleDoubleDown />
                 </div>
            </section>

            {/* Section 4: Our Impact & Milestones */}
             <section className="snap-section section-4 min-h-screen flex flex-col items-center justify-center py-16 md:py-24 px-4 text-center relative overflow-hidden">
                 <div className="section-4-content relative z-10 w-full max-w-6xl">
                     <div className="section-4-intro">
             {/* --- UPDATED H3 --- */}
             <h3 className="font-heading text-5xl md:text-6xl mb-8 animated-gradient-heading drop-shadow-lg">
               Our Impact
             </h3>
             {/* --- END UPDATED H3 --- */}
           </div>
                      <div className="v4-impact mb-16">
                          <div className="flex flex-col gap-6">
                               <LogoMarquee images={portfolioImages} speed={25} direction="left" />
                               <LogoMarquee images={[...portfolioImages].reverse()} speed={25} direction="right" />
                          </div>
                      </div>

                     <div className="section-4-intro mt-16">
                        <h2 className="font-heading text-4xl md:text-5xl font-bold text-text mb-6">
                            Explore the <span className="animated-gradient-heading">Chizel Universe</span>
                        </h2>
                        <p className="text-secondary-text text-lg md:text-xl max-w-3xl mx-auto mb-12">
                            Dive into the core platform or experience tailored journeys designed for kids and parents.
                        </p>
                     </div>
                     <div className="impact-card-container grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                         <ImpactCard
                             icon={<FaGlobe />}
                             title="Chizel Core"
                             description="Discover the foundation of our learning ecosystem, technology, and vision."
                             buttonText="Explore Core"
                             onClick={() => navigate('/chizel-core')}
                             gradientClass="bg-gradient-to-br from-blue-900/50 via-card/70 to-blue-900/50 backdrop-blur-lg"
                             iconBgClass="bg-blue-500/30"
                             shadowClass={"rgba(31, 111, 235, 0.4)"}
                         />
                         <ImpactCard
                             icon={<FaChild />}
                             title="Chizel for Kids"
                             description="Step into the interactive ChizelVerse designed for fun, skill-building adventures."
                             buttonText="Enter Kids Verse"
                             onClick={() => handleExternalLink('https://rajvansh-1.github.io/ChizelVerse/')}
                              gradientClass="bg-gradient-to-br from-purple-900/50 via-card/70 to-purple-900/50 backdrop-blur-lg"
                             iconBgClass="bg-purple-500/30"
                             shadowClass={"rgba(93, 63, 211, 0.4)"}
                         />
                         <ImpactCard
                             icon={<FaUserFriends />}
                             title="Chizel for Parents"
                             description="Monitor progress, discover resources, and connect with the parent community."
                             buttonText="View Parent Portal"
                             onClick={() => handleExternalLink('https://rajvansh-1.github.io/ParentPage-CV/')}
                              gradientClass="bg-gradient-to-br from-orange-900/50 via-card/70 to-orange-900/50 backdrop-blur-lg"
                             iconBgClass="bg-orange-500/30"
                             shadowClass={"rgba(255, 179, 71, 0.4)"}
                         />
                     </div>
                 </div>
                 <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-secondary-text animate-bounce flex flex-col items-center gap-1 opacity-70">
                     <span>Join the Mission</span>
                     <FaAngleDoubleDown />
                 </div>
             </section>

             {/* Section 5: CTA */}
              {/* --- MODIFIED: Removed h-screen, added padding --- */}
              <section className="snap-section section-5 flex flex-col items-center justify-center text-center p-4 relative overflow-hidden pt-24 pb-32 md:pt-32 md:pb-40">
                 <div className="section-5-content relative z-10 w-full max-w-3xl">
                     <h2 className="animated-element font-heading text-4xl md:text-6xl font-bold text-text mb-6 drop-shadow-md">
                         Ready to Ignite <span className="animated-gradient-heading">Potential?</span>
                     </h2>
                     <p className="animated-element text-secondary-text text-lg md:text-xl mb-10 leading-relaxed">
                         Be among the first explorers. Join the Chizel waitlist today for exclusive early access, special launch rewards, and updates on our mission to reshape learning.
                     </p>
                     <div className="animated-element relative inline-block group">
                          <div className="absolute -inset-1.5 bg-gradient-to-r from-primary via-accent to-badge-bg rounded-full blur-lg opacity-60 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
                          <Button
                              title="Secure Your Spot"
                              onClick={handleWaitlist}
                              rightIcon={<FaArrowRight />}
                              containerClass="relative !text-lg !py-4 !px-10 !bg-gradient-to-r !from-primary !to-accent hover:!shadow-[0_0_30px_rgba(var(--color-primary-rgb,31,111,235),0.6)]"
                          />
                     </div>
                 </div>
             </section>

            {/* Global Styles (No changes needed) */}
            <style jsx global>{`
                 :root {
                     --color-primary-rgb: 31, 111, 235;
                     --color-accent-rgb: 93, 63, 211;
                     --color-badge-bg-rgb: 255, 179, 71;
                 }
                .impact-button .bg-size-200 { background-size: 200% auto; }
                .impact-button .bg-pos-0 { background-position: 0% center; }
                .impact-button .bg-pos-100 { background-position: 100% center; }
                 /* --- MODIFIED: Added min-height to section-5 --- */
                 .snap-section {
                    /* Keep min-height for sections 1-4 */
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    width: 100%;
                    overflow: hidden;
                    z-index: 1;
                    background-color: transparent;
                 }
                 .section-5 {
                    /* Remove min-height from section 5 */
                    min-height: auto; /* Or simply remove the min-height override */
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
                     0% { background-position: 0% 50%; }
                     50% { background-position: 100% 50%; }
                     100% { background-position: 0% 50%; }
                 }
                 .animate-pulse {
                     animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                 }
                 @keyframes pulse {
                     0%, 100% { opacity: 1; }
                     50% { opacity: .5; }
                 }
                .animation-delay-1000 { animation-delay: 1s; }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-3000 { animation-delay: 3s; }
                .animation-delay-4000 { animation-delay: 4s; }
            `}</style>
        </div>
    );
};

export default ProfessionalLandingPage;