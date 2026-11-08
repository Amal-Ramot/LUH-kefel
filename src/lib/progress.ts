"use client";

// חזרה מרווחת בשיטת לייטנר: כל עובדה נמצאת ב"קופסה" 0–5.
// תשובה נכונה → קופסה גבוהה יותר (חוזרת פחות). טעות → חזרה לקופסה 1 (חוזרת הרבה).

import { useCallback, useEffect, useState } from "react";
import { NUMBERS, factKey } from "./data";

const KEY = "luh-kefel-progress-v1";

export type Progress = {
  boxes: Record<string, number>;
  stars: Record<number, number>; // כוכבים לכל לוח (0–3)
  gameHigh: number;
  correct: number;
  streakDays: string[];
};

const empty = (): Progress => ({ boxes: {}, stars: {}, gameHigh: 0, correct: 0, streakDays: [] });

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    return { ...empty(), ...JSON.parse(raw) };
  } catch {
    return empty();
  }
}

function save(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* מצב גלישה פרטית – ממשיכים בלי לשמור */
  }
}

export const MAX_BOX = 5;
export const MASTERED_BOX = 3;

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(empty);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgress(load());
    setReady(true);
  }, []);

  const update = useCallback((fn: (p: Progress) => Progress) => {
    setProgress((prev) => {
      const next = fn(prev);
      save(next);
      return next;
    });
  }, []);

  const record = useCallback(
    (a: number, b: number, ok: boolean) =>
      update((p) => {
        const k = factKey(a, b);
        const box = p.boxes[k] ?? 0;
        const today = new Date().toISOString().slice(0, 10);
        return {
          ...p,
          boxes: { ...p.boxes, [k]: ok ? Math.min(MAX_BOX, box + 1) : 1 },
          correct: p.correct + (ok ? 1 : 0),
          streakDays: p.streakDays.includes(today) ? p.streakDays : [...p.streakDays, today].slice(-60),
        };
      }),
    [update]
  );

  const setStars = useCallback(
    (n: number, stars: number) =>
      update((p) => ({ ...p, stars: { ...p.stars, [n]: Math.max(p.stars[n] ?? 0, stars) } })),
    [update]
  );

  const setGameHigh = useCallback(
    (score: number) => update((p) => ({ ...p, gameHigh: Math.max(p.gameHigh, score) })),
    [update]
  );

  const reset = useCallback(() => update(() => empty()), [update]);

  return { progress, ready, record, setStars, setGameHigh, reset };
}

export const boxOf = (p: Progress, a: number, b: number) => p.boxes[factKey(a, b)] ?? 0;

/** כמה מהעובדות בלוח מסוים כבר "נלמדו" */
export function tableMastery(p: Progress, n: number) {
  const done = NUMBERS.filter((m) => boxOf(p, n, m) >= MASTERED_BOX).length;
  return done / NUMBERS.length;
}

/** בוחר את העובדה הבאה לתרגול: עובדות בקופסה נמוכה מופיעות הרבה יותר */
export function pickFact(p: Progress, tables: number[], avoid?: string): [number, number] {
  const pool: { a: number; b: number; w: number }[] = [];
  for (const a of tables)
    for (const b of NUMBERS) {
      if (factKey(a, b) === avoid) continue;
      const box = boxOf(p, a, b);
      const w = box === 0 ? 6 : Math.pow(2, MAX_BOX - box);
      pool.push({ a, b, w });
    }
  const total = pool.reduce((s, x) => s + x.w, 0);
  let r = Math.random() * total;
  for (const x of pool) {
    r -= x.w;
    if (r <= 0) return Math.random() < 0.5 ? [x.a, x.b] : [x.b, x.a];
  }
  const last = pool[pool.length - 1];
  return [last.a, last.b];
}
