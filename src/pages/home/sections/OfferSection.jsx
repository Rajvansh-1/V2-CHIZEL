import { offers } from "@utils/constants";
import { FaChild, FaUserFriends, FaChartLine } from 'react-icons/fa';

const iconMap = {
  kids: <FaChild className="text-4xl text-text" />,
  parents: <FaUserFriends className="text-4xl text-text" />,
  investors: <FaChartLine className="text-4xl text-text" />,
};

const OfferCard = ({ icon, title, description, bgGradient, iconGradient, hoverShadow }) => {
    const cardClasses = `
      group relative overflow-hidden rounded-2xl bg-gradient-to-br ${bgGradient} 
      border border-white/20 p-8 transition-all duration-500 hover:scale-105 ${hoverShadow}
    `;
  
    const iconContainerClasses = `
      inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br 
      ${iconGradient} mb-6 group-hover:scale-110 transition-transform duration-300
    `;
  
    return (
      <div className={cardClasses.trim()}>
        <div className="relative z-10 text-center">
          <div className={iconContainerClasses.trim()}>
            {icon}
          </div>
          <h3 className="font-heading text-2xl md:text-3xl text-text mb-4">
            {title}
          </h3>
          <p className="font-body text-secondary-text mb-6 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    );
  };

const OfferSection = () => {
  return (
    <section id="what-we-offer" className="w-full bg-background py-20 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-text">
            What We Offer
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <OfferCard
              key={offer.title}
              icon={iconMap[offer.icon]}
              title={offer.title}
              description={offer.description}
              bgGradient={offer.bgGradient}
              iconGradient={offer.iconGradient}
              hoverShadow={offer.hoverShadow}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OfferSection;