import { useEffect, useState } from "react";
import { motion, animate } from "framer-motion";

export default function StatCard({ label, value, icon: Icon }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.2,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value]);

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group relative rounded-xl p-[1px] overflow-hidden cursor-default"
    >
      {/* Gradient border on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "conic-gradient(from 180deg, #4DE6B6, #818CF8, #F87171, #4DE6B6)" }}
      />

      {/* Card body */}
      <div className="relative rounded-xl bg-brand-surface p-5 flex items-center gap-4 h-full">
        {Icon && (
          <div className="relative">
            {/* Icon glow */}
            <div className="absolute inset-0 rounded-xl bg-brand-blue/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, rgba(77,230,182,0.15), rgba(129,140,248,0.1))",
                border: "1px solid rgba(77,230,182,0.15)",
              }}
            >
              <Icon className="text-brand-blue" />
            </div>
          </div>
        )}
        <div>
          <div className="font-mono text-2xl font-bold text-ink leading-none">{display}</div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted mt-1.5">{label}</div>
        </div>
      </div>
    </motion.div>
  );
}