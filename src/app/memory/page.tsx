"use client";

// משחק זיכרון ללוח הכפל – לא התאמת קלפים, אלא שינון בשלושה שלבים על 3 תרגילים בכל סיבוב:
// 1. מצלמים בראש (קידוד: דמות, ציור, חרוז וקול)
// 2. מה נעלם? (היזכרות עם רמז: משלימים את החלק החסר)
// 3. מהזיכרון! (שליפה חופשית בהקלדה, כל תרגיל פעמיים עד שהוא "ננעל" כיהלום)

import { useCallback, useState } from "react";
import Character from "@/components/Characters";
import { AnswerInput, Confetti, DotArray, MathText, PageHeader, SubmitBar } from "@/components/ui";
import { Icon } from "@/components/icons";
import { CHARACTERS, NUMBERS, factKey, storyFor } from "@/lib/data";
import { pickFact, useProgress } from "@/lib/progress";
import { sounds } from "@/lib/sound";
import { speakFact } from "@/lib/voice";

type Fact = [number, number];
type Phase = "intro" | "look" | "gap" | "recall" | "done";
type Hole = "a" | "b" | "p";

const ROUND = 3;
const STEPS: { id: Phase; label: string }[] = [
  { id: "look", label: "מצלמים בראש" },
  { id: "gap", label: "מה נעלם?" },
  { id: "recall", label: "מהזיכרון!" },
];

const shuffle = <T,>(arr: T[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

function choicesFor(right: number, isProduct: boolean, [a, b]: Fact) {
  const near = isProduct
    ? [a * (b + 1), a * (b - 1), (a + 1) * b, (a - 1) * b, right + 10, right - 10, right + 2]
    : [right + 1, right - 1, right + 2, right - 2, right + 3];
  const max = isProduct ? 110 : 10;
  const set = new Set<number>([right]);
  for (const x of shuffle(near)) {
    if (set.size >= 4) break;
    if (x >= 1 && x <= max) set.add(x);
  }
  for (let x = 1; set.size < 4; x++) set.add(x);
  return shuffle([...set]);
}

export default function MemoryPage() {
  const { progress, ready, record, addGems } = useProgress();
  const [phase, setPhase] = useState<Phase>("intro");
  const [facts, setFacts] = useState<Fact[]>([]);
  const [idx, setIdx] = useState(0);
  // שלב 2
  const [gapQueue, setGapQueue] = useState<{ f: number; hole: Hole; choices: number[] }[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  // שלב 3
  const [need, setNeed] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [value, setValue] = useState("");
  const [state, setState] = useState<"ask" | "ok" | "no">("ask");
  const [rounds, setRounds] = useState(0);

  const start = () => {
    const tables = NUMBERS.filter((n) => n > 1);
    const chosen: Fact[] = [];
    const keys = new Set<string>();
    for (let tries = 0; chosen.length < ROUND && tries < 300; tries++) {
      const [a, b] = pickFact(progress, tables);
      const k = factKey(a, b);
      if (a === 1 || b === 1 || keys.has(k)) continue;
      keys.add(k);
      chosen.push([a, b]);
    }
    setFacts(chosen);
    setIdx(0);
    setPhase("look");
    speakFact(chosen[0][0], chosen[0][1]);
  };

  const nextLook = () => {
    if (idx + 1 < facts.length) {
      setIdx(idx + 1);
      speakFact(facts[idx + 1][0], facts[idx + 1][1]);
      return;
    }
    const holes: Hole[] = shuffle(["a", "b", "p"]);
    setGapQueue(
      shuffle(facts.map((_, f) => f)).map((f, i) => {
        const hole = holes[i % 3];
        const [a, b] = facts[f];
        const right = hole === "a" ? a : hole === "b" ? b : a * b;
        return { f, hole, choices: choicesFor(right, hole === "p", facts[f]) };
      })
    );
    setPicked(null);
    setPhase("gap");
  };

  const pickGap = (v: number) => {
    if (picked !== null) return;
    const g = gapQueue[0];
    const [a, b] = facts[g.f];
    const right = g.hole === "a" ? a : g.hole === "b" ? b : a * b;
    const ok = v === right;
    setPicked(v);
    if (ok) sounds.correct();
    else sounds.wrong();
    speakFact(a, b);
    setTimeout(
      () => {
        setPicked(null);
        const rest = gapQueue.slice(1);
        // טעות: התרגיל חוזר לסוף התור עם חור אחר
        if (!ok) {
          const hole: Hole = g.hole === "p" ? "a" : "p";
          const r = hole === "a" ? a : a * b;
          rest.push({ f: g.f, hole, choices: choicesFor(r, hole === "p", facts[g.f]) });
        }
        if (rest.length) {
          setGapQueue(rest);
        } else {
          setNeed(facts.map(() => 2));
          setCurrent(Math.floor(Math.random() * facts.length));
          setValue("");
          setState("ask");
          setPhase("recall");
        }
      },
      ok ? 1300 : 2400
    );
  };

  const advanceRecall = useCallback(
    (needNow: number[]) => {
      const open = needNow.map((n, i) => (n > 0 ? i : -1)).filter((i) => i >= 0);
      if (!open.length) {
        addGems(facts.length);
        setRounds((r) => r + 1);
        setPhase("done");
        sounds.win();
        return;
      }
      const others = open.filter((i) => i !== current);
      const pool = others.length ? others : open;
      setCurrent(pool[Math.floor(Math.random() * pool.length)]);
      setValue("");
      setState("ask");
    },
    [addGems, current, facts.length]
  );

  const submitRecall = useCallback(() => {
    if (state !== "ask" || !value) return;
    const [a, b] = facts[current];
    const ok = Number(value) === a * b;
    record(a, b, ok);
    if (ok) {
      sounds.correct();
      setState("ok");
      const nn = need.map((n, i) => (i === current ? n - 1 : n));
      setNeed(nn);
      setTimeout(() => advanceRecall(nn), 900);
    } else {
      sounds.wrong();
      speakFact(a, b);
      setState("no");
      setNeed(need.map((n, i) => (i === current ? 2 : n)));
    }
  }, [state, value, facts, current, record, need, advanceRecall]);

  /* ---------- פתיחה ---------- */
  if (phase === "intro")
    return (
      <>
        <PageHeader
          icon="cards"
          eyebrow="משחק זיכרון"
          title={
            <>
              שלושה תרגילים <span className="gradient-text">נכנסים לראש</span>
            </>
          }
          subtitle="בכל סיבוב לומדים רק 3 תרגילים – בשלושה שלבים קצרים. מי שמסיים אוסף 3 יהלומים."
        />
        <div className="mem-how">
          <div className="card">
            <div className="big">📸</div>
            <b>1. מצלמים בראש</b>
            <span>מסתכלים על התרגיל, על הדמות ועל החרוז, ומקשיבים.</span>
          </div>
          <div className="card">
            <div className="big">🕵️</div>
            <b>2. מה נעלם?</b>
            <span>חלק מהתרגיל נעלם – בוחרים מה חסר.</span>
          </div>
          <div className="card">
            <div className="big">💎</div>
            <b>3. מהזיכרון!</b>
            <span>מקלידים את התשובה בלי רמזים, עד שהתרגיל ננעל.</span>
          </div>
        </div>
        <div className="center">
          <button className="btn big" disabled={!ready} onClick={start}>
            <Icon name="play" size={18} /> מתחילים
          </button>
          <p className="muted">
            {(progress.gems ?? 0) > 0 ? `כבר אספתם ${progress.gems} יהלומים 💎` : "המשחק בוחר את התרגילים שהכי כדאי לחזק."}
          </p>
        </div>
      </>
    );

  const stepIndex = STEPS.findIndex((s) => s.id === phase);
  const header = (
    <>
      <div className="mem-steps">
        {STEPS.map((s, i) => (
          <span
            key={s.id}
            className={`mem-step ${phase === "done" || i < stepIndex ? "past" : i === stepIndex ? "now" : ""}`}
          >
            <i>{i + 1}</i>
            <span>{s.label}</span>
          </span>
        ))}
      </div>
      <div className="gems" aria-label="יהלומים">
        {facts.map((_, i) => {
          const n = phase === "done" ? 0 : phase === "recall" ? need[i] : 2;
          return (
            <span key={i} className={`gem ${n === 0 ? "on" : n === 1 ? "half" : ""}`}>
              💎
            </span>
          );
        })}
      </div>
    </>
  );

  /* ---------- שלב 1: מצלמים בראש ---------- */
  if (phase === "look") {
    const [a, b] = facts[idx];
    const c = CHARACTERS[Math.max(a, b)];
    return (
      <div className="mem">
        {header}
        <div className="mem-card card" key={idx} style={{ ["--c" as string]: c.color, ["--soft" as string]: c.soft }}>
          <span className="mem-count">
            תרגיל {idx + 1} מתוך {facts.length}
          </span>
          <div>
            <Character n={Math.max(a, b)} size={110} animate="bounce" />
          </div>
          <div className="mem-eq" dir="ltr">
            {a} × {b} = <b>{a * b}</b>
          </div>
          <DotArray a={a} b={b} max={180} />
          <p className="mem-story">
            <MathText text={storyFor(a, b)} />
          </p>
          <p className="mem-tip">אמרו את התרגיל בקול, עצמו עיניים ונסו לראות אותו בראש.</p>
          <div className="mem-actions">
            <button className="btn ghost" onClick={() => speakFact(a, b)}>
              <Icon name="volume" size={18} /> שוב
            </button>
            <button className="btn big" onClick={nextLook} autoFocus>
              צילמתי בראש! <Icon name="arrowLeft" size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- שלב 2: מה נעלם? ---------- */
  if (phase === "gap") {
    const g = gapQueue[0];
    const [a, b] = facts[g.f];
    const c = CHARACTERS[Math.max(a, b)];
    const right = g.hole === "a" ? a : g.hole === "b" ? b : a * b;
    const part = (h: Hole, v: number) =>
      g.hole === h ? (
        <span className={`mem-hole ${picked === null ? "" : picked === right ? "ok" : "no"}`}>
          {picked === null ? "?" : right}
        </span>
      ) : h === "p" ? (
        <b>{v}</b>
      ) : (
        v
      );
    return (
      <div className="mem">
        {header}
        <div className="mem-card card" style={{ ["--c" as string]: c.color, ["--soft" as string]: c.soft }}>
          <span className="mem-count">מה נעלם מהתרגיל?</span>
          <div>
            <Character n={Math.max(a, b)} size={90} animate="float" mood={picked === right ? "wow" : "happy"} />
          </div>
          <div className="mem-eq" dir="ltr">
            {part("a", a)} × {part("b", b)} = {part("p", a * b)}
          </div>
          {picked !== null && picked !== right && (
            <p className="mem-story">
              <MathText text={storyFor(a, b)} />
            </p>
          )}
          <div className="mem-choices">
            {g.choices.map((v) => (
              <button
                key={v}
                className={`mem-choice ${picked !== null && v === right ? "right" : picked === v ? "wrong" : ""}`}
                disabled={picked !== null}
                onClick={() => pickGap(v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ---------- שלב 3: מהזיכרון ---------- */
  if (phase === "recall") {
    const [a, b] = facts[current];
    const c = CHARACTERS[Math.max(a, b)];
    return (
      <div className="mem">
        {header}
        <div
          className={`mem-card card ${state === "no" ? "shake" : ""} ${state === "ok" ? "pop" : ""}`}
          style={{ ["--c" as string]: c.color, ["--soft" as string]: c.soft }}
        >
          <span className="mem-count">בלי רמזים – מה התשובה?</span>
          <div>
            <Character n={Math.max(a, b)} size={90} animate="float" mood={state === "ok" ? "wow" : "happy"} />
          </div>
          <div className="mem-eq" dir="ltr">
            {a} × {b} ={" "}
            <AnswerInput
              value={value}
              onChange={setValue}
              onSubmit={submitRecall}
              disabled={state !== "ask"}
              shown={state === "no" ? String(a * b) : undefined}
            />
          </div>
          {state === "no" && (
            <>
              <p className="mem-story">
                <MathText text={storyFor(a, b)} />
              </p>
              <p className="mem-tip">לא נורא! התרגיל הזה יחזור עוד פעמיים.</p>
              <div className="mem-actions">
                <button className="btn big" onClick={() => advanceRecall(need)} autoFocus>
                  הבנתי, ממשיכים <Icon name="arrowLeft" size={20} />
                </button>
              </div>
            </>
          )}
        </div>
        {state !== "no" && <SubmitBar onSubmit={submitRecall} disabled={state !== "ask" || !value} />}
      </div>
    );
  }

  /* ---------- סיום ---------- */
  return (
    <div className="mem">
      <Confetti show key={rounds} />
      {header}
      <div className="mem-card card">
        <Character n={5} size={110} animate="bounce" mood="wow" />
        <h2>3 תרגילים נכנסו לזיכרון!</h2>
        <div className="mem-done-list" dir="ltr">
          {facts.map(([a, b]) => (
            <div key={factKey(a, b)}>
              💎 {a} × {b} = {a * b}
            </div>
          ))}
        </div>
        <p className="mem-tip">סך הכול אספתם {progress.gems ?? 0} יהלומים. התרגילים האלה יחזרו בתרגול כדי להישאר בזיכרון.</p>
        <div className="mem-actions">
          <button className="btn big" onClick={start} autoFocus>
            <Icon name="repeat" size={18} /> עוד 3 תרגילים
          </button>
        </div>
      </div>
    </div>
  );
}
