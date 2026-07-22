import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../../components/shared/AppShell";
import UploadZone from "../../components/shared/UploadZone";
import SkillChip from "../../components/shared/SkillChip";
import { uploadResume } from "../../api/client";

const STAGES = ["Extracting text...", "Detecting skills...", "Classifying domain..."];

export default function ResumeUpload() {
  const [status, setStatus] = useState("idle");
  const [stageIndex, setStageIndex] = useState(0);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  async function handleFile(file) {
    setStatus("processing");
    setStageIndex(0);

    const interval = setInterval(() => {
      setStageIndex((i) => Math.min(i + 1, STAGES.length - 1));
    }, 500);

    const profile = await uploadResume(file);

    clearInterval(interval);
    setResult(profile);
    setStatus("done");
  }

  return (
    <AppShell title="Resume">
      <div className="max-w-xl mx-auto">
        {status !== "done" && <UploadZone onFileSelected={handleFile} />}

        {status === "processing" && (
          <div className="mt-6 bg-brand-surface rounded-xl border border-brand-border p-5">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-3">
              Analyzing your resume
            </p>
            <ul className="space-y-2">
              {STAGES.map((s, i) => (
                <li
                  key={s}
                  className={`text-sm flex items-center gap-2 transition ${
                    i <= stageIndex ? "text-brand-blue" : "text-brand-border"
                  }`}
                >
                  <span className="font-mono text-xs w-3">{i < stageIndex ? "✓" : "•"}</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {status === "done" && result && (
          <div className="bg-brand-surface rounded-xl border border-brand-border p-6">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-1">
              Resume score
            </p>
            <p className="font-mono text-3xl font-semibold text-ink mb-4">
              {result.resumeScore}<span className="text-lg text-muted">/100</span>
            </p>

            <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-1">
              Primary domain
            </p>
            <p className="font-display font-medium text-ink mb-4">{result.primaryDomain}</p>

            <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-2">
              Detected skills
            </p>
            <div className="flex flex-wrap gap-1.5 mb-6">
              {result.skills.map((s) => (
                <SkillChip key={s} label={s} variant="neutral" />
              ))}
            </div>

            <button
              onClick={() => navigate("/student/dashboard")}
              className="w-full bg-brand-blue text-white rounded-lg py-2.5 font-medium hover:opacity-90 transition"
            >
              Go to dashboard
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}