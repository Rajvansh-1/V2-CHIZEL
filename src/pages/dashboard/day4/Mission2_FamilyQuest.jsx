import { FamilyQuest } from '../shared/FamilyQuest';

export const Mission2_FamilyQuest = ({ onComplete }) => {
  return (
    <FamilyQuest 
      onComplete={onComplete}
      questionText="What is your favorite animal?"
      questionAudioText="Ask someone at home: What is your favorite animal?"
      visualEmoji="🐾🦁"
      themeColor="#f59e0b"
      accentColor="#f97316"
      topTitle="Ask someone at home:"
    />
  );
};
