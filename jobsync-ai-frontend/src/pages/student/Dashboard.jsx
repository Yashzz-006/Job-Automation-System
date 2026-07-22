import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../../components/shared/AppShell";
import MatchCard from "../../components/shared/MatchCard";
import MatchScoreRing from "../../components/shared/MatchScoreRing";
import { getMatches, getStudentProfile } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

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

  return (
    <AppShell title="Dashboard">
      <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Welcome back, {user?.name || "there"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {profile ? `Primary domain: ${profile.primaryDomain}` : "Loading your profile..."}
          </p>
        </div>
        {profile && <MatchScoreRing score={profile.resumeScore} size={72} label="Resume score" />}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">Recommended for you</h3>
        <Link to="/student/jobs" className="text-sm text-brand-blue font-medium">
          View all
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading matches...</p>
      ) : (
        <div className="grid gap-3">
          {jobs.slice(0, 5).map((job) => (
            <MatchCard key={job.id} type="job" data={job} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
