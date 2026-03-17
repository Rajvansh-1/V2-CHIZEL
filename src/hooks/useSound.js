// src/hooks/useSound.js
// ─────────────────────────────────────────────────────────────────────────────
// CHIZEL · GAMIFIED SOUND ENGINE  (Web Audio API — no dependencies)
// Works on both mobile and desktop. Every AudioContext is created fresh per
// sound so we respect autoplay policies.  BGM uses a single persistent ctx.
// ─────────────────────────────────────────────────────────────────────────────
import { useCallback, useRef } from 'react';

// ── Shared AudioContext (singleton per hook instance) for BGM only ────────
let _bgCtx = null;

const getBgCtx = () => {
  if (_bgCtx && _bgCtx.state !== 'closed') return _bgCtx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  _bgCtx = new AC();
  return _bgCtx;
};

// ── Fresh single-use context (for SFX — avoids suspended-state issues) ────
const getSfxCtx = () => {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  return new AC();
};

// ─────────────────────────────────────────────────────────────────────────────
// Low-level helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Create a simple convolver reverb using white-noise impulse */
const addReverb = (ctx, wetRatio = 0.25) => {
  const convolver = ctx.createConvolver();
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * 1.5;
  const buffer = ctx.createBuffer(2, length, sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
    }
  }
  convolver.buffer = buffer;

  const wet = ctx.createGain();
  const dry = ctx.createGain();
  wet.gain.value = wetRatio;
  dry.gain.value = 1 - wetRatio;

  convolver.connect(wet);
  wet.connect(ctx.destination);
  dry.connect(ctx.destination);

  return { convolver, dry }; // route signal → dry AND → convolver
};

/**
 * Play a single note with ADSR, vibrato, optional distortion.
 * Returns the gain node so callers can chain.
 */
const playNote = (
  ctx,
  dest,          // AudioNode destination
  freq,
  type = 'sine',
  start,         // seconds (ctx.currentTime based)
  dur = 0.3,
  vol = 0.15,
  {
    attack  = 0.01,
    decay   = 0.05,
    sustain = 0.8,
    release = 0.1,
    vibrato = 0,     // vibrato depth in Hz
    bend    = 0,     // pitch bend: semitones over duration
    distort = false,
  } = {}
) => {
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (bend !== 0) {
      osc.frequency.linearRampToValueAtTime(
        freq * Math.pow(2, bend / 12),
        start + dur
      );
    }

    // ADSR
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(vol, start + attack);
    gain.gain.linearRampToValueAtTime(vol * sustain, start + attack + decay);
    gain.gain.setValueAtTime(vol * sustain, start + dur - release);
    gain.gain.linearRampToValueAtTime(0.0001, start + dur);

    // Vibrato
    if (vibrato > 0) {
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 5.5;
      lfoGain.gain.value = vibrato;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(start + dur * 0.3);
      lfo.stop(start + dur);
    }

    // Distortion (for hard hits)
    if (distort) {
      const shaper = ctx.createWaveShaper();
      const curve = new Float32Array(512);
      for (let i = 0; i < 512; i++) {
        const x = (i * 2) / 512 - 1;
        curve[i] = (Math.PI + 200) * x / (Math.PI + 200 * Math.abs(x));
      }
      shaper.curve = curve;
      osc.connect(gain);
      gain.connect(shaper);
      shaper.connect(dest);
    } else {
      osc.connect(gain);
      gain.connect(dest);
    }

    osc.start(start);
    osc.stop(start + dur + 0.05);
  } catch (_) { /* silent fail */ }
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTED HOOK
// ─────────────────────────────────────────────────────────────────────────────
export const useSound = () => {
  const bgIntervals = useRef([]);
  const bgCtxRef    = useRef(null);

  // ── UI Click ──────────────────────────────────────────────────────────────
  const playClick = useCallback(() => {
    try {
      const ctx  = getSfxCtx();
      const now  = ctx.currentTime;
      playNote(ctx, ctx.destination, 900, 'sine',   now,       0.04, 0.10, { attack: 0.003, decay: 0.02, release: 0.02 });
      playNote(ctx, ctx.destination, 1200,'sine',   now + 0.03, 0.05, 0.06, { attack: 0.003 });
    } catch (_) {}
  }, []);

  // ── Correct / Success ─────────────────────────────────────────────────────
  const playSuccess = useCallback(() => {
    try {
      const ctx = getSfxCtx();
      const now = ctx.currentTime;
      const { convolver, dry } = addReverb(ctx, 0.2);
      // Rising arpeggio C4 → E4 → G4 with velocity
      [
        [261, 0.00, 0.22, 0.18, 'triangle'],
        [329, 0.10, 0.22, 0.18, 'triangle'],
        [392, 0.20, 0.25, 0.20, 'triangle'],
        [523, 0.30, 0.40, 0.22, 'sine'    ],
      ].forEach(([f, t, d, v, type]) => {
        playNote(ctx, dry, f, type, now + t, d, v, { attack: 0.01, decay: 0.05, sustain: 0.85, release: 0.08, vibrato: 2 });
        playNote(ctx, convolver, f, type, now + t, d, v * 0.5, { attack: 0.01, decay: 0.05, sustain: 0.85 });
      });
    } catch (_) {}
  }, []);

  // ── Wrong Answer ──────────────────────────────────────────────────────────
  const playWrong = useCallback(() => {
    try {
      const ctx = getSfxCtx();
      const now = ctx.currentTime;
      // Descending buzz drop
      playNote(ctx, ctx.destination, 220, 'sawtooth', now,        0.18, 0.14, { bend: -4, attack: 0.005, decay: 0.04, sustain: 0.7, release: 0.07, distort: true });
      playNote(ctx, ctx.destination, 165, 'sawtooth', now + 0.15, 0.22, 0.12, { bend: -3, attack: 0.005, decay: 0.04, sustain: 0.7, release: 0.1,  distort: true });
    } catch (_) {}
  }, []);

  // Alias
  const playError = playWrong;

  // ── Level-Up Fanfare ──────────────────────────────────────────────────────
  const playLevelUp = useCallback(() => {
    try {
      const ctx = getSfxCtx();
      const now = ctx.currentTime;
      const { convolver, dry } = addReverb(ctx, 0.3);

      // Punchy ascending chord burst  C4–E4–G4–C5
      const seq = [
        [261, 0.00, 0.35, 0.18, 'triangle'],
        [330, 0.08, 0.32, 0.18, 'triangle'],
        [392, 0.16, 0.30, 0.20, 'sine'    ],
        [523, 0.24, 0.55, 0.25, 'sine'    ],
        [659, 0.36, 0.70, 0.22, 'sine'    ],
      ];
      seq.forEach(([f, t, d, v, type]) => {
        playNote(ctx, dry,       f, type, now + t, d, v,       { attack: 0.008, decay: 0.06, sustain: 0.9, release: 0.1, vibrato: 3 });
        playNote(ctx, convolver, f, type, now + t, d, v * 0.4, { attack: 0.008 });
      });

      // Sparkle shimmer on top
      [784, 1047, 1319].forEach((f, i) => {
        playNote(ctx, dry, f, 'sine', now + 0.50 + i * 0.08, 0.25, 0.12, { attack: 0.005, decay: 0.04, sustain: 0.6, release: 0.1, vibrato: 4 });
      });
    } catch (_) {}
  }, []);

  // ── Combo Pick-Up ─────────────────────────────────────────────────────────
  const playCombo = useCallback(() => {
    try {
      const ctx = getSfxCtx();
      const now = ctx.currentTime;
      // Quick upward sweep + chime
      playNote(ctx, ctx.destination, 660,  'sine',     now,        0.08, 0.13, { attack: 0.003, bend: 3 });
      playNote(ctx, ctx.destination, 880,  'sine',     now + 0.07, 0.10, 0.13, { attack: 0.003, bend: 2 });
      playNote(ctx, ctx.destination, 1100, 'triangle', now + 0.14, 0.18, 0.12, { attack: 0.003, vibrato: 3 });
    } catch (_) {}
  }, []);

  // ── Big Victory / Tada (Mission Complete) ─────────────────────────────────
  const playTada = useCallback(() => {
    try {
      const ctx = getSfxCtx();
      const now = ctx.currentTime;
      const { convolver, dry } = addReverb(ctx, 0.35);

      // Heroic chord blast: C major with harmonics
      const chords = [
        { freqs: [261, 330, 392],  t: 0.00, d: 0.50, v: 0.20, type: 'triangle' },
        { freqs: [392, 494, 587],  t: 0.15, d: 0.50, v: 0.18, type: 'triangle' },
        { freqs: [523, 659, 784],  t: 0.30, d: 0.70, v: 0.22, type: 'sine'     },
        { freqs: [659, 784, 1047], t: 0.52, d: 0.90, v: 0.20, type: 'sine'     },
      ];
      chords.forEach(({ freqs, t, d, v, type }) => {
        freqs.forEach(f => {
          playNote(ctx, dry,       f, type, now + t, d, v,       { attack: 0.01, decay: 0.07, sustain: 0.9, release: 0.12, vibrato: 2 });
          playNote(ctx, convolver, f, type, now + t, d, v * 0.5, {});
        });
      });

      // Star sparkles
      [1047, 1319, 1568, 2093].forEach((f, i) => {
        playNote(ctx, dry, f, 'sine', now + 0.80 + i * 0.10, 0.30, 0.10, { attack: 0.005, decay: 0.04, sustain: 0.5, release: 0.1, vibrato: 5 });
      });
    } catch (_) {}
  }, []);

  // ── Reward Unlock ─────────────────────────────────────────────────────────
  const playReward = useCallback(() => {
    try {
      const ctx = getSfxCtx();
      const now = ctx.currentTime;
      const { convolver, dry } = addReverb(ctx, 0.25);

      // Magical pentatonic glide upward
      [440, 554, 659, 880, 1108].forEach((f, i) => {
        const t = i * 0.12;
        playNote(ctx, dry,       f, 'sine',     now + t, 0.35, 0.16, { attack: 0.008, decay: 0.05, sustain: 0.85, release: 0.12, vibrato: 4 });
        playNote(ctx, convolver, f, 'triangle', now + t, 0.35, 0.08, {});
      });
    } catch (_) {}
  }, []);

  // ── Soft Unlock Whoosh ────────────────────────────────────────────────────
  const playUnlock = useCallback(() => {
    try {
      const ctx = getSfxCtx();
      const now = ctx.currentTime;
      // Noise whoosh + chime
      const bufLen = ctx.sampleRate * 0.3;
      const noiseBuffer = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(400, now);
      bandpass.frequency.linearRampToValueAtTime(3000, now + 0.28);
      bandpass.Q.value = 1;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.06, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      noiseSource.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noiseSource.start(now);
      noiseSource.stop(now + 0.35);

      // Chime on top
      playNote(ctx, ctx.destination, 1568, 'sine', now + 0.15, 0.45, 0.12, { attack: 0.005, decay: 0.06, sustain: 0.6, release: 0.15, vibrato: 5 });
    } catch (_) {}
  }, []);

  // ── Countdown Beep ───────────────────────────────────────────────────────
  const playCountdown = useCallback(() => {
    try {
      const ctx = getSfxCtx();
      const now = ctx.currentTime;
      playNote(ctx, ctx.destination, 1047, 'square', now, 0.14, 0.12, { attack: 0.003, decay: 0.04, sustain: 0.8, release: 0.06, bend: -1 });
    } catch (_) {}
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // BACKGROUND MUSIC  — 3-layer: bass drone + melody arpeggio + rhythm pulse
  // ─────────────────────────────────────────────────────────────────────────
  const playBgMusic = useCallback(() => {
    try {
      const ctx = getBgCtx();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();
      bgCtxRef.current = ctx;

      // Master chain: compressor → gain → destination
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -18;
      comp.knee.value = 10;
      comp.ratio.value = 4;
      comp.attack.value = 0.003;
      comp.release.value = 0.25;
      const master = ctx.createGain();
      master.gain.value = 0.55;
      comp.connect(master);
      master.connect(ctx.destination);

      // ── Layer 1: Bass pulse (root notes, 120 BPM, 8th-note grid) ──────
      // C2–G2–A2–F2 chord progression loop (8 beats = 4s)
      const bassPattern = [65, 65, 98, 98, 110, 110, 87, 87]; // C2 G2 A2 F2 semitones→Hz
      const beatLen = 0.5; // 120bpm = 0.5s per beat
      let bassBeat = 0;
      const bassInterval = setInterval(() => {
        try {
          if (!bgCtxRef.current || bgCtxRef.current.state === 'closed') return;
          const now = ctx.currentTime;
          const freq = bassPattern[bassBeat % bassPattern.length];
          const osc  = ctx.createOscillator();
          const g    = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.value = freq;
          g.gain.setValueAtTime(0, now);
          g.gain.linearRampToValueAtTime(0.28, now + 0.015);
          g.gain.exponentialRampToValueAtTime(0.001, now + beatLen * 0.9);
          osc.connect(g);
          g.connect(comp);
          osc.start(now);
          osc.stop(now + beatLen);
          bassBeat++;
        } catch (_) {}
      }, beatLen * 1000);

      // ── Layer 2: Melody arpeggio (16th notes, pentatonic) ────────────
      // Rotate through C-major pentatonic: C4 D4 E4 G4 A4 G4 E4 D4
      const melodyPattern = [261, 294, 330, 392, 440, 392, 330, 294,
                              523, 587, 659, 784, 880, 784, 659, 587];
      const noteLen = beatLen / 2; // 16th-note = 0.25s
      let melIdx = 0;
      const melInterval = setInterval(() => {
        try {
          if (!bgCtxRef.current || bgCtxRef.current.state === 'closed') return;
          const now  = ctx.currentTime;
          const freq = melodyPattern[melIdx % melodyPattern.length];
          const osc  = ctx.createOscillator();
          const g    = ctx.createGain();
          const vib  = ctx.createOscillator();
          const vibG = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.value = freq;

          // Soft vibrato
          vib.frequency.value = 5;
          vibG.gain.value = 3;
          vib.connect(vibG);
          vibG.connect(osc.frequency);

          g.gain.setValueAtTime(0, now);
          g.gain.linearRampToValueAtTime(0.14, now + 0.01);
          g.gain.exponentialRampToValueAtTime(0.001, now + noteLen * 0.75);

          osc.connect(g);
          g.connect(comp);
          osc.start(now);
          osc.stop(now + noteLen);
          vib.start(now);
          vib.stop(now + noteLen);
          melIdx++;
        } catch (_) {}
      }, noteLen * 1000);

      // ── Layer 3: Rhythm "hat" clicks (every beat) ────────────────────
      let hatBeat = 0;
      const hatInterval = setInterval(() => {
        try {
          if (!bgCtxRef.current || bgCtxRef.current.state === 'closed') return;
          const isDownbeat = hatBeat % 4 === 0;
          const now = ctx.currentTime;

          // White-noise burst for hat
          const bufLen = Math.floor(ctx.sampleRate * 0.06);
          const buf    = ctx.createBuffer(1, bufLen, ctx.sampleRate);
          const data   = buf.getChannelData(0);
          for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
          const src = ctx.createBufferSource();
          src.buffer = buf;
          const hpf = ctx.createBiquadFilter();
          hpf.type = 'highpass';
          hpf.frequency.value = isDownbeat ? 3000 : 6000;
          const hg = ctx.createGain();
          hg.gain.setValueAtTime(isDownbeat ? 0.18 : 0.08, now);
          hg.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
          src.connect(hpf);
          hpf.connect(hg);
          hg.connect(comp);
          src.start(now);
          src.stop(now + 0.06);
          hatBeat++;
        } catch (_) {}
      }, beatLen * 1000);

      bgIntervals.current = [bassInterval, melInterval, hatInterval];
    } catch (_) {}
  }, []);

  const stopBgMusic = useCallback(() => {
    try {
      bgIntervals.current.forEach(id => clearInterval(id));
      bgIntervals.current = [];
      if (bgCtxRef.current && bgCtxRef.current.state !== 'closed') {
        bgCtxRef.current.close();
        bgCtxRef.current = null;
        _bgCtx = null;
      }
    } catch (_) {}
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
