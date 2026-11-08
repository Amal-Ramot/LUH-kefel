"use client";

import Link from "next/link";
import Character from "@/components/Characters";
import { Stars } from "@/components/ui";
import { CHARACTERS, NUMBERS } from "@/lib/data";
import { MASTERED_BOX, tableMastery, useProgress } from "@/lib/progress";

export default function ProgressPage() {
  const { progress, ready, reset } = useProgress();
  const known = Object.values(progress.boxes).filter((b) => b >= MASTERED_BOX).length;
  const stickers = NUMBERS.filter((n) => (progress.stars[n] ?? 0) === 3 || tableMastery(progress, n) >= 0.8);

  if (!ready) return null;

  return (
    <>
      <h1 className="page-title">🏆 אלבום המדבקות שלי</h1>
      <div className="stats">
        <div className="stat">
          <b>{stickers.length}/10</b>
          <span>מדבקות</span>
        </div>
        <div className="stat">
          <b>{known}/55</b>
          <span>תרגילים שאני יודע/ת</span>
        </div>
        <div className="stat">
          <b>{progress.correct}</b>
          <span>תשובות נכונות</span>
        </div>
        <div className="stat">
          <b>{progress.streakDays.length}</b>
          <span>ימי תרגול</span>
        </div>
        <div className="stat">
          <b>{progress.gameHigh}</b>
          <span>שיא במשחק 🚀</span>
        </div>
      </div>

      <p className="center muted">
        מקבלים מדבקה כשמשיגים 3 כוכבים בבוחן של הלוח, או כשמתרגלים ויודעים את רוב התרגילים שלו.
      </p>

      <div className="album">
        {NUMBERS.map((n) => {
          const has = stickers.includes(n);
          const c = CHARACTERS[n];
          return (
            <Link
              href={`/learn/${n}/`}
              key={n}
              className={`sticker ${has ? "has" : "locked"}`}
              style={{ background: has ? c.soft : undefined, borderColor: has ? c.color : undefined }}
            >
              <Character n={n} size={90} animate={has ? "wiggle" : "none"} />
              <b>{has ? c.name : "???"}</b>
              <Stars count={progress.stars[n] ?? 0} />
              <span className="tiny">לוח ה-{n} · {Math.round(tableMastery(progress, n) * 100)}%</span>
            </Link>
          );
        })}
      </div>

      <div className="center" style={{ marginTop: 32 }}>
        <button
          className="btn small ghost"
          onClick={() => {
            if (confirm("למחוק את כל ההתקדמות ולהתחיל מחדש?")) reset();
          }}
        >
          🗑️ איפוס התקדמות
        </button>
      </div>
    </>
  );
}
