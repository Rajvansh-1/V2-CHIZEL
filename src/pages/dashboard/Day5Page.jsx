import { DayPageTemplate } from './shared/DayPageTemplate';
import { Mission1_SpaceQuiz } from './day5/Mission1_BrainBoss';
import { Mission2_FamilyQuest } from './day5/Mission2_FamilyQuest';
import { Mission3_SpaceMission } from './day5/Mission3_HallOfFame';

export default function Day5Page() {
  const missionsConfig = {
    m1: {
      icon: "🚀",
      title: "Brain Blaster (Space)",
      subtitle: "Answer 5 out-of-this-world space questions!",
      points: "+50 XP",
      color: "#8b5cf6",
      reward: { emoji: '🚀', title: 'Space Brain Unlocked!', points: '+50 Brain Points', color: '#8b5cf6' }
    },
    m2: {
      icon: "🌙",
      title: "Space Talk",
      subtitle: "Ask someone at home about the stars!",
      points: "+50 XP",
      color: "#ec4899",
      reward: { emoji: '🌙', title: 'Social Legend Unlocked!', points: '+50 Social Points', color: '#ec4899' }
    },
    m3: {
      icon: "🌌",
      title: "Space Mission",
      subtitle: "Find something space-like at home & share it!",
      points: "+50 XP",
      color: "#8b5cf6",
      reward: { emoji: '🏆', title: 'Creator Legend Unlocked!', points: '+50 Creator Points', color: '#8b5cf6' }
    }
  };

  return (
    <DayPageTemplate
      dayNumber={5}
      themeColor="#8b5cf6"
      title="SPACE ADVENTURE"
      subtitle="You explored the world… now reach SPACE! 🚀✨"
      missionsConfig={missionsConfig}
      M1Component={Mission1_SpaceQuiz}
      M2Component={Mission2_FamilyQuest}
      M3Component={Mission3_SpaceMission}
    />
  );
}

