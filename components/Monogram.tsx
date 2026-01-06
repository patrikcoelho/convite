export default function Monogram() {
  return (
    <div className="flex items-center justify-center">
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        aria-hidden="true"
        className="text-gold"
      >
        <defs>
          <linearGradient id="gold" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#e1c48a" />
            <stop offset="100%" stopColor="#b9965f" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="54" fill="none" stroke="url(#gold)" strokeWidth="2" />
        <circle
          cx="60"
          cy="60"
          r="46"
          fill="none"
          stroke="rgba(202,168,107,0.35)"
          strokeWidth="1"
        />
        <text
          x="50%"
          y="54%"
          textAnchor="middle"
          fontFamily="var(--font-playfair), Times New Roman, serif"
          fontSize="38"
          fill="url(#gold)"
          dominantBaseline="middle"
          letterSpacing="2"
        >
          VP
        </text>
      </svg>
    </div>
  );
}
