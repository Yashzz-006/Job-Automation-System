import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Tag({ children }) {
  return (
    <span className="font-mono text-[11px] uppercase tracking-wide text-muted bg-brand-bg border border-brand-border rounded-md px-2 py-1">
      {children}
    </span>
  );
}

export default function JobPostCard({ data, onToggleBookmark }) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(!!data.bookmarked);

  const handleBookmark = (e) => {
    e.stopPropagation();
    setSaved((s) => !s);
    onToggleBookmark?.(data.id, !saved);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -3, boxShadow: "0 10px 30px rgba(13,148,136,0.10)" }}
      onClick={() => navigate(`/student/jobs/${data.id}`)}
      className="bg-brand-surface rounded-xl border border-brand-border p-5 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-brand-bg border border-brand-border flex items-center justify-center overflow-hidden shrink-0">
            {data.logo ? (
              <img src={data.logo} alt={data.company} className="w-full h-full object-cover" />
            ) : (
              <span className="font-display font-semibold text-ink">
                {data.company?.[0] ?? "?"}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted truncate">
              {data.company} {data.postedAt && <>· {data.postedAt}</>}
            </p>
            <h3 className="font-display font-semibold text-ink truncate">{data.title}</h3>
            <p className="text-xs text-muted truncate">{data.location}</p>
          </div>
        </div>

        <button
          onClick={handleBookmark}
          aria-label={saved ? "Remove bookmark" : "Bookmark job"}
          className="shrink-0 text-muted hover:text-ink transition-colors"
        >
          {saved ? "🔖" : "📑"}
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {data.level && <Tag>{data.level}</Tag>}
        {data.jobType && <Tag>{data.jobType}</Tag>}
        {data.workMode && <Tag>{data.workMode}</Tag>}
      </div>

      {data.description && (
        <p className="text-sm text-muted line-clamp-2">{data.description}</p>
      )}
    </motion.div>
  );
}