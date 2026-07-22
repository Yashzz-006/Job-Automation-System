import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiBriefcase, FiUsers, FiCheckCircle } from "react-icons/fi";
import AppShell from "../../components/shared/AppShell";
import StatCard from "../../components/shared/StatCard";
import MatchCard from "../../components/shared/MatchCard";
import { getCandidatesForJob, getRecruiterJobs } from "../../api/client";

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

  return (
    <AppShell title="Dashboard">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Active jobs" value={jobs.length} icon={FiBriefcase} />
        <StatCard label="Candidates matched" value={candidates.length} icon={FiUsers} />
        <StatCard label="Shortlisted" value={0} icon={FiCheckCircle} />
      </div>

      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">Top AI-ranked candidates</h3>
        <Link to="/recruiter/candidates" className="text-sm text-brand-blue font-medium">
          View all
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading candidates...</p>
      ) : (
        <div className="grid gap-3">
          {candidates.slice(0, 5).map((c) => (
            <MatchCard key={c.id} type="candidate" data={c} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
