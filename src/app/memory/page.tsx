"use client";

import { useEffect, useRef, useState } from "react";
import Character from "@/components/Characters";
import { Confetti, PageHeader } from "@/components/ui";
import { Icon } from "@/components/icons";
import { NUMBERS } from "@/lib/data";
import { pickFact, useProgress } from "@/lib/progress";
import { sounds } from "@/lib/sound";
import { speakFact } from "@/lib/voice";

type Card = { id: number; pair: number; kind: "q" | "a"; a: number; b: number };

const LEVELS = [
  { pairs: 6, label: "קל", sub: "12 קלפים" },
  { pairs: 8, label: "בינוני", sub: "16 קלפים" },
  { pairs: 10, label: "אלוף", sub: "20 קלפים" },
];

const shuffle = <T,>(arr: T[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function MemoryPage() {
  const { progress, ready, record, setMemoryBest } = useProgress();
  const [pairs, setPairs] = useState(8);
  const [cards, setCards] = useState<Card[] | null>(null);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [newBest, setNewBest] = useState(false);
  const lock = useRef(false);

  const done = cards !== null && matched.length === pairs;

  const start = (count: number) => {
    // בוחרים תרגילים שהילד פחות יודע, בלי 1× ובלי שתי תוצאות זהות על הלוח
    const tables = NUMBERS.filter((n) => n > 1);
    const facts: [number, number][] = [];
    const products = new Set<number>();
    for (let tries = 0; facts.length < count && tries < 500; tries++) {
      const [a, b] = pickFact(progress, tables);
      if (a === 1 || b === 1 || products.has(a * b)) continue;
      products.add(a * b);
      facts.push([a, b]);
    }
    const deck = facts.flatMap(([a, b], i): Card[] => [
      { id: i * 2, pair: i, kind: "q", a, b },
      { id: i * 2 + 1, pair: i, kind: "a", a, b },
    ]);
    setPairs(facts.length);
    setCards(shuffle(deck));
    setOpen([]);
    setMatched([]);
    setMoves(0);
    setSeconds(0);
    setNewBest(false);
    lock.current = false;
  };

  useEffect(() => {
    if (!cards || done) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [cards, done]);

  const flip = (card: Card) => {
    if (lock.current || open.includes(card.id) || matched.includes(card.pair)) return;
    sounds.pop();
    if (open.length === 0) {
      setOpen([card.id]);
      return;
    }
    const first = cards!.find((c) => c.id === open[0])!;
    setOpen([first.id, card.id]);
    const nextMoves = moves + 1;
    setMoves(nextMoves);
    lock.current = true;
    if (first.pair === card.pair) {
      record(card.a, card.b, true);
      setTimeout(() => {
        sounds.correct();
        speakFact(card.a, card.b);
        const nm = [...matched, card.pair];
        setMatched(nm);
        setOpen([]);
        lock.current = false;
        if (nm.length === pairs) {
          const best = progress.memoryBest[pairs];
          if (best === undefined || nextMoves < best) setNewBest(true);
          setMemoryBest(pairs, nextMoves);
          setTimeout(() => sounds.win(), 500);
        }
      }, 450);
    } else {
      setTimeout(() => {
        sounds.wrong();
        setOpen([]);
        lock.current = false;
      }, 1100);
    }
  };

  const time = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  if (!cards)
    return (
      <>
        <PageHeader
          icon="cards"
          eyebrow="משחק זיכרון"
          title={
            <>
              זיכרון <span className="gradient-text">לוח הכפל</span>
            </>
          }
          subtitle="הופכים שני קלפים ומחפשים זוג: תרגיל והתשובה שלו. המשחק בוחר את התרגילים שהכי כדאי לכם לחזק."
        />
        <div className="memory-demo" aria-hidden="true">
          <div className="mcard open static">
            <div className="mface mfront q">
              <Character n={8} size={46} animate="none" />
              <span dir="ltr">7 × 8</span>
            </div>
          </div>
          <Icon name="heart" size={26} />
          <div className="mcard open static">
            <div className="mface mfront a">
              <span>56</span>
            </div>
          </div>
        </div>
        <h2 className="section-title">בוחרים רמה</h2>
        <div className="levels">
          {LEVELS.map((l) => (
            <button key={l.pairs} className="level card" disabled={!ready} onClick={() => start(l.pairs)}>
              <b>{l.label}</b>
              <span>{l.sub}</span>
              <small>
                {progress.memoryBest[l.pairs] ? `השיא שלכם: ${progress.memoryBest[l.pairs]} מהלכים` : "עוד לא שיחקתם"}
              </small>
            </button>
          ))}
        </div>
      </>
    );

  return (
    <div className="memory">
      <Confetti show={done} />
      <div className="game-hud">
        <span className="pill">
          <Icon name="repeat" size={16} /> מהלכים: <b>{moves}</b>
        </span>
        <span className="pill">
          <Icon name="clock" size={16} /> {time}
        </span>
        <span className="pill">
          <Icon name="check" size={16} /> {matched.length}/{pairs}
        </span>
        <button className="btn small ghost" onClick={() => setCards(null)}>
          <Icon name="settings" size={15} /> החלפת רמה
        </button>
      </div>

      {done && (
        <div className="memory-win card">
          <Character n={5} size={90} animate="bounce" mood="wow" />
          <div>
            <h2>כל הכבוד! מצאתם את כל הזוגות</h2>
            <p>
              {moves} מהלכים · {time}
              {newBest ? " · שיא חדש!" : ` · השיא שלכם: ${progress.memoryBest[pairs] ?? moves} מהלכים`}
            </p>
          </div>
          <button className="btn" onClick={() => start(pairs)}>
            <Icon name="repeat" size={18} /> משחק חדש
          </button>
        </div>
      )}

      <div className={`mgrid p${pairs}`}>
        {cards.map((c) => {
          const isMatched = matched.includes(c.pair);
          const isOpen = isMatched || open.includes(c.id);
          return (
            <button
              key={c.id}
              className={`mcard ${isOpen ? "open" : ""} ${isMatched ? "matched" : ""}`}
              onClick={() => flip(c)}
              aria-label={isOpen ? (c.kind === "q" ? `${c.a} כפול ${c.b}` : String(c.a * c.b)) : "קלף הפוך"}
            >
              <div className="mface mback">
                <span>×</span>
              </div>
              <div className={`mface mfront ${c.kind}`}>
                {c.kind === "q" ? (
                  <>
                    <Character n={Math.max(c.a, c.b)} size={46} animate="none" />
                    <span dir="ltr">
                      {c.a} × {c.b}
                    </span>
                  </>
                ) : (
                  <span>{c.a * c.b}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
