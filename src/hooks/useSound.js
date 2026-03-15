// src/hooks/useSound.js
import { useCallback } from 'react';

export const useSound = () => {
  const playTone = useCallback((freq, type, duration, vol=0.1) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio not supported or blocked
    }
  }, []);

  const playClick = useCallback(() => playTone(600, 'sine', 0.1, 0.05), [playTone]);
  
  const playSuccess = useCallback(() => {
    playTone(523.25, 'sine', 0.15, 0.1); // C5
    setTimeout(() => playTone(659.25, 'sine', 0.3, 0.1), 100); // E5
  }, [playTone]);
  
  const playError = useCallback(() => {
    playTone(300, 'sawtooth', 0.2, 0.05);
    setTimeout(() => playTone(250, 'sawtooth', 0.3, 0.05), 150);
  }, [playTone]);
  
  const playReward = useCallback(() => {
    playTone(440, 'sine', 0.2, 0.1);    // A4
    setTimeout(() => playTone(554.37, 'sine', 0.2, 0.1), 150); // C#5
    setTimeout(() => playTone(659.25, 'sine', 0.2, 0.1), 300); // E5
    setTimeout(() => playTone(880, 'sine', 0.6, 0.1), 450);    // A5
  }, [playTone]);

  const playUnlock = useCallback(() => {
    playTone(880, 'square', 0.1, 0.05);
    setTimeout(() => playTone(1760, 'sine', 0.4, 0.05), 100);
  }, [playTone]);

  return { playClick, playSuccess, playError, playReward, playUnlock };
};
