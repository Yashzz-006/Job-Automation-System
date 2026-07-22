import { useEffect, useState } from "react";
import AppShell from "../../components/shared/AppShell";
import MatchCard from "../../components/shared/MatchCard";
import { getMatches } from "../../api/client";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMatches().then((data) => {
      setJobs(data);
      setLoading(false);
    });
  }, []);

  return (
    <AppShell title="Recommended jobs">
      {loading ? (
        <p className="text-sm text-gray-400">Loading matches...</p>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          No jobs matched yet — upload your resume to get started.
        </div>
      ) : (
        <div className="grid gap-3">
          {jobs.map((job) => (
            <MatchCard key={job.id} type="job" data={job} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
