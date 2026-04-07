import { DayPageTemplate } from './shared/DayPageTemplate';
import { Mission1_NatureQuiz } from './day3/Mission1_WordWizard';
import { Mission2_FamilyQuest } from './day3/Mission2_FamilyQuest';
import { Mission3_NatureCollection } from './day3/Mission3_ComicStrip';

export default function Day3Page() {
  const missionsConfig = {
    m1: {
      icon: "🌿",
      title: "Brain Blaster (Nature)",
      subtitle: "Answer 5 fun nature questions!",
      points: "+50 XP",
      color: "#22c55e",
      reward: { emoji: '🌿', title: 'Nature Brain Unlocked!', points: '+50 Brain Points', color: '#22c55e' }
    },
    m2: {
      icon: "🌸",
      title: "Nature Talk",
      subtitle: "Ask someone at home about nature!",
      points: "+50 XP",
      color: "#6366f1",
      reward: { emoji: '🌸', title: 'Social Power Unlocked!', points: '+50 Social Points', color: '#6366f1' }
    },
    m3: {
      icon: "📸",
      title: "Nature Collection",
      subtitle: "Find a rock, leaf, or flower & snap it!",
      points: "+50 XP",
      color: "#10b981",
      reward: { emoji: '🍃', title: 'Creator Power Unlocked!', points: '+50 Creator Points', color: '#10b981' }
    }
  };

  return (
    <DayPageTemplate
      dayNumber={3}
      themeColor="#22c55e"
      title="NATURE EXPLORER"
      subtitle="Explore the world around you! 🌿"
      missionsConfig={missionsConfig}
      M1Component={Mission1_NatureQuiz}
      M2Component={Mission2_FamilyQuest}
      M3Component={Mission3_NatureCollection}
    />
  );
}

