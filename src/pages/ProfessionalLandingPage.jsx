// src/pages/ProfessionalLandingPage.jsx

import { useRef, useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Button from '@/components/ui/Button';
import AuthModal from '@/components/auth/AuthModal';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import {
    FaMobileAlt, FaInfinity, FaStopCircle, FaMousePointer,
    FaArrowRight, FaRegLightbulb, FaChevronDown, FaChevronLeft, FaChevronRight,
    FaInstagram, FaYoutube, FaLinkedin, FaFacebook
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { socialLinks } from '@utils/constants';

gsap.registerPlugin(ScrollTrigger);

// ─── Single fixed cosmic background behind the whole page ─────────────────
const CosmicBg = memo(() => {
    const starsData = useMemo(() => Array.from({ length: 60 }, (_, i) => ({
        top:  `${(i * 37 + 11) % 100}%`,
        left: `${(i * 53 + 7)  % 100}%`,
        size: `${(i % 3) * 0.55 + 0.35}px`,
        delay: `${(i * 0.21) % 5}s`,
        dur:   `${(i % 4) * 1.1 + 1.8}s`,
    })), []);

    return (
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden="true">
            {/* Slow Ken-Burns pan — the only movement on the bg image */}
            <img
                src="/images/Chizel-verse-bg.jpg"
                alt=""
                className="absolute w-[106%] h-[106%] object-cover"
                style={{ animation: 'cosmicPan 30s ease-in-out infinite alternate', transformOrigin: 'center', top: '-3%', left: '-3%' }}
                loading="eager"
                decoding="async"
            />
            {/* Uniform dark overlay — same opacity everywhere, no orbs */}
            <div className="absolute inset-0" style={{ background: 'rgba(11,18,38,0.80)' }} />
            {/* One very subtle static center ambient — adds depth without patchy zones */}
            <div className="absolute inset-0" style={{
                background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(31,111,235,0.055) 0%, transparent 70%)'
            }} />
            {/* Twinkling star particles — gives "alive" feel uniformly */}
            {starsData.map((s, i) => (
                <div key={i} className="absolute rounded-full bg-white"
                    style={{ top: s.top, left: s.left, width: s.size, height: s.size, animation: `starTwinkle ${s.dur} ${s.delay} infinite ease-in-out alternate` }} />
            ))}
        </div>
    );
});
CosmicBg.displayName = 'CosmicBg';


// ─── Obstacle Card ──────────────────────────────────────────────────────────
const ObstacleCard = memo(({ icon, title, description, delay }) => {
    const cardRef = useRef(null);

    useGSAP(() => {
        if (!cardRef.current) return;
        gsap.fromTo(cardRef.current,
            { opacity: 0, y: 30 },
            {
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: 'top 92%',
                    toggleActions: 'play none none reverse',
                    fastScrollEnd: true,
                },
                opacity: 1, y: 0,
                duration: 0.55,
                delay: delay * 0.07,
                ease: 'power2.out',
            }
        );
    }, { scope: cardRef });

    return (
        <div
            ref={cardRef}
            className="group bg-card/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center shadow-lg transition-colors duration-300 relative overflow-hidden"
            style={{ opacity: 0 }}
        >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="relative inline-block mb-4 p-3 bg-red-500/15 rounded-full border border-red-500/25">
                <div className="text-red-400 text-3xl">{icon}</div>
            </div>
            <h3 className="font-heading text-xl text-text mb-2">{title}</h3>
            <p className="text-secondary-text text-sm leading-relaxed">{description}</p>
        </div>
    );
});
ObstacleCard.displayName = 'ObstacleCard';

// ─── 3-Panel Impact Slider ─────────────────────────────────────────────────
const SLIDER_IMAGES = [
    "/images/slider/i1.jpeg",
    "/images/slider/i2.jpeg",
    "/images/slider/i3.jpeg",
    "/images/slider/i4.jpeg",
    "/images/slider/i5.jpeg",
    "/images/slider/i6.jpeg",
    "/images/slider/i7.jpeg",
    "/images/slider/i8.jpeg",
    "/images/slider/i9.jpeg",
    "/images/slider/i10.jpeg",
];
const TOTAL = SLIDER_IMAGES.length;

const ImpactSlider = memo(() => {
    const [current, setCurrent] = useState(0);
    const [displayed, setDisplayed] = useState(0); // what's actually visible (for crossfade)
    const [fading, setFading] = useState(false);
    const [paused, setPaused] = useState(false);

    // Auto-advance every 2 seconds — pauses on hover
    useEffect(() => {
        if (paused) return;
        const id = setInterval(() => {
            setCurrent(prev => (prev + 1) % TOTAL);
        }, 2000);
        return () => clearInterval(id);
    }, [paused]);

    // Beautiful crossfade: fade out → swap → fade in
    useEffect(() => {
        if (current === displayed) return;
        setFading(true);
        const t = setTimeout(() => {
            setDisplayed(current);
            setFading(false);
        }, 320);
        return () => clearTimeout(t);
    }, [current, displayed]);

    const goTo = useCallback((index) => {
        if (fading) return;
        setCurrent(index);
    }, [fading]);

    const goPrev = useCallback(() => goTo((current - 1 + TOTAL) % TOTAL), [current, goTo]);
    const goNext = useCallback(() => goTo((current + 1) % TOTAL), [current, goTo]);

    const leftIdx  = (current - 1 + TOTAL) % TOTAL;
    const rightIdx = (current + 1) % TOTAL;

    return (
        <div
            className="relative w-full"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* ── MOBILE: single full-width card (hidden on sm+) ── */}
            <div className="block sm:hidden px-2">
                <div
                    className="relative w-full rounded-2xl overflow-hidden mx-auto"
                    style={{
                        aspectRatio: '4/3',
                        maxWidth: '100%',
                        boxShadow: '0 0 50px rgba(31,111,235,0.55), 0 0 100px rgba(93,63,211,0.25)',
                        border: '1.5px solid rgba(31,111,235,0.5)',
                    }}
                >
                    <img
                        src={SLIDER_IMAGES[displayed]}
                        alt={`Impact ${displayed + 1}`}
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.32s ease-in-out' }}
                        loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none z-10" />
                    <div className="absolute inset-0 pointer-events-none z-10" style={{
                        background: 'radial-gradient(ellipse at top left, rgba(31,111,235,0.18), transparent 55%), radial-gradient(ellipse at bottom right, rgba(93,63,211,0.14), transparent 55%)'
                    }} />
                    {/* Mobile tap zones */}
                    <div className="absolute inset-y-0 left-0 w-1/3 z-20" onClick={goPrev} aria-label="Previous" role="button" />
                    <div className="absolute inset-y-0 right-0 w-1/3 z-20" onClick={goNext} aria-label="Next" role="button" />
                </div>
            </div>

            {/* ── DESKTOP: 3-panel row (hidden on mobile) ── */}
            <div
                className="hidden sm:flex items-center justify-center gap-4 px-14 md:px-16"
                style={{ minHeight: 'clamp(220px, 36vw, 420px)' }}
            >
                {/* LEFT — blurred side */}
                <div
                    className="flex-shrink-0 cursor-pointer rounded-xl overflow-hidden"
                    style={{
                        width: '20%', aspectRatio: '4/3',
                        filter: 'blur(3px) brightness(0.38)',
                        transform: 'scale(0.83)', opacity: 0.6,
                        transition: 'all 0.5s ease',
                    }}
                    onClick={goPrev}
                    aria-label="Previous image"
                >
                    <img src={SLIDER_IMAGES[leftIdx]} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>

                {/* CENTER — main with crossfade */}
                <div
                    className="relative flex-shrink-0 rounded-2xl overflow-hidden"
                    style={{
                        width: '58%', aspectRatio: '4/3',
                        boxShadow: '0 0 70px rgba(31,111,235,0.55), 0 0 120px rgba(93,63,211,0.22)',
                        border: '1px solid rgba(31,111,235,0.45)',
                        transition: 'box-shadow 0.4s ease',
                    }}
                >
                    <img
                        key={`bg-${displayed}`}
                        src={SLIDER_IMAGES[displayed]}
                        alt={`Impact ${displayed + 1}`}
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.32s ease-in-out' }}
                        loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none z-10" />
                    <div className="absolute inset-0 pointer-events-none z-10" style={{
                        background: 'radial-gradient(ellipse at top left, rgba(31,111,235,0.15), transparent 60%), radial-gradient(ellipse at bottom right, rgba(93,63,211,0.12), transparent 60%)'
                    }} />
                </div>

                {/* RIGHT — blurred side */}
                <div
                    className="flex-shrink-0 cursor-pointer rounded-xl overflow-hidden"
                    style={{
                        width: '20%', aspectRatio: '4/3',
                        filter: 'blur(3px) brightness(0.38)',
                        transform: 'scale(0.83)', opacity: 0.6,
                        transition: 'all 0.5s ease',
                    }}
                    onClick={goNext}
                    aria-label="Next image"
                >
                    <img src={SLIDER_IMAGES[rightIdx]} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
            </div>

            {/* ── Nav buttons ── */}
            <button
                onClick={goPrev}
                aria-label="Previous"
                className="absolute left-0 top-1/2 -translate-y-8 z-20 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-black/70 border border-white/25 text-white hover:bg-primary hover:border-primary hover:scale-110 active:scale-95 transition-all duration-200 backdrop-blur-sm shadow-lg"
            >
                <FaChevronLeft size="0.9em" />
            </button>
            <button
                onClick={goNext}
                aria-label="Next"
                className="absolute right-0 top-1/2 -translate-y-8 z-20 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-black/70 border border-white/25 text-white hover:bg-primary hover:border-primary hover:scale-110 active:scale-95 transition-all duration-200 backdrop-blur-sm shadow-lg"
            >
                <FaChevronRight size="0.9em" />
            </button>

            {/* ── Progress bar + dots ── */}
            <div className="flex flex-col items-center gap-2 mt-5">
                {/* Animated progress bar */}
                <div className="w-32 h-0.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                        style={{
                            width: `${((current + 1) / TOTAL) * 100}%`,
                            transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
                        }}
                    />
                </div>
                {/* Dots */}
                <div className="flex justify-center gap-1.5">
                    {SLIDER_IMAGES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            aria-label={`Slide ${i + 1}`}
                            className={clsx(
                                'rounded-full transition-all duration-300 border-0',
                                i === current
                                    ? 'w-5 h-1.5 bg-gradient-to-r from-primary to-accent'
                                    : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/50'
                            )}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
});
ImpactSlider.displayName = 'ImpactSlider';


// ─── Main Landing Page ──────────────────────────────────────────────────────
const ProfessionalLandingPage = () => {
    const containerRef = useRef(null);
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
    const [authOpen, setAuthOpen] = useState(false);

    const iconMap = {
        Instagram: <FaInstagram size="1.5em" />,
        YouTube:   <FaYoutube size="1.5em" />,
        LinkedIn:  <FaLinkedin size="1.5em" />,
        Twitter:   <FaXTwitter size="1.5em" />,
        Facebook:  <FaFacebook size="1.5em" />,
    };

    const obstacles = useMemo(() => [
        { icon: <FaMobileAlt />,    title: "Screen Overload",       description: "Hours lost in passive digital consumption." },
        { icon: <FaInfinity />,     title: "Mindless Scrolling",    description: "The endless feed trap stealing focus." },
        { icon: <FaMousePointer />, title: "Digital Distractions",  description: "Focus shattered in a hyper-connected world." },
        { icon: <FaStopCircle />,   title: "Passive Alternatives",  description: "Lack of truly engaging developmental tools." },
    ], []);

    useEffect(() => {
        const fn = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', fn, { passive: true });
        return () => window.removeEventListener('resize', fn);
    }, []);

    // ── Handlers ──────────────────────────────────────────────────────────
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    const handleTryChizel = useCallback(() => {
        if (user) {
            navigate('/day/1');
        } else {
            setAuthOpen(true);
        }
    }, [user, navigate]);
    const handleWaitlist     = useCallback(() => window.open(
        "https://docs.google.com/forms/d/1Hx5WA9eEEKGYv96UcotYh-t5ImBNvdO_WdD6IzftTD0/viewform?edit_requested=true",
        '_blank'
    ), []);
    const handleSocialClick  = useCallback((name) => console.log(`Social: ${name}`), []);

    // ── GSAP Animations ────────────────────────────────────────────────────
    useGSAP(() => {
        // Hero
        gsap.from(['.hero-line-1', '.hero-line-2'], {
            opacity: 0, y: 45,
            duration: 1.1, stagger: 0.22,
            ease: 'power3.out', delay: 0.35,
        });
        gsap.from('.hero-sub', {
            opacity: 0, y: 22,
            duration: 0.85, ease: 'power2.out', delay: 0.78,
        });
        gsap.from('.scroll-indicator', {
            opacity: 0, duration: 0.6, ease: 'power2.out', delay: 1.5,
        });

        // Scroll-triggered sections
        const sectionClasses = ['.section-2', '.section-3', '.section-4', '.section-5', '.section-socials'];
        sectionClasses.forEach(sel => {
            const els = gsap.utils.toArray(`${sel} .anim`);
            if (!els.length) return;
            gsap.from(els, {
                scrollTrigger: {
                    trigger: sel,
                    start: 'top 82%',
                    toggleActions: 'play none none reverse',
                    fastScrollEnd: true,
                },
                opacity: 0, y: 28,
                stagger: 0.09,
                duration: 0.65,
                ease: 'power2.out',
            });
        });

        // Social icon hover
        const icons = gsap.utils.toArray('.social-icon-link');
        icons.forEach((link) => {
            const wrapper = link.querySelector('.social-icon-wrapper');
            const span    = wrapper?.querySelector('span');
            const ping    = link.querySelector('.ping-effect');
            if (!wrapper || !span || !ping) return;
            const tl = gsap.timeline({ paused: true });
            tl.to(wrapper, { scale: 1.2, rotate: 10, backgroundColor: 'var(--color-primary)', borderColor: 'rgba(255,255,255,0.3)', boxShadow: '0 0 30px 5px rgba(31,111,235,0.5)', duration: 0.3, ease: 'power2.out' })
              .to(span,    { color: '#fff', scale: 1.1, duration: 0.3, ease: 'power2.out' }, 0)
              .fromTo(ping, { scale: 0.5, opacity: 0.8 }, { scale: 1.8, opacity: 0, duration: 0.4, ease: 'power1.out' }, 0);
            link.addEventListener('mouseenter', () => tl.play());
            link.addEventListener('mouseleave', () => tl.reverse());
        });

        return () => ScrollTrigger.getAll().forEach(t => t.kill());
    }, { scope: containerRef, dependencies: [isMobile] });

    return (
        <div ref={containerRef} className="professional-landing text-text relative z-10 flex-grow">

            {/* Single fixed bg — renders once behind all sections, no patchy seams */}
            <CosmicBg />

            {/* ══════════ SECTION 1 — HERO ══════════ */}
            <section className="section-1 relative min-h-screen flex flex-col items-center justify-center text-center px-5 py-24">
                <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto">
                    <h1 className="font-heading leading-tight">
                        <span className="hero-line-1 block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-text drop-shadow-[0_0_24px_rgba(31,111,235,0.4)]">
                            Tired of
                        </span>
                        <span className="hero-line-2 block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mt-1 animated-gradient-heading">
                            Doom Scrolling?
                        </span>
                    </h1>
                    <p className="hero-sub mt-5 text-secondary-text text-lg md:text-xl max-w-lg leading-relaxed">
                        Wondering how to break the loop?
                    </p>
                </div>

                <div className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30 pointer-events-none">
                    <div className="relative text-lg text-yellow-300">
                        <div className="absolute -inset-1 rounded-full bg-yellow-400 opacity-50 blur-md animate-pulse-glow" />
                        <FaRegLightbulb className="relative" />
                    </div>
                    <span className="font-ui text-sm text-secondary-text">Scroll Down</span>
                    <FaChevronDown className="text-secondary-text text-xs animate-bounce-slight" />
                </div>
            </section>

            {/* ══════════ SECTION 2 — OBSTACLES ══════════ */}
            <section className="section-2 relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-10 md:px-16 py-20 md:py-28">
                <div className="relative z-10 w-full max-w-5xl text-center">
                    <h2 className="anim font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-text mb-10 md:mb-14">
                        What&apos;s <span className="text-red-400">Holding</span> You Back?
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
                        {obstacles.map((o, i) => (
                            <ObstacleCard key={o.title} icon={o.icon} title={o.title} description={o.description} delay={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════ SECTION 3 — ONE-TIME SOLUTION ══════════ */}
            <section className="section-3 relative min-h-screen flex flex-col items-center justify-center text-center px-5 py-20">
                <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
                    <div className="anim mb-8">
                        <img
                            src="/images/logo.png"
                            alt="Chizel Logo"
                            className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 object-contain drop-shadow-[0_0_30px_rgba(31,111,235,0.65)] mx-auto"
                            loading="lazy"
                        />
                    </div>
                    <h2 className="anim font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text leading-tight drop-shadow-md mb-5">
                        One-time solution to your{' '}
                        <span className="animated-gradient-heading block sm:inline">doom scrolling.</span>
                    </h2>
                    <p className="anim text-secondary-text text-base md:text-lg max-w-md leading-relaxed">
                        Chizel transforms passive screen time into an active launchpad for brilliance and real-world skills — forever.
                    </p>
                </div>
            </section>

            {/* ══════════ SECTION 4 — OUR IMPACT ══════════ */}
            <section className="section-4 relative flex flex-col items-center justify-center py-20 md:py-28 px-5 text-center">
                <div className="relative z-10 w-full max-w-5xl">
                    <h3 className="anim font-heading text-4xl sm:text-5xl md:text-6xl mb-3 animated-gradient-heading drop-shadow-lg">
                        Our Impact
                    </h3>
                    <p className="anim text-secondary-text text-base md:text-lg max-w-xl mx-auto mb-10">
                        A glimpse into the vibrant, engaging world we&apos;re building.
                    </p>
                    <div className="anim w-full">
                        <ImpactSlider />
                    </div>
                </div>
            </section>

            {/* ══════════ SECTION — TRY CHIZEL FOR FREE ══════════ */}
            <section className="section-try relative flex flex-col items-center justify-center text-center px-5 py-20 md:py-28">
                <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
                    <h2 className="anim font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-text mb-4 drop-shadow-md leading-tight">
                        Try <span className="animated-gradient-heading">Chizel</span> for Free
                    </h2>
                    <p className="anim text-secondary-text text-base md:text-lg max-w-md mt-2 mb-8 leading-relaxed">
                        Start your journey — explore our brainrot cure and unlock your potential today.
                    </p>
                    <div className="anim relative group">
                        <div className="absolute -inset-1.5 bg-gradient-to-r from-primary via-accent to-primary rounded-full blur-lg opacity-50 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none animate-pulse-glow" />
                        <Button
                            title={user ? "RESUME PROGRESS" : "TRY CHIZEL FREE"}
                            onClick={handleTryChizel}
                            rightIcon={<FaArrowRight />}
                            containerClass="relative !text-base sm:!text-lg !py-4 !px-10 md:!px-12 !bg-gradient-to-r !from-primary !to-accent !font-bold hover:!shadow-[0_0_30px_rgba(31,111,235,0.6)] transition-shadow duration-300"
                        />
                    </div>
                </div>
            </section>

            {/* ══════════ SECTION 5 — READY TO IGNITE ══════════ */}
            <section className="section-5 relative flex flex-col items-center justify-center text-center px-5 py-20 md:py-28">
                <div className="relative z-10 w-full max-w-3xl">
                    <h2 className="anim font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-5 drop-shadow-md">
                        Ready to Ignite <span className="animated-gradient-heading">Potential?</span>
                    </h2>
                    <p className="anim text-secondary-text text-base md:text-lg leading-relaxed max-w-xl mx-auto">
                        Be among the first explorers. Join the Chizel waitlist today for exclusive early access, special launch rewards, and updates on our mission to reshape learning.
                    </p>
                </div>
            </section>

            {/* ══════════ SECTION — SOCIALS ══════════ */}
            <section className="section-socials relative flex flex-col items-center justify-center text-center px-5 pt-10 pb-24">
                <div className="relative z-10 w-full max-w-lg">
                    <h4 className="anim font-ui uppercase tracking-widest text-secondary-text mb-8">
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
                                <div className="social-icon-float">
                                    <div className="social-icon-wrapper w-14 h-14 sm:w-16 sm:h-16 relative flex-center bg-card/60 border-2 border-primary/20 rounded-full backdrop-blur-md transition-colors duration-300">
                                        <div className="ping-effect absolute inset-0 rounded-full border-2 border-primary opacity-0" />
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

            <style>{`
                /* ── Gradient heading ── */
                .animated-gradient-heading {
                    color: transparent;
                    background: linear-gradient(90deg, #1f6feb, #7c4dff, #ff9800, #1f6feb);
                    -webkit-background-clip: text;
                    background-clip: text;
                    background-size: 200% auto;
                    animation: gradientFlow 6s linear infinite;
                    font-weight: 800;
                    display: inline-block;
                }
                @keyframes gradientFlow {
                    0%   { background-position: 0% center; }
                    100% { background-position: 200% center; }
                }

                /* ── Cosmic bg animations ── */
                @keyframes cosmicPan {
                    0%   { transform: scale(1.05) translate(0%, 0%); }
                    25%  { transform: scale(1.06) translate(-1%, 0.5%); }
                    50%  { transform: scale(1.07) translate(-1.5%, -0.8%); }
                    75%  { transform: scale(1.06) translate(-0.5%, -1%); }
                    100% { transform: scale(1.05) translate(1%, 0.5%); }
                }
                @keyframes orbFloat1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33%      { transform: translate(3%, -4%) scale(1.06); }
                    66%      { transform: translate(-2%, 3%) scale(0.96); }
                }
                @keyframes orbFloat2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    40%      { transform: translate(-4%, 3%) scale(1.05); }
                    70%      { transform: translate(2%, -2%) scale(0.97); }
                }
                @keyframes orbFloat3 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50%      { transform: translate(3%, -5%) scale(1.08); }
                }
                @keyframes starTwinkle {
                    0%   { opacity: 0.15; transform: scale(0.85); }
                    100% { opacity: 0.9;  transform: scale(1.25); }
                }

                /* ── Bounce ── */
                @keyframes bounceSlight {
                    0%, 100% { transform: translateY(0); opacity: 0.7; }
                    50%       { transform: translateY(5px); opacity: 1; }
                }
                .animate-bounce-slight { animation: bounceSlight 2s infinite ease-in-out; }

                /* ── Pulse glow ── */
                @keyframes pulseGlow {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50%       { opacity: 0.75; transform: scale(1.02); }
                }
                .animate-pulse-glow { animation: pulseGlow 2s cubic-bezier(0.4,0,0.6,1) infinite; }

                /* ── Social icons float ── */
                @keyframes gentleFloat {
                    0%, 100% { transform: translateY(0); }
                    50%       { transform: translateY(-6px); }
                }
                .social-icon-float { animation: gentleFloat 4s infinite ease-in-out; will-change: transform; }
                .social-icon-link:nth-child(2) .social-icon-float { animation-delay: 0.3s; }
                .social-icon-link:nth-child(3) .social-icon-float { animation-delay: 0.6s; }
                .social-icon-link:nth-child(4) .social-icon-float { animation-delay: 0.9s; }
                .social-icon-link:nth-child(5) .social-icon-float { animation-delay: 1.2s; }

                /* ── Slider transition ── */
                .duration-400 { transition-duration: 400ms; }

                /* ── Mobile: reduce min-height, improve readability ── */
                @media (max-width: 639px) {
                    .section-1, .section-2, .section-3 { min-height: 100svh; }
                    .section-4, .section-try, .section-5 { min-height: auto; }
                }

                /* ── Consistent bg across sections ── */
                .professional-landing section { position: relative; width: 100%; overflow: hidden; }
            `}</style>

            {/* Auth Modal */}
            <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
        </div>
    );
};

export default ProfessionalLandingPage;