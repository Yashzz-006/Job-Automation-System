import { useEffect, useState } from "react";
import AppShell from "../../components/shared/AppShell";
import MatchCard from "../../components/shared/MatchCard";
import { getCandidatesForJob } from "../../api/client";

export default function CandidateList() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Phase 7: pass the real jobId (e.g. from a job selector) instead of a hardcoded id
    getCandidatesForJob("job-1").then((data) => {
      setCandidates(data);
      setLoading(false);
    });
  }, []);

  return (
    <AppShell title="AI-ranked candidates">
      {loading ? (
        <p className="text-sm text-gray-400">Loading candidates...</p>
      ) : candidates.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          No candidates yet — post a job to start receiving applications.
        </div>
      ) : (
        <div className="grid gap-3">
          {candidates.map((c) => (
            <MatchCard key={c.id} type="candidate" data={c} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
