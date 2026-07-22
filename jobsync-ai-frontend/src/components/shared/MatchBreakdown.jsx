import MatchScoreRing from "./MatchScoreRing";
import SkillChip from "./SkillChip";

export default function MatchBreakdown({ score, matchedSkills = [], missingSkills = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-5 sticky top-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Match breakdown</h3>
        <MatchScoreRing score={score} size={64} />
      </div>

      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-1 flex justify-between">
          <span>Skill overlap</span>
          <span>Semantic fit</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden bg-gray-100 flex">
          <div className="bg-brand-blue h-full" style={{ width: "40%" }} />
          <div className="bg-brand-purple h-full" style={{ width: "60%" }} />
        </div>
      </div>

      <div className="mb-3">
        <p className="text-xs font-medium text-gray-500 mb-1.5">Matched skills</p>
        <div className="flex flex-wrap gap-1.5">
          {matchedSkills.map((s) => (
            <SkillChip key={s} label={s} variant="matched" />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-500 mb-1.5">Missing skills</p>
        <div className="flex flex-wrap gap-1.5">
          {missingSkills.map((s) => (
            <SkillChip key={s} label={s} variant="missing" />
          ))}
        </div>
      </div>
    </div>
  );
}
