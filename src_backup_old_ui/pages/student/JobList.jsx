import { useEffect, useState, useMemo } from "react";
import AppShell from "../../components/shared/AppShell";
import JobPostCard from "../../components/shared/JobPostCard";
import JobFilterSidebar from "../../components/shared/JobFilterSidebar";
import { getMatches } from "../../api/client";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [filters, setFilters] = useState({ time: [], level: [], jobType: [], workMode: [] });

  useEffect(() => {
    getMatches().then((data) => {
      setJobs(data);
      setLoading(false);
    });
  }, []);

  const handleToggleBookmark = (jobId, saved) => {
    // TODO: call your bookmark API here, e.g. bookmarkJob(jobId, saved)
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, bookmarked: saved } : j)));
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        !search || job.title?.toLowerCase().includes(search.toLowerCase()) ||
        job.company?.toLowerCase().includes(search.toLowerCase());
      const matchesLocation =
        !locationSearch || job.location?.toLowerCase().includes(locationSearch.toLowerCase());
      const matchesLevel = !filters.level.length || filters.level.includes(job.level);
      const matchesType = !filters.jobType.length || filters.jobType.includes(job.jobType);
      const matchesMode = !filters.workMode.length || filters.workMode.includes(job.workMode);
      return matchesSearch && matchesLocation && matchesLevel && matchesType && matchesMode;
    });
  }, [jobs, search, locationSearch, filters]);

  return (
    <AppShell title="Jobs">
      <div className="flex gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="What job title or company"
          className="flex-1 bg-brand-surface border border-brand-border rounded-lg px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
        />
        <input
          value={locationSearch}
          onChange={(e) => setLocationSearch(e.target.value)}
          placeholder="Where city, province or region"
          className="flex-1 bg-brand-surface border border-brand-border rounded-lg px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
        />
      </div>

      <div className="flex gap-6 items-start">
        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <h2 className="font-display font-semibold text-ink">
              Jobs related to your skills{" "}
              <span className="text-muted font-normal">{filteredJobs.length}</span>
            </h2>
            <p className="text-sm text-muted">We've sorted the jobs related to the skills you have</p>
          </div>

          {loading ? (
            <p className="text-sm text-muted">Loading matches...</p>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-brand-surface rounded-xl border border-dashed border-brand-border p-8 text-center">
              <p className="text-sm text-ink font-medium">No jobs matched yet</p>
              <p className="text-sm text-muted mt-1">Upload your resume to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredJobs.map((job) => (
                <JobPostCard key={job.id} data={job} onToggleBookmark={handleToggleBookmark} />
              ))}
            </div>
          )}
        </div>

        <JobFilterSidebar
          jobs={jobs}
          filters={filters}
          onChange={setFilters}
          onClearAll={() => setFilters({ time: [], level: [], jobType: [], workMode: [] })}
        />
      </div>
    </AppShell>
  );
}