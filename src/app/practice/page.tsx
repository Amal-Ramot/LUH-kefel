"use client";

import { useCallback, useEffect, useState } from "react";
import Character from "@/components/Characters";
import { Confetti, FactCard, Keypad, MathText, PageHeader } from "@/components/ui";
import { Icon } from "@/components/icons";
import { CHARACTERS, NUMBERS, factKey, storyFor } from "@/lib/data";
import { MAX_BOX, boxOf, pickFact, useProgress } from "@/lib/progress";
import { sounds } from "@/lib/sound";

const BOX_NAMES = ["חדש", "ביצה 🥚", "אפרוח 🐣", "ציפור 🐥", "נשר 🦅", "כוכב ⭐"];

export default function PracticePage() {
  const { progress, ready, record } = useProgress();
  const [tables, setTables] = useState<number[]>([2, 3, 4, 5]);
  const [started, setStarted] = useState(false);
  const [fact, setFact] = useState<[number, number] | null>(null);
  const [value, setValue] = useState("");
  const [state, setState] = useState<"ask" | "ok" | "no">("ask");
  const [streak, setStreak] = useState(0);
  const [count, setCount] = useState({ ok: 0, all: 0 });
  const [party, setParty] = useState(0);

  const nextFact = useCallback(() => {
    setFact((prev) => pickFact(progress, tables, prev ? factKey(prev[0], prev[1]) : undefined));
    setValue("");
    setState("ask");
  }, [progress, tables]);

  useEffect(() => {
    if (started && !fact) nextFact();
  }, [started, fact, nextFact]);

  const submit = useCallback(() => {
    if (!fact || state !== "ask" || !value) return;
    const [a, b] = fact;
    const ok = Number(value) === a * b;
    record(a, b, ok);
    setCount((c) => ({ ok: c.ok + (ok ? 1 : 0), all: c.all + 1 }));
    if (ok) {
      sounds.correct();
      setState("ok");
      const ns = streak + 1;
      setStreak(ns);
      if (ns % 5 === 0) {
        setParty((p) => p + 1);
        sounds.win();
      }
      setTimeout(nextFact, 800);
    } else {
      sounds.wrong();
      setState("no");
      setStreak(0);
    }
  }, [fact, state, value, streak, record, nextFact]);

  const toggle = (n: number) =>
    setTables((t) => (t.includes(n) ? (t.length > 1 ? t.filter((x) => x !== n) : t) : [...t, n].sort((x, y) => x - y)));

  if (!started)
    return (
      <>
        <PageHeader
          icon="brain"
          eyebrow="תרגול חכם"
          title={
            <>
              מתרגלים <span className="gradient-text">בחוכמה</span>
            </>
          }
        />
        <div className="info-box">
          <Icon name="sparkles" size={20} />
          <span>
          <b>איך זה עובד?</b> כל תרגיל גדל כמו ציפור: 🥚 → 🐣 → 🐥 → 🦅 → ⭐. כשעונים נכון – הוא גדל ויחזור פחות.
          כשטועים – הוא חוזר להיות ביצה ונתרגל אותו יותר. ככה המוח שומר את התרגילים לזמן ארוך!
          </span>
        </div>
        <h2 className="section-title">אילו לוחות לתרגל?</h2>
        <div className="chooser">
          {NUMBERS.map((n) => (
            <button
              key={n}
              className={`choose ${tables.includes(n) ? "on" : ""}`}
              style={{ ["--c" as string]: CHARACTERS[n].color }}
              onClick={() => toggle(n)}
            >
              <Character n={n} size={54} animate="none" />
              <b>{n}</b>
            </button>
          ))}
        </div>
        <div className="center">
          <button className="btn big" disabled={!ready} onClick={() => setStarted(true)}>
            <Icon name="play" size={18} /> מתחילים
          </button>
        </div>
      </>
    );

  if (!fact) return null;
  const [a, b] = fact;
  const big = Math.max(a, b);
  const box = boxOf(progress, a, b);

  return (
    <div className="practice">
      <Confetti show={party > 0} key={party} />
      <div className="practice-top">
        <span className="pill">
          <Icon name="flame" size={16} /> רצף: <b>{streak}</b>
        </span>
        <span className="pill">
          <Icon name="check" size={16} /> {count.ok}/{count.all}
        </span>
        <span className="pill">
          שלב התרגיל: <b>{BOX_NAMES[Math.min(box, MAX_BOX)]}</b>
        </span>
        <button className="btn small ghost" onClick={() => { setStarted(false); setFact(null); }}>
          <Icon name="settings" size={15} /> החלפת לוחות
        </button>
      </div>

      <div className={`question ${state === "no" ? "shake" : ""} ${state === "ok" ? "pop" : ""}`}>
        <Character n={big} size={100} animate={state === "ok" ? "bounce" : "float"} mood={state === "ok" ? "wow" : "happy"} />
        <div className="q-text" dir="ltr">
          {a} × {b} = <span className="answer-box">{state === "no" ? a * b : value || "?"}</span>
        </div>
      </div>

      {state === "ok" && <p className="feedback ok">🎉 מעולה! {streak > 0 && streak % 5 === 0 ? `רצף של ${streak}!` : ""}</p>}

      {state === "no" ? (
        <>
          <p className="feedback no">
            עניתם {value}. בואו נזכור ביחד 👇 <MathText text={storyFor(a, b)} />
          </p>
          <FactCard a={a} b={b} />
          <div className="center">
            <button className="btn big" onClick={nextFact} autoFocus>
              הבנתי! הבא <Icon name="arrowLeft" size={20} />
            </button>
          </div>
        </>
      ) : (
        <Keypad value={value} onChange={setValue} onSubmit={submit} disabled={state !== "ask"} />
      )}
    </div>
  );
}
