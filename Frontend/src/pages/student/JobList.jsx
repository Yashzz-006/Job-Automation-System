import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiMapPin } from "react-icons/fi";
import AppShell from "../../components/shared/AppShell";
import JobPostCard from "../../components/shared/JobPostCard";
import JobFilterSidebar from "../../components/shared/JobFilterSidebar";
import { getMatches } from "../../api/client";

function JobCardSkeleton() {
  return (
    <div className="bg-brand-surface rounded-xl border border-brand-border p-5 space-y-2.5 skeleton-shimmer">
      <div className="h-4 w-2/3 rounded bg-brand-border" />
      <div className="h-3 w-1/3 rounded bg-brand-border" />
    </div>
  );
}

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

  const inputWrapperClass = "flex-1 flex items-center gap-3 bg-brand-surface/80 border border-brand-border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-brand-blue/30 focus-within:border-brand-blue/50 transition-all duration-300 glass-card";

  return (
    <AppShell title="Jobs">
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className={inputWrapperClass}>
          <FiSearch className="text-muted text-lg shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="What job title or company"
            className="w-full bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
          />
        </div>
        <div className={inputWrapperClass}>
          <FiMapPin className="text-muted text-lg shrink-0" />
          <input
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            placeholder="Where city, province or region"
            className="w-full bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 min-w-0 w-full">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-display font-semibold text-xl text-ink">
                Jobs related to your skills
              </h2>
              <p className="text-sm text-muted mt-1">We've sorted the jobs related to the skills you have</p>
            </div>
            <div className="bg-brand-surface border border-brand-border px-3 py-1.5 rounded-lg">
              <span className="font-mono text-xs uppercase tracking-wider text-muted">Results</span>
              <span className="ml-2 font-mono font-bold text-brand-blue">{filteredJobs.length}</span>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-brand-surface rounded-xl border border-dashed border-brand-border p-12 text-center glass-card"
            >
              <div className="w-16 h-16 rounded-full bg-brand-border/30 mx-auto flex items-center justify-center mb-4">
                <FiSearch className="text-2xl text-muted" />
              </div>
              <p className="text-lg text-ink font-medium">No jobs matched your search</p>
              <p className="text-sm text-muted mt-2">Try adjusting your filters or search terms.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredJobs.map((job, i) => (
                <JobPostCard key={job.id} data={job} index={i} onToggleBookmark={handleToggleBookmark} />
              ))}
            </div>
          )}
        </div>

        <div className="w-full lg:w-[280px] shrink-0 sticky top-24">
          <JobFilterSidebar
            jobs={jobs}
            filters={filters}
            onChange={setFilters}
            onClearAll={() => setFilters({ time: [], level: [], jobType: [], workMode: [] })}
          />
        </div>
      </div>
    </AppShell>
  );
}