import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    await postJob({
      ...form,
      requiredSkills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
    });
    setSubmitting(false);
    navigate("/recruiter/dashboard");
  }

  const inputClass =
    "w-full border border-brand-border rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-blue transition text-ink placeholder:text-muted/60";
  const labelClass = "block font-mono text-[10px] uppercase tracking-wider text-muted mb-1.5";

  return (
    <AppShell title="Post a job">
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl bg-brand-surface rounded-xl border border-brand-border p-6 space-y-4"
      >
        <div>
          <label className={labelClass}>Job title</label>
          <input
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="e.g. Frontend Developer (Fresher)"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Domain</label>
            <select
              value={form.domain}
              onChange={(e) => update("domain", e.target.value)}
              className={inputClass}
            >
              {DOMAINS.map((d) => (
                <option key={d}>{d}</option>
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

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            required
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            placeholder="Describe the role..."
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Required skills (comma separated)</label>
          <input
            value={form.skills}
            onChange={(e) => update("skills", e.target.value)}
            placeholder="React, Node.js, MongoDB"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Stipend / CTC</label>
          <input
            value={form.stipendOrCtc}
            onChange={(e) => update("stipendOrCtc", e.target.value)}
            placeholder="e.g. ₹8–10 LPA"
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-brand-blue text-white rounded-lg px-6 py-2.5 font-medium hover:opacity-90 transition disabled:opacity-60"
        >
          {submitting ? "Publishing..." : "Publish job"}
        </button>
      </form>
    </AppShell>
  );
}