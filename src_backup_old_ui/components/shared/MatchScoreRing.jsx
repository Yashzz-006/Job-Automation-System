export default function MatchScoreRing({ score = 0, size = 84, label, theme = "light" }) {
  const strokeWidth = size * 0.09;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  const startAngle = -225;
  const sweepAngle = 270;
  const valueAngle = startAngle + (score / 100) * sweepAngle;

  const toRad = (deg) => (deg * Math.PI) / 180;
  const point = (angleDeg, r) => ({
    x: center + r * Math.cos(toRad(angleDeg)),
    y: center + r * Math.sin(toRad(angleDeg)),
  });

  const describeArc = (fromDeg, toDeg, r) => {
    const start = point(fromDeg, r);
    const end = point(toDeg, r);
    const largeArc = toDeg - fromDeg > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  };

  const gradientId = `dial-gradient-${size}-${score}`;
  const isDark = theme === "dark";

  const trackColor = isDark ? "rgba(255,255,255,0.12)" : "var(--color-brand-border)";
  const tickColor = isDark ? "rgba(255,255,255,0.3)" : "var(--color-muted)";
  const numberColor = isDark ? "#ffffff" : "var(--color-ink)";
  const captionColor = isDark ? "rgba(255,255,255,0.4)" : "var(--color-muted)";

  const ticks = [0, 25, 50, 75, 100];

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-brand-blue)" />
              <stop offset="100%" stopColor="var(--color-brand-purple)" />
            </linearGradient>
          </defs>

          <path
            d={describeArc(startAngle, startAngle + sweepAngle, radius)}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {ticks.map((t) => {
            const angle = startAngle + (t / 100) * sweepAngle;
            const outer = point(angle, radius + strokeWidth * 0.75);
            const inner = point(angle, radius + strokeWidth * 0.35);
            return (
              <line
                key={t}
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke={tickColor}
                strokeWidth={1}
              />
            );
          })}

          <path
            d={describeArc(startAngle, valueAngle, radius)}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{ transition: "d 0.7s cubic-bezier(0.4, 0, 0.2, 1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-mono font-semibold"
            style={{ fontSize: size * 0.24, color: numberColor }}
          >
            {score}
          </span>
          <span
            className="text-[9px] uppercase tracking-wide -mt-0.5"
            style={{ color: captionColor }}
          >
            match
          </span>
        </div>
      </div>
      {label && (
        <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "var(--color-muted)" }}>
          {label}
        </span>
      )}
    </div>
  );
}