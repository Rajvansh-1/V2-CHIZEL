import { FamilyQuest } from '../shared/FamilyQuest';

export const Mission2_FamilyQuest = ({ onComplete }) => {
  return (
    <FamilyQuest 
      onComplete={onComplete}
      questionText="What is your favorite color?"
      questionAudioText="Ask your teacher at school: What is your favorite color?"
      visualEmoji="🎒🏫"
      themeColor="#f97316"
      accentColor="#14b8a6"
      topTitle="Ask your teacher at school:"
    />
  );
};
