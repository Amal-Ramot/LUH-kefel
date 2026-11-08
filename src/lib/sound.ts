"use client";

let ctx: AudioContext | null = null;

function tone(freq: number, start: number, dur: number, type: OscillatorType = "sine", vol = 0.15) {
  if (typeof window === "undefined") return;
  try {
    ctx ??= new AudioContext();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    const t = ctx.currentTime + start;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + dur);
  } catch {
    /* אין שמע – לא נורא */
  }
}

export const sounds = {
  correct() {
    tone(660, 0, 0.12, "triangle");
    tone(880, 0.1, 0.18, "triangle");
  },
  wrong() {
    tone(220, 0, 0.25, "sawtooth", 0.06);
  },
  win() {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.25, "triangle"));
  },
  pop() {
    tone(520, 0, 0.06, "square", 0.05);
  },
};
