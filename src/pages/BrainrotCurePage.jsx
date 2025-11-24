// src/pages/BrainrotCurePage.jsx
import { useRef, useState, memo, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import { 
  FaHome, FaBrain, FaExternalLinkAlt, FaCheckCircle, 
  FaLightbulb, FaShieldAlt, FaHourglassHalf, FaQuoteLeft, 
  FaArrowRight, FaRedo, FaMobileAlt, FaWalking, FaGamepad
} from 'react-icons/fa';
import { trackEvent } from "@/utils/analytics";
import BentoTilt from "@/components/common/BentoTilt"; // Importing your existing component

// --- 1. DATA CONSTANTS ---

const QUIZ_QUESTIONS = [
  "Do you check your phone within 15 minutes of waking up?",
  "Do you get distracted before reading even 2–3 pages of a book?",
  "Do you lose track of time while watching Reels or Shorts?",
  "Do you check your phone in the middle of a real-life conversation?",
  "Do you start one task but jump to another without finishing the first?",
  "Do you often forget simple things or why you walked into a room?",
  "Do you unlock your phone without any specific reason?",
  "Do you find it boring to finish long videos (10m+), podcasts, or lectures?",
  "Do you need background music or noise just to focus on work?",
  "Do you feel your attention span is significantly shorter than a year ago?",
];

const RESULTS_DATA = {
  low: {
    title: "CYBER-MONK STATUS",
    color: "text-emerald-400",
    gradient: "from-emerald-500 to-teal-500",
    description: "Your mind is a fortress. You control the tech; it doesn't control you. However, staying vigilant is key. Use the guide below to maintain your mental clarity.",
    emoji: "🛡️"
  },
  medium: {
    title: "MILD BRAINROT DETECTED",
    color: "text-yellow-400",
    gradient: "from-yellow-500 to-orange-500",
    description: "The rot has started to set in. You're slipping into the dopamine loop, but you haven't lost control yet. Now is the perfect time to rewire before it gets worse.",
    emoji: "⚠️"
  },
  high: {
    title: "CRITICAL SYSTEM FAILURE",
    color: "text-red-500",
    gradient: "from-red-600 to-rose-600",
    description: "Your attention span is shattered. The algorithm has hijacked your dopamine receptors. Immediate, dedicated detox is required to reclaim your brain.",
    emoji: "🚨"
  }
};

const CURE_STEPS = [
  {
    step: "01",
    title: "Admit the Problem",
    icon: <FaQuoteLeft />,
    content: "Your brain is constantly craving quick hits of dopamine. Opening your phone again and again isn’t normal. Accepting this is a biological addiction is the first step to breaking the loop.",
    accent: "border-red-500/50 text-red-400",
    bg: "bg-red-500/5",
  },
  {
    step: "02",
    title: "Train Your Focus",
    icon: <FaBrain />,
    content: "Progressive Overload for your mind. Read for 10 minutes today, 15 tomorrow. Keep your phone in another room. This physically rebuilds neural pathways for attention.",
    accent: "border-orange-500/50 text-orange-400",
    bg: "bg-orange-500/5",
  },
  {
    step: "03",
    title: "Environment Design",
    icon: <FaShieldAlt />,
    content: "If you see it, you will check it. Keep your phone completely out of sight while working. Create a 'monk mode' space that supports deep work, not distraction.",
    accent: "border-yellow-500/50 text-yellow-400",
    bg: "bg-yellow-500/5",
  },
  {
    step: "04",
    title: "Morning Protocol",
    icon: <FaLightbulb />,
    content: "Viewing Reels in the morning fries your dopamine receptors for the whole day. Choose calm habits: hydrate, stretch, or simply stare out a window for 5 minutes.",
    accent: "border-cyan-500/50 text-cyan-400",
    bg: "bg-cyan-500/5",
  },
  {
    step: "05",
    title: "Dopamine Fast",
    icon: <FaHourglassHalf />,
    content: "Spend 1 hour a day with ZERO input. No music, no podcasts, no screens. Just you and your thoughts. This 'boredom' is where creativity and mental clarity are born.",
    accent: "border-indigo-500/50 text-indigo-400",
    bg: "bg-indigo-500/5",
  },
  {
    step: "06",
    title: "Mindful Consumption",
    icon: <FaCheckCircle />,
    content: "Before unlocking, ask: 'Do I need to do a specific task?' If the answer is 'No' or 'I don't know', put it back down immediately. Break the twitch.",
    accent: "border-purple-500/50 text-purple-400",
    bg: "bg-purple-500/5",
  },
];

const REWIRE_STEPS = [
  { 
    emoji: "📱", 
    title: "Grayscale Mode", 
    content: "Go to Settings and turn your phone Black & White. Without color, the brain releases significantly less dopamine. It makes Instagram look boring instantly." 
  },
  { 
    emoji: "🧘", 
    title: "3-Senses Reset", 
    content: "Feeling an urge to scroll? Stop. Name 3 things you see, 3 you hear, and 3 you can physically feel. Grounds you instantly." 
  },
  { 
    emoji: "✍️", 
    title: "Nightly '3 Wins'", 
    content: "Before bed, write down 1 thing you learned, 1 thing you enjoyed, and 1 thing you achieved. Rewires brain for satisfaction, not consumption." 
  },
  { 
    emoji: "🔺", 
    title: "Shape Search", 
    content: "Look around the room and find 3 triangles or 3 circles. A simple pattern-recognition task to snap your brain out of 'zombie mode'." 
  },
  { 
    emoji: "🎨", 
    title: "Color Challenge", 
    content: "Pick a color. Find 5 real objects in that color around you. Force your eyes to scan the real world instead of a screen." 
  },
  { 
    emoji: "🌍", 
    title: "Explorer Day", 
    content: "Once a week, go somewhere new without headphones. Listen to the world. Take photos of real life, but don't post them." 
  },
  { 
    emoji: "⚔️", 
    title: "Challenge Master", 
    content: "Do 1 'hard' quest weekly: help at home, build something, or try a new hobby for 15 mins. Reward yourself only after completion." 
  },
];

// --- 2. SUB-COMPONENTS ---

const ProgressBar = ({ current, total }) => {
  const progress = ((current + 1) / total) * 100;
  return (
    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-8">
      <div 
        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

const QuizCard = ({ question, index, total, onAnswer }) => {
  const cardRef = useRef(null);

  // Animate entry
  useGSAP(() => {
    gsap.fromTo(cardRef.current, 
      { opacity: 0, x: 50, scale: 0.95 },
      { opacity: 1, x: 0, scale: 1, duration: 0.4, ease: "back.out(1.5)" }
    );
  }, [index]);

  return (
    <div ref={cardRef} className="w-full max-w-2xl mx-auto bg-card/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
      <div className="flex justify-between items-center mb-6 text-secondary-text font-ui text-sm tracking-widest uppercase">
        <span>Question {index + 1}</span>
        <span>{total} Total</span>
      </div>
      
      <h2 className="font-heading text-2xl md:text-4xl font-bold text-text mb-12 leading-tight min-h-[120px] flex items-center justify-center">
        {question}
      </h2>

      <div className="grid grid-cols-2 gap-6">
        <button 
          onClick={() => onAnswer(1)}
          className="group relative h-20 md:h-24 rounded-2xl border-2 border-red-500/30 bg-red-500/10 hover:bg-red-500 hover:border-red-500 transition-all duration-300 active:scale-95"
        >
          <span className="font-heading text-2xl md:text-3xl font-bold text-red-200 group-hover:text-white">YES</span>
        </button>
        
        <button 
          onClick={() => onAnswer(0)}
          className="group relative h-20 md:h-24 rounded-2xl border-2 border-green-500/30 bg-green-500/10 hover:bg-green-500 hover:border-green-500 transition-all duration-300 active:scale-95"
        >
          <span className="font-heading text-2xl md:text-3xl font-bold text-green-200 group-hover:text-white">NO</span>
        </button>
      </div>
    </div>
  );
};

const ResultHeader = ({ score, resultData, onRetake }) => {
  return (
    <div className="text-center space-y-6 animate-fade-in mb-20">
      <div className="inline-block text-8xl md:text-9xl mb-4 drop-shadow-2xl filter animate-float">
        {resultData.emoji}
      </div>
      
      <div className="space-y-2">
        <h3 className="font-ui text-secondary-text uppercase tracking-[0.3em] text-sm md:text-base">Diagnosis Complete</h3>
        <h1 className={`font-heading text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r ${resultData.gradient}`}>
          {resultData.title}
        </h1>
      </div>

      <div className="inline-block px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
        <p className="font-ui font-bold text-xl text-white">
          Brainrot Score: <span className={resultData.color}>{score * 10}%</span>
        </p>
      </div>

      <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed border-l-4 border-primary/50 pl-6 py-2 text-left md:text-center md:border-l-0 md:border-t-0 bg-card/30 md:bg-transparent rounded-r-xl md:rounded-none">
        {resultData.description}
      </p>

      <div className="pt-4">
        <button 
          onClick={onRetake}
          className="text-sm text-secondary-text hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          <FaRedo className="text-xs" /> Retake Diagnosis
        </button>
      </div>
    </div>
  );
};

// --- 3. MAIN COMPONENT ---

const BrainrotCurePage = () => {
  const [gameState, setGameState] = useState('intro'); // intro, playing, results
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const containerRef = useRef(null);

  const handleStart = () => {
    setGameState('playing');
    setQuestionIndex(0);
    setScore(0);
    trackEvent('brainrot_quiz_start', 'Quiz', 'Started');
  };

  const handleAnswer = (value) => {
    const newScore = score + value;
    setScore(newScore);

    if (questionIndex < QUIZ_QUESTIONS.length - 1) {
      setQuestionIndex(prev => prev + 1);
    } else {
      setGameState('results');
      trackEvent('brainrot_quiz_complete', 'Quiz', `Final Score: ${newScore}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getResultData = (finalScore) => {
    if (finalScore <= 3) return RESULTS_DATA.low;
    if (finalScore <= 7) return RESULTS_DATA.medium;
    return RESULTS_DATA.high;
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-text pt-24 pb-20 px-4 overflow-x-hidden">
      
      {/* --- INTRO SCREEN --- */}
      {gameState === 'intro' && (
        <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-red-500/20 blur-[60px] rounded-full"></div>
            <FaBrain className="relative text-7xl md:text-8xl text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.6)] animate-pulse" />
          </div>
          
          <h1 className="font-heading text-5xl md:text-7xl font-black text-white leading-none">
            IS YOUR BRAIN <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">ROTTING?</span>
          </h1>
          
          <p className="font-body text-xl text-secondary-text max-w-xl mx-auto">
            The algorithm is designed to steal your attention. Find out how much of your mind still belongs to you.
          </p>

          <button 
            onClick={handleStart}
            className="group relative px-10 py-5 bg-white text-background font-heading font-bold text-xl rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)] mt-8"
          >
            <span className="relative z-10 flex items-center gap-3">
              START DIAGNOSIS <FaArrowRight />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </button>
        </div>
      )}

      {/* --- PLAYING SCREEN --- */}
      {gameState === 'playing' && (
        <div className="max-w-3xl mx-auto min-h-[60vh] flex flex-col justify-center">
          <ProgressBar current={questionIndex} total={QUIZ_QUESTIONS.length} />
          <QuizCard 
            question={QUIZ_QUESTIONS[questionIndex]} 
            index={questionIndex} 
            total={QUIZ_QUESTIONS.length} 
            onAnswer={handleAnswer} 
          />
        </div>
      )}

      {/* --- RESULTS SCREEN (CONTENT REVEAL) --- */}
      {gameState === 'results' && (
        <div className="max-w-7xl mx-auto animate-fade-in">
          
          {/* 1. Result Header */}
          <ResultHeader 
            score={score} 
            resultData={getResultData(score)} 
            onRetake={handleStart} 
          />

          {/* 2. The Cure Section - SPOTLIGHT EFFECT */}
          <div className="mb-32">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl md:text-5xl font-black text-white mb-4">THE PROTOCOL</h2>
              <p className="text-secondary-text text-lg max-w-2xl mx-auto">
                6 tactical steps to detoxify your mind. <br/>
                <span className="text-primary font-bold">Hover to focus on a step.</span>
              </p>
            </div>
            
            {/* "group/grid" enables the spotlight logic on children */}
            <div className="group/grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-2">
              {CURE_STEPS.map((step, i) => (
                <div 
                  key={i}
                  className="transition-all duration-500 ease-out group-hover/grid:blur-[2px] group-hover/grid:scale-[0.98] hover:!blur-none hover:!scale-105 hover:!z-10"
                >
                  <BentoTilt className="h-full">
                    <div className={`relative h-full overflow-hidden rounded-3xl border-2 ${step.accent} bg-card/80 p-8 flex flex-col`}>
                        {/* Background Glow */}
                        <div className={`absolute inset-0 ${step.bg} opacity-20`}></div>
                        
                        <div className="relative z-10 flex justify-between items-start mb-6">
                            <span className={`font-heading text-5xl font-bold opacity-20 ${step.accent.split(' ')[1]}`}>
                                {step.step}
                            </span>
                            <div className={`text-3xl ${step.accent.split(' ')[1]}`}>
                                {step.icon}
                            </div>
                        </div>

                        <h3 className="relative z-10 font-heading text-2xl font-bold text-white mb-4">
                            {step.title}
                        </h3>
                        
                        <p className="relative z-10 font-body text-secondary-text leading-relaxed text-base">
                            {step.content}
                        </p>
                    </div>
                  </BentoTilt>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Rewire Section - QUEST CARDS */}
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-4">
                REWIRE YOUR BRAIN
              </h2>
              <p className="text-secondary-text text-lg">Daily "Side Quests" to reclaim your attention span.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {REWIRE_STEPS.map((step, i) => (
                <BentoTilt key={i} className={i === REWIRE_STEPS.length - 1 ? "md:col-span-2" : ""}>
                    <div className="h-full flex items-start gap-5 p-6 md:p-8 rounded-2xl bg-card/40 border border-white/10 hover:bg-card/60 hover:border-primary/30 transition-all duration-300 group">
                        <div className="h-14 w-14 flex-shrink-0 rounded-xl bg-white/5 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 border border-white/5">
                            {step.emoji}
                        </div>
                        <div>
                            <h4 className="font-heading text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                {step.title}
                            </h4>
                            <p className="font-body text-secondary-text text-sm md:text-base leading-relaxed">
                                {step.content}
                            </p>
                        </div>
                    </div>
                </BentoTilt>
              ))}
            </div>
          </div>

          

        </div>
      )}
    </div>
  );
};

export default BrainrotCurePage;