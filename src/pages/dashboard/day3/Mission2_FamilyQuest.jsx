import { FamilyQuest } from '../shared/FamilyQuest';

export const Mission2_FamilyQuest = ({ onComplete }) => {
  return (
    <FamilyQuest 
      onComplete={onComplete}
      questionText="What is your favorite flower or plant?"
      questionAudioText="Ask someone at home: What is your favorite flower or plant?"
      visualEmoji="🌸🌿"
      themeColor="#22c55e"
      accentColor="#86efac"
      topTitle="Ask someone at home:"
    />
  );
};
