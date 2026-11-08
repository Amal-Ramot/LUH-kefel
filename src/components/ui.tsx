"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CHARACTERS, bestTrickFor, factSentence, speak, storyFor } from "@/lib/data";
import Character from "./Characters";

const LINKS = [
  { href: "/", label: "בית", icon: "🏠" },
  { href: "/learn/", label: "לומדים", icon: "📖" },
  { href: "/table/", label: "הלוח", icon: "🔢" },
  { href: "/practice/", label: "מתרגלים", icon: "🧠" },
  { href: "/game/", label: "משחק", icon: "🚀" },
  { href: "/progress/", label: "המדבקות שלי", icon: "🏆" },
];

export function NavBar() {
  const path = usePathname() || "/";
  const norm = (p: string) => (p.endsWith("/") ? p : p + "/");
  return (
    <nav className="nav">
      <Link href="/" className="brand">
        <span className="brand-badge">×</span> לוח הכפל בכיף
      </Link>
      <div className="nav-links">
        {LINKS.map((l) => {
          const active = l.href === "/" ? norm(path) === "/" : norm(path).startsWith(l.href);
          return (
            <Link key={l.href} href={l.href} className={`nav-link ${active ? "active" : ""}`}>
              <span className="nav-icon">{l.icon}</span>
              <span className="nav-label">{l.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

const MATH_RE = /(\d+(?:\s*[×=+\-÷→]\s*\d+)+)/g;

/** עוטף ביטויים מתמטיים בכיוון שמאל-לימין כדי ש-7 × 8 לא יתהפך בתוך טקסט עברי */
export function MathText({ text }: { text: string }) {
  const parts = text.split(MATH_RE);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <bdi key={i} dir="ltr" className="math">
            {part}
          </bdi>
        ) : (
          part
        )
      )}
    </>
  );
}

/** מערך נקודות: a שורות × b עמודות – רואים את הכפל */
export function DotArray({ a, b, color, max = 220 }: { a: number; b: number; color?: string; max?: number }) {
  const c = color ?? CHARACTERS[Math.max(a, b)].color;
  const cell = Math.min(22, Math.floor(max / Math.max(a, b, 1)));
  return (
    <div className="dots" style={{ gridTemplateColumns: `repeat(${b}, ${cell}px)`, gap: Math.max(2, cell / 6) }}>
      {Array.from({ length: a * b }, (_, i) => (
        <span
          key={`${a}-${b}-${i}`}
          className="dot"
          style={{
            width: cell * 0.8,
            height: cell * 0.8,
            background: c,
            animationDelay: `${Math.floor(i / b) * 70}ms`,
          }}
        />
      ))}
    </div>
  );
}

export function Confetti({ show }: { show: boolean }) {
  const [pieces, setPieces] = useState<{ l: number; d: number; c: string; r: number }[]>([]);
  useEffect(() => {
    if (!show) return;
    const colors = ["#e5484d", "#f2c200", "#46c27a", "#4aa8e0", "#8e5cd9", "#d94f9c", "#ff8c42"];
    setPieces(
      Array.from({ length: 70 }, () => ({
        l: Math.random() * 100,
        d: Math.random() * 0.8,
        c: colors[Math.floor(Math.random() * colors.length)],
        r: Math.random() * 360,
      }))
    );
    const t = setTimeout(() => setPieces([]), 2600);
    return () => clearTimeout(t);
  }, [show]);
  if (!pieces.length) return null;
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          style={{ left: `${p.l}%`, background: p.c, animationDelay: `${p.d}s`, transform: `rotate(${p.r}deg)` }}
        />
      ))}
    </div>
  );
}

/** מקלדת מספרים – שליפה מהזיכרון חזקה יותר מבחירה מתוך אפשרויות */
export function Keypad({
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (disabled) return;
      if (/^[0-9]$/.test(e.key) && value.length < 3) onChange(value + e.key);
      else if (e.key === "Backspace") onChange(value.slice(0, -1));
      else if (e.key === "Enter" && value) onSubmit();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [value, onChange, onSubmit, disabled]);

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "✓"];
  return (
    <div className="keypad" dir="ltr">
      {keys.map((k) => (
        <button
          key={k}
          className={`key ${k === "✓" ? "key-ok" : ""} ${k === "⌫" ? "key-back" : ""}`}
          disabled={disabled || (k === "✓" && !value)}
          onClick={() => {
            if (k === "⌫") onChange(value.slice(0, -1));
            else if (k === "✓") onSubmit();
            else if (value.length < 3) onChange(value + k);
          }}
        >
          {k}
        </button>
      ))}
    </div>
  );
}

/** כרטיס הסבר לעובדה: דמות, נקודות, טריק וסיפור */
export function FactCard({ a, b, onClose }: { a: number; b: number; onClose?: () => void }) {
  const big = Math.max(a, b);
  const c = CHARACTERS[big];
  const trick = bestTrickFor(a, b);
  return (
    <div className="fact-card" style={{ borderColor: c.color, background: c.soft }}>
      {onClose && (
        <button className="close" onClick={onClose} aria-label="סגירה">
          ✕
        </button>
      )}
      <div className="fact-head">
        <Character n={big} size={90} animate="bounce" />
        <div>
          <div className="fact-eq" dir="ltr">
            {a} × {b} = <b style={{ color: c.color }}>{a * b}</b>
          </div>
          <button className="btn small ghost" onClick={() => speak(factSentence(a, b))}>
            🔊 הקשיבו
          </button>
        </div>
      </div>
      <DotArray a={a} b={b} />
      <p className="story">📖 <MathText text={storyFor(a, b)} /></p>
      <p className="trick">
        💡 <b>{trick.title}:</b> <MathText text={trick.text} />
      </p>
      {a !== b && (
        <p className="swap">
          🔄 קסם ההחלפה: <span dir="ltr">{b} × {a}</span> זה בדיוק אותו דבר!
        </p>
      )}
    </div>
  );
}

export function Stars({ count, total = 3 }: { count: number; total?: number }) {
  return (
    <span className="stars" aria-label={`${count} כוכבים`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={i < count ? "star on" : "star"}>
          ★
        </span>
      ))}
    </span>
  );
}
