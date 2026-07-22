import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

// Multi-orb ambient background with particle field.
// Designed to live behind content — blurred, low-opacity, slow-moving.
export default function AnimatedBackground({ variant = "default" }) {
  const { theme } = useTheme();
  const opacityMultiplier = theme === "dark" ? 1 : 0.4;

  const orbs = variant === "dense"
    ? [
        { cls: "animate-float-a", color: "#4DE6B6", size: 600, top: "-10%", left: "-8%", opacity: 0.25 * opacityMultiplier },
        { cls: "animate-float-b", color: "#818CF8", size: 550, top: "20%", right: "-12%", opacity: 0.2 * opacityMultiplier },
        { cls: "animate-float-c", color: "#F87171", size: 480, bottom: "5%", left: "15%", opacity: 0.18 * opacityMultiplier },
        { cls: "animate-float-d", color: "#FBBF24", size: 420, top: "50%", right: "20%", opacity: 0.15 * opacityMultiplier },
        { cls: "animate-float-a", color: "#4DE6B6", size: 360, bottom: "-10%", right: "-5%", opacity: 0.12 * opacityMultiplier },
      ]
    : [
        { cls: "animate-float-a", color: "#4DE6B6", size: 520, top: "-8%", left: "-5%", opacity: 0.25 * opacityMultiplier },
        { cls: "animate-float-b", color: "#818CF8", size: 480, top: "30%", right: "-10%", opacity: 0.2 * opacityMultiplier },
        { cls: "animate-float-c", color: "#F87171", size: 400, bottom: "0%", left: "25%", opacity: 0.15 * opacityMultiplier },
      ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Gradient Orbs */}
      {orbs.map((orb, i) => (
        <div
          key={i}
          className={`absolute rounded-full blur-3xl ${orb.cls}`}
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            right: orb.right,
            bottom: orb.bottom,
            opacity: orb.opacity,
            background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
          }}
        />
      ))}

      {/* Floating Particles */}
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={`p-${i}`}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 5 + 3,
            height: Math.random() * 5 + 3,
            left: `${Math.random() * 100}%`,
            bottom: "-5%",
            background: i % 3 === 0 ? "#4DE6B6" : i % 3 === 1 ? "#818CF8" : "#FBBF24",
            boxShadow: `0 0 10px ${i % 3 === 0 ? "#4DE6B6" : i % 3 === 1 ? "#818CF8" : "#FBBF24"}`,
          }}
          animate={{
            y: [0, -(window?.innerHeight || 900) * 1.1],
            x: [0, (Math.random() - 0.5) * 100],
            opacity: [0, 0.8, 0.8, 0],
            scale: [0.5, 1.2, 1.2, 0.5],
          }}
          transition={{
            duration: 8 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}