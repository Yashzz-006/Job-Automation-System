import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiLoader } from "react-icons/fi";
import AppShell from "../../components/shared/AppShell";
import { postJob } from "../../api/client";

const DOMAINS = ["Full Stack", "DevOps", "AI/ML", "Cybersecurity", "Testing", "Salesforce"];

export default function PostJob() {
  const [form, setForm] = useState({
    title: "",
    domain: DOMAINS[0],
    description: "",
    skills: "",
    location: "",
    stipendOrCtc: "",
  });
  const [status, setStatus] = useState("idle"); // idle | submitting | success
  const navigate = useNavigate();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    
    // Simulate network delay for animation viewing
    setTimeout(async () => {
      await postJob({
        ...form,
        requiredSkills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setStatus("success");
      setTimeout(() => {
        navigate("/recruiter/dashboard");
      }, 800);
    }, 1200);
  }

  const inputClass =
    "w-full bg-brand-bg/50 border border-brand-border rounded-lg px-4 py-3 text-sm outline-none focus:border-brand-blue/60 focus:ring-2 focus:ring-brand-blue/20 transition-all text-ink placeholder:text-muted/50";
  const labelClass = "block font-mono text-[10px] uppercase tracking-wider text-muted mb-2";

  return (
    <AppShell title="Post a job">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-2xl mx-auto"
      >
        <div className="mb-8">
          <h2 className="font-display text-2xl font-semibold text-ink mb-2">Create a new opening</h2>
          <p className="text-muted text-sm">Post a job and let JobSync AI instantly rank the best candidates.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-brand-surface rounded-2xl border border-brand-border/60 p-8 space-y-6 glass-card relative overflow-hidden shadow-2xl"
        >
          {/* Subtle gradient glow in corner of form */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <label className={labelClass}>Job title</label>
            <input
              required
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Frontend Developer (Fresher)"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div>
              <label className={labelClass}>Domain</label>
              <select
                value={form.domain}
                onChange={(e) => update("domain", e.target.value)}
                className={inputClass}
              >
                {DOMAINS.map((d) => (
                  <option key={d} value={d} className="bg-brand-surface text-ink">{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder="e.g. Bengaluru / Remote"
                className={inputClass}
              />
            </div>
          </div>

          <div className="relative z-10">
            <label className={labelClass}>Description</label>
            <textarea
              required
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={5}
              placeholder="Describe the role and responsibilities..."
              className={inputClass}
            />
          </div>

          <div className="relative z-10">
            <label className={labelClass}>Required skills (comma separated)</label>
            <input
              value={form.skills}
              onChange={(e) => update("skills", e.target.value)}
              placeholder="React, Node.js, MongoDB"
              className={inputClass}
            />
          </div>

          <div className="relative z-10">
            <label className={labelClass}>Stipend / CTC</label>
            <input
              value={form.stipendOrCtc}
              onChange={(e) => update("stipendOrCtc", e.target.value)}
              placeholder="e.g. ₹8–10 LPA"
              className={inputClass}
            />
          </div>

          <div className="pt-4 relative z-10">
            <motion.button
              type="submit"
              disabled={status !== "idle"}
              whileHover={{ scale: status === "idle" ? 1.02 : 1 }}
              whileTap={{ scale: status === "idle" ? 0.98 : 1 }}
              className={`w-full rounded-xl py-3.5 font-semibold transition-all flex items-center justify-center gap-2 ${
                status === "success"
                  ? "bg-match-good text-brand-bg shadow-[0_0_20px_rgba(77,230,182,0.4)]"
                  : status === "submitting"
                  ? "bg-brand-blue/20 text-brand-blue border border-brand-blue/30 cursor-wait"
                  : "bg-brand-blue text-brand-bg shadow-[0_0_20px_rgba(77,230,182,0.2)] hover:shadow-[0_0_30px_rgba(77,230,182,0.4)]"
              }`}
            >
              <AnimatePresence mode="wait">
                {status === "submitting" ? (
                  <motion.span
                    key="submitting"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2"
                  >
                    <FiLoader className="animate-spin text-lg" /> Publishing...
                  </motion.span>
                ) : status === "success" ? (
                  <motion.span
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    <FiCheck className="text-xl" /> Published
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Publish job
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </AppShell>
  );
}