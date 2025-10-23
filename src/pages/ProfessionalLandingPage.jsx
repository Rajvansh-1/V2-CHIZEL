// src/pages/ProfessionalLandingPage.jsx

 import { useRef, useEffect, useState } from 'react'; // Added useState
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
const RealisticStarfield = ({
    starCountDesktop = 50, // Reduced counts
    starCountMobile = 25,
    layerCount = 3,
    baseSpeed = 0.05
}) => {
    const starfieldRef = useRef(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const starCount = isMobile ? starCountMobile : starCountDesktop;

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
                size: `${Math.random() * 1 + 0.3}px`, // Slightly smaller stars
            });
        }
        layers.push({ stars, speedFactor, opacity, zIndex: -50 - i });
    }

    useGSAP(() => {
        const mm = gsap.matchMedia();

        // --- Desktop: Parallax + Twinkle ---
        mm.add("(min-width: 768px)", () => {
            gsap.utils.toArray('.star-layer').forEach((layer, i) => {
                const speed = layer.dataset.speed;
                gsap.to(layer, {
                    yPercent: -20 * (i + 1), // Reduced parallax effect
                    ease: "none",
                    scrollTrigger: {
                        trigger: "body",
                        start: "top top",
                        end: "bottom top",
                        scrub: 2 + i // Slightly increased scrub
                    }
                });
            });

            // Simplified twinkle using CSS for performance
            gsap.fromTo(".realistic-star",
                { opacity: 0 },
                {
                    opacity: () => gsap.utils.random(0.4, 0.9),
                    duration: 1.5,
                    stagger: 0.02, // Reduced stagger
                    ease: "power2.out",
                }
            );
        });

        // --- Mobile: Simple Fade In ---
        mm.add("(max-width: 767px)", () => {
             gsap.fromTo(".realistic-star",
                { opacity: 0 },
                {
                    opacity: () => gsap.utils.random(0.3, 0.7),
                    duration: 1.5,
                    stagger: 0.03,
                    ease: "power2.out",
                }
            );
             // No parallax or complex twinkle on mobile
        });

    }, { scope: starfieldRef, dependencies: [isMobile] }); // Rerun on mobile state change

    return (
        <div ref={starfieldRef} className="fixed inset-0 z-[-1] overflow-hidden bg-gradient-to-b from-[#020010] via-[#0b1226] to-[#020010]">
            {/* Simplified background pulses */}
            <div className="absolute inset-0 opacity-20 mix-blend-soft-light">
                 <div className="absolute top-[-20%] left-[-15%] w-[60vw] h-[60vh] bg-gradient-radial from-primary/15 via-transparent to-transparent rounded-full animate-pulse blur-3xl animation-delay-1000"></div>
                 <div className="absolute bottom-[-20%] right-[-20%] w-[70vw] h-[70vh] bg-gradient-radial from-accent/10 via-transparent to-transparent rounded-full animate-pulse blur-3xl animation-delay-3000"></div>
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
                            className="realistic-star absolute rounded-full bg-white opacity-0" // Add CSS animation class
                            style={{
                                top: star.top,
                                left: star.left,
                                width: star.size,
                                height: star.size,
                                animation: isMobile ? 'none' : `twinkle ${Math.random() * 4 + 3}s infinite ease-in-out alternate`, // Use CSS for desktop twinkle
                                animationDelay: `${Math.random() * 5}s`
                            }}
                        />
                    ))}
                </div>
            ))}
            {/* CSS for Twinkle */}
             <style>{`
               @keyframes twinkle {
                 0% { opacity: 0.3; transform: scale(0.8); }
                 100% { opacity: 0.8; transform: scale(1.1); }
               }
             `}</style>
        </div>
    );
};


// --- Optimized ObstacleCard ---
 const ObstacleCard = ({ icon, title, description, delay }) => {
     const cardRef = useRef(null);
     const [isTouchDevice, setIsTouchDevice] = useState(false);

     useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
     }, []);

     useGSAP(() => {
         // Entrance animation - common for both
         gsap.from(cardRef.current, {
             scrollTrigger: {
                 trigger: cardRef.current,
                 start: 'top 90%', // Trigger slightly earlier
                 toggleActions: 'play none none reverse',
             },
             opacity: 0,
             y: 50, // Reduced y distance
             scale: 0.95, // Subtle scale
             duration: 0.8, // Faster duration
             delay: delay * 0.1, // Reduced delay
             ease: 'power2.out', // Smoother ease
         });

         // Hover animation - only for non-touch devices
         if (!isTouchDevice) {
             const tl = gsap.timeline({ paused: true });
             tl.to(cardRef.current, {
                 y: -6,
                 scale: 1.02, // Reduced scale
                 boxShadow: '0 10px 25px rgba(239, 68, 68, 0.25)', // Softer shadow
                 borderColor: 'rgba(239, 68, 68, 0.7)',
                 duration: 0.3,
                 ease: 'power2.out',
             });
             tl.to(cardRef.current.querySelector('.obstacle-icon-wrapper'), {
                 scale: 1.1, // Reduced scale
                 duration: 0.3,
                 ease: 'power2.out'
             }, 0);

             cardRef.current.addEventListener('mouseenter', () => tl.play());
             cardRef.current.addEventListener('mouseleave', () => tl.reverse());
         }

     }, { scope: cardRef, dependencies: [isTouchDevice] }); // Rerun if touch device status changes (though unlikely)

     // Added 'will-change' for performance hint
     return (
         <div ref={cardRef} className="obstacle-card-enhanced group bg-card/60 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center shadow-lg transform-gpu transition-colors duration-300 relative overflow-hidden will-change-transform">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/10 via-transparent to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
             <div className="obstacle-icon-wrapper relative inline-block mb-4 p-3 bg-red-500/15 rounded-full border border-red-500/25 transition-transform duration-300"> {/* Optimized transforms */}
                  <div className="text-red-500 text-3xl">{icon}</div>
             </div>
              <h3 className="font-heading text-xl text-text mb-2">{title}</h3>
              <p className="text-secondary-text text-sm leading-relaxed">{description}</p>
         </div>
     );
 };

// --- Optimized ImpactCard ---
 const ImpactCard = ({ icon, title, description, buttonText, onClick, gradientClass, iconBgClass, shadowClass }) => {
     const cardRef = useRef(null);
     const [isTouchDevice, setIsTouchDevice] = useState(false);

     useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
     }, []);

     useGSAP(() => {
         // Entrance animation - common for both
         gsap.from(cardRef.current, {
             scrollTrigger: {
                 trigger: cardRef.current,
                 start: 'top 88%', // Trigger slightly earlier
                 toggleActions: 'play none none reverse',
             },
             opacity: 0,
             y: 40, // Reduced y distance
             duration: 0.7, // Faster duration
             ease: 'power2.out',
         });

         // Hover animation - only for non-touch devices
         if (!isTouchDevice) {
             const tl = gsap.timeline({ paused: true });
             tl.to(cardRef.current, {
                 y: -8, // Reduced y distance
                 scale: 1.02, // Reduced scale
                 boxShadow: `0 15px 30px ${shadowClass ? shadowClass.replace('0.4)', '0.25)') : 'rgba(0,0,0,0.2)'}`, // Softer shadow
                 duration: 0.3,
                 ease: 'power2.out'
             });

              cardRef.current.addEventListener('mouseenter', () => tl.play());
              cardRef.current.addEventListener('mouseleave', () => tl.reverse());
         }

     }, { scope: cardRef, dependencies: [isTouchDevice] });

     // Using simple CSS transitions for button hover for better performance
     return (
         <div ref={cardRef} className={`impact-card relative group p-8 rounded-3xl border border-white/10 overflow-hidden text-center transform-gpu ${gradientClass || 'bg-card/70 backdrop-blur-lg'} will-change-transform`}> {/* Added will-change */}
             <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
             <div className="relative z-10 flex flex-col items-center h-full">
                 <div className={`p-4 rounded-full border border-white/15 mb-5 inline-block transition-transform duration-300 group-hover:scale-110 ${iconBgClass || 'bg-primary/15'}`}> {/* Reduced border opacity, bg opacity */}
                     <div className="text-3xl text-white">{icon}</div>
                 </div>
                 <h3 className="font-heading text-2xl text-text mb-3">{title}</h3>
                 <p className="text-secondary-text text-sm mb-6 flex-grow leading-relaxed">{description}</p>
                  {/* Using CSS for button hover effect */}
                  <button
                     onClick={onClick}
                     className="impact-button-css mt-auto relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-white transition duration-300 ease-out border-2 border-white/20 rounded-full group w-full hover:border-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-white/50"
                 >
                     <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 transform -translate-x-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-left group-hover:translate-x-0 group-hover:bg-right ease">
                         <FaArrowRight className="text-xl ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                     </span>
                     <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
                         {buttonText}
                     </span>
                     <span className="relative invisible">{buttonText}</span> {/* Keep for sizing */}
                  </button>
             </div>
         </div>
     );
 };

 // --- Main Landing Page Component ---
 const ProfessionalLandingPage = () => {
     const containerRef = useRef(null);
     const navigate = useNavigate();

     // --- Marquee Image Logic (Keep as is) ---
     const allPortfolioImages = [
         "/images/slider/i1.jpg", "/images/slider/i2.jpg", "/images/slider/i3.jpg",
         "/images/slider/i4.jpg", "/images/slider/i5.jpg", "/images/slider/i10.png",
         "/images/slider/i8.png", "/images/slider/i9.png", "/images/slider/i7.png",
         "/images/slider/i11.png"
     ];
     const shuffledImages = [...allPortfolioImages].sort(() => Math.random() - 0.5);
     const midpoint = Math.ceil(shuffledImages.length / 2);
     const marqueeImages1 = shuffledImages.slice(0, midpoint);
     const marqueeImages2 = shuffledImages.slice(midpoint);
     // --- END Marquee Image Logic ---


     const obstacles = [
         { icon: <FaMobileAlt />, title: "Screen Overload", description: "Hours lost in passive digital consumption." },
         { icon: <FaInfinity />, title: "Mindless Scrolling", description: "The endless feed trap stealing focus." },
         { icon: <FaMousePointer />, title: "Digital Distractions", description: "Focus shattered in a hyper-connected world." },
         { icon: <FaStopCircle />, title: "Passive Alternatives", description: "Lack of truly engaging developmental tools." },
     ];

     useGSAP(() => {
        const mm = gsap.matchMedia();

        // --- Common Animations (Desktop & Mobile) ---
        // Simple fade-in for section 1 elements
        gsap.from(".section-1 .animated-element", { opacity: 0, y: 30, stagger: 0.15, duration: 0.8, ease: "power2.out", delay: 0.3 });
        gsap.from(".section-1 .scroll-indicator", { opacity: 0, y: 15, duration: 0.8, ease: "power2.out", delay: 1 });

        // Scroll-triggered simple fade-ins for subsequent sections
        const sectionsToAnimate = ['.section-2', '.section-3', '.section-4-intro', '.section-4 .v4-impact', '.section-5'];

        sectionsToAnimate.forEach(selector => {
            gsap.from(`${selector} .animated-element, ${selector} > *`, { // Target direct children if no .animated-element
                scrollTrigger: {
                    trigger: selector,
                    start: "top 85%", // Start animation sooner
                    toggleActions: 'play none none reverse',
                },
                opacity: 0,
                y: 30, // Reduced y distance
                stagger: 0.1, // Reduced stagger
                duration: 0.7, // Faster duration
                ease: "power2.out"
            });
        });

        // --- Desktop Specific Animations (if any needed later) ---
        // mm.add("(min-width: 768px)", () => {
        //     // Add any desktop-only subtle effects here if desired
        // });

        // --- Mobile Specific Animations (if any needed later) ---
        // mm.add("(max-width: 767px)", () => {
        //     // Add mobile-only adjustments if necessary
        // });

     }, { scope: containerRef });

     const handleExternalLink = (url) => window.open(url, '_blank', 'noopener,noreferrer');
     const handleWaitlist = () => handleExternalLink("https://docs.google.com/forms/d/1Hx5WA9eEEKGYv96UcotYh-t5ImBNvdO_WdD6IzftTD0/viewform?edit_requested=true");

     return (
         // Removed snap-section classes
         <div ref={containerRef} className="professional-landing-wrapper">
             <div className="professional-landing bg-transparent text-text relative z-10">
                 <RealisticStarfield /> {/* Using optimized starfield */}

                 {/* Section 1: Intro */}
                 <section className="section-1 min-h-screen flex flex-col items-center justify-center text-center p-4 relative overflow-hidden"> {/* Adjusted height */}
                     <div className="section-1-content relative z-10">
                         <h1 className="animated-element font-heading text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-primary via-accent to-badge-bg bg-clip-text text-transparent mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.15)] leading-tight md:leading-tight"> {/* Softer shadow */}
                             Ever Dreamt of <br className="hidden md:inline" /> Being Successful?
                         </h1>
                          <p className="animated-element text-secondary-text text-lg md:text-xl max-w-2xl mx-auto mb-8">
                              Unlocking potential in a universe saturated with digital noise.
                          </p>
                     </div>
                    {/* Simplified scroll indicator with only CSS animation */}
                    <div className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 text-secondary-text animate-bounce flex flex-col items-center gap-1 opacity-60">
                          <span>Scroll Down</span>
                          <FaAngleDoubleDown />
                      </div>
                 </section>

                 {/* Section 2: Obstacles */}
                 <section className="section-2 min-h-screen flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden"> {/* Adjusted height */}
                      <div className="section-2-content relative z-10 w-full max-w-5xl text-center">
                         <h2 className="animated-element font-heading text-4xl md:text-5xl font-bold text-text mb-12 md:mb-16"> {/* Reduced margin */}
                             What's <span className="text-red-500">Holding</span> You Back?
                         </h2>
                         {/* Obstacle cards now use .animated-element class via the component */}
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"> {/* Reduced gap slightly */}
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
                      {/* Removed duplicate scroll indicator */}
                 </section>

                 {/* Section 3: Chizel Born */}
                 <section className="section-3 min-h-screen flex flex-col items-center justify-center text-center p-4 relative overflow-hidden"> {/* Adjusted height */}
                      <div className="section-3-content relative z-10 flex flex-col items-center">
                          {/* Removed border and shadow for cleaner look */}
                          <div className="animated-element relative mb-6 md:mb-8">
                              <img src="/images/logo.png" alt="Chizel Logo" className="w-24 h-24 md:w-32 md:h-32 drop-shadow-lg"/>
                          </div>
                         <h2 className="animated-element font-heading text-4xl md:text-6xl font-bold text-text mb-4 drop-shadow-md">
                             That's Where <span className="animated-gradient-heading">Chizel</span> Was Born.
                         </h2>
                         <p className="animated-element text-secondary-text text-lg md:text-xl max-w-xl leading-relaxed">
                             Forged from the need to transform passive screen time into an active launchpad for brilliance and real-world skills.
                         </p>
                      </div>
                      {/* Removed duplicate scroll indicator */}
                 </section>

                 {/* Section 4: Our Impact & Milestones */}
                  <section className="section-4 min-h-screen flex flex-col items-center justify-center py-16 md:py-24 px-4 text-center relative overflow-hidden"> {/* Adjusted height */}
                      <div className="section-4-content relative z-10 w-full max-w-6xl">
                          <div className="section-4-intro mb-12 md:mb-16"> {/* Added margin bottom */}
                             <h3 className="font-heading text-5xl md:text-6xl mb-4 animated-gradient-heading drop-shadow-lg"> {/* Reduced margin */}
                                 Our Impact
                             </h3>
                          </div>
                           {/* Impact section now uses .animated-element class */}
                           <div className="v4-impact mb-16 md:mb-20"> {/* Adjusted margin */}
                               <div className="flex flex-col gap-5 md:gap-6"> {/* Reduced gap */}
                                    <LogoMarquee images={marqueeImages1} speed={10} direction="left" /> {/* Increased speed slightly */}
                                    <LogoMarquee images={marqueeImages2} speed={10} direction="right" />
                               </div>
                           </div>
                          <div className="section-4-intro mt-16 md:mt-20"> {/* Adjusted margin */}
                             <h2 className="font-heading text-4xl md:text-5xl font-bold text-text mb-5 md:mb-6"> {/* Reduced margin */}
                                 Explore the <span className="animated-gradient-heading">Chizel Universe</span>
                             </h2>
                             <p className="text-secondary-text text-lg md:text-xl max-w-3xl mx-auto mb-10 md:mb-12"> {/* Reduced margin */}
                                 Dive into the core platform or experience tailored journeys designed for kids and parents.
                             </p>
                          </div>
                          {/* Impact cards now use .animated-element class via the component */}
                          <div className="impact-card-container grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto"> {/* Reduced gap */}
                              <ImpactCard
                                  icon={<FaGlobe />} title="Chizel Core" description="Discover the foundation of our learning ecosystem, technology, and vision." buttonText="Explore Core"
                                  onClick={() => navigate('/chizel-core')}
                                  gradientClass="bg-gradient-to-br from-blue-900/40 via-card/60 to-blue-900/40 backdrop-blur-lg" iconBgClass="bg-blue-500/25" shadowClass={"rgba(31, 111, 235, 0.25)"}
                              />
                              <ImpactCard
                                  icon={<FaChild />} title="Chizel for Kids" description="Step into the interactive ChizelVerse designed for fun, skill-building adventures." buttonText="Enter Kids Verse"
                                  onClick={() => handleExternalLink('https://rajvansh-1.github.io/ChizelVerse/')}
                                   gradientClass="bg-gradient-to-br from-purple-900/40 via-card/60 to-purple-900/40 backdrop-blur-lg" iconBgClass="bg-purple-500/25" shadowClass={"rgba(93, 63, 211, 0.25)"}
                              />
                              <ImpactCard
                                  icon={<FaUserFriends />} title="Chizel for Parents" description="Monitor progress, discover resources, and connect with the parent community." buttonText="View Parent Portal"
                                  onClick={() => handleExternalLink('https://rajvansh-1.github.io/ParentPage-CV/')}
                                   gradientClass="bg-gradient-to-br from-orange-900/40 via-card/60 to-orange-900/40 backdrop-blur-lg" iconBgClass="bg-orange-500/25" shadowClass={"rgba(255, 179, 71, 0.25)"}
                              />
                          </div>
                      </div>
                      {/* Removed duplicate scroll indicator */}
                  </section>

                  {/* Section 5: CTA */}
                   {/* Adjusted padding, removed min-height */}
                   <section className="section-5 flex flex-col items-center justify-center text-center p-4 relative overflow-hidden py-20 md:py-32">
                      <div className="section-5-content relative z-10 w-full max-w-3xl">
                          <h2 className="animated-element font-heading text-4xl md:text-6xl font-bold text-text mb-5 md:mb-6 drop-shadow-md"> {/* Reduced margin */}
                              Ready to Ignite <span className="animated-gradient-heading">Potential?</span>
                          </h2>
                          <p className="animated-element text-secondary-text text-lg md:text-xl mb-8 md:mb-10 leading-relaxed"> {/* Reduced margin */}
                              Be among the first explorers. Join the Chizel waitlist today for exclusive early access, special launch rewards, and updates on our mission to reshape learning.
                          </p>
                          <div className="animated-element relative inline-block group">
                               {/* Simplified glow effect */}
                               <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-badge-bg rounded-full blur-md opacity-50 group-hover:opacity-75 transition duration-300 animate-pulse"></div>
                               <Button
                                   title="Secure Your Spot"
                                   onClick={handleWaitlist}
                                   rightIcon={<FaArrowRight />}
                                   // Simplified button styling slightly
                                   containerClass="relative !text-base md:!text-lg !py-3 !px-8 md:!py-4 md:!px-10 !bg-gradient-to-r !from-primary !to-accent hover:!shadow-[0_0_20px_rgba(var(--color-primary-rgb,31,111,235),0.5)]"
                               />
                          </div>
                      </div>
                  </section>

                 {/* Global Styles */}
                 <style jsx global>{`
                  /* Root variables remain the same */
                  :root { --color-primary-rgb: 31, 111, 235; /* ... keep others ... */ }

                  /* --- Optimized Button CSS --- */
                  .impact-button-css .bg-left { background-position: 0% center; }
                  .impact-button-css .bg-right { background-position: 100% center; }
                  /* --- End Optimized Button CSS --- */

                  /* Removed snap-section styles */
                  section { /* Basic section styling if needed, ensure sufficient height/padding */
                     min-height: 80vh; /* Ensure sections have some height */
                     display: flex;
                     flex-direction: column;
                     align-items: center;
                     justify-content: center;
                     position: relative;
                     width: 100%;
                     overflow: hidden; /* Prevent horizontal scroll */
                     z-index: 1; /* Keep content above starfield */
                     background-color: transparent; /* Sections are transparent over the starfield */
                     padding-top: 5rem; /* Add padding for navbar */
                     padding-bottom: 5rem;
                  }
                  .section-1, .section-2, .section-3, .section-4 { min-height: 100vh; } /* Restore min-height if full screen sections are desired */
                  .section-5 { min-height: auto; } /* CTA section doesn't need full height */

                  .professional-landing { background-color: transparent; }

                  /* Animated gradient heading remains the same */
                  .animated-gradient-heading {
                       color: transparent;
                       background: linear-gradient(90deg, var(--color-primary), var(--color-accent), var(--color-badge-bg), var(--color-primary));
                       background-clip: text; -webkit-background-clip: text;
                       background-size: 200% auto;
                       animation: gradient-animation 6s linear infinite;
                       font-weight: 800;
                  }
                  @keyframes gradient-animation { /* Keep as is */ }

                  /* Pulse animation remains the same */
                  .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                  @keyframes pulse { /* Keep as is */ }

                 /* Animation delays remain the same */
                 .animation-delay-1000 { animation-delay: 1s; }
                 .animation-delay-3000 { animation-delay: 3s; }

                 /* Performance Hinting */
                 .animated-element, .obstacle-card-enhanced, .impact-card {
                     will-change: opacity, transform;
                 }
             `}</style>
             </div>
             <Footer />
         </div>
     );
 };

 export default ProfessionalLandingPage;