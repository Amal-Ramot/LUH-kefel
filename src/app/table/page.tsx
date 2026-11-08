"use client";

import { useState } from "react";
import { FactCard, PageHeader } from "@/components/ui";
import { Icon } from "@/components/icons";
import { CHARACTERS, NUMBERS } from "@/lib/data";
import { MASTERED_BOX, boxOf, useProgress } from "@/lib/progress";
import Character from "@/components/Characters";

type Mode = "plain" | "mirror" | "mastery";

export default function TablePage() {
  const { progress } = useProgress();
  const [hover, setHover] = useState<[number, number] | null>(null);
  const [sel, setSel] = useState<[number, number] | null>([7, 8]);
  const [mode, setMode] = useState<Mode>("plain");

  const knownCount = NUMBERS.flatMap((a) => NUMBERS.map((b) => boxOf(progress, a, b) >= MASTERED_BOX)).filter(Boolean)
    .length;

  const cellClass = (a: number, b: number) => {
    const cls = ["cell"];
    if (hover && (hover[0] === a || hover[1] === b) && !(hover[0] === a && hover[1] === b)) cls.push("cross");
    if (hover && hover[0] === a && hover[1] === b) cls.push("hot");
    if (sel && sel[0] === a && sel[1] === b) cls.push("sel");
    if (mode === "mirror") {
      if (a === b) cls.push("diag");
      else if (a > b) cls.push("dim");
      if (sel && sel[0] === b && sel[1] === a && a !== b) cls.push("twin");
    }
    if (mode === "mastery") {
      const box = boxOf(progress, a, b);
      cls.push(box >= MASTERED_BOX ? "known" : box > 0 ? "learning" : "new");
    }
    return cls.join(" ");
  };

  return (
    <>
      <PageHeader
        icon="grid"
        eyebrow="לוח אינטראקטיבי"
        title={
          <>
            לוח הכפל <span className="gradient-text">הקסום</span>
          </>
        }
        subtitle="עברו על הלוח ולחצו על משבצת כדי לראות ציור, סיפור וטריק."
      />

      <div className="mode-switch">
        <button className={mode === "plain" ? "tab active" : "tab"} onClick={() => setMode("plain")}>
          <Icon name="eye" size={17} /> רגיל
        </button>
        <button className={mode === "mirror" ? "tab active" : "tab"} onClick={() => setMode("mirror")}>
          <Icon name="swap" size={17} /> קסם ההחלפה
        </button>
        <button className={mode === "mastery" ? "tab active" : "tab"} onClick={() => setMode("mastery")}>
          <Icon name="brain" size={17} /> מה אני כבר יודע/ת
        </button>
      </div>

      {mode === "mirror" && (
        <div className="info-box">
          <Icon name="sparkles" size={20} />
          <span>
            <b>סוד גדול:</b> 4 × 7 שווה בדיוק ל-7 × 4. כל המשבצות האפורות הן "תאומות" של משבצות שכבר יש. אז במקום 100
          תרגילים – צריך ללמוד רק 55! והשורות של 1, 2, 5 ו-10 הן קלות מאוד, אז נשארים רק כ-<b>21</b> תרגילים "קשים".
          </span>
        </div>
      )}
      {mode === "mastery" && (
        <div className="info-box">
          <Icon name="target" size={20} />
          <span>
            ירוק = יודעים · צהוב = בדרך · אפור = עוד לא תרגלנו. כבר שלטתם ב-<b>{knownCount}</b> מתוך 100 משבצות!
          </span>
        </div>
      )}

      <div className="table-layout">
        <div className="mult-table-wrap" dir="ltr">
          <table className="mult-table" onMouseLeave={() => setHover(null)}>
            <thead>
              <tr>
                <th className="corner">×</th>
                {NUMBERS.map((b) => (
                  <th key={b} style={{ background: CHARACTERS[b].color }}>
                    {b}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {NUMBERS.map((a) => (
                <tr key={a}>
                  <th style={{ background: CHARACTERS[a].color }}>{a}</th>
                  {NUMBERS.map((b) => (
                    <td
                      key={b}
                      className={cellClass(a, b)}
                      onMouseEnter={() => setHover([a, b])}
                      onClick={() => setSel([a, b])}
                    >
                      {a * b}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-side">
          {sel ? (
            <FactCard a={sel[0]} b={sel[1]} />
          ) : (
            <div className="fact-card">
              <Character n={5} size={90} />
              <p>בחרו משבצת!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
