import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Tag({ children }) {
  return (
    <span className="font-mono text-[11px] uppercase tracking-wide text-muted bg-brand-bg/80 border border-brand-border/50 rounded-lg px-2 py-1">
      {children}
    </span>
  );
}

export default function JobPostCard({ data, onToggleBookmark, index = 0 }) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(!!data.bookmarked);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    setSaved((s) => !s);
    onToggleBookmark?.(data.id, !saved);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      onClick={() => navigate(`/student/jobs/${data.id}`)}
      className="group relative rounded-xl p-[1px] cursor-pointer overflow-hidden"
    >
      {/* Animated gradient border */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "conic-gradient(from 0deg, rgba(77,230,182,0.3), rgba(129,140,248,0.2), rgba(77,230,182,0.3))" }}
      />

      {/* Card body */}
      <div className="relative rounded-xl bg-brand-surface p-5 h-full overflow-hidden">
        {/* Spotlight */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: opacity * 0.8,
            background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, rgba(77,230,182,0.06), transparent 40%)`
          }}
        />

        <div className="relative z-10 flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden shrink-0"
              style={{ background: "rgba(77,230,182,0.08)", border: "1px solid rgba(77,230,182,0.12)" }}
            >
              {data.logo ? (
                <img src={data.logo} alt={data.company} className="w-full h-full object-cover" />
              ) : (
                <span className="font-display font-semibold text-brand-blue text-sm">
                  {data.company?.[0] ?? "?"}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted truncate">
                {data.company} {data.postedAt && <>· {data.postedAt}</>}
              </p>
              <h3 className="font-display font-semibold text-ink truncate group-hover:text-brand-blue transition-colors duration-300">{data.title}</h3>
              <p className="text-xs text-muted truncate">{data.location}</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.85 }}
            onClick={handleBookmark}
            aria-label={saved ? "Remove bookmark" : "Bookmark job"}
            className="shrink-0 text-muted hover:text-brand-blue transition-colors text-lg"
          >
            {saved ? "🔖" : "📑"}
          </motion.button>
        </div>

        <div className="relative z-10 flex flex-wrap gap-1.5 mb-3">
          {data.level && <Tag>{data.level}</Tag>}
          {data.jobType && <Tag>{data.jobType}</Tag>}
          {data.workMode && <Tag>{data.workMode}</Tag>}
        </div>

        {data.description && (
          <p className="relative z-10 text-sm text-muted line-clamp-2">{data.description}</p>
        )}
      </div>
    </motion.div>
  );
}