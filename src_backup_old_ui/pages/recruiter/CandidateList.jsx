import { useEffect, useState } from "react";
import AppShell from "../../components/shared/AppShell";
import MatchCard from "../../components/shared/MatchCard";
import { getCandidatesForJob } from "../../api/client";

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
    <AppShell title="AI-ranked candidates">
      {loading ? (
        <p className="text-sm text-muted">Loading candidates...</p>
      ) : candidates.length === 0 ? (
        <div className="bg-brand-surface rounded-xl border border-dashed border-brand-border p-8 text-center">
          <p className="text-sm text-ink font-medium">No candidates yet</p>
          <p className="text-sm text-muted mt-1">Post a job to start receiving applications.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {candidates.map((c, i) => (
            <MatchCard key={c.id} type="candidate" data={c} rank={i} />
          ))}
        </div>
      )}
    </AppShell>
  );
}