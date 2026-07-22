import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiCheck, FiX, FiCalendar, FiDownload } from "react-icons/fi";
import AppShell from "../../components/shared/AppShell";
import MatchBreakdown from "../../components/shared/MatchBreakdown";
import SkillChip from "../../components/shared/SkillChip";
import { getCandidateDetail } from "../../api/client";

export default function CandidateDetail() {
  const { candidateId } = useParams();
  const [candidate, setCandidate] = useState(null);

  useEffect(() => {
    getCandidateDetail(candidateId).then(setCandidate);
  }, [candidateId]);

  if (!candidate) {
    return (
      <AppShell title="Candidate">
        <p className="text-sm text-gray-400">Loading...</p>
      </AppShell>
    );
  }

  return (
    <AppShell title={candidate.name}>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl border border-brand-border p-6">
          <h2 className="text-xl font-semibold text-gray-900">{candidate.name}</h2>
          <p className="text-sm text-gray-500 mt-1">{candidate.education}</p>
          <p className="text-sm text-gray-500">{candidate.experience}</p>

          <p className="text-xs font-medium text-gray-500 mt-4 mb-1.5">All skills</p>
          <div className="flex flex-wrap gap-1.5 mb-6">
            {candidate.skills.map((s) => (
              <SkillChip key={s} label={s} variant="neutral" />
            ))}
          </div>

          <div className="flex gap-3 flex-wrap">
            <button className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 rounded-xl px-4 py-2 text-sm font-medium hover:bg-green-100 transition">
              <FiCheck /> Shortlist
            </button>
            <button className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 rounded-xl px-4 py-2 text-sm font-medium hover:bg-red-100 transition">
              <FiX /> Reject
            </button>
            <button className="flex items-center gap-2 bg-white border border-brand-border rounded-xl px-4 py-2 text-sm font-medium hover:bg-gray-50 transition">
              <FiCalendar /> Schedule interview
            </button>
            <button className="flex items-center gap-2 bg-white border border-brand-border rounded-xl px-4 py-2 text-sm font-medium hover:bg-gray-50 transition">
              <FiDownload /> Download resume
            </button>
          </div>
        </div>

        <MatchBreakdown
          score={candidate.matchScore}
          matchedSkills={candidate.matchedSkills}
          missingSkills={candidate.missingSkills}
        />
      </div>
    </AppShell>
  );
}
