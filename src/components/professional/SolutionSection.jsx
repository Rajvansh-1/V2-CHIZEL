// src/components/professional/SolutionSection.jsx
import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import { FaGlobe, FaChild, FaUsers, FaArrowRight, FaTimes } from 'react-icons/fa';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- IFRAME MODAL COMPONENT (with Fullscreen Logic) ---
const IframeModal = ({ url, onClose }) => {
    const modalRef = useRef(null);
    const overlayRef = useRef(null);
    const iframeRef = useRef(null); // Ref for the iframe element

    useEffect(() => {
        // --- Enter Fullscreen on Mount ---
        const iframe = iframeRef.current;
        if (iframe && iframe.requestFullscreen) {
            iframe.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                // Fallback for browsers that might block the request
                gsap.to(overlayRef.current, { opacity: 1, duration: 0.5 });
                gsap.from(modalRef.current, { opacity: 0, scale: 0.9, duration: 0.5, ease: 'power3.out' });
            });
        }

        // --- Event listener to close modal on fullscreen exit ---
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                handleClose();
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        
        // --- Animate In (as a fallback) ---
        gsap.to(overlayRef.current, { opacity: 1, duration: 0.5 });
        gsap.from(modalRef.current, { opacity: 0, scale: 0.95, duration: 0.5, ease: 'power3.out' });

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
             // Ensure we exit fullscreen if the component unmounts for any reason
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        };
    }, []); // Empty dependency array ensures this runs only once on mount

    const handleClose = () => {
        gsap.to([modalRef.current, overlayRef.current], {
            opacity: 0,
            duration: 0.3,
            onComplete: onClose
        });
    };

    return (
        <div ref={overlayRef} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm opacity-0">
            <div ref={modalRef} className="relative w-full h-full bg-background overflow-hidden">
                <iframe
                    ref={iframeRef}
                    src={url}
                    title="Chizel Experience"
                    className="w-full h-full border-0"
                    allow="fullscreen; autoplay"
                />
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 w-10 h-10 flex-center bg-black/50 rounded-full text-white hover:bg-red-500 transition-all duration-300 z-10"
                    aria-label="Close"
                >
                    <FaTimes />
                </button>
            </div>
        </div>
    );
};

// --- SOLUTION BUTTON COMPONENT ---
const SolutionButton = ({ icon, title, description, color, onClick }) => {
    const btnRef = useRef(null);

    useGSAP(() => {
        const btn = btnRef.current;
        if (!btn) return;

        btn.addEventListener("mousemove", (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = (y / rect.height - 0.5) * -20;
            const rotateY = (x / rect.width - 0.5) * 20;
            
            gsap.to(btn, {
              rotationX: rotateX,
              rotationY: rotateY,
              scale: 1.05,
              duration: 0.8,
              ease: 'power3.out'
            });
        });

        btn.addEventListener("mouseleave", () => {
            gsap.to(btn, {
              rotationX: 0,
              rotationY: 0,
              scale: 1,
              duration: 1,
              ease: 'elastic.out(1, 0.5)'
            });
        });

    }, { scope: btnRef });

    return (
        <button
            ref={btnRef}
            onClick={onClick}
            className="solution-button group relative w-full text-left p-1.5 rounded-2xl bg-gradient-to-br from-white/20 via-white/10 to-transparent transition-all duration-300 hover:shadow-2xl"
            style={{ 
                transformStyle: 'preserve-3d',
                perspective: '1200px',
                '--glow-color': color,
                 boxShadow: `0 0 20px -5px ${color}60`
            }}
        >
            <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-primary via-accent to-badge-bg animate-gradient-animation opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 h-full w-full rounded-[14px] bg-slate-900/90 p-6 backdrop-blur-lg">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 flex-shrink-0 flex-center rounded-full border-2" style={{backgroundColor: `${color}20`, borderColor: color}}>
                        {icon}
                    </div>
                    <div>
                        <h3 className="font-heading text-xl md:text-2xl text-text">{title}</h3>
                        <p className="text-secondary-text text-sm mt-1">{description}</p>
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-end font-ui text-sm font-bold" style={{ color }}>
                    Launch Experience <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
            </div>
        </button>
    );
};


// --- MAIN SOLUTION SECTION COMPONENT ---
const SolutionSection = () => {
    const containerRef = useRef(null);
    const navigate = useNavigate();
    const [modalUrl, setModalUrl] = useState(null);

    useGSAP(() => {
        gsap.from(".solution-button", {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 75%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 60,
            duration: 0.8,
            ease: "power2.out"
        });
    }, { scope: containerRef });

    const handleNavigate = (path) => {
        if (path.startsWith('http')) {
            setModalUrl(path);
        } else {
            navigate(path);
            // Explicitly scroll to the top of the new page
            window.scrollTo(0, 0); 
        }
    };

    return (
        <>
            <section ref={containerRef} className="py-24 bg-transparent">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="font-heading text-4xl md:text-6xl font-bold animated-gradient-heading">Our Solution, Your Universe</h2>
                    <p className="mt-4 text-lg text-secondary-text max-w-3xl mx-auto">Three tailored experiences, one unified mission. Choose your path and explore the world of Chizel.</p>
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        
                        <SolutionButton
                            icon={<FaGlobe className="text-4xl" style={{color: 'var(--color-primary)'}} />}
                            title="Experience Chizel Web"
                            description="Our main website with a deep dive into our vision."
                            color="var(--color-primary)"
                            onClick={() => handleNavigate('/home')}
                        />

                        <SolutionButton
                            icon={<FaChild className="text-4xl" style={{color: 'var(--color-accent)'}}/>}
                            title="Chizel for Kids"
                            description="An interactive demo of the ChizelVerse for young explorers."
                            color="var(--color-accent)"
                            onClick={() => handleNavigate('https://rajvansh-1.github.io/ChizelVerse/')}
                        />

                        <SolutionButton
                            icon={<FaUsers className="text-4xl" style={{color: 'var(--color-badge-bg)'}}/>}
                            title="Chizel for Parents"
                            description="Insights and tools for your child's developmental journey."
                            color="var(--color-badge-bg)"
                            onClick={() => handleNavigate('https://rajvansh-1.github.io/ParentPage-CV/')}
                        />
                    </div>
                </div>
            </section>
            
            {modalUrl && <IframeModal url={modalUrl} onClose={() => setModalUrl(null)} />}
        </>
    );
};

export default SolutionSection;