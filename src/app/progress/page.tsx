"use client";

import Link from "next/link";
import Character from "@/components/Characters";
import { PageHeader, Stars } from "@/components/ui";
import { Icon, type IconName } from "@/components/icons";
import { CHARACTERS, NUMBERS } from "@/lib/data";
import { MASTERED_BOX, tableMastery, useProgress } from "@/lib/progress";

export default function ProgressPage() {
  const { progress, ready, reset } = useProgress();
  const known = Object.values(progress.boxes).filter((b) => b >= MASTERED_BOX).length;
  const stickers = NUMBERS.filter((n) => (progress.stars[n] ?? 0) === 3 || tableMastery(progress, n) >= 0.8);

  if (!ready) return null;

  return (
    <>
      <PageHeader
        icon="trophy"
        eyebrow="ההישגים שלי"
        title={
          <>
            אלבום <span className="gradient-text">המדבקות</span>
          </>
        }
        subtitle="מקבלים מדבקה כשמשיגים 3 כוכבים בבוחן של הלוח, או כשיודעים את רוב התרגילים שלו."
      />
      <div className="stats">
        {(
          [
            ["trophy", `${stickers.length}/10`, "מדבקות"],
            ["target", `${known}/55`, "תרגילים שאני יודע/ת"],
            ["check", progress.correct, "תשובות נכונות"],
            ["calendar", progress.streakDays.length, "ימי תרגול"],
            ["rocket", progress.gameHigh, "שיא במשחק"],
          ] as [IconName, string | number, string][]
        ).map(([icon, value, label]) => (
          <div className="stat" key={label}>
            <span className="stat-ico">
              <Icon name={icon} size={18} />
            </span>
            <b>{value}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="album">
        {NUMBERS.map((n) => {
          const has = stickers.includes(n);
          const c = CHARACTERS[n];
          return (
            <Link
              href={`/learn/${n}/`}
              key={n}
              className={`sticker ${has ? "has" : "locked"}`}
              style={{ ["--c" as string]: c.color }}
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
          <Icon name="trash" size={15} /> איפוס התקדמות
        </button>
      </div>
    </>
  );
}
