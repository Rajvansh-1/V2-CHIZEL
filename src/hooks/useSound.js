// src/hooks/useSound.js
import { useCallback, useRef } from 'react';

export const useSound = () => {
  const bgNodes = useRef([]);

  const getCtx = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    return new AudioContext();
  };

  const playTone = useCallback((freq, type, duration, vol = 0.12, ctx = null) => {
    try {
      const audioCtx = ctx || getCtx();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(vol, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) { /* silent fail */ }
  }, []);

  // ── Basic UI ───────────────────────────────────────────────────
  const playClick = useCallback(() => playTone(700, 'sine', 0.08, 0.08), [playTone]);

  // ── Success / Wrong ────────────────────────────────────────────
  const playSuccess = useCallback(() => {
    playTone(523, 'sine', 0.15, 0.12);
    setTimeout(() => playTone(659, 'sine', 0.3, 0.12), 100);
  }, [playTone]);

  const playError = useCallback(() => {
    playTone(300, 'sawtooth', 0.2, 0.08);
    setTimeout(() => playTone(250, 'sawtooth', 0.3, 0.08), 150);
  }, [playTone]);

  // ── Level Up Fanfare ───────────────────────────────────────────
  const playLevelUp = useCallback(() => {
    const notes = [523, 659, 784, 1047];
    notes.forEach((n, i) => setTimeout(() => playTone(n, 'sine', 0.3, 0.14), i * 120));
  }, [playTone]);

  // ── Wrong Answer ───────────────────────────────────────────────
  const playWrong = useCallback(() => {
    playTone(200, 'sawtooth', 0.15, 0.1);
    setTimeout(() => playTone(150, 'sawtooth', 0.25, 0.1), 180);
  }, [playTone]);

  // ── Combo / Social pick ────────────────────────────────────────
  const playCombo = useCallback(() => {
    playTone(880, 'sine', 0.1, 0.1);
    setTimeout(() => playTone(1100, 'sine', 0.2, 0.1), 90);
  }, [playTone]);

  // ── Big Victory (Mission Complete) ────────────────────────────
  const playTada = useCallback(() => {
    const seq = [523, 659, 784, 1047, 784, 1047, 1319];
    seq.forEach((n, i) => setTimeout(() => playTone(n, 'sine', 0.5, 0.15), i * 140));
  }, [playTone]);

  // ── Countdown beep (3-2-1) ────────────────────────────────────
  const playCountdown = useCallback(() => {
    playTone(880, 'square', 0.12, 0.08);
  }, [playTone]);

  // ── Reward Unlock ─────────────────────────────────────────────
  const playReward = useCallback(() => {
    [440, 554, 659, 880].forEach((n, i) =>
      setTimeout(() => playTone(n, 'sine', 0.3, 0.12), i * 150)
    );
  }, [playTone]);

  // ── Soft "unlock" whoosh ──────────────────────────────────────
  const playUnlock = useCallback(() => {
    playTone(880, 'square', 0.1, 0.06);
    setTimeout(() => playTone(1760, 'sine', 0.4, 0.06), 100);
  }, [playTone]);

  // ── Looping Background Music ──────────────────────────────────
  const playBgMusic = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.04, ctx.currentTime);
      masterGain.connect(ctx.destination);

      // Simple looping arpeggio pattern
      const scale = [261, 329, 392, 523, 392, 329];
      let noteIdx = 0;
      const interval = setInterval(() => {
        try {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(scale[noteIdx % scale.length], ctx.currentTime);
          g.gain.setValueAtTime(0.06, ctx.currentTime);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
          osc.connect(g);
          g.connect(masterGain);
          osc.start();
          osc.stop(ctx.currentTime + 0.35);
          noteIdx++;
        } catch (e) { /* silent */ }
      }, 380);

      bgNodes.current = [ctx, masterGain, interval];
    } catch (e) { /* silent */ }
  }, []);

  const stopBgMusic = useCallback(() => {
    try {
      const [ctx, , interval] = bgNodes.current;
      if (interval) clearInterval(interval);
      if (ctx) ctx.close();
      bgNodes.current = [];
    } catch (e) { /* silent */ }
  }, []);

  return {
    playClick,
    playSuccess,
    playError,
    playLevelUp,
    playWrong,
    playCombo,
    playTada,
    playCountdown,
    playReward,
    playUnlock,
    playBgMusic,
    stopBgMusic,
  };
};
