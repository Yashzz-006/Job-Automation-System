import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiBriefcase, FiUsers, FiCheckCircle } from "react-icons/fi";
import AppShell from "../../components/shared/AppShell";
import StatCard from "../../components/shared/StatCard";
import MatchCard from "../../components/shared/MatchCard";
import { getCandidatesForJob, getRecruiterJobs } from "../../api/client";

function StatCardSkeleton() {
  return (
    <div className="bg-brand-surface rounded-xl border border-brand-border p-5 space-y-2.5 skeleton-shimmer">
      <div className="h-3 w-20 rounded bg-brand-border" />
      <div className="h-6 w-12 rounded bg-brand-border" />
    </div>
  );
}

function CandidateCardSkeleton() {
  return (
    <div className="bg-brand-surface rounded-xl border border-brand-border p-5 space-y-2.5 skeleton-shimmer">
      <div className="h-4 w-2/3 rounded bg-brand-border" />
      <div className="h-3 w-1/3 rounded bg-brand-border" />
    </div>
  );
}

export default function RecruiterDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCandidatesForJob("job-1"), getRecruiterJobs()]).then(([c, j]) => {
      setCandidates(c);
      setJobs(j);
      setLoading(false);
    });
  }, []);

  const STATS = [
    { label: "Active jobs", value: jobs.length, icon: FiBriefcase },
    { label: "Candidates matched", value: candidates.length, icon: FiUsers },
    { label: "Shortlisted", value: 0, icon: FiCheckCircle },
  ];

  return (
    <AppShell title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)
          : STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <StatCard label={s.label} value={s.value} icon={s.icon} />
              </motion.div>
            ))}
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-lg text-ink">Top AI-ranked candidates</h3>
          <Link
            to="/recruiter/candidates"
            className="font-mono text-xs uppercase tracking-wider text-brand-blue font-medium hover:text-white transition-colors"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <CandidateCardSkeleton key={i} />
            ))}
          </div>
        ) : candidates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-brand-surface rounded-xl border border-dashed border-brand-border p-10 text-center glass-card"
          >
            <div className="w-16 h-16 rounded-full bg-brand-border/30 mx-auto flex items-center justify-center mb-4">
              <span className="text-2xl">👥</span>
            </div>
            <p className="text-lg text-ink font-medium">No ranked candidates yet</p>
            <p className="text-sm text-muted mt-2 max-w-md mx-auto">Post a job to start seeing AI-ranked matches stream in here.</p>
          </motion.div>
        ) : (
          <div className="grid gap-3">
            {candidates.slice(0, 5).map((c, i) => (
              <MatchCard key={c.id} type="candidate" data={c} rank={i} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}