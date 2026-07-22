import { motion } from "framer-motion";
import MatchScoreRing from "./MatchScoreRing";
import SkillChip from "./SkillChip";

export default function MatchBreakdown({
  score,
  matchedSkills = [],
  missingSkills = [],
  semanticFit,
}) {
  const totalSkills = matchedSkills.length + missingSkills.length;
  const skillOverlap = totalSkills > 0 ? Math.round((matchedSkills.length / totalSkills) * 100) : 0;
  const fit = semanticFit ?? score ?? 0;

  return (
    <div className="bg-brand-surface rounded-xl border border-brand-border p-5 sticky top-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display font-semibold text-ink">Match breakdown</h3>
          <p className="font-mono text-[10px] tracking-widest text-muted mt-0.5">AI READING</p>
        </div>
        <MatchScoreRing score={score} size={68} />
      </div>

      <div className="mb-5">
        <div className="font-mono text-[10px] uppercase tracking-wider text-muted mb-1.5 flex justify-between">
          <span>Skill overlap · {skillOverlap}%</span>
          <span>Semantic fit · {fit}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden bg-brand-bg flex gap-px">
          <motion.div
            className="bg-brand-blue h-full rounded-l-full"
            initial={{ width: 0 }}
            animate={{ width: `${skillOverlap}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          <motion.div
            className="bg-brand-purple h-full rounded-r-full"
            initial={{ width: 0 }}
            animate={{ width: `${fit}%` }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          />
        </div>
      </div>

      <div className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-2">Matched skills</p>
        {matchedSkills.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {matchedSkills.map((s) => (
              <SkillChip key={s} label={s} variant="matched" />
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted">No overlapping skills found.</p>
        )}
      </div>

      <div>
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-2">Missing skills</p>
        {missingSkills.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {missingSkills.map((s) => (
              <SkillChip key={s} label={s} variant="missing" />
            ))}
          </div>
        ) : (
          <p className="text-xs text-match-good">All required skills covered.</p>
        )}
      </div>
    </div>
  );
}