"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Character from "@/components/Characters";
import { Confetti } from "@/components/ui";
import { CHARACTERS, NUMBERS } from "@/lib/data";
import { pickFact, useProgress } from "@/lib/progress";
import { sounds } from "@/lib/sound";

const DURATION = 60;

function choicesFor(a: number, b: number) {
  const right = a * b;
  const set = new Set<number>([right]);
  const near = [a * (b + 1), a * (b - 1), (a + 1) * b, (a - 1) * b, right + 1, right - 1, right + 10, right - 10];
  for (const x of near.sort(() => Math.random() - 0.5)) {
    if (set.size >= 4) break;
    if (x > 0 && x <= 110) set.add(x);
  }
  while (set.size < 4) set.add(1 + Math.floor(Math.random() * 100));
  return [...set].sort(() => Math.random() - 0.5);
}

export default function GamePage() {
  const { progress, record, setGameHigh } = useProgress();
  const [phase, setPhase] = useState<"intro" | "play" | "end">("intro");
  const [time, setTime] = useState(DURATION);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [fact, setFact] = useState<[number, number]>([2, 3]);
  const [choices, setChoices] = useState<number[]>([]);
  const [flash, setFlash] = useState<{ v: number; ok: boolean } | null>(null);
  const [newHigh, setNewHigh] = useState(false);
  const scoreRef = useRef(0);

  const nextQ = useCallback(() => {
    const f = pickFact(progress, NUMBERS);
    setFact(f);
    setChoices(choicesFor(f[0], f[1]));
    setFlash(null);
  }, [progress]);

  const start = () => {
    setScore(0);
    scoreRef.current = 0;
    setCombo(0);
    setTime(DURATION);
    setNewHigh(false);
    nextQ();
    setPhase("play");
  };

  useEffect(() => {
    if (phase !== "play") return;
    const t = setInterval(() => setTime((x) => x - 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase === "play" && time <= 0) {
      setPhase("end");
      const s = scoreRef.current;
      if (s > progress.gameHigh) {
        setNewHigh(true);
        sounds.win();
      }
      setGameHigh(s);
    }
  }, [time, phase, progress.gameHigh, setGameHigh]);

  const answer = (v: number) => {
    if (flash) return;
    const [a, b] = fact;
    const ok = v === a * b;
    record(a, b, ok);
    setFlash({ v, ok });
    if (ok) {
      sounds.correct();
      const mult = 1 + Math.floor(combo / 3);
      const ns = scoreRef.current + 10 * mult;
      scoreRef.current = ns;
      setScore(ns);
      setCombo((c) => c + 1);
      setTimeout(nextQ, 350);
    } else {
      sounds.wrong();
      setCombo(0);
      setTimeout(nextQ, 1100);
    }
  };

  const [a, b] = fact;
  const height = Math.min(100, (score / 600) * 100);
  const mult = 1 + Math.floor(combo / 3);

  if (phase === "intro" || phase === "end")
    return (
      <div className="game-intro">
        <Confetti show={phase === "end" && newHigh} />
        <div className="rocket-big">🚀</div>
        <h1 className="page-title">{phase === "intro" ? "מירוץ לירח!" : `צברתם ${score} נקודות!`}</h1>
        {phase === "intro" ? (
          <p className="lead center">
            יש לכם {DURATION} שניות. כל תשובה נכונה מקפיצה את החללית למעלה. 3 תשובות נכונות ברצף = נקודות כפולות! 🔥
          </p>
        ) : (
          <p className="lead center">
            {newHigh ? "🏆 שיא חדש! כל הכבוד!" : `השיא שלכם: ${progress.gameHigh}. נסו לשבור אותו!`}
          </p>
        )}
        <div className="chars-row">
          {[2, 5, 8, 9].map((n) => (
            <Character key={n} n={n} size={70} animate="bounce" />
          ))}
        </div>
        <button className="btn big" onClick={start}>
          {phase === "intro" ? "🚀 המראה!" : "🔁 עוד סיבוב"}
        </button>
      </div>
    );

  return (
    <div className="game">
      <div className="space">
        <div className="moon">🌕</div>
        <div className="rocket" style={{ bottom: `${height * 0.82}%` }}>
          🚀
        </div>
        {Array.from({ length: 18 }, (_, i) => (
          <span key={i} className="twinkle" style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%`, animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
      <div className="game-main">
        <div className="game-hud">
          <span className="pill">⏱️ {time}</span>
          <span className="pill">⭐ {score}</span>
          <span className={`pill ${mult > 1 ? "hot" : ""}`}>🔥 ×{mult}</span>
        </div>
        <div className="timebar">
          <span style={{ width: `${(time / DURATION) * 100}%` }} />
        </div>
        <div className="question big-q">
          <Character n={Math.max(a, b)} size={80} animate="float" />
          <div className="q-text" dir="ltr">
            {a} × {b} = ?
          </div>
        </div>
        <div className="bubbles">
          {choices.map((v, i) => {
            const isRight = v === a * b;
            const cls = flash ? (isRight ? "right" : flash.v === v ? "wrong" : "faded") : "";
            return (
              <button
                key={`${a}-${b}-${v}`}
                className={`bubble ${cls}`}
                style={{ background: CHARACTERS[(i * 3 + 2) % 10 || 10].color }}
                onClick={() => answer(v)}
              >
                {v}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
