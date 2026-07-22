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
    <div className="bg-brand-surface rounded-xl border border-brand-border p-6 flex items-center justify-between mb-6">
      <div className="space-y-2.5">
        <div className="h-5 w-48 rounded bg-brand-border animate-pulse" />
        <div className="h-3 w-32 rounded bg-brand-border animate-pulse" />
      </div>
      <div className="w-[72px] h-[72px] rounded-full bg-brand-border animate-pulse" />
    </div>
  );
}

function JobCardSkeleton() {
  return (
    <div className="bg-brand-surface rounded-xl border border-brand-border p-5 space-y-2.5">
      <div className="h-4 w-2/3 rounded bg-brand-border animate-pulse" />
      <div className="h-3 w-1/3 rounded bg-brand-border animate-pulse" />
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
    // TODO: call your bookmark API here, e.g. bookmarkJob(jobId, saved)
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, bookmarked: saved } : j)));
  };

  return (
    <AppShell title="Dashboard">
      {loading ? (
        <WelcomeSkeleton />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative bg-brand-surface rounded-xl border border-brand-border p-6 flex items-center justify-between mb-6 overflow-hidden"
        >
          <div
            className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-brand-blue/10 blur-[60px] pointer-events-none"
            aria-hidden="true"
          />
          <div className="relative">
            <h2 className="font-display font-semibold text-lg text-ink">
              Welcome back, {user?.name || "there"}
            </h2>
            <p className="font-mono text-xs text-muted mt-1.5 tracking-wide">
              {profile ? `PRIMARY DOMAIN · ${profile.primaryDomain.toUpperCase()}` : "LOADING PROFILE…"}
            </p>
          </div>
          {profile && (
            <div className="relative">
              <MatchScoreRing score={profile.resumeScore} size={72} label="Resume score" />
            </div>
          )}
        </motion.div>
      )}

      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-ink">Recommended for you</h3>
        <Link
          to="/student/jobs"
          className="font-mono text-xs uppercase tracking-wider text-brand-blue font-medium hover:underline"
        >
          View all
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-brand-surface rounded-xl border border-dashed border-brand-border p-8 text-center">
          <p className="text-sm text-ink font-medium">No matches yet</p>
          <p className="text-sm text-muted mt-1">Complete your profile to start getting recommendations.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {jobs.slice(0, 4).map((job) => (
            <JobPostCard key={job.id} data={job} onToggleBookmark={handleToggleBookmark} />
          ))}
        </div>
      )}
    </AppShell>
  );
}