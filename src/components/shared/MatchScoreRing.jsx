import { motion, animate } from "framer-motion";
import { useEffect, useState, useId } from "react";

export default function MatchScoreRing({ score = 0, size = 84, label, theme = "dark" }) {
  const uniqueId = useId();
  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth * 3) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Use 270° arc (3/4 circle)
  const arcLength = circumference * 0.75;
  const scoreOffset = arcLength - (score / 100) * arcLength;
  
  const isDark = theme === "dark";

  // Animated counter
  const [displayScore, setDisplayScore] = useState(0);
  useEffect(() => {
    const controls = animate(0, score, {
      duration: 1.4,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.3,
      onUpdate: (v) => setDisplayScore(Math.round(v)),
    });
    return () => controls.stop();
  }, [score]);

  // Color based on score tier
  const tierColor =
    score >= 80 ? "#4DE6B6" : score >= 60 ? "#FBBF24" : "#F87171";
  const tierColorSecondary =
    score >= 80 ? "#818CF8" : score >= 60 ? "#F59E0B" : "#EF4444";
  
  const trackColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const numberColor = isDark ? "#ffffff" : "var(--color-ink)";
  const captionColor = isDark ? "rgba(255,255,255,0.4)" : "var(--color-muted)";

  const gradientId = `ring-grad-${uniqueId}`;
  const glowId = `ring-glow-${uniqueId}`;
  const bgGlowId = `ring-bg-glow-${uniqueId}`;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: "rotate(-225deg)" }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={tierColor} />
              <stop offset="100%" stopColor={tierColorSecondary} />
            </linearGradient>
            <filter id={glowId}>
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feFlood floodColor={tierColor} floodOpacity="0.8" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id={bgGlowId}>
              <feGaussianBlur stdDeviation="8" />
            </filter>
          </defs>

          {/* Background track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
          />

          {/* Subtle background glow arc */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={tierColor}
            strokeWidth={strokeWidth * 2.5}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            filter={`url(#${bgGlowId})`}
            opacity={0.15}
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset: scoreOffset }}
            transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
          />

          {/* Main animated arc */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            filter={`url(#${glowId})`}
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset: scoreOffset }}
            transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
          />

          {/* Decorative tick marks */}
          {[0, 25, 50, 75, 100].map((t) => {
            const angle = (t / 100) * 270 * (Math.PI / 180);
            const innerR = radius - strokeWidth * 1.2;
            const outerR = radius - strokeWidth * 0.3;
            return (
              <line
                key={t}
                x1={center + innerR * Math.cos(angle)}
                y1={center + innerR * Math.sin(angle)}
                x2={center + outerR * Math.cos(angle)}
                y2={center + outerR * Math.sin(angle)}
                stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}
                strokeWidth={1}
              />
            );
          })}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-mono font-bold leading-none"
            style={{ fontSize: size * 0.26, color: numberColor }}
          >
            {displayScore}
          </span>
          <span
            className="font-mono uppercase tracking-widest"
            style={{ fontSize: Math.max(size * 0.09, 8), color: captionColor }}
          >
            match
          </span>
        </div>
      </div>
      {label && (
        <span className="text-xs font-mono tracking-wide" style={{ color: captionColor }}>
          {label}
        </span>
      )}
    </div>
  );
}