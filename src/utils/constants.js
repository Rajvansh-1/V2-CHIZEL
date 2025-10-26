// src/utils/constants.js

// data for AboutSection
export const holoDecks = [
  {
    id: "kids",
    title: "A Universe of Play",
    subtitle: "For Kids",
    description: "Fun games that make learning exciting, an AI buddy that builds confidence, and a community to explore, learn, and connect — helping them grow in every aspect of life from the very beginning.",
    icon: "FaChild",
    image: "/images/about-image.webp",
    alt: "Kids creating in Chizel",
    themeColor: "var(--color-primary)",
  },
  {
    id: "parents",
    title: "A Journey to Witness",
    subtitle: "For Parents",
    description: "Peace of mind knowing your child is learning while having fun. Watch their interests grow, support their journey, and turn screen time into skill time",
    icon: "FaUsers",
    image: "/images/vision-image.webp",
    alt: "Parents witnessing growth",
    themeColor: "var(--color-accent)",
  },
  {
    id: "investors",
    title: "A Future to Build",
    subtitle: "For Investors",
    description: "Be part of transforming lives with Chizel. This is your chance to be an early supporter of something set for massive growth — blink now, and you might miss us`.",
    icon: "FaChartLine",
    image: "/images/ecosystem-image.webp",
    alt: "The future of Chizel expanding",
    themeColor: "var(--color-badge-bg)",
  },
];

export const navItems = [
    { name: "Home", href: "#home" },
    { name: "Problem", href: "#problem" },
    { name: "Chizelverse", href: "#chizelverse-cards" },
    { name: "About", href: "/about-us" },
    { name: "Ecosystem", href: "#chizel-ecosystem" },
    { name: "Chizel App", href: "#chizel-app" },
    { name: "Chizel Web", href: "/chizel-web" },
    { name: "Contact", href: "#contact" },
  ];

export const principles = [
  {
    title: "From Screen Waste to Smart Play",
    description:
      "Ditch violent games and junk videos — kids get the same fun while sharpening creativity and problem-solving skills.",
  },
  {
    title: "From Shy to Social Star",
    description:
      "From speaking up to making friends, our AI chatbot helps kids build social skills and shine anywhere — no boring lessons here.",
  },
  {
    title: "From Isolated to Inspired",
    description:
      "Find buddies, build dreams, spark ideas — all in a safe, vibrant community where children can thrive.",
  },
];

export const featuresData = [
  {
    title: "Word Warriors",
    description:
      "Instead of wasting hours on mindless scrolling and toxic online chatter, Word Warriors helps children build strong social skills, improve speaking abilities, sharpen people skills, and grow into confident communicators from a very young age — all through engaging, language-based challenges.",
    quote: "The art of communication is the language of leadership.",
    author: "James Humes",
    assetSrc: "/videos/word-warrior.mp4", // CORRECTED PATH
  },
  {
    title: "Logic League",
    description:
      "Instead of consuming garbage content on social media and violence from games, Logic League gives kids the same thrill and excitement — while boosting their thinking skills, focus, and creativity through fun, brain-challenging adventures.",
    quote:
      "It’s not that I’m so smart, it’s just that I stay with problems longer.",
    author: "Albert Einstein",
    assetSrc: "/videos/logic-league.mp4", // CORRECTED PATH
  },
  {
    title: "Chizel Club",
    description:
      "Chizel Club is a lively space where children can learn, grow, and share their ideas with others. Through group projects, creative collaborations, and skill-sharing activities, they not only develop knowledge but also build friendships, confidence, and a sense of belonging—all within a safe and vibrant community.",
    quote: "Alone we can do so little; together we can do so much.",
    author: "Helen Keller",
    assetSrc: "/videos/chizel-club.mp4", // CORRECTED PATH
  },
];

export const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/chizel_official?utm_source=qr&igsh=MXkxdDR6Nzg1cnl4YQ==",
  },
  { name: "YouTube", href: "https://www.youtube.com/@chizelofficial" },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/chizelofficial/?viewAsMember=true",
  },
  { 
    name: "Twitter", href: "https://x.com/Chizel_Official"
   },
];

export const problemSlides = [
  {
    badge: "🧠 Mind Theft",
    title: "Screens Are Stealing Childhood",
    description:
      "It feels like play, but every moment online steals tomorrow — second by second, dream by dream.",
    gradient: "from-red-700/50 via-orange-600/50 to-yellow-500/50",
    assetSrc: "/videos/brain_hijack.mp4", // CORRECTED PATH
  },
  {
    badge: "🚨 Gateway to Harm",
    title: "The Dark Side of Screens",
    description:
      "The internet hides dangers no child should face. Predators, violence, and toxic content are twisting childhood into something darker.",
    gradient: "from-red-900/70 via-red-700/60 to-orange-600/60",
    assetSrc: "/videos/gateway-to-harm.mp4", // CORRECTED PATH
  },
];




export const chizelAppData = {
  header: {
    comingSoonText: "Coming Soon",
    title: "The Chizel App",
    subtitle:
      "A revolutionary space adventure that transforms learning into an exciting journey. Smart play, real skills, zero junk content.",
  },
  mainContent: {
    leftPanel: {
      title: "Launching",
      highlight: "Soon",
      description:
        "Join the first wave of pioneers in smart play. Our app combines cutting-edge AI technology with proven educational methods to create an experience that's both fun and transformative.",
      platformBadges: [
        {
          iconName: "MdPhoneIphone",
          text: "iOS",
          colorClasses: "border-primary/40 bg-primary/15 text-primary",
        },
        {
          iconName: "FaMobile",
          text: "Android",
          colorClasses: "border-accent/40 bg-accent/15 text-accent",
        },

      ],
      specialFeatures: {
        title: "What Makes Us Special",
        features: [
          {
            iconName: "FaBrain",
            title: "AI-Powered Learning",
            description: "Adaptive difficulty and personalized challenges",
          },
          {
            iconName: "FaUsers",
            title: "Progress Tracking",
            description: "Monitor development with detailed insights",
          },
        ],
      },
    },
  },
  revolutionSection: {
    title: "Join the Revolution",
    subtitle:
      "Be among the first to experience the future of educational gaming. Reserve your spot and get exclusive early access benefits.",
    features: [
      {
        iconName: "FaRocket",
        title: "Early Access",
        subtitle: "First to Experience",
      },
      {
        iconName: "FaCheckCircle",
        title: "Smart Play",
        subtitle: "AI Powered",
      },
      {
        iconName: "MdPhoneIphone",
        title: "Mobile Ready",
        subtitle: "iOS & Android",
      },
    ],
  },
};

export const offers = [
  {
    icon: "kids",
    title: "For Kids",
    description: "Fun games that make learning exciting, an AI buddy that builds confidence, and a community to explore, learn, and connect — helping them grow in every aspect of life from the very beginning.",
    bgGradient: "from-primary/20 via-accent/15 to-badge-bg/10",
    iconGradient: "from-primary to-accent",
    hoverShadow: "hover:shadow-[0_0_40px_rgba(31,111,235,0.3)]",
  },
  {
    icon: "parents",
    title: "For Parents",
    description: "Peace of mind knowing your child is learning while having fun. Watch their interests grow, support their journey, and turn screen time into skill time",
    bgGradient: "from-accent/20 via-primary/15 to-badge-bg/10",
    iconGradient: "from-accent to-primary",
    hoverShadow: "hover:shadow-[0_0_40px_rgba(93,63,211,0.3)]",
  },
  {
    icon: "investors",
    title: "For Investors",
    description: `Be part of transforming lives with Chizel. This is your chance to be an early supporter of something set for massive growth — blink now, and you might miss us`,
    bgGradient: "from-badge-bg/20 via-primary/15 to-accent/10",
    iconGradient: "from-badge-bg to-primary",
    hoverShadow: "hover:shadow-[0_0_40px_rgba(255,179,71,0.3)]",
  },
];

export const solutionCards = [
  {
    emoji: "🎮",
    title: "Ignite Genius",
    description: "Gaming that evolves with your child, turning challenges into triumphs.",
  },
  {
    emoji: "💬",
    title: "Unlock Confidence",
    description: "An AI co-pilot for social navigation, helping kids connect and lead.",
  },
  {
    emoji: "🤝",
    title: "Build a Universe",
    description: "A safe harbor for collaboration, where friendships and ideas take flight.",
  },
  {
    emoji: "🛡️",
    title: "Mission Control for Parents",
    description: "Peace of mind, knowing every moment is a step toward growth.",
  },
];

export const chizelverseCards = [
  {
    title: "The Learning Core",
    description: "At the heart of the Chizelverse, the Learning Core adapts to each child's unique journey, offering personalized challenges that make education an adventure.",
    image: "/images/vision-image.webp",
  },
  {
    title: "Creativity Nebula",
    description: "A vibrant space where ideas collide and imagination takes flight. Here, children collaborate on projects, build worlds, and express themselves freely.",
    image: "/images/about-image.webp",
  },
  {
    title: "Social Sphere",
    description: "Connect with fellow explorers in a safe and moderated environment. The Social Sphere is where friendships are forged and communication skills are honed.",
    image: "/images/ecosystem-image.webp",
  },
];

export const chizelverseInfo = [
  {
    icon: 'gamepad',
    title: 'Clubs, Games, Friends – Let’s Go!',
    points: [
      'Join Clubs, Discover New Hobbies',
      'Make Friends, Play, and Collaborate anywhere',
      'Learn New Skills, Create, Spark Ideas',
      'Share Your Creations in a Safe Space'
    ]
  },
  {
    icon: 'users',
    title: 'Family Bonding, Activities, and Memories Await',
    points: [
      'Discover workshops, activities, and events',
      'Connect with a vast, creative parent community',
      'Enjoy safe, verified clubs and spaces',
      'Bond through activities and achievement'
    ]
  },
];