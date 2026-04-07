import { DayPageTemplate } from './shared/DayPageTemplate';
import { Mission1_BrainBooster } from './day2/Mission1_NumberNinja';
import { Mission2_FamilyQuest } from './day2/Mission2_FamilyQuest';
import { Mission3_EmojiChallenge } from './day2/Mission3_RhythmCreator';

export default function Day2Page() {
  const missionsConfig = {
    m1: {
      icon: "⚡",
      title: "Brain Booster",
      subtitle: "Think fast! 5 pattern & speed challenges",
      points: "+50 XP",
      color: "#f97316",
      reward: { emoji: '⚡', title: 'Brain Booster Unlocked!', points: '+50 Brain Points', color: '#f97316' }
    },
    m2: {
      icon: "🎒",
      title: "School Challenge",
      subtitle: "Ask your teacher a fun question!",
      points: "+50 XP",
      color: "#14b8a6",
      reward: { emoji: '🏫', title: 'Social Power Unlocked!', points: '+50 Social Points', color: '#14b8a6' }
    },
    m3: {
      icon: "😆",
      title: "Emoji Drawing",
      subtitle: "Draw a funny emoji face & share it!",
      points: "+50 XP",
      color: "#3b82f6",
      reward: { emoji: '😄', title: 'Creator Power Unlocked!', points: '+50 Creator Points', color: '#3b82f6' }
    }
  };

  return (
    <DayPageTemplate 
      dayNumber={2}
      themeColor="#f97316"
      title="SPEED & SMILES"
      subtitle="Think fast and have fun! ⚡😄"
      missionsConfig={missionsConfig}
      M1Component={Mission1_BrainBooster}
      M2Component={Mission2_FamilyQuest}
      M3Component={Mission3_EmojiChallenge}
    />
  );
}
