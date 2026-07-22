import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheck, FiX, FiCalendar, FiDownload, FiArrowLeft } from "react-icons/fi";
import AppShell from "../../components/shared/AppShell";
import MatchBreakdown from "../../components/shared/MatchBreakdown";
import SkillChip from "../../components/shared/SkillChip";
import { getCandidateDetail } from "../../api/client";

function DetailSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-brand-surface rounded-xl border border-brand-border p-6 space-y-3">
        <div className="h-6 w-2/3 rounded bg-brand-border animate-pulse" />
        <div className="h-3 w-1/2 rounded bg-brand-border animate-pulse" />
        <div className="h-3 w-1/3 rounded bg-brand-border animate-pulse" />
        <div className="h-16 w-full rounded bg-brand-border animate-pulse mt-4" />
      </div>
      <div className="bg-brand-surface rounded-xl border border-brand-border p-6 h-48 animate-pulse" />
    </div>
  );
}

export default function CandidateDetail() {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [status, setStatus] = useState(null); // "shortlisted" | "rejected" | null

  useEffect(() => {
    getCandidateDetail(candidateId).then(setCandidate);
  }, [candidateId]);

  if (!candidate) {
    return (
      <AppShell title="Candidate">
        <DetailSkeleton />
      </AppShell>
    );
  }

  return (
    <AppShell title={candidate.name}>
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted hover:text-brand-blue transition mb-4"
      >
        <FiArrowLeft className="w-3.5 h-3.5" /> Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="grid md:grid-cols-3 gap-6"
      >
        <div className="md:col-span-2 bg-brand-surface rounded-xl border border-brand-border p-6">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-xl font-semibold text-ink">{candidate.name}</h2>
            {status && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-md border ${
                  status === "shortlisted"
                    ? "bg-match-good/10 text-match-good border-match-good/25"
                    : "bg-match-bad/10 text-match-bad border-match-bad/25"
                }`}
              >
                {status}
              </motion.span>
            )}
          </div>
          <p className="font-mono text-xs text-muted mt-2 tracking-wide">
            {candidate.education?.toUpperCase()}
          </p>
          <p className="font-mono text-xs text-muted tracking-wide">
            {candidate.experience?.toUpperCase()}
          </p>

          <p className="font-mono text-[10px] uppercase tracking-wider text-muted mt-4 mb-2">
            All skills
          </p>
          <div className="flex flex-wrap gap-1.5 mb-6">
            {candidate.skills.map((s) => (
              <SkillChip key={s} label={s} variant="neutral" />
            ))}
          </div>

          <div className="flex gap-3 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStatus(status === "shortlisted" ? null : "shortlisted")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition border ${
                status === "shortlisted"
                  ? "bg-match-good text-white border-match-good"
                  : "bg-match-good/10 text-match-good border-match-good/25 hover:bg-match-good/15"
              }`}
            >
              <FiCheck /> {status === "shortlisted" ? "Shortlisted" : "Shortlist"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStatus(status === "rejected" ? null : "rejected")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition border ${
                status === "rejected"
                  ? "bg-match-bad text-white border-match-bad"
                  : "bg-match-bad/10 text-match-bad border-match-bad/25 hover:bg-match-bad/15"
              }`}
            >
              <FiX /> {status === "rejected" ? "Rejected" : "Reject"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 bg-brand-surface border border-brand-border text-ink rounded-lg px-4 py-2 text-sm font-medium hover:bg-brand-bg transition"
            >
              <FiCalendar /> Schedule interview
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 bg-brand-surface border border-brand-border text-ink rounded-lg px-4 py-2 text-sm font-medium hover:bg-brand-bg transition"
            >
              <FiDownload /> Download resume
            </motion.button>
          </div>
        </div>

        <MatchBreakdown
          score={candidate.matchScore}
          matchedSkills={candidate.matchedSkills}
          missingSkills={candidate.missingSkills}
        />
      </motion.div>
    </AppShell>
  );
}