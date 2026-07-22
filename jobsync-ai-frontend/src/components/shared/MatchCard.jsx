import { useNavigate } from "react-router-dom";
import MatchScoreRing from "./MatchScoreRing";
import SkillChip from "./SkillChip";

// type: "job" (student browsing jobs) or "candidate" (recruiter browsing candidates)
export default function MatchCard({ type, data }) {
  const navigate = useNavigate();

  const isJob = type === "job";
  const title = isJob ? data.title : data.name;
  const subtitle = isJob ? `${data.company} · ${data.location}` : `${data.domain} · Resume score ${data.resumeScore}`;
  const linkTo = isJob ? `/student/jobs/${data.id}` : `/recruiter/candidates/${data.id}`;

  return (
    <div
      onClick={() => navigate(linkTo)}
      className="bg-white rounded-2xl border border-brand-border shadow-sm p-4 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-brand-blue/30 transition"
    >
      <MatchScoreRing score={data.matchScore} size={56} />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
        <p className="text-sm text-gray-500 truncate">{subtitle}</p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {data.matchedSkills?.slice(0, 3).map((s) => (
            <SkillChip key={s} label={s} variant="matched" />
          ))}
        </div>
      </div>
    </div>
  );
}
