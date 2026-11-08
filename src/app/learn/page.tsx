"use client";

import Link from "next/link";
import Character from "@/components/Characters";
import { Stars } from "@/components/ui";
import { CHARACTERS, NUMBERS, TRICKS } from "@/lib/data";
import { tableMastery, useProgress } from "@/lib/progress";

// סדר הלמידה המומלץ: מהקל לקשה
const ORDER = [1, 10, 2, 5, 3, 4, 9, 6, 8, 7];

export default function LearnIndex() {
  const { progress } = useProgress();
  return (
    <>
      <h1 className="page-title">📖 בוחרים לוח ולומדים</h1>
      <p className="lead center">
        מומלץ ללמוד לפי הסדר: מהלוחות הקלים לקשים. כל לוח שלומדים עוזר בלוח הבא!
      </p>
      <div className="learn-grid">
        {ORDER.map((n, i) => {
          const c = CHARACTERS[n];
          const m = Math.round(tableMastery(progress, n) * 100);
          return (
            <Link key={n} href={`/learn/${n}/`} className="learn-card" style={{ borderColor: c.color, background: c.soft }}>
              <span className="order">שלב {i + 1}</span>
              <Character n={n} size={96} animate="none" />
              <div className="learn-card-body">
                <h3 style={{ color: c.color }}>לוח ה-{n}</h3>
                <p className="muted">{c.name}</p>
                <p className="tiny">💡 {TRICKS[n].title}</p>
                <Stars count={progress.stars[n] ?? 0} />
                <div className="bar">
                  <span style={{ width: `${m}%`, background: c.color }} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <p className="center muted">יש {NUMBERS.length} לוחות – ואתם יכולים לכבוש את כולם! 💪</p>
    </>
  );
}
