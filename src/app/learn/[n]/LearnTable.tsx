"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import Character from "@/components/Characters";
import { AnswerInput, Confetti, FactCard, MathText, Stars, SubmitBar } from "@/components/ui";
import { Icon } from "@/components/icons";
import { CHARACTERS, NUMBERS, TRICKS, storyFor } from "@/lib/data";
import { speakFact, speakNumber } from "@/lib/voice";
import { useProgress } from "@/lib/progress";
import { sounds } from "@/lib/sound";

const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

export default function LearnTable({ n }: { n: number }) {
  const c = CHARACTERS[n];
  const trick = TRICKS[n];
  const [hop, setHop] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const [tab, setTab] = useState<"learn" | "quiz">("learn");

  const next = n < 10 ? n + 1 : null;
  const prev = n > 1 ? n - 1 : null;

  const doHop = () => {
    const h = hop >= 10 ? 0 : hop + 1;
    setHop(h);
    sounds.pop();
    if (h > 0) speakNumber(n * h);
  };

  return (
    <div style={{ ["--c" as string]: c.color, ["--soft" as string]: c.soft }}>
      <section className="table-hero" data-n={n}>
        <Character n={n} size={150} animate="bounce" />
        <div>
          <h1 className="page-title start">
            לוח ה-{n} עם <span style={{ color: c.color }}>{c.name}</span>
          </h1>
          <p className="lead">
            למה {c.name}? <MathText text={c.why} />.
          </p>
          <div className="trick-box">
            <b>
              <Icon name="bulb" size={18} /> הטריק: {trick.title}
            </b>
            <p>
              <MathText text={trick.text} />
            </p>
            <code dir="ltr">{trick.example}</code>
          </div>
        </div>
      </section>

      <div className="tabs">
        <button className={tab === "learn" ? "tab active" : "tab"} onClick={() => setTab("learn")}>
          <Icon name="book" size={17} /> לומדים
        </button>
        <button className={tab === "quiz" ? "tab active" : "tab"} onClick={() => setTab("quiz")}>
          <Icon name="star" size={17} /> בוחן כוכבים
        </button>
      </div>

      {tab === "learn" ? (
        <>
          <h2 className="section-title">קופצים בקפיצות של {n}</h2>
          <p className="center muted">לחצו על הכפתור ו{c.name} תקפוץ קדימה. אמרו את המספר בקול!</p>
          <div className="hop-track" dir="ltr">
            {NUMBERS.map((m) => (
              <div key={m} className={`hop-stone ${m <= hop ? "lit" : ""}`}>
                {m === hop && (
                  <div className="hopper">
                    <Character n={n} size={56} animate="none" />
                  </div>
                )}
                <span>{m <= hop ? n * m : "?"}</span>
              </div>
            ))}
          </div>
          <div className="center">
            <button className="btn big" onClick={doHop}>
              {hop >= 10 ? "מההתחלה" : "קפיצה!"} <Icon name={hop >= 10 ? "repeat" : "arrowLeft"} size={20} />
            </button>
          </div>

          <h2 className="section-title">כל התרגילים – לחצו כדי לראות ציור וסיפור</h2>
          <div className="fact-list">
            {NUMBERS.map((m) => (
              <button
                key={m}
                className={`fact-chip ${open === m ? "active" : ""}`}
                onClick={() => {
                  setOpen(open === m ? null : m);
                  speakFact(n, m);
                }}
                dir="ltr"
              >
                {n} × {m} = <b>{n * m}</b>
              </button>
            ))}
          </div>
          {open !== null && <FactCard a={n} b={open} onClose={() => setOpen(null)} />}
          <div className="center" style={{ marginTop: 24 }}>
            <button className="btn big secondary" onClick={() => setTab("quiz")}>
              <Icon name="star" size={20} /> מוכנים? לבוחן הכוכבים
            </button>
          </div>
        </>
      ) : (
        <Quiz n={n} key={n} />
      )}

      <div className="pager">
        {prev ? (
          <Link className="btn ghost" href={`/learn/${prev}/`}>
            <Icon name="arrowRight" size={18} /> לוח ה-{prev}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link className="btn ghost" href={`/learn/${next}/`}>
            לוח ה-{next} <Icon name="arrowLeft" size={18} />
          </Link>
        )}
      </div>
    </div>
  );
}

function Quiz({ n }: { n: number }) {
  const { record, setStars } = useProgress();
  const [order, setOrder] = useState(() => shuffle(NUMBERS));
  const [i, setI] = useState(0);
  const [value, setValue] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<null | "ok" | "no">(null);
  const c = CHARACTERS[n];
  const done = i >= order.length;
  const m = order[i];

  const stars = useMemo(() => (score === 10 ? 3 : score >= 8 ? 2 : score >= 5 ? 1 : 0), [score]);

  const submit = useCallback(() => {
    if (!value || feedback) return;
    const ok = Number(value) === n * m;
    record(n, m, ok);
    setFeedback(ok ? "ok" : "no");
    if (ok) {
      sounds.correct();
      setScore((s) => s + 1);
    } else {
      sounds.wrong();
      speakFact(n, m);
    }
    setTimeout(
      () => {
        setFeedback(null);
        setValue("");
        const nx = i + 1;
        if (nx >= order.length) {
          const final = score + (ok ? 1 : 0);
          const st = final === 10 ? 3 : final >= 8 ? 2 : final >= 5 ? 1 : 0;
          setStars(n, st);
          if (st > 0) sounds.win();
        }
        setI(nx);
      },
      ok ? 700 : 2600
    );
  }, [value, feedback, n, m, i, record, order.length, score, setStars]);

  if (done)
    return (
      <div className="quiz-done">
        <Confetti show={stars > 0} />
        <Character n={n} size={140} animate="bounce" mood="wow" />
        <h2>
          {score} מתוך 10!
        </h2>
        <Stars count={stars} />
        <p className="lead">
          {stars === 3
            ? `מדהים! ${c.name} גאה בכם – קיבלתם את המדבקה!`
            : stars > 0
              ? "כל הכבוד! עוד קצת תרגול ותגיעו ל-3 כוכבים."
              : "לא נורא! חזרו ללשונית הלמידה ונסו שוב."}
        </p>
        <button
          className="btn big"
          onClick={() => {
            setOrder(shuffle(NUMBERS));
            setI(0);
            setScore(0);
          }}
        >
          <Icon name="repeat" size={20} /> שוב
        </button>
      </div>
    );

  return (
    <div className="quiz">
      <div className="quiz-progress">
        {order.map((_, k) => (
          <span key={k} className={k < i ? "done" : k === i ? "now" : ""} />
        ))}
      </div>
      <div className={`question ${feedback === "no" ? "shake" : ""} ${feedback === "ok" ? "pop" : ""}`}>
        <Character n={n} size={90} animate={feedback === "ok" ? "bounce" : "float"} mood={feedback === "ok" ? "wow" : "happy"} />
        <div className="q-text" dir="ltr">
          {n} × {m} = <AnswerInput value={value} onChange={setValue} onSubmit={submit} disabled={!!feedback} />
        </div>
      </div>
      {feedback === "ok" && <p className="feedback ok">🎉 נכון!</p>}
      {feedback === "no" && (
        <p className="feedback no">
          כמעט! <span dir="ltr">{n} × {m} = {n * m}</span> <br />📖 <MathText text={storyFor(n, m)} />
        </p>
      )}
      <SubmitBar onSubmit={submit} disabled={!!feedback || !value} />
    </div>
  );
}
