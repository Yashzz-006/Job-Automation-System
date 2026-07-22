import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MatchScoreRing from "./MatchScoreRing";
import SkillChip from "./SkillChip";

// type: "job" (student browsing jobs) or "candidate" (recruiter browsing candidates)
// rank: zero-based index in the current ranked list — drives the badge + "Top match" ribbon
export default function MatchCard({ type, data, rank = null }) {
  const navigate = useNavigate();

  const isJob = type === "job";
  const title = isJob ? data.title : data.name;
  const subtitle = isJob
    ? `${data.company} · ${data.location}`
    : `${data.domain} · Resume score ${data.resumeScore}`;
  const linkTo = isJob ? `/student/jobs/${data.id}` : `/recruiter/candidates/${data.id}`;

  const tierColor =
    data.matchScore >= 80
      ? "var(--color-match-good)"
      : data.matchScore >= 60
      ? "var(--color-match-mid)"
      : "var(--color-match-bad)";

  const extraSkillCount = Math.max((data.matchedSkills?.length || 0) - 3, 0);
  const isTop = rank === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: rank != null ? rank * 0.07 : 0, ease: "easeOut" }}
      whileHover={{ y: -3, boxShadow: "0 10px 30px rgba(13,148,136,0.12)" }}
      onClick={() => navigate(linkTo)}
      className="group relative bg-brand-surface rounded-xl border border-brand-border cursor-pointer overflow-hidden"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: tierColor }} />

      {isTop && (
        <div className="absolute top-0 right-0">
          <div
            className="font-mono text-[9px] uppercase tracking-widest text-white px-3 py-1 rounded-bl-lg"
            style={{ background: "var(--color-brand-blue)" }}
          >
            Top match
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 p-4 pl-6 group-hover:bg-brand-bg/40 transition-colors">
        {rank != null && (
          <span className="font-mono text-xs text-muted w-5 shrink-0 text-center">
            {String(rank + 1).padStart(2, "0")}
          </span>
        )}

        <MatchScoreRing score={data.matchScore} size={58} />

        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-ink truncate">{title}</h3>
          <p className="text-sm text-muted truncate mt-0.5">{subtitle}</p>
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            {data.matchedSkills?.slice(0, 3).map((s) => (
              <SkillChip key={s} label={s} variant="matched" />
            ))}
            {extraSkillCount > 0 && (
              <span className="font-mono text-[11px] text-muted px-1.5">+{extraSkillCount} more</span>
            )}
          </div>
        </div>

        <motion.span className="text-muted shrink-0 text-lg" animate={{ x: 0 }} whileHover={{ x: 3 }}>
          →
        </motion.span>
      </div>
    </motion.div>
  );
}