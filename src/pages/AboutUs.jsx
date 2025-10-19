// src/pages/AboutUs.jsx
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaLinkedin, FaEnvelope, FaWhatsapp, FaQuoteLeft, FaShieldAlt, FaBrain, FaRocket } from 'react-icons/fa';
import Button from '@/components/ui/Button';
import LogoMarquee from '@/components/common/LogoMarquee';

gsap.registerPlugin(ScrollTrigger);

const AboutUsPage = () => {
  const containerRef = useRef(null);

  const founders = [
    { name: "Shamiq Khan", imageUrl: "/images/f1.png", title: "The Visionary Architect", socials: [ { name: 'LinkedIn', url: 'https://www.linkedin.com/in/shamiqkhan/', icon: <FaLinkedin /> }, { name: 'WhatsApp', url: 'https://wa.me/918955986358', icon: <FaWhatsapp /> }, { name: 'Email', url: 'mailto:shamiqkhan4@gmail.com', icon: <FaEnvelope /> } ] },
    { name: "Rajvansh", imageUrl: "/images/f2.jpg", title: "The Master Builder", socials: [ { name: 'LinkedIn', url: 'https://www.linkedin.com/in/rajvansh-25abcdee/', icon: <FaLinkedin /> }, { name: 'WhatsApp', url: 'https://wa.me/917426810155', icon: <FaWhatsapp /> }, { name: 'Email', url: 'mailto:rajvansh2525@gmail.com', icon: <FaEnvelope /> } ] },
  ];
  
  const portfolioImages = [
    "/images/slider/i1.jpg",
    "/images/slider/i2.jpg",
    "/images/slider/i3.jpg",
    "/images/slider/i4.jpg",
    "/images/slider/i5.jpg",
    "public/images/slider/i10.png",
    // "/images/slider/i6.png",
    
    "/images/slider/i8.png",
    "public/images/slider/i9.png",
    "/images/slider/i7.png",
    "public/images/slider/i11.png"



  ];

  useGSAP(() => {
    gsap.utils.toArray('.animate-section').forEach(section => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 50,
        duration: 1.2,
        ease: 'power3.out',
      });
    });

    const cards = gsap.utils.toArray('.founder-spotlight-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        gsap.to(card, {
          '--mouse-x': `${x}px`,
          '--mouse-y': `${y}px`,
          '--spotlight-opacity': '1',
          duration: 0.4,
          ease: 'power2.out',
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          '--spotlight-opacity': '0',
          duration: 0.5,
          ease: 'power3.out',
        });
      });
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="about-us-v4-container">
      <div className="v4-content-wrapper animate-section">
        <div className="v4-header">
          <h1 className="v4-title">Meet the Minds Behind the Mission</h1>
          <p className="v4-subtitle">
            We are two founders obsessed with a single, powerful question: What if every second a child spends on a screen could be a step toward their greatness?
          </p>
        </div>
      </div>

      <div className="v4-content-wrapper animate-section">
        <div className="v4-founders-grid">
          {founders.map((founder) => (
            <div key={founder.name} className="founder-spotlight-card">
              <div className="card-content">
                <img src={founder.imageUrl} alt={founder.name} className="founder-img" />
                <h2 className="founder-name">{founder.name}</h2>
                <p className="founder-title">{founder.title}</p>
                <div className="founder-socials">
                  {founder.socials.map((social) => (
                    <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer">
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="v4-impact animate-section">
        <div className="v4-content-wrapper">
            <h2 className="section-title">Our Impact in Pixels</h2>
            <p className="v4-subtitle">A glimpse into the vibrant, engaging world we're building for the next generation of learners and creators.</p>
        </div>
        <div className="flex flex-col gap-6 mt-12">
            <LogoMarquee images={portfolioImages} speed={18} direction="left" />
            <LogoMarquee images={portfolioImages} speed={18} direction="right" />
        </div>
      </div>

      <div className="v4-content-wrapper animate-section">
        <div className="v4-mission-quote">
          <FaQuoteLeft className="quote-icon" />
          <blockquote>“We Are Not Building A Company We're Building Generations”</blockquote>
          <cite>- The Chizel Founders</cite>
        </div>
      </div>
      
      <div className="v4-content-wrapper animate-section">
        <div className="v4-philosophy">
          <h2 className="section-title">Our Core Philosophy</h2>
          <div className="philosophy-grid">
              <div className="philosophy-item">
                <FaShieldAlt className="philosophy-icon" />
                <h3>Safety is Non-Negotiable</h3>
                <p>In the vast digital universe, we are your child’s fortress. Every corner of Chizel is a sanctuary built on absolute safety.</p>
              </div>
              <div className="philosophy-item">
                <FaBrain className="philosophy-icon" />
                <h3>Play with a Purpose</h3>
                <p>We reject mindless entertainment. Every game is meticulously designed to ignite curiosity and build real-world skills.</p>
              </div>
              <div className="philosophy-item">
                <FaRocket className="philosophy-icon" />
                <h3>Forging Future Architects</h3>
                <p>We are not preparing children for yesterday's tests; we are arming them for tomorrow's challenges.</p>
              </div>
          </div>
        </div>
      </div>

      <div className="v4-content-wrapper animate-section">
        <div className="v4-cta">
          <h2 className="section-title">The Mission Awaits. Will You Join Us?</h2>
          <p>The journey to redefine learning is vast. Whether you're a parent seeking a better digital future or an investor who shares our passion—you are a vital part of this mission.</p>
          <Button
              title="Join the Waitlist & Start the Journey"
              onClick={() => window.open("https://docs.google.com/forms/d/1Hx5WA9eEEKGYv96UcotYh-t5ImBNvdO_WdD6IzftTD0/viewform?edit_requested=true", "_blank")}
              containerClass="!text-lg !py-4 !px-8 mx-auto mt-8"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;