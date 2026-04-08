import { FamilyQuest } from '../shared/FamilyQuest';

export const Mission2_FamilyQuest = ({ onComplete }) => {
  return (
    <FamilyQuest 
      onComplete={onComplete}
      questionText="Do you like the Moon or the Stars more?"
      questionAudioText="Ask someone at home: Do you like the Moon or the Stars more?"
      visualEmoji="🚀🌌"
      themeColor="#8b5cf6"
      accentColor="#ec4899"
      topTitle="Ask someone at home:"
    />
  );
};
