import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiX, FiCalendar, FiDownload, FiArrowLeft } from "react-icons/fi";
import AppShell from "../../components/shared/AppShell";
import MatchBreakdown from "../../components/shared/MatchBreakdown";
import SkillChip from "../../components/shared/SkillChip";
import { getCandidateDetail } from "../../api/client";

function DetailSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 bg-brand-surface rounded-xl border border-brand-border p-8 space-y-4 skeleton-shimmer">
        <div className="h-8 w-2/3 rounded bg-brand-border" />
        <div className="h-4 w-1/2 rounded bg-brand-border" />
        <div className="h-4 w-1/3 rounded bg-brand-border" />
        <div className="h-16 w-full rounded bg-brand-border mt-8" />
      </div>
      <div className="bg-brand-surface rounded-xl border border-brand-border p-8 h-64 skeleton-shimmer" />
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
        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted hover:text-brand-blue transition-colors mb-6 group max-w-5xl mx-auto block"
      >
        <FiArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
      >
        <div className="md:col-span-2 relative">
          <div className="bg-brand-surface rounded-2xl border border-brand-border/60 p-6 glass-card shadow-2xl relative overflow-hidden">
            
            {/* Subtle glow behind title */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-display text-3xl font-semibold text-ink">{candidate.name}</h2>
                  <p className="font-mono text-sm text-muted mt-2 tracking-wide">
                    {candidate.education?.toUpperCase()}
                  </p>
                  <p className="font-mono text-sm text-muted tracking-wide">
                    {candidate.experience?.toUpperCase()}
                  </p>
                </div>
                
                <AnimatePresence>
                  {status && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={`font-mono text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg border-2 ${
                        status === "shortlisted"
                          ? "text-match-good border-match-good/30 bg-match-good/10"
                          : "text-match-bad border-match-bad/30 bg-match-bad/10"
                      }`}
                    >
                      {status}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-6 pt-6 border-t border-brand-border/50">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-4">
                  Verified Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((s, i) => (
                    <motion.div
                      key={s}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                    >
                      <SkillChip label={s} variant="neutral" />
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 flex-wrap mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStatus(status === "shortlisted" ? null : "shortlisted")}
                  className={`flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all ${
                    status === "shortlisted"
                      ? "bg-match-good text-brand-bg shadow-[0_0_20px_rgba(77,230,182,0.4)]"
                      : "bg-brand-surface border border-brand-border text-ink hover:border-match-good hover:text-match-good"
                  }`}
                >
                  <FiCheck className="text-lg" /> {status === "shortlisted" ? "Shortlisted" : "Shortlist"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStatus(status === "rejected" ? null : "rejected")}
                  className={`flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all ${
                    status === "rejected"
                      ? "bg-match-bad text-brand-bg shadow-[0_0_20px_rgba(248,113,113,0.4)]"
                      : "bg-brand-surface border border-brand-border text-ink hover:border-match-bad hover:text-match-bad"
                  }`}
                >
                  <FiX className="text-lg" /> {status === "rejected" ? "Rejected" : "Reject"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 bg-brand-bg border border-brand-border text-ink rounded-xl px-6 py-3 font-medium hover:bg-brand-border/50 transition-colors ml-auto"
                >
                  <FiCalendar /> Schedule interview
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <MatchBreakdown
            score={candidate.matchScore}
            matchedSkills={candidate.matchedSkills}
            missingSkills={candidate.missingSkills}
          />
        </div>
      </motion.div>
    </AppShell>
  );
}