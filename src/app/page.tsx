import Link from "next/link";
import Character from "@/components/Characters";
import { Icon } from "@/components/icons";
import { DotArray } from "@/components/ui";
import { CHARACTERS, NUMBERS } from "@/lib/data";

export default function Home() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <Icon name="sparkles" size={15} /> שיטה חדשה ללמידת לוח הכפל
          </span>
          <h1 className="hero-title">
            לוח הכפל
            <br />
            <span className="gradient-text">נשאר בראש.</span>
          </h1>
          <p className="hero-sub">
            10 חברים מצוירים, סיפורים וחרוזים, טריקים חכמים ותרגול שמתאים את עצמו לילד. במקום לשנן בעל-פה – מבינים,
            מדמיינים וזוכרים.
          </p>
          <div className="hero-actions">
            <Link href="/learn/" className="btn big">
              מתחילים ללמוד <Icon name="arrowLeft" size={20} />
            </Link>
            <Link href="/game/" className="btn big ghost">
              <Icon name="rocket" size={20} /> למשחק
            </Link>
          </div>
          <div className="hero-stats">
            <div>
              <b>10</b>
              <span>דמויות</span>
            </div>
            <div>
              <b>55</b>
              <span>תרגילים בלבד</span>
            </div>
            <div>
              <b>6</b>
              <span>צעדי זיכרון</span>
            </div>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="orbit">
            <span className="ring r1" />
            <span className="ring r2" />
          </div>
          <div className="preview card">
            <div className="preview-top">
              <span className="dot-r" />
              <span className="dot-y" />
              <span className="dot-g" />
              <small>תמנונה · לוח ה-8</small>
            </div>
            <div className="preview-body">
              <Character n={8} size={110} animate="float" />
              <div className="preview-eq" dir="ltr">
                7 × 8 = <b>56</b>
              </div>
              <p className="preview-rhyme">״5-6-7-8 – חמישים ושש זה שבע כפול שמונה!״</p>
            </div>
          </div>
          <div className="float-chip fc1 glass">
            <Icon name="flame" size={16} /> רצף של 12!
          </div>
          <div className="float-chip fc2 glass">
            <span className="mini-stars">★★★</span> לוח ה-7
          </div>
          <div className="float-char fc3">
            <Character n={4} size={92} animate="bounce" />
          </div>
          <div className="float-char fc4">
            <Character n={5} size={70} animate="wiggle" />
          </div>
        </div>
      </section>

      {/* ---------- BENTO: השיטה ---------- */}
      <section className="section">
        <div className="section-head">
          <span className="eyebrow">
            <Icon name="brain" size={15} /> השיטה
          </span>
          <h2 className="display-2">6 צעדים שהופכים מספרים לזיכרונות</h2>
          <p className="subtitle">כל צעד נשען על איך שהמוח של ילדים באמת לומד: דימוי, סיפור, הבנה וחזרה בזמן הנכון.</p>
        </div>

        <div className="bento">
          <article className="tile t-see card">
            <div className="tile-text">
              <span className="tile-num">01</span>
              <h3>רואים את הכפל</h3>
              <p>כל תרגיל הופך לציור של נקודות. 3 × 4 הן 3 שורות של 4 – וזה פתאום הגיוני.</p>
            </div>
            <div className="tile-art">
              <DotArray a={3} b={4} color="#6d4aff" max={150} />
            </div>
          </article>

          <article className="tile t-friend card">
            <span className="tile-num">02</span>
            <h3>חבר לכל מספר</h3>
            <p>לתמנונה 8 זרועות, לבובי 4 רגליים. הדמות היא עוגן לזיכרון.</p>
            <div className="tile-chars">
              {[8, 4, 6].map((n) => (
                <Character key={n} n={n} size={64} animate="none" />
              ))}
            </div>
          </article>

          <article className="tile t-trick card">
            <span className="tile-num">03</span>
            <h3>טריק לכל לוח</h3>
            <p>כפול 5 = חצי מכפול 10. כפול 9 – טריק האצבעות.</p>
            <code dir="ltr">9 × 4 = 36 → 3+6 = 9</code>
          </article>

          <article className="tile t-rhyme card">
            <span className="tile-num">04</span>
            <h3>חרוזים וסיפורים</h3>
            <p>לתרגילים הקשים יש חרוז שנדבק לראש.</p>
            <div className="rhyme-bubble">״שש כפול שמונה – ארבעים ושמונה!״</div>
          </article>

          <article className="tile t-swap card">
            <span className="tile-num">05</span>
            <h3>קסם ההחלפה</h3>
            <p>
              <bdi dir="ltr">3 × 7 = 7 × 3</bdi> – אז מתוך 100 תרגילים נשארים רק 21 קשים באמת.
            </p>
            <div className="mini-table" dir="ltr">
              {Array.from({ length: 36 }, (_, i) => {
                const r = Math.floor(i / 6);
                const c = i % 6;
                return <span key={i} className={r === c ? "d" : r < c ? "on" : ""} />;
              })}
            </div>
          </article>

          <article className="tile t-repeat card">
            <div className="tile-text">
              <span className="tile-num">06</span>
              <h3>חוזרים בזמן הנכון</h3>
              <p>מה שקשה – חוזר הרבה. מה שכבר יודעים – פחות. כל תרגיל גדל כמו ציפור עד שהוא הופך לכוכב.</p>
            </div>
            <div className="growth">
              {["🥚", "🐣", "🐥", "🦅", "⭐"].map((e, i) => (
                <span key={e} style={{ animationDelay: `${i * 0.15}s` }}>
                  {e}
                </span>
              ))}
            </div>
          </article>
        </div>
      </section>

      {/* ---------- החברים ---------- */}
      <section className="section">
        <div className="section-head">
          <span className="eyebrow">
            <Icon name="heart" size={15} /> החברים
          </span>
          <h2 className="display-2">הכירו את החבורה</h2>
          <p className="subtitle">כל דמות שומרת על לוח אחד. לחצו על חבר כדי להתחיל.</p>
        </div>
        <div className="friends">
          {NUMBERS.map((n) => {
            const c = CHARACTERS[n];
            return (
              <Link
                key={n}
                href={`/learn/${n}/`}
                className="friend card"
                style={{ ["--c" as string]: c.color, ["--soft" as string]: c.soft }}
              >
                <span className="friend-num">{n}</span>
                <div className="friend-art">
                  <Character n={n} size={92} animate="none" />
                </div>
                <b>{c.name}</b>
                <small>{c.why}</small>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="cta card">
        <div>
          <h2 className="display-2">מוכנים לכבוש את לוח הכפל?</h2>
          <p>מתחילים מהלוחות הקלים, אוספים כוכבים ומדבקות – ובסוף יודעים הכול.</p>
        </div>
        <Link href="/learn/" className="btn big light">
          בואו נתחיל <Icon name="arrowLeft" size={20} />
        </Link>
      </section>
    </>
  );
}
