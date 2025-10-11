// src/components/professional/ImpactSection.jsx
import LogoMarquee from "@/components/common/LogoMarquee";

const ImpactSection = () => {
  const portfolioImages = [
    "/images/slider/i1.jpg", "/images/slider/i2.jpg", "/images/slider/i3.jpg",
    "/images/slider/i4.jpg", "/images/slider/i5.jpg", "/images/slider/i7.png",
    "/images/slider/i8.png",
  ];

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6 text-center mb-12">
        <h2 className="font-heading text-4xl md:text-6xl font-bold text-text">Our Impact in Pixels</h2>
        <p className="mt-4 text-lg text-secondary-text max-w-3xl mx-auto">A glimpse into the vibrant, engaging world we're building for the next generation of learners and creators.</p>
      </div>
      <div className="flex flex-col gap-6">
        <LogoMarquee images={portfolioImages} speed={25} direction="left" />
        <LogoMarquee images={[...portfolioImages].reverse()} speed={25} direction="right" />
      </div>
    </section>
  );
};

export default ImpactSection;