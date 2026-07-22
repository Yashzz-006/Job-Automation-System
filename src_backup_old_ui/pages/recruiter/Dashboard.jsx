import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiBriefcase, FiUsers, FiCheckCircle } from "react-icons/fi";
import AppShell from "../../components/shared/AppShell";
import StatCard from "../../components/shared/StatCard";
import MatchCard from "../../components/shared/MatchCard";
import AnimatedBackground from "../../components/shared/AnimatedBackground";
import { getCandidatesForJob, getRecruiterJobs } from "../../api/client";

function StatCardSkeleton() {
  return (
    <div className="bg-brand-surface rounded-xl border border-brand-border p-5 space-y-2.5">
      <div className="h-3 w-20 rounded bg-brand-border animate-pulse" />
      <div className="h-6 w-12 rounded bg-brand-border animate-pulse" />
    </div>
  );
}

function CandidateCardSkeleton() {
  return (
    <div className="bg-brand-surface rounded-xl border border-brand-border p-5 space-y-2.5">
      <div className="h-4 w-2/3 rounded bg-brand-border animate-pulse" />
      <div className="h-3 w-1/3 rounded bg-brand-border animate-pulse" />
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
      <div className="grid grid-cols-3 gap-4 mb-6">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)
          : STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.06, ease: "easeOut" }}
              >
                <StatCard label={s.label} value={s.value} icon={s.icon} />
              </motion.div>
            ))}
      </div>

      <div className="relative">
        <AnimatedBackground />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold text-ink">Top AI-ranked candidates</h3>
            <Link
              to="/recruiter/candidates"
              className="font-mono text-xs uppercase tracking-wider text-brand-blue font-medium hover:underline"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <CandidateCardSkeleton key={i} />
              ))}
            </div>
          ) : candidates.length === 0 ? (
            <div className="bg-brand-surface rounded-xl border border-dashed border-brand-border p-8 text-center">
              <p className="text-sm text-ink font-medium">No ranked candidates yet</p>
              <p className="text-sm text-muted mt-1">Post a job to start seeing AI-ranked matches here.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {candidates.slice(0, 5).map((c, i) => (
                <MatchCard key={c.id} type="candidate" data={c} rank={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}