import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppShell from "../../components/shared/AppShell";
import MatchBreakdown from "../../components/shared/MatchBreakdown";
import { getJobDetail } from "../../api/client";

export default function JobDetail() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    getJobDetail(jobId).then(setJob);
  }, [jobId]);

  if (!job) {
    return (
      <AppShell title="Job details">
        <p className="text-sm text-gray-400">Loading...</p>
      </AppShell>
    );
  }

  return (
    <AppShell title={job.title}>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl border border-brand-border p-6">
          <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {job.company} · {job.location} · {job.type}
          </p>
          <p className="text-sm text-gray-500 mt-1">{job.stipendOrCtc}</p>
          <p className="text-gray-700 mt-4 leading-relaxed">{job.description}</p>

          <button className="mt-6 bg-brand-blue text-white rounded-xl px-6 py-2.5 font-medium hover:opacity-90 transition">
            Apply now
          </button>
        </div>

        <MatchBreakdown
          score={job.matchScore}
          matchedSkills={job.matchedSkills}
          missingSkills={job.missingSkills}
        />
      </div>
    </AppShell>
  );
}
