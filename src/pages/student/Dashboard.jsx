import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AppShell from "../../components/shared/AppShell";
import JobPostCard from "../../components/shared/JobPostCard";
import MatchScoreRing from "../../components/shared/MatchScoreRing";
import { getMatches, getStudentProfile } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

function WelcomeSkeleton() {
  return (
    <div className="bg-brand-surface rounded-xl border border-brand-border p-6 flex items-center justify-between mb-6 skeleton-shimmer">
      <div className="space-y-2.5">
        <div className="h-5 w-48 rounded bg-brand-border" />
        <div className="h-3 w-32 rounded bg-brand-border" />
      </div>
      <div className="w-[72px] h-[72px] rounded-full bg-brand-border" />
    </div>
  );
}

function JobCardSkeleton() {
  return (
    <div className="bg-brand-surface rounded-xl border border-brand-border p-5 space-y-2.5 skeleton-shimmer">
      <div className="h-4 w-2/3 rounded bg-brand-border" />
      <div className="h-3 w-1/3 rounded bg-brand-border" />
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMatches(), getStudentProfile()]).then(([j, p]) => {
      setJobs(j);
      setProfile(p);
      setLoading(false);
    });
  }, []);

  const handleToggleBookmark = (jobId, saved) => {
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, bookmarked: saved } : j)));
  };

  return (
    <AppShell title="Dashboard">
      {loading ? (
        <WelcomeSkeleton />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative rounded-xl overflow-hidden mb-6 group"
        >
          {/* Animated gradient border */}
          <div
            className="absolute inset-0 opacity-100 transition-opacity duration-500"
            style={{ background: "conic-gradient(from 180deg, rgba(77,230,182,0.3), rgba(129,140,248,0.2), rgba(248,113,113,0.2), rgba(77,230,182,0.3))" }}
          />
          <div className="absolute inset-[1px] bg-brand-surface rounded-xl" />
          
          <div className="relative p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
            <div
              className="absolute -top-24 -right-12 w-64 h-64 rounded-full bg-brand-blue/10 blur-[80px] pointer-events-none animate-pulse"
              aria-hidden="true"
            />
            
            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="font-display font-semibold text-2xl text-ink"
              >
                Welcome back, {user?.name || "there"}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="font-mono text-xs text-muted mt-2 tracking-wide flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-glow-pulse" />
                {profile ? `PRIMARY DOMAIN · ${profile.primaryDomain.toUpperCase()}` : "LOADING PROFILE…"}
              </motion.p>
            </div>
            
            {profile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
                className="relative z-10 shrink-0"
              >
                <MatchScoreRing score={profile.resumeScore} size={84} label="Resume Score" />
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      <div className="flex items-center justify-between mb-4 mt-8">
        <h3 className="font-display font-semibold text-lg text-ink">Recommended for you</h3>
        <Link
          to="/student/jobs"
          className="font-mono text-xs uppercase tracking-wider text-brand-blue font-medium hover:text-white transition-colors"
        >
          View all
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-brand-surface rounded-xl border border-dashed border-brand-border p-10 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-brand-border/30 mx-auto flex items-center justify-center mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <p className="text-lg text-ink font-medium">No matches yet</p>
          <p className="text-sm text-muted mt-2 max-w-md mx-auto">Complete your profile and upload your latest resume to start getting AI-powered recommendations.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.slice(0, 4).map((job, i) => (
            <JobPostCard key={job.id} data={job} index={i} onToggleBookmark={handleToggleBookmark} />
          ))}
        </div>
      )}
    </AppShell>
  );
}