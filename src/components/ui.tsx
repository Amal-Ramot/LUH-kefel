"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CHARACTERS, bestTrickFor, storyFor } from "@/lib/data";
import { speakFact } from "@/lib/voice";
import Character from "./Characters";
import { Icon, type IconName } from "./icons";

const LINKS: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "בית", icon: "home" },
  { href: "/learn/", label: "לומדים", icon: "book" },
  { href: "/table/", label: "הלוח", icon: "grid" },
  { href: "/practice/", label: "תרגול", icon: "brain" },
  { href: "/game/", label: "משחק", icon: "rocket" },
  { href: "/memory/", label: "זיכרון", icon: "cards" },
  { href: "/progress/", label: "הישגים", icon: "trophy" },
];

export function NavBar() {
  const path = usePathname() || "/";
  const norm = (p: string) => (p.endsWith("/") ? p : p + "/");
  const isActive = (href: string) => (href === "/" ? norm(path) === "/" : norm(path).startsWith(href));
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <>
      <header className={`topbar ${scrolled ? "scrolled" : ""}`}>
        <div className="topbar-inner glass">
          <Link href="/" className="brand" aria-label="דף הבית">
            <span className="brand-mark">
              <span>×</span>
            </span>
            <span className="brand-text">
              <b>לוח הכפל</b>
              <small>לומדים בכיף</small>
            </span>
          </Link>
          <nav className="nav-links" aria-label="ניווט ראשי">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={`nav-link ${isActive(l.href) ? "active" : ""}`}>
                <Icon name={l.icon} size={18} />
                <span>{l.label}</span>
              </Link>
            ))}
          </nav>
          <Link href="/practice/" className="btn small nav-cta">
            <Icon name="play" size={14} /> תרגול מהיר
          </Link>
        </div>
      </header>

      {/* סרגל תחתון בסגנון אפליקציה – לטלפונים */}
      <nav className="tabbar glass" aria-label="ניווט">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className={`tab-item ${isActive(l.href) ? "active" : ""}`}>
            <span className="tab-icon">
              <Icon name={l.icon} size={22} />
            </span>
            <span>{l.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}

/** כותרת עמוד אחידה: תווית קטנה, כותרת וטקסט משנה */
export function PageHeader({
  icon,
  eyebrow,
  title,
  subtitle,
}: {
  icon: IconName;
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}) {
  return (
    <header className="page-header">
      <span className="eyebrow">
        <Icon name={icon} size={15} /> {eyebrow}
      </span>
      <h1 className="display">{title}</h1>
      {subtitle && <p className="subtitle">{subtitle}</p>}
    </header>
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

/** שדה תשובה – מקלידים מהמקלדת (בטלפון נפתחת מקלדת מספרים), Enter לבדיקה */
export function AnswerInput({
  value,
  onChange,
  onSubmit,
  disabled,
  shown,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  /** ערך להצגה במקום מה שהוקלד (למשל התשובה הנכונה אחרי טעות) */
  shown?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) ref.current?.focus({ preventScroll: true });
  }, [disabled]);

  // הקלדת ספרה כשהפוקוס במקום אחר מחזירה את הפוקוס לשדה
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (disabled || document.activeElement === ref.current) return;
      if (/^[0-9]$/.test(e.key)) ref.current?.focus();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [disabled]);

  return (
    <input
      ref={ref}
      className="answer-box answer-input"
      dir="ltr"
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      autoComplete="off"
      enterKeyHint="done"
      aria-label="התשובה"
      placeholder="?"
      maxLength={3}
      size={3}
      value={shown ?? value}
      readOnly={disabled}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 3))}
      onKeyDown={(e) => {
        if (e.key === "Enter" && value && !disabled) {
          e.preventDefault();
          onSubmit();
        }
      }}
    />
  );
}

export function SubmitBar({ onSubmit, disabled }: { onSubmit: () => void; disabled?: boolean }) {
  return (
    <div className="submit-bar">
      <button className="btn big" onClick={onSubmit} disabled={disabled}>
        <Icon name="check" size={20} /> בדיקה
      </button>
      <span className="kbd-hint">
        מקלידים את התשובה ולוחצים <kbd>Enter</kbd>
      </span>
    </div>
  );
}

/** כרטיס הסבר לעובדה: דמות, נקודות, טריק וסיפור */
export function FactCard({ a, b, onClose }: { a: number; b: number; onClose?: () => void }) {
  const big = Math.max(a, b);
  const c = CHARACTERS[big];
  const trick = bestTrickFor(a, b);
  return (
    <div className="fact-card card" style={{ ["--c" as string]: c.color, ["--soft" as string]: c.soft }}>
      {onClose && (
        <button className="icon-btn close" onClick={onClose} aria-label="סגירה">
          <Icon name="x" size={18} />
        </button>
      )}
      <div className="fact-head">
        <div className="fact-avatar">
          <Character n={big} size={84} animate="bounce" />
        </div>
        <div>
          <div className="fact-eq" dir="ltr">
            {a} × {b} = <b>{a * b}</b>
          </div>
          <button className="chip-btn" onClick={() => speakFact(a, b)}>
            <Icon name="volume" size={16} /> הקשיבו
          </button>
        </div>
      </div>
      <DotArray a={a} b={b} />
      <div className="fact-rows">
        <div className="fact-row">
          <span className="fact-ico" style={{ background: "#fff1d6", color: "#c77700" }}>
            <Icon name="story" size={18} />
          </span>
          <p className="story">
            <MathText text={storyFor(a, b)} />
          </p>
        </div>
        <div className="fact-row">
          <span className="fact-ico" style={{ background: "#e8f1ff", color: "#2f6fe0" }}>
            <Icon name="bulb" size={18} />
          </span>
          <p>
            <b>{trick.title}.</b> <MathText text={trick.text} />
          </p>
        </div>
        {a !== b && (
          <div className="fact-row">
            <span className="fact-ico" style={{ background: "#f3e8ff", color: "#7c3aed" }}>
              <Icon name="swap" size={18} />
            </span>
            <p>
              קסם ההחלפה: <bdi dir="ltr" className="math">{b} × {a}</bdi> זה בדיוק אותו דבר!
            </p>
          </div>
        )}
      </div>
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
