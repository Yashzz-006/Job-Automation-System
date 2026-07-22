import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft, FiCheck, FiLoader, FiMapPin, FiClock } from "react-icons/fi";
import AppShell from "../../components/shared/AppShell";
import MatchBreakdown from "../../components/shared/MatchBreakdown";
import { getJobDetail } from "../../api/client";

function DetailSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 bg-brand-surface rounded-xl border border-brand-border p-8 space-y-4 skeleton-shimmer">
        <div className="h-8 w-2/3 rounded bg-brand-border" />
        <div className="h-4 w-1/2 rounded bg-brand-border" />
        <div className="h-4 w-1/3 rounded bg-brand-border" />
        <div className="h-24 w-full rounded bg-brand-border mt-8" />
      </div>
      <div className="bg-brand-surface rounded-xl border border-brand-border p-8 h-64 skeleton-shimmer" />
    </div>
  );
}

export default function JobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [status, setStatus] = useState("idle"); // idle, submitting, applied

  useEffect(() => {
    getJobDetail(jobId).then(setJob);
  }, [jobId]);

  const handleApply = () => {
    setStatus("submitting");
    setTimeout(() => {
      setStatus("applied");
    }, 1200);
  };

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
            <div className="absolute top-0 left-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <h2 className="font-display text-3xl font-semibold text-ink">{job.title}</h2>
              <p className="font-mono text-sm text-brand-blue mt-2 tracking-wide">
                {job.company.toUpperCase()}
              </p>
              
              <div className="flex flex-wrap gap-4 mt-4 font-mono text-xs text-muted">
                <span className="flex items-center gap-1.5"><FiMapPin /> {job.location.toUpperCase()}</span>
                <span className="flex items-center gap-1.5"><FiClock /> {job.type?.toUpperCase() || "FULL-TIME"}</span>
                <span className="bg-brand-bg px-2 py-1 rounded text-ink/70 border border-brand-border/50">{job.stipendOrCtc}</span>
              </div>
              
              <div className="mt-6 pt-6 border-t border-brand-border/50">
                <h3 className="font-display text-lg font-medium text-ink mb-3">About the role</h3>
                <p className="text-ink/80 leading-relaxed text-sm whitespace-pre-wrap">{job.description}</p>
              </div>

              <motion.button
                whileHover={{ scale: status === "idle" ? 1.02 : 1 }}
                whileTap={{ scale: status === "idle" ? 0.98 : 1 }}
                onClick={handleApply}
                disabled={status !== "idle"}
                className={`mt-6 rounded-xl px-8 py-3.5 font-semibold transition-all flex items-center justify-center gap-2 min-w-[160px] ${
                  status === "applied"
                    ? "bg-match-good text-brand-bg shadow-[0_0_20px_rgba(77,230,182,0.4)] cursor-default"
                    : status === "submitting"
                    ? "bg-brand-blue/20 text-brand-blue border border-brand-blue/30 cursor-wait"
                    : "bg-brand-blue text-brand-bg hover:opacity-90 shadow-[0_0_20px_rgba(77,230,182,0.2)] hover:shadow-[0_0_30px_rgba(77,230,182,0.4)]"
                }`}
              >
                <AnimatePresence mode="wait">
                  {status === "submitting" ? (
                    <motion.span
                      key="submitting"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-center gap-2"
                    >
                      <FiLoader className="animate-spin text-lg" /> Submitting...
                    </motion.span>
                  ) : status === "applied" ? (
                    <motion.span
                      key="applied"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2"
                    >
                      <FiCheck className="text-xl" /> Application Sent
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Apply now
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        <div>
          <MatchBreakdown
            score={job.matchScore}
            matchedSkills={job.matchedSkills}
            missingSkills={job.missingSkills}
          />
        </div>
      </motion.div>
    </AppShell>
  );
}