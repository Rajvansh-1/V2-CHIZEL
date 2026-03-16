// src/pages/onboarding/OnboardingPage.jsx
import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { FaArrowRight, FaArrowLeft, FaCheck } from 'react-icons/fa';

// ─── Avatar logic ────────────────────────────────────────────────────────────
const determineAvatar = (answers) => {
  const scores = { thinker: 0, creator: 0, explorer: 0, connector: 0 };
  if (answers[3]?.includes('Drawing'))   scores.creator  += 2;
  if (answers[3]?.includes('sport'))     scores.explorer += 2;
  if (answers[3]?.includes('puzzle'))    scores.thinker  += 2;
  if (answers[5] === 'I love them')      scores.thinker  += 2;
  if (answers[6] === 'Very comfortable') scores.connector+= 2;
  if (answers[8]?.includes('Think'))     scores.thinker  += 1;
  if (answers[8]?.includes('Creat'))     scores.creator  += 1;
  if (answers[8]?.includes('Social'))    scores.connector+= 1;
  if (answers[9]?.includes('Think'))     scores.thinker  += 1;
  if (answers[9]?.includes('Creat'))     scores.creator  += 1;
  if (answers[9]?.includes('Social'))    scores.connector+= 1;
  if (answers[9]?.includes('Physic'))    scores.explorer += 1;
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
};

const AVATAR_META = {
  thinker:   { emoji: '🧠', label: 'The Thinker',   color: '#1f6feb', desc: 'You love logic, puzzles & deep thinking!' },
  creator:   { emoji: '🎨', label: 'The Creator',   color: '#f59e0b', desc: 'You shine through art, ideas & creativity!' },
  explorer:  { emoji: '🌍', label: 'The Explorer',  color: '#10b981', desc: 'You love adventures & trying new things!' },
  connector: { emoji: '🤝', label: 'The Connector', color: '#8b5cf6', desc: 'You thrive with people & social bonds!' },
};

// ─── Questions ────────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    q: 'How old are you?',
    emoji: '🎂',
    options: ['6 – 8', '9 – 11', '12 – 14', '15+'],
  },
  {
    q: 'How much time do you spend on screens every day?',
    emoji: '📱',
    options: ['Less than 1 hour', '1 – 2 hours', '2 – 3 hours', 'More than 3 hours'],
  },
  {
    q: 'What do you mostly do on your phone or tablet?',
    emoji: '📺',
    options: ['Watch videos', 'Play games', 'Use social media'],
    hasCustom: true,
  },
  {
    q: 'Which activity do you enjoy the most?',
    emoji: '⭐',
    options: ['Drawing or creating', 'Playing sports', 'Solving puzzles'],
    hasCustom: true,
  },
  {
    q: 'How often do you try new activities or hobbies?',
    emoji: '🚀',
    options: ['Very often', 'Sometimes', 'Rarely', 'Almost never'],
  },
  {
    q: 'Do you enjoy solving puzzles or brain games?',
    emoji: '🧩',
    options: ['I love them', 'They are fun sometimes', "I don't enjoy them much", 'I have never tried them'],
  },
  {
    q: 'How comfortable are you talking to new people?',
    emoji: '💬',
    options: ['Very comfortable', 'A little comfortable', 'A little shy', 'Very shy'],
  },
  {
    q: 'How often do you spend time away from screens?',
    emoji: '🌿',
    options: ['Every day', 'A few times a week', 'Once in a while', 'Almost never'],
  },
  {
    q: 'What would you like to improve the most?',
    emoji: '💡',
    options: ['Thinking skills', 'Creativity', 'Social confidence'],
    hasCustom: true,
  },
  {
    q: 'What kind of challenges do you enjoy the most?',
    emoji: '🏆',
    options: ['Thinking challenges', 'Creative activities', 'Physical activities', 'Social challenges'],
  },
];

// ─── Single question card ─────────────────────────────────────────────────────
const QuestionCard = ({ q, idx, total, answer, customAnswer, onSelect, onCustom }) => {
  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Question number */}
      <p className="text-center text-secondary-text font-ui text-xs uppercase tracking-widest mb-2">
        Question {idx + 1} of {total}
      </p>
      <div
        className="rounded-3xl border border-white/10 p-6 sm:p-8"
        style={{ background: 'linear-gradient(145deg, rgba(15,22,45,0.95), rgba(11,18,38,0.98))', boxShadow: '0 0 60px rgba(31,111,235,0.12)' }}
      >
        <div className="text-5xl text-center mb-4">{q.emoji}</div>
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-text text-center mb-6 leading-snug">{q.q}</h2>
        <div className="space-y-3">
          {q.options.map((opt) => {
            const selected = answer === opt;
            return (
              <button
                key={opt}
                onClick={() => onSelect(opt)}
                className={`w-full text-left px-5 py-3 rounded-2xl border transition-all duration-200 font-ui text-sm ${
                  selected
                    ? 'border-primary bg-primary/20 text-text shadow-[0_0_20px_rgba(31,111,235,0.3)] scale-[1.02]'
                    : 'border-white/10 bg-white/3 text-secondary-text hover:border-white/25 hover:bg-white/8 hover:text-text'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${selected ? 'border-primary bg-primary' : 'border-white/30'}`}>
                    {selected && <FaCheck className="text-white text-[8px]" />}
                  </span>
                  {opt}
                </span>
              </button>
            );
          })}
          {q.hasCustom && (
            <div className="relative">
              <input
                type="text"
                placeholder="Write your own answer..."
                value={answer?.startsWith('custom:') ? customAnswer : ''}
                onChange={(e) => { onCustom(e.target.value); onSelect(`custom:${e.target.value}`); }}
                className="w-full px-5 py-3 rounded-2xl border border-white/10 bg-white/3 text-text placeholder-secondary-text text-sm focus:outline-none focus:border-primary/60 transition-all duration-200"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Avatar reveal screen ─────────────────────────────────────────────────────
const AvatarReveal = ({ avatarType, onContinue }) => {
  const meta = AVATAR_META[avatarType] || AVATAR_META.thinker;
  const ref = useRef(null);
  useGSAP(() => {
    // Sped up to 0.4s to be lightning fast
    gsap.from('.avatar-reveal-el', { opacity: 0, scale: 0.9, y: 20, stagger: 0.1, duration: 0.4, ease: 'back.out(1.5)' });
  }, { scope: ref });

  return (
    <div ref={ref} className="flex flex-col items-center justify-center min-h-screen px-5 text-center">
      <div className="avatar-reveal-el text-8xl mb-4" style={{ filter: `drop-shadow(0 0 30px ${meta.color})` }}>
        {meta.emoji}
      </div>
      <h2 className="avatar-reveal-el font-heading text-3xl sm:text-4xl font-black text-text mb-2">
        You are <span style={{ color: meta.color }}>{meta.label}</span>!
      </h2>
      <p className="avatar-reveal-el text-secondary-text text-lg max-w-xs mb-8">{meta.desc}</p>
      <button
        onClick={onContinue}
        className="avatar-reveal-el flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white text-base transition-all duration-200 hover:scale-105"
        style={{ background: `linear-gradient(135deg, ${meta.color}, #7c4dff)`, boxShadow: `0 0 30px ${meta.color}60` }}
      >
        Start My Journey <FaArrowRight />
      </button>
    </div>
  );
};

// ─── Main Onboarding Page ─────────────────────────────────────────────────────
const OnboardingPage = () => {
  const { user, markOnboardingDone } = useAuth();
  const navigate = useNavigate();
  const [step,          setStep]         = useState(0);  // 0-9: questions, 10: avatar reveal
  const [answers,       setAnswers]      = useState({});
  const [customAnswers, setCustomAnswers]= useState({});
  const [saving,        setSaving]       = useState(false);
  const [avatarType,    setAvatarType]   = useState(null);
  const containerRef = useRef(null);

  const total = QUESTIONS.length;
  const progress = (step / total) * 100;

  const animateTransition = useCallback((dir, cb) => {
    const el = containerRef.current?.querySelector('.question-wrap');
    if (!el) { cb(); return; }
    // Lightning fast animations 0.15s
    gsap.to(el, {
      opacity: 0, x: dir === 'next' ? -20 : 20, duration: 0.15, ease: 'power2.in',
      onComplete: () => {
        cb();
        gsap.fromTo(el, { opacity: 0, x: dir === 'next' ? 20 : -20 }, { opacity: 1, x: 0, duration: 0.25, ease: 'power2.out' });
      },
    });
  }, []);

  const handleSelect = useCallback((opt) => {
    setAnswers(prev => ({ ...prev, [step]: opt }));
  }, [step]);

  const handleCustom = useCallback((val) => {
    setCustomAnswers(prev => ({ ...prev, [step]: val }));
  }, [step]);

  const handleNext = useCallback(() => {
    if (!answers[step]) return; // must select something
    if (step < total - 1) {
      animateTransition('next', () => setStep(s => s + 1));
    } else {
      handleSubmit();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, answers, animateTransition, total]);

  const handleBack = useCallback(() => {
    if (step > 0) animateTransition('back', () => setStep(s => s - 1));
  }, [step, animateTransition]);

  const handleSubmit = async () => {
    setSaving(true);
    const avatar = determineAvatar(answers);
    setAvatarType(avatar);

    try {
      // Save profile
      const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Explorer';
      await supabase.from('profiles').upsert({
        user_id:        user.id,
        display_name:   displayName,
        avatar_type:    avatar,
        age_group:      answers[0] || '',
        onboarding_done: true,
      }, { onConflict: 'user_id' });

      // Save individual answers
      const answerRows = Object.entries(answers).map(([idx, ans]) => ({
        user_id:        user.id,
        question_index: parseInt(idx),
        answer:         ans.startsWith('custom:') ? customAnswers[idx] || '' : ans,
      }));
      await supabase.from('quiz_answers').insert(answerRows);

      markOnboardingDone();
      setStep(10); // avatar reveal
    } catch (err) {
      console.error('Onboarding save error:', err);
      // Still show avatar even if save fails
      setStep(10);
    } finally {
      setSaving(false);
    }
  };

  // Avatar reveal screen
  if (step === 10 && avatarType) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(31,111,235,0.1), transparent 70%)' }} />
        <AvatarReveal avatarType={avatarType} onContinue={() => navigate('/intro')} />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle background */}
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(31,111,235,0.07), transparent 70%)' }} />

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <img src="/images/logo.png" alt="Chizel" className="w-7 h-7" />
          <span className="text-text font-heading font-bold text-sm">CHIZEL</span>
        </div>
        <span className="text-secondary-text font-ui text-xs">{step + 1} / {total}</span>
      </div>

      {/* Question */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        <div className="question-wrap w-full max-w-lg">
          <QuestionCard
            q={QUESTIONS[step]}
            idx={step}
            total={total}
            answer={answers[step]}
            customAnswer={customAnswers[step] || ''}
            onSelect={handleSelect}
            onCustom={handleCustom}
          />

          {/* Navigation buttons */}
          <div className="flex items-center gap-3 mt-6 max-w-lg mx-auto">
            {step > 0 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-5 py-3 rounded-full border border-white/10 text-secondary-text hover:text-text hover:border-white/25 transition-all duration-200 text-sm font-ui"
              >
                <FaArrowLeft size="0.8em" /> Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!answers[step] || saving}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-bold text-white text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #1f6feb, #7c4dff)', boxShadow: answers[step] ? '0 0 20px rgba(31,111,235,0.4)' : 'none' }}
            >
              {saving ? (
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : step === total - 1 ? (
                <><FaCheck size="0.9em" /> Reveal My Avatar</>
              ) : (
                <>Next <FaArrowRight size="0.9em" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
