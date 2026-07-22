import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import AppShell from "../../components/shared/AppShell";
import MatchBreakdown from "../../components/shared/MatchBreakdown";
import { getJobDetail } from "../../api/client";

function DetailSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-brand-surface rounded-xl border border-brand-border p-6 space-y-3">
        <div className="h-6 w-2/3 rounded bg-brand-border animate-pulse" />
        <div className="h-3 w-1/2 rounded bg-brand-border animate-pulse" />
        <div className="h-3 w-1/3 rounded bg-brand-border animate-pulse" />
        <div className="h-20 w-full rounded bg-brand-border animate-pulse mt-4" />
      </div>
      <div className="bg-brand-surface rounded-xl border border-brand-border p-6 h-48 animate-pulse" />
    </div>
  );
}

export default function JobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    getJobDetail(jobId).then(setJob);
  }, [jobId]);

  if (!job) {
    return (
      <AppShell title="Job details">
        <DetailSkeleton />
      </AppShell>
    );
  }

  return (
    <AppShell title={job.title}>
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
          <h2 className="font-display text-xl font-semibold text-ink">{job.title}</h2>
          <p className="font-mono text-xs text-muted mt-2 tracking-wide">
            {job.company.toUpperCase()} · {job.location.toUpperCase()} · {job.type?.toUpperCase()}
          </p>
          <p className="font-mono text-xs text-muted mt-1 tracking-wide">{job.stipendOrCtc}</p>
          <p className="text-ink/80 mt-4 leading-relaxed">{job.description}</p>

          <motion.button
            whileHover={{ scale: applied ? 1 : 1.02 }}
            whileTap={{ scale: applied ? 1 : 0.98 }}
            onClick={() => setApplied(true)}
            disabled={applied}
            className={`mt-6 rounded-lg px-6 py-2.5 font-medium transition flex items-center gap-2 ${
              applied
                ? "bg-match-good/10 text-match-good border border-match-good/25 cursor-default"
                : "bg-brand-blue text-white hover:opacity-90"
            }`}
          >
            <AnimatePresence mode="wait">
              {applied ? (
                <motion.span
                  key="applied"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2"
                >
                  <FiCheck /> Applied
                </motion.span>
              ) : (
                <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  Apply now
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        <MatchBreakdown
          score={job.matchScore}
          matchedSkills={job.matchedSkills}
          missingSkills={job.missingSkills}
        />
      </motion.div>
    </AppShell>
  );
}