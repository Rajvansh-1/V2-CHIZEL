// src/pages/ProfessionalLandingPage.jsx
import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; // <-- REMOVED
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button'; // Assuming Button component handles styles
import LogoMarquee from '@/components/common/LogoMarquee'; // Import LogoMarquee
import {
    FaMobileAlt, FaInfinity, FaStopCircle, FaMousePointer,
    FaArrowRight, FaAngleDoubleDown, FaGlobe, FaChild, FaUserFriends
} from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger); // <-- REMOVED ScrollToPlugin

// --- Starfield Component (Reusable) ---
const Starfield = ({ count = 100 }) => (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-50" aria-hidden="true">
        {Array.from({ length: count }).map((_, i) => (
            <div
                key={`star-${i}`}
                className="star absolute w-px h-px bg-white rounded-full" // Added 'star' class for GSAP twinkle
                style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    // Animation handled by GSAP now for better control
                    opacity: 0 // Start hidden for GSAP animation
                }}
            />
        ))}
    </div>
);


// --- Enhanced Obstacle Card Component ---
const ObstacleCard = ({ icon, title, description, delay }) => {
    const cardRef = useRef(null);

    useGSAP(() => {
        // Entrance Animation
        gsap.from(cardRef.current, {
            scrollTrigger: {
                trigger: cardRef.current,
                start: 'top 90%', // Trigger a bit later
                toggleActions: 'play none none reverse',
            },
            opacity: 0,
            y: 60,
            scale: 0.9,
            duration: 1,
            delay: delay * 0.15, // Stagger delay
            ease: 'power3.out',
        });

        // Hover Effect using GSAP
        const tl = gsap.timeline({ paused: true });
        tl.to(cardRef.current, {
            y: -8,
            scale: 1.03,
            boxShadow: '0 15px 35px rgba(239, 68, 68, 0.3)', // Red shadow
            borderColor: 'rgb(239, 68, 68)', // Red border
            duration: 0.4,
            ease: 'power2.out',
        });
        
        // Icon Animation on Hover
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


// --- NEW Impact Card Component ---
const ImpactCard = ({ icon, title, description, buttonText, onClick, gradientClass, iconBgClass, shadowClass }) => {
    const cardRef = useRef(null);

    useGSAP(() => {
        // Entrance animation for the card itself
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

        // Hover animation for the card
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
            {/* Background Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            {/* Inner content */}
            <div className="relative z-10 flex flex-col items-center h-full">
                <div className={`p-4 rounded-full border-2 border-white/20 mb-5 inline-block transition-transform duration-300 group-hover:scale-110 ${iconBgClass || 'bg-primary/20'}`}>
                    <div className="text-3xl text-white">{icon}</div>
                </div>
                <h3 className="font-heading text-2xl text-text mb-3">{title}</h3>
                <p className="text-secondary-text text-sm mb-6 flex-grow leading-relaxed">{description}</p>
                 {/* Custom Button Style within Card */}
                 <button
                    onClick={onClick}
                    className="impact-button mt-auto relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-white transition duration-300 ease-out border-2 border-white/30 rounded-full group w-full hover:border-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-white/50" // Added focus styles
                >
                    <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-gradient-to-r from-primary via-accent to-primary bg-size-200 bg-pos-0 group-hover:translate-x-0 group-hover:bg-pos-100 ease"> 
                        <FaArrowRight className="text-xl ml-1 transform transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
                        {buttonText}
                    </span>
                    <span className="relative invisible">{buttonText}</span>{/* For sizing */}
                 </button>
            </div>
        </div>
    );
};


// --- Main Landing Page Component ---
const ProfessionalLandingPage = () => {
    const containerRef = useRef(null);
    const navigate = useNavigate();

     // Portfolio images for the marquee
     const portfolioImages = [
         "/images/slider/i1.jpg", "/images/slider/i2.jpg", "/images/slider/i3.jpg",
         "/images/slider/i4.jpg", "/images/slider/i5.jpg", "/images/slider/i7.png",
         "/images/slider/i8.png",
         // Duplicate for seamless loop
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
        // --- ALL SCROLL-SNAPPING LOGIC REMOVED ---


        // --- Section Entrance Animations (These are normal scroll-triggered animations) ---
        gsap.from(".section-1-content > *", { opacity: 0, y: 50, stagger: 0.3, duration: 1, ease: "power3.out", delay: 0.5 });
        
        // Animate in the scroll indicator for section 1
        gsap.from(".section-1 .scroll-indicator", { opacity: 0, y: 20, duration: 1, ease: "power3.out", delay: 1.5 }); // Delay until after text

        gsap.from(".section-2-content > *", { scrollTrigger: { trigger: ".section-2", start: "top 75%", toggleActions: 'play none none reverse' }, opacity: 0, y: 50, stagger: 0.15, duration: 0.8, ease: "power3.out" });
        // Obstacle card animation is within its component
        gsap.from(".section-3-content > *", { scrollTrigger: { trigger: ".section-3", start: "top 75%", toggleActions: 'play none none reverse' }, opacity: 0, scale: 0.8, duration: 1.2, ease: "elastic.out(1, 0.7)" });
        // Section 4 animation targets the container for the impact cards
        gsap.from(".impact-card-container", { scrollTrigger: { trigger: ".section-4", start: "top 75%", toggleActions: 'play none none reverse' }, opacity: 0, y: 50, duration: 0.8, ease: "power3.out" });
        // Animate marquee section separately
        gsap.from(".section-4 .v4-impact", { scrollTrigger: { trigger: ".section-4 .impact-card-container", start: "bottom 80%", toggleActions: 'play none none reverse' }, opacity: 0, y: 50, duration: 0.8, ease: "power3.out" });
        gsap.from(".section-5-content > *", { scrollTrigger: { trigger: ".section-5", start: "top 75%", toggleActions: 'play none none reverse' }, opacity: 0, y: 50, stagger: 0.15, duration: 0.8, ease: "power3.out" });

        // Twinkle animation for stars
         gsap.to(".star", {
           opacity: () => gsap.utils.random(0.3, 0.8),
           scale: () => gsap.utils.random(0.7, 1.1), 
           duration: () => gsap.utils.random(2, 4), 
           repeat: -1,
           yoyo: true,
           ease: "sine.inOut",
           stagger: {
               each: 0.05, 
               from: "random"
           },
           delay: () => gsap.utils.random(0, 1) 
         });

    }, { scope: containerRef });

    // --- Button Click Handlers ---
    const handleNavigate = (path) => navigate(path);
    const handleExternalLink = (url) => window.open(url, '_blank', 'noopener,noreferrer');
    const handleWaitlist = () => handleExternalLink("https://docs.google.com/forms/d/1Hx5WA9eEEKGYv96UcotYh-t5ImBNvdO_WdD6IzftTD0/viewform?edit_requested=true");


    return (
        <div ref={containerRef} className="professional-landing bg-background text-text">

            {/* Section 1: Intro Question */}
            {/* Using snap-section class just for min-height and flex properties now */}
            <section className="snap-section section-1 h-screen flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
                <Starfield count={150} />
                <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-radial from-primary/15 via-transparent to-transparent rounded-full animate-pulse blur-3xl opacity-70"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-accent/15 via-transparent to-transparent rounded-full animate-pulse animation-delay-2000 blur-3xl opacity-70"></div>
                <div className="section-1-content relative z-10">
                    <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-primary via-accent to-badge-bg bg-clip-text text-transparent mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                        Ever Dreamt of being Successful?
                    </h1>
                     <p className="text-secondary-text text-lg md:text-xl max-w-2xl mx-auto mb-8">
                         Unlocking potential in a universe saturated with digital noise.
                     </p>
                    
                </div>
                
                {/* --- This is the scroll down symbol you requested --- */}
               {/* --- UPDATED: Scroll Down Indicator for Section 1 --- */}
<div className="scroll-indicator absolute bottom-12 left-1/2 -translate-x-1/2 text-white/80 animate-bounce flex flex-col items-center gap-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"> {/* <-- REMOVED opacity-0 and ADDED styles */}
    <span className="text-sm tracking-wider font-light">Scroll Down</span>
    <FaAngleDoubleDown className="text-lg" />
</div>
            </section>

            {/* Section 2: Obstacles */}
            <section className="snap-section section-2 min-h-screen flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
                 <Starfield count={100} />
                 <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-red-500/10 via-transparent to-transparent rounded-full blur-3xl opacity-60 animate-pulse animation-delay-1000"></div>
                 <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-orange-500/10 via-transparent to-transparent rounded-full blur-3xl opacity-60 animate-pulse animation-delay-3000"></div>
                 <div className="section-2-content relative z-10 w-full max-w-5xl text-center">
                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-text mb-16">
                        What's <span className="text-red-500">Holding</span> You Back?
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
                 {/* This is the other scroll indicator, you can keep or remove it */}
                 <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-secondary-text animate-bounce flex flex-col items-center gap-1 opacity-70">
                     <span>Continue Journey</span>
                     <FaAngleDoubleDown />
                 </div>
            </section>

            {/* Section 3: Chizel Born */}
            <section className="snap-section section-3 h-screen flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
                 <Starfield count={150} />
                 <div className="absolute inset-0 flex items-center justify-center z-0 opacity-40">
                     <div className="w-[50vmin] h-[50vmin] bg-gradient-radial from-primary/25 via-transparent to-transparent rounded-full animate-pulse blur-3xl"></div>
                 </div>
                 <div className="section-3-content relative z-10 flex flex-col items-center">
                     <div className="relative mb-8 p-2 border-2 border-primary/30 rounded-full shadow-[0_0_30px_rgba(var(--color-primary-rgb,31,111,235),0.4)]">
                         <img src="/images/logo.png" alt="Chizel Logo" className="w-24 h-24 md:w-32 md:h-32 drop-shadow-lg"/>
                     </div>
                    <h2 className="font-heading text-4xl md:text-6xl font-bold text-text mb-4 drop-shadow-md">
                        That's Where <span className="animated-gradient-heading">Chizel</span> Was Born.
                    </h2>
                    <p className="text-secondary-text text-lg md:text-xl max-w-xl leading-relaxed">
                        Forged from the need to transform passive screen time into an active launchpad for brilliance and real-world skills.
                    </p>
                 </div>
                 <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-secondary-text animate-bounce flex flex-col items-center gap-1 opacity-70">
                     <span>Discover More</span>
                     <FaAngleDoubleDown />
                 </div>
            </section>

            {/* Section 4: Our Impact with NEW CARDS */}
             <section className="snap-section section-4 min-h-screen flex flex-col items-center justify-center py-16 md:py-24 px-4 text-center relative overflow-hidden">
                 <Starfield count={120} />
                 <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-accent/10 to-transparent blur-3xl opacity-50"></div>
                 <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-primary/10 to-transparent blur-3xl opacity-50"></div>

                 <div className="section-4-content relative z-10 w-full max-w-6xl">
                     <h2 className="font-heading text-4xl md:text-5xl font-bold text-text mb-6">
                         Explore the <span className="animated-gradient-heading">Chizel Universe</span>
                     </h2>
                     <p className="text-secondary-text text-lg md:text-xl max-w-3xl mx-auto mb-12">
                         Dive into the core platform or experience tailored journeys designed for kids and parents.
                     </p>

                     {/* Grid for Impact Cards */}
                     <div className="impact-card-container grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
                         <ImpactCard
                             icon={<FaGlobe />}
                             title="Chizel Core"
                             description="Discover the foundation of our learning ecosystem, technology, and vision."
                             buttonText="Explore Core"
                             onClick={() => handleNavigate('/chizel-core')}
                             gradientClass="bg-gradient-to-br from-blue-900/50 via-card/70 to-blue-900/50 backdrop-blur-lg"
                             iconBgClass="bg-blue-500/30"
                             shadowClass="rgba(31, 111, 235, 0.4)" // Primary blue shadow
                         />
                         <ImpactCard
                             icon={<FaChild />}
                             title="Chizel for Kids"
                             description="Step into the interactive ChizelVerse designed for fun, skill-building adventures."
                             buttonText="Enter Kids Verse"
                             onClick={() => handleExternalLink('https://rajvansh-1.github.io/ChizelVerse/')}
                              gradientClass="bg-gradient-to-br from-purple-900/50 via-card/70 to-purple-900/50 backdrop-blur-lg"
                             iconBgClass="bg-purple-500/30"
                             shadowClass="rgba(93, 63, 211, 0.4)" // Accent purple shadow
                         />
                         <ImpactCard
                             icon={<FaUserFriends />}
                             title="Chizel for Parents"
                             description="Monitor progress, discover resources, and connect with the parent community."
                             buttonText="View Parent Portal"
                             onClick={() => handleExternalLink('https://rajvansh-1.github.io/ParentPage-CV/')}
                              gradientClass="bg-gradient-to-br from-orange-900/50 via-card/70 to-orange-900/50 backdrop-blur-lg"
                             iconBgClass="bg-orange-500/30"
                             shadowClass="rgba(255, 179, 71, 0.4)" // Badge orange shadow
                         />
                     </div>

                     {/* Logo Marquee remains */}
                     <h3 className="font-heading text-3xl md:text-4xl text-text mb-8 mt-16 opacity-80">Our Journey & Milestones</h3>
                      <div className="v4-impact">
                          <div className="flex flex-col gap-6">
                               <LogoMarquee images={portfolioImages} speed={25} direction="left" />
                               <LogoMarquee images={[...portfolioImages].reverse()} speed={25} direction="right" />
                          </div>
                      </div>
                 </div>
                 <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-secondary-text animate-bounce flex flex-col items-center gap-1 opacity-70">
                     <span>Join the Mission</span>
                     <FaAngleDoubleDown />
                 </div>
             </section>

             {/* Section 5: CTA */}
              <section className="snap-section section-5 h-screen flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
                 <Starfield count={200} />
                 <div className="absolute inset-0 flex items-center justify-center z-0 opacity-60">
                     <div className="w-[60vmin] h-[60vmin] bg-gradient-radial from-primary/30 via-accent/15 to-transparent rounded-full animate-pulse blur-3xl"></div>
                 </div>
                 <div className="section-5-content relative z-10 w-full max-w-3xl">
                     <h2 className="font-heading text-4xl md:text-6xl font-bold text-text mb-6 drop-shadow-md">
                         Ready to Ignite <span className="animated-gradient-heading">Potential?</span>
                     </h2>
                     <p className="text-secondary-text text-lg md:text-xl mb-10 leading-relaxed">
                         Be among the first explorers. Join the Chizel waitlist today for exclusive early access, special launch rewards, and updates on our mission to reshape learning.
                     </p>
                     <div className="relative inline-block group">
                          <div className="absolute -inset-1.5 bg-gradient-to-r from-primary via-accent to-badge-bg rounded-full blur-lg opacity-60 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
                          <Button
                              title="Secure Your Spot"
                              onClick={handleWaitlist}
                              rightIcon={<FaArrowRight />}
                              containerClass="relative !text-lg !py-4 !px-10 !bg-gradient-to-r !from-primary !to-accent hover:!shadow-[0_0_30px_rgba(var(--color-primary-rgb,31,111,235),0.6)]" // Added relative for z-index stacking
                          />
                     </div>
                 </div>
             </section>

            {/* Footer is rendered by MainLayout */}

            {/* Global Styles */}
            <style jsx global>{`
                @keyframes twinkle {
                    0%, 100% { opacity: var(--start-opacity, 0.2); transform: scale(var(--start-scale, 0.8)); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
                .star {
                    /* Define CSS variables for random initial values */
                    --start-opacity: ${Math.random() * 0.4 + 0.1};
                    --start-scale: ${Math.random() * 0.3 + 0.7};
                    animation-name: twinkle;
                    animation-timing-function: ease-in-out;
                    animation-iteration-count: infinite;
                    animation-direction: alternate;
                }
                 /* Define RGB color variables */
                 :root {
                     --color-primary-rgb: 31, 111, 235;
                     --color-accent-rgb: 93, 63, 211;
                     --color-badge-bg-rgb: 255, 179, 71; /* Assuming badge color */
                 }

                 /* New Impact Card Button Styles */
                .impact-button .bg-size-200 { background-size: 200% auto; }
                .impact-button .bg-pos-0 { background-position: 0% center; }
                .impact-button .bg-pos-100 { background-position: 100% center; }

                 /* --- REMOVED CSS THAT HIDES SCROLLBAR --- */
                 
                 .snap-section {
                    min-height: 100vh;
                     /* This class is just used for min-height and flex centering now */
                    display: flex;
                    flex-direction: column; /* Stack content vertically */
                    align-items: center;
                    justify-content: center;
                    position: relative; /* Crucial for absolute positioning inside */
                    width: 100%; /* Ensure full width */
                    overflow: hidden; /* Prevent content overflow issues */
                 }

                 /* Animated Gradient Heading - Ensure this is defined */
                 .animated-gradient-heading {
                      color: transparent;
                      background: linear-gradient(90deg, var(--color-primary), var(--color-accent), var(--color-badge-bg), var(--color-primary));
                      background-clip: text;
                      -webkit-background-clip: text;
                      background-size: 200% auto;
                      animation: gradient-animation 6s linear infinite; /* Adjust speed if needed */
                      font-weight: 800;
                 }

                 @keyframes gradient-animation {
                     0% { background-position: 0% 50%; }
                     50% { background-position: 100% 50%; }
                     100% { background-position: 0% 50%; }
                 }

                 /* Ensure pulse animation is defined (Tailwind might provide this) */
                 .animate-pulse {
                     animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                 }
                 @keyframes pulse {
                     0%, 100% { opacity: 1; }
                     50% { opacity: .5; }
                 }
                 /* Custom animation delays if needed */
                .animation-delay-1000 { animation-delay: 1s; }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-3000 { animation-delay: 3s; }
                .animation-delay-4000 { animation-delay: 4s; }

            `}</style>
        </div>
    );
};

export default ProfessionalLandingPage;