import { useEffect, useState } from "react";
import { motion, animate } from "framer-motion";

export default function StatCard({ label, value, icon: Icon }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value]);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="group bg-brand-surface rounded-xl border border-brand-border p-4 flex items-center gap-3 hover:border-brand-blue/40 transition-colors"
    >
      {Icon && (
        <div className="w-10 h-10 rounded-lg bg-ink text-white flex items-center justify-center text-lg shrink-0 transition-colors group-hover:bg-brand-blue">
          <Icon />
        </div>
      )}
      <div>
        <div className="font-mono text-xl font-semibold text-ink leading-none">{display}</div>
        <div className="font-mono text-[10px] uppercase tracking-wider text-muted mt-1">{label}</div>
      </div>
    </motion.div>
  );
}