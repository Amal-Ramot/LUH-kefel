import Link from "next/link";
import Character from "@/components/Characters";
import { CHARACTERS, NUMBERS } from "@/lib/data";

const STEPS = [
  { icon: "👀", title: "רואים", text: "כל תרגיל הופך לציור של נקודות – מבינים מה זה בכלל כפל." },
  { icon: "🦒", title: "מכירים חבר", text: "לכל מספר יש דמות שמזכירה אותו: לתמנונה 8 זרועות, לכלב 4 רגליים." },
  { icon: "💡", title: "טריק", text: "לכל לוח יש טריק שמאפשר לחשב במקום לשנן." },
  { icon: "🎵", title: "חרוז וסיפור", text: "לתרגילים הקשים יש חרוזים: 5-6-7-8 → 56 = 7 × 8." },
  { icon: "🔄", title: "קסם ההחלפה", text: "3 × 7 זה כמו 7 × 3 – אז יש חצי מהתרגילים ללמוד!" },
  { icon: "🧠", title: "חוזרים בחוכמה", text: "מה שקשה חוזר הרבה, מה שכבר יודעים – פחות. ככה זה נשאר בראש." },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <h1>
            ברוכים הבאים ל<span className="rainbow-text">לוח הכפל בכיף!</span>
          </h1>
          <p className="lead">
            10 חברים מצוירים מחכים לכם. כל אחד מהם יעזור לכם לזכור לוח כפל אחד – עם ציורים, סיפורים, טריקים
            ומשחקים.
          </p>
          <div className="hero-actions">
            <Link href="/learn/" className="btn big">
              📖 בואו נתחיל ללמוד
            </Link>
            <Link href="/game/" className="btn big secondary">
              🚀 ישר למשחק
            </Link>
          </div>
        </div>
        <div className="hero-art">
          <Character n={8} size={170} animate="float" />
          <Character n={4} size={120} animate="bounce" className="hero-dog" />
          <Character n={5} size={90} animate="wiggle" className="hero-star" />
        </div>
      </section>

      <h2 className="section-title">הכירו את החברים</h2>
      <div className="friends">
        {NUMBERS.map((n) => (
          <Link key={n} href={`/learn/${n}/`} className="friend" style={{ background: CHARACTERS[n].soft }}>
            <span className="friend-num" style={{ background: CHARACTERS[n].color }}>
              {n}
            </span>
            <Character n={n} size={86} animate="none" />
            <b>{CHARACTERS[n].name}</b>
          </Link>
        ))}
      </div>

      <h2 className="section-title">איך זוכרים? בשיטת 6 הצעדים</h2>
      <div className="steps">
        {STEPS.map((s, i) => (
          <div key={s.title} className="step" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="step-icon">{s.icon}</div>
            <h3>
              {i + 1}. {s.title}
            </h3>
            <p>{s.text}</p>
          </div>
        ))}
      </div>
    </>
  );
}
