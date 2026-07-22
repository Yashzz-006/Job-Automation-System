import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AppShell from "../../components/shared/AppShell";
import MatchCard from "../../components/shared/MatchCard";
import { getCandidatesForJob } from "../../api/client";
import { FiUsers } from "react-icons/fi";

function CandidateCardSkeleton() {
  return (
    <div className="bg-brand-surface rounded-xl border border-brand-border p-5 space-y-2.5 skeleton-shimmer">
      <div className="h-4 w-2/3 rounded bg-brand-border" />
      <div className="h-3 w-1/3 rounded bg-brand-border" />
    </div>
  );
}

export default function CandidateList() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCandidatesForJob("job-1").then((data) => {
      setCandidates(data);
      setLoading(false);
    });
  }, []);

  return (
    <AppShell title="AI-Ranked Candidates">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display font-semibold text-xl text-ink">
              Frontend Developer (Fresher)
            </h2>
            <p className="text-sm text-muted mt-1">Showing all matched candidates ranked by AI score.</p>
          </div>
          <div className="bg-brand-surface border border-brand-border px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-muted">Total</span>
            <span className="font-mono font-bold text-brand-blue">{candidates.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <CandidateCardSkeleton key={i} />
            ))}
          </div>
        ) : candidates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-brand-surface rounded-xl border border-dashed border-brand-border p-12 text-center glass-card"
          >
            <div className="w-16 h-16 rounded-full bg-brand-border/30 mx-auto flex items-center justify-center mb-4">
              <FiUsers className="text-2xl text-muted" />
            </div>
            <p className="text-lg text-ink font-medium">No candidates yet</p>
            <p className="text-sm text-muted mt-2">Post a job to start receiving applications.</p>
          </motion.div>
        ) : (
          <div className="grid gap-4 relative z-10">
            {candidates.map((c, i) => (
              <MatchCard key={c.id} type="candidate" data={c} rank={i} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}