import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaLinkedin, FaEnvelope, FaWhatsapp, FaQuoteLeft, FaShieldAlt, FaBrain, FaRocket } from 'react-icons/fa';
import Button from '@/components/ui/Button';


gsap.registerPlugin(Flip, ScrollTrigger);

// --- Ultra-Attractive Founder Card Component ---
const FounderCard = ({ founder, isActive, onInteraction }) => {
  const cardRef = useRef(null);

  useGSAP(() => {
    const card = cardRef.current;
    if (!card) return;

    const state = Flip.getState(card, { props: "borderRadius" });
    card.classList.toggle('is-expanded', isActive);
    
    Flip.from(state, {
      duration: 0.7,
      ease: 'power3.inOut',
      absolute: true,
    });
  }, { dependencies: [isActive] });

  return (
    <div className="relative flex h-[550px] w-full items-center justify-center">
      <div
        ref={cardRef}
        className="founder-card absolute flex h-56 w-56 cursor-pointer items-center justify-center rounded-full border-2 border-primary/30 bg-card p-2 backdrop-blur-md"
        onMouseEnter={() => onInteraction(true)}
        onMouseLeave={() => onInteraction(false)}
        onClick={() => onInteraction()}
      >
        <div className="relative h-full w-full overflow-hidden rounded-full">
          <img src={founder.imageUrl} alt={founder.name} className="absolute inset-0 h-full w-full object-cover scale-105" />
          <div className="card-content absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 text-center opacity-0">
            <h3 className="font-heading text-4xl font-bold text-text">{founder.name}</h3>
            <p className="font-ui text-lg font-semibold uppercase tracking-wider text-primary">Founder</p>
            <div className="mt-5 flex items-center gap-6">
              {founder.socials.map((social) => (
                <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="social-icon text-3xl text-secondary-text transition-colors duration-300 hover:text-primary">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main About Us Page Component ---
const AboutUsPage = () => {
  const containerRef = useRef(null);
  const [activeCard, setActiveCard] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const founders = [
    { name: "Shamiq Khan", imageUrl: "/images/f1.png", socials: [ { name: 'LinkedIn', url: 'https://www.linkedin.com/in/shamiqkhan/', icon: <FaLinkedin /> }, { name: 'WhatsApp', url: 'https://wa.me/918955986358', icon: <FaWhatsapp /> }, { name: 'Email', url: 'mailto:shamiqkhan4@gmail.com', icon: <FaEnvelope /> } ] },
    { name: "Rajvansh", imageUrl: "/images/f2.jpg", socials: [ { name: 'LinkedIn', url: 'https://www.linkedin.com/in/rajvansh-25abcdee/', icon: <FaLinkedin /> }, { name: 'WhatsApp', url: 'https://wa.me/917426810155', icon: <FaWhatsapp /> }, { name: 'Email', url: 'mailto:rajvansh2525@gmail.com', icon: <FaEnvelope /> } ] },
  ];

  const handleInteraction = (index, isHovering) => {
    if (isMobile) {
      if (typeof isHovering !== 'boolean') { // Ensure it's a click
        setActiveCard(activeCard === index ? null : index);
      }
    } else {
      setActiveCard(isHovering ? index : null);
    }
  };
  
  useGSAP(() => {
    gsap.from(".animate-in", {
      scrollTrigger: { trigger: containerRef.current, start: "top 80%", toggleActions: "play none none reverse" },
      opacity: 0,
      y: -40,
      duration: 1.2,
      stagger: 0.2,
      ease: 'power3.out'
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative min-h-screen w-full overflow-hidden bg-background py-24 text-text">
      <div className="container relative z-10 mx-auto max-w-5xl px-4 sm:px-8 space-y-28 md:space-y-32">
        <header className="text-center">
          <h1 className="animate-in font-heading text-4xl sm:text-6xl font-bold animated-gradient-heading">
            Meet the Minds Behind the Mission
          </h1>
          <p className="animate-in mt-4 text-lg text-secondary-text max-w-3xl mx-auto">
            Our mission began with a single, powerful question: What if every second a child spends on a screen could be a step toward their greatness? We are two founders obsessed with building the answer.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            {founders.map((founder, index) => (
                <FounderCard
                    key={founder.name}
                    founder={founder}
                    isActive={activeCard === index}
                    onInteraction={(isHovering) => handleInteraction(index, isHovering)}
                />
            ))}
        </section>
        
        <section className="animate-in relative text-center max-w-3xl mx-auto">
          <FaQuoteLeft className="absolute -top-8 left-1/2 -translate-x-1/2 text-5xl text-primary/20" />
          <blockquote className="font-heading text-3xl md:text-4xl text-text leading-tight">
            “We Are Not Building A Company We're Building Generations”
          </blockquote>
          <cite className="mt-4 block font-body text-xl text-primary">- The Chizel Founders</cite>
        </section>

        <section className="animate-in text-center">
          <h2 className="font-heading text-4xl text-text mb-12">Our Core Philosophy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <FaShieldAlt className="mx-auto text-5xl text-primary" />
              <h3 className="font-heading text-2xl font-bold">Safety is Non-Negotiable</h3>
              <p className="text-secondary-text">In an overwhelming digital world of endless distractions and unseen dangers, your child deserves a sanctuary—a digital fortress where safety is not an afterthought, but our unbreakable promise.
Every line of code, every pixel, every interaction is forged with one purpose: to protect your child’s innocence and curiosity.
With privacy-first architecture and zero tolerance for risk, we’re the vigilant guardians while they explore, play, and grow.</p>
            </div>
            <div className="space-y-4">
              <FaBrain className="mx-auto text-5xl text-primary" />
              <h3 className="font-heading text-2xl font-bold">Play with a Purpose</h3>
              <p className="text-secondary-text">We don’t do “mindless entertainment.”
Each game, challenge, and puzzle is a carefully crafted opportunity to awaken wonder, sharpen critical thinking, and nurture real-world skills.
This is not screen time—it is skill time.
Here, every click, tap, and swipe is a step toward making your child smarter, more curious, and incredibly capable of solving tomorrow’s problems.</p>
            </div>
            <div className="space-y-4">
              <FaRocket className="mx-auto text-5xl text-primary" />
              <h3 className="font-heading text-2xl font-bold">Forging Future Architects</h3>
              <p className="text-secondary-text">Your child is not meant to follow yesterday’s footsteps.
We are shaping a generation that doesn’t just consume technology, but invents it.
Through bold innovation, relentless creativity, and unyielding passion, we cultivate thinkers, creators, communicators, and collaborators—ready to lead the world.
Because raising a child is not just parenting.
It is a mission to forge the architects of the future..</p>
            </div>
          </div>
        </section>

        <section className="animate-in text-center">
          <h2 className="font-heading text-4xl text-text mb-4">The Mission Awaits. Will You Join Us?</h2>
          <p className="text-secondary-text text-lg max-w-3xl mx-auto mb-8">
            The journey to redefine learning is vast, and we cannot walk it alone. Whether you are a parent seeking a better digital future for your child or an investor who shares our fiery passion—you are a vital part of this mission.
          </p>
          <Button
            title="Join the Waitlist & Start the Journey"
            onClick={() => window.open("https://docs.google.com/forms/d/1Hx5WA9eEEKGYv96UcotYh-t5ImBNvdO_WdD6IzftTD0/viewform?edit_requested=true", "_blank")}
            containerClass="!text-lg !py-4 !px-8 mx-auto"
          />
        </section>

      </div>
      
      <style jsx global>{`
        .founder-card.is-expanded {
          width: 24rem; /* 384px */
          height: 32rem; /* 512px */
          border-radius: 1.5rem; /* rounded-3xl */
          cursor: default;
        }
        .founder-card.is-expanded .card-content {
          opacity: 1;
          transition: opacity 0.5s 0.2s ease-in;
        }
        .grid:has(.is-expanded) .founder-card:not(.is-expanded) {
          filter: blur(4px) saturate(0.8);
          transform: scale(0.95);
        }
        @media (max-width: 768px) {
          .grid {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2rem;
          }
          .founder-card {
            position: relative;
          }
           .founder-card.is-expanded {
            height: 28rem;
            width: 90vw;
            max-width: 22rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutUsPage;