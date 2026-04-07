import { FamilyQuest } from '../shared/FamilyQuest';

export const Mission2 = ({ onComplete }) => {
  return (
    <FamilyQuest 
      onComplete={onComplete}
      questionText="What was their favourite hobby growing up?"
      questionAudioText="Ask anyone at home: What was their favourite hobby growing up?"
      visualEmoji="🏠✨"
      themeColor="#7c4dff"
      accentColor="#ec4899"
      topTitle="Ask anyone at home:"
    />
  );
};
