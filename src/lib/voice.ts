"use client";

// קול נשי של Google (מוקלט מראש לקובצי mp3 ב-public/audio).
// אם קובץ לא נטען – נופלים לקול עברי של הדפדפן, עם עדיפות לקול נשי.

import { factSentence } from "./data";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
let current: HTMLAudioElement | null = null;

function browserSpeak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "he-IL";
  u.rate = 0.95;
  const he = synth.getVoices().filter((v) => v.lang.toLowerCase().startsWith("he") || v.lang.toLowerCase().startsWith("iw"));
  const female = /google|hila|carmit|female|אישה/i;
  u.voice = he.find((v) => female.test(v.name)) ?? he[0] ?? null;
  synth.speak(u);
}

function play(file: string, fallback: string) {
  if (typeof window === "undefined") return;
  try {
    current?.pause();
    const audio = new Audio(`${BASE}/audio/${file}`);
    current = audio;
    audio.play().catch(() => browserSpeak(fallback));
  } catch {
    browserSpeak(fallback);
  }
}

export const speakFact = (a: number, b: number) => play(`f-${a}x${b}.mp3`, factSentence(a, b));
export const speakNumber = (n: number) => play(`n-${n}.mp3`, String(n));
