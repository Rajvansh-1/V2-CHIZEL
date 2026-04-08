import { DayPageTemplate } from './shared/DayPageTemplate';
import { Mission1_AnimalQuiz } from './day4/Mission1_ScienceQuiz';
import { Mission2_FamilyQuest } from './day4/Mission2_FamilyQuest';
import { Mission3_AnimalMission } from './day4/Mission3_NatureSpotter';

export default function Day4Page() {
  const missionsConfig = {
    m1: {
      icon: "🐾",
      title: "Brain Booster (Animals)",
      subtitle: "Answer 5 fun animal questions!",
      points: "+50 XP",
      color: "#f59e0b",
      reward: { emoji: '🐾', title: 'Animal Brain Unlocked!', points: '+50 Brain Points', color: '#f59e0b' }
    },
    m2: {
      icon: "🦁",
      title: "Animal Talk",
      subtitle: "Ask someone at home about animals!",
      points: "+50 XP",
      color: "#f97316",
      reward: { emoji: '🦁', title: 'Social Power Unlocked!', points: '+50 Social Points', color: '#f97316' }
    },
    m3: {
      icon: "🐶",
      title: "Animal Mission",
      subtitle: "Find or draw an animal & share it!",
      points: "+50 XP",
      color: "#f59e0b",
      reward: { emoji: '🐾', title: 'Creator Power Unlocked!', points: '+50 Creator Points', color: '#f59e0b' }
    }
  };

  return (
    <DayPageTemplate
      dayNumber={4}
      themeColor="#f59e0b"
      title="ANIMAL KINGDOM"
      subtitle="Explore the animal world! 🐾"
      missionsConfig={missionsConfig}
      M1Component={Mission1_AnimalQuiz}
      M2Component={Mission2_FamilyQuest}
      M3Component={Mission3_AnimalMission}
    />
  );
}

