// דמויות מצוירות (SVG) – אחת לכל מספר. כל דמות "נושאת" את המספר שלה בגוף.

type FaceProps = { x: number; y: number; s?: number; mood?: "happy" | "wow" };

function Face({ x, y, s = 1, mood = "happy" }: FaceProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx={-8} cy={0} r={5.5} fill="#fff" />
      <circle cx={8} cy={0} r={5.5} fill="#fff" />
      <circle cx={-7} cy={1} r={3} fill="#222" />
      <circle cx={9} cy={1} r={3} fill="#222" />
      <circle cx={-6} cy={0} r={1} fill="#fff" />
      <circle cx={10} cy={0} r={1} fill="#fff" />
      <circle cx={-14} cy={9} r={3} fill="#ff8fa3" opacity={0.6} />
      <circle cx={14} cy={9} r={3} fill="#ff8fa3" opacity={0.6} />
      {mood === "wow" ? (
        <ellipse cx={0} cy={11} rx={3.5} ry={4} fill="#7a2230" />
      ) : (
        <path d="M-6 8 Q0 15 6 8" stroke="#7a2230" strokeWidth={2.2} fill="none" strokeLinecap="round" />
      )}
    </g>
  );
}

function Giraffe({ mood }: { mood?: FaceProps["mood"] }) {
  return (
    <g>
      <rect x={52} y={30} width={16} height={60} rx={8} fill="#f4c04e" />
      <circle cx={57} cy={48} r={3} fill="#c47a1d" />
      <circle cx={63} cy={62} r={3.5} fill="#c47a1d" />
      <circle cx={57} cy={76} r={3} fill="#c47a1d" />
      <ellipse cx={60} cy={96} rx={26} ry={16} fill="#f4c04e" />
      <circle cx={50} cy={94} r={4} fill="#c47a1d" />
      <circle cx={70} cy={98} r={4.5} fill="#c47a1d" />
      <rect x={40} y={104} width={7} height={14} rx={3} fill="#e0a937" />
      <rect x={73} y={104} width={7} height={14} rx={3} fill="#e0a937" />
      <line x1={50} y1={14} x2={48} y2={4} stroke="#c47a1d" strokeWidth={3} strokeLinecap="round" />
      <line x1={70} y1={14} x2={72} y2={4} stroke="#c47a1d" strokeWidth={3} strokeLinecap="round" />
      <circle cx={48} cy={4} r={3} fill="#8a4f12" />
      <circle cx={72} cy={4} r={3} fill="#8a4f12" />
      <ellipse cx={60} cy={26} rx={20} ry={16} fill="#f4c04e" />
      <ellipse cx={60} cy={34} rx={11} ry={7} fill="#f8d98d" />
      <Face x={60} y={22} s={0.8} mood={mood} />
    </g>
  );
}

function Swan({ mood }: { mood?: FaceProps["mood"] }) {
  return (
    <g>
      <path d="M8 104 Q20 98 32 104 T56 104 T80 104 T104 104 T120 104 V120 H0 V104Z" fill="#9fd6f7" />
      <ellipse cx={66} cy={88} rx={34} ry={18} fill="#fff" stroke="#cfe4f2" strokeWidth={2} />
      <path d="M70 80 Q90 70 98 86" fill="#eef7fd" stroke="#cfe4f2" strokeWidth={2} />
      <path
        d="M40 86 C 30 66, 30 50, 44 36 C 52 28, 46 18, 38 22"
        stroke="#fff"
        strokeWidth={14}
        fill="none"
        strokeLinecap="round"
      />
      <circle cx={40} cy={26} r={15} fill="#fff" stroke="#cfe4f2" strokeWidth={2} />
      <path d="M26 28 L14 32 L26 34Z" fill="#ff9a3c" />
      <Face x={42} y={24} s={0.6} mood={mood} />
      <path d="M48 14 Q52 8 56 13" stroke="#f9b8d0" strokeWidth={3} fill="none" strokeLinecap="round" />
    </g>
  );
}

function Clover({ mood }: { mood?: FaceProps["mood"] }) {
  const leaf = (rot: number) => (
    <g transform={`rotate(${rot} 60 56)`}>
      <circle cx={50} cy={30} r={17} fill="#46c27a" />
      <circle cx={70} cy={30} r={17} fill="#46c27a" />
      <path d="M36 38 L60 60 L84 38Z" fill="#46c27a" />
    </g>
  );
  return (
    <g>
      <path d="M60 70 Q62 95 50 116" stroke="#2f9a5c" strokeWidth={6} fill="none" strokeLinecap="round" />
      {leaf(0)}
      {leaf(120)}
      {leaf(240)}
      <circle cx={60} cy={56} r={18} fill="#6fdc9b" />
      <Face x={60} y={53} s={0.75} mood={mood} />
    </g>
  );
}

function Dog({ mood }: { mood?: FaceProps["mood"] }) {
  return (
    <g>
      <path d="M96 76 Q112 64 108 52" stroke="#b9773d" strokeWidth={6} fill="none" strokeLinecap="round" />
      <ellipse cx={70} cy={82} rx={30} ry={18} fill="#c98a4b" />
      {[46, 58, 78, 90].map((x) => (
        <rect key={x} x={x} y={92} width={9} height={22} rx={4} fill="#b9773d" />
      ))}
      <circle cx={42} cy={52} r={24} fill="#c98a4b" />
      <ellipse cx={22} cy={52} rx={8} ry={16} fill="#8a5427" transform="rotate(15 22 52)" />
      <ellipse cx={62} cy={52} rx={8} ry={16} fill="#8a5427" transform="rotate(-15 62 52)" />
      <ellipse cx={42} cy={62} rx={11} ry={8} fill="#f1d3b1" />
      <ellipse cx={42} cy={58} rx={4} ry={3} fill="#3a2414" />
      <Face x={42} y={46} s={0.75} mood={mood} />
      <rect x={30} y={72} width={24} height={5} rx={2.5} fill="#e5484d" />
      <circle cx={42} cy={79} r={4} fill="#f2c200" />
    </g>
  );
}

function Star({ mood }: { mood?: FaceProps["mood"] }) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 === 0 ? 52 : 24;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    return `${60 + r * Math.cos(a)},${64 + r * Math.sin(a)}`;
  }).join(" ");
  return (
    <g>
      <polygon points={pts} fill="#ffd43b" stroke="#f2a900" strokeWidth={4} strokeLinejoin="round" />
      <Face x={60} y={62} s={0.9} mood={mood} />
      <circle cx={100} cy={20} r={3} fill="#ffd43b" />
      <circle cx={18} cy={28} r={2} fill="#ffd43b" />
    </g>
  );
}

function Ladybug({ mood }: { mood?: FaceProps["mood"] }) {
  const legs = [
    [34, 62, 16, 54],
    [32, 78, 12, 80],
    [36, 94, 18, 106],
    [86, 62, 104, 54],
    [88, 78, 108, 80],
    [84, 94, 102, 106],
  ];
  return (
    <g>
      {legs.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#222" strokeWidth={4} strokeLinecap="round" />
      ))}
      <ellipse cx={60} cy={80} rx={32} ry={30} fill="#e5484d" />
      <line x1={60} y1={52} x2={60} y2={110} stroke="#222" strokeWidth={3} />
      {[
        [46, 72],
        [74, 72],
        [44, 94],
        [76, 94],
        [60, 104],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={6} fill="#222" />
      ))}
      <circle cx={60} cy={42} r={20} fill="#333" />
      <line x1={52} y1={24} x2={44} y2={10} stroke="#333" strokeWidth={3} />
      <line x1={68} y1={24} x2={76} y2={10} stroke="#333" strokeWidth={3} />
      <circle cx={44} cy={10} r={4} fill="#e5484d" />
      <circle cx={76} cy={10} r={4} fill="#e5484d" />
      <Face x={60} y={40} s={0.75} mood={mood} />
    </g>
  );
}

function Rainbow({ mood }: { mood?: FaceProps["mood"] }) {
  const colors = ["#e5484d", "#ff8c42", "#f2c200", "#46c27a", "#4aa8e0", "#3b5bdb", "#8e5cd9"];
  return (
    <g>
      {colors.map((c, i) => (
        <path
          key={c}
          d={`M${14 + i * 5} 88 A ${46 - i * 5} ${46 - i * 5} 0 0 1 ${106 - i * 5} 88`}
          stroke={c}
          strokeWidth={5.5}
          fill="none"
        />
      ))}
      <g>
        <circle cx={22} cy={92} r={14} fill="#fff" />
        <circle cx={36} cy={96} r={12} fill="#fff" />
        <circle cx={10} cy={98} r={10} fill="#fff" />
        <circle cx={98} cy={92} r={14} fill="#fff" />
        <circle cx={84} cy={96} r={12} fill="#fff" />
        <circle cx={110} cy={98} r={10} fill="#fff" />
      </g>
      <Face x={60} y={78} s={0.7} mood={mood} />
    </g>
  );
}

function Octopus({ mood }: { mood?: FaceProps["mood"] }) {
  const arms = Array.from({ length: 8 }, (_, i) => {
    const x = 22 + i * 10.8;
    const dir = i % 2 === 0 ? 1 : -1;
    return `M${x} 70 q ${dir * 8} 14 0 26 q ${-dir * 8} 10 ${dir * 4} 18`;
  });
  return (
    <g>
      {arms.map((d, i) => (
        <path key={i} d={d} stroke="#d94f9c" strokeWidth={8} fill="none" strokeLinecap="round" />
      ))}
      <ellipse cx={60} cy={50} rx={40} ry={34} fill="#e86aae" />
      <ellipse cx={46} cy={30} rx={10} ry={6} fill="#f6a6cf" />
      <Face x={60} y={54} s={0.95} mood={mood} />
    </g>
  );
}

function Cat({ mood }: { mood?: FaceProps["mood"] }) {
  return (
    <g>
      <path d="M92 104 Q116 96 108 70" stroke="#ff8c42" strokeWidth={8} fill="none" strokeLinecap="round" />
      <ellipse cx={64} cy={96} rx={30} ry={20} fill="#ffa564" />
      <path d="M26 30 L32 4 L50 22Z" fill="#ff8c42" />
      <path d="M94 30 L88 4 L70 22Z" fill="#ff8c42" />
      <path d="M32 24 L34 12 L44 22Z" fill="#ffc4d0" />
      <path d="M88 24 L86 12 L76 22Z" fill="#ffc4d0" />
      <circle cx={60} cy={48} r={34} fill="#ffa564" />
      <path d="M50 18 L52 28 M60 15 L60 27 M70 18 L68 28" stroke="#e0712a" strokeWidth={3} strokeLinecap="round" />
      <Face x={60} y={46} s={0.9} mood={mood} />
      <path d="M30 56 H12 M30 62 H14 M90 56 H108 M90 62 H106" stroke="#7a4a2a" strokeWidth={1.8} strokeLinecap="round" />
      <path d="M57 54 L63 54 L60 58Z" fill="#ff5c8a" />
    </g>
  );
}

function Robot({ mood }: { mood?: FaceProps["mood"] }) {
  return (
    <g>
      <line x1={60} y1={18} x2={60} y2={6} stroke="#5b7083" strokeWidth={4} />
      <circle cx={60} cy={6} r={5} fill="#e5484d" className="blink" />
      <rect x={28} y={18} width={64} height={46} rx={12} fill="#9fb3c8" stroke="#5b7083" strokeWidth={3} />
      <rect x={36} y={26} width={48} height={30} rx={8} fill="#dff3ff" />
      <Face x={60} y={38} s={0.8} mood={mood} />
      <rect x={34} y={68} width={52} height={40} rx={10} fill="#9fb3c8" stroke="#5b7083" strokeWidth={3} />
      <circle cx={60} cy={88} r={12} fill="#fff" stroke="#5b7083" strokeWidth={3} />
      <text x={60} y={94} textAnchor="middle" fontSize={17} fontWeight={800} fill="#5b7083">
        0
      </text>
      <rect x={16} y={72} width={14} height={30} rx={7} fill="#9fb3c8" stroke="#5b7083" strokeWidth={3} />
      <rect x={90} y={72} width={14} height={30} rx={7} fill="#9fb3c8" stroke="#5b7083" strokeWidth={3} />
      <rect x={42} y={108} width={12} height={10} rx={3} fill="#5b7083" />
      <rect x={66} y={108} width={12} height={10} rx={3} fill="#5b7083" />
    </g>
  );
}

const DRAWINGS: Record<number, (p: { mood?: FaceProps["mood"] }) => React.JSX.Element> = {
  1: Giraffe,
  2: Swan,
  3: Clover,
  4: Dog,
  5: Star,
  6: Ladybug,
  7: Rainbow,
  8: Octopus,
  9: Cat,
  10: Robot,
};

type Props = {
  n: number;
  size?: number;
  mood?: FaceProps["mood"];
  animate?: "bounce" | "wiggle" | "float" | "none";
  className?: string;
};

export default function Character({ n, size = 120, mood = "happy", animate = "float", className = "" }: Props) {
  const Draw = DRAWINGS[n] ?? Star;
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={`character anim-${animate} ${className}`}
      aria-hidden="true"
    >
      <Draw mood={mood} />
    </svg>
  );
}
