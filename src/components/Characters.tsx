// דמויות תלת-ממדיות (Microsoft Fluent Emoji 3D – רישיון MIT) עם אנימציות "חיים":
// נשימה, ריחוף, קפיצה, תגובה לעכבר וניצוצות בהצלחה.

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

type Props = {
  n: number;
  size?: number;
  mood?: "happy" | "wow";
  animate?: "bounce" | "wiggle" | "float" | "none";
  className?: string;
};

export default function Character({ n, size = 120, mood = "happy", animate = "float", className = "" }: Props) {
  const src = `${BASE}/characters/${n >= 1 && n <= 10 ? n : 5}.png`;
  return (
    <span
      className={`character anim-${animate} ${mood === "wow" ? "mood-wow" : ""} ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span className="char-shadow" />
      <span className="char-body">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" width={size} height={size} draggable={false} loading="lazy" decoding="async" />
      </span>
      {mood === "wow" && (
        <>
          <span className="spark s1">✦</span>
          <span className="spark s2">✦</span>
          <span className="spark s3">✦</span>
        </>
      )}
    </span>
  );
}
