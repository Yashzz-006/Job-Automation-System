import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../../components/shared/AppShell";
import UploadZone from "../../components/shared/UploadZone";
import SkillChip from "../../components/shared/SkillChip";
import { uploadResume } from "../../api/client";

const STAGES = ["Extracting text...", "Detecting skills...", "Classifying domain..."];

export default function ResumeUpload() {
  const [status, setStatus] = useState("idle"); // idle | processing | done
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
          <div className="mt-6 bg-white rounded-2xl border border-brand-border p-5">
            <p className="text-sm font-medium text-gray-700 mb-2">Analyzing your resume</p>
            <ul className="space-y-1.5">
              {STAGES.map((s, i) => (
                <li
                  key={s}
                  className={`text-sm ${
                    i <= stageIndex ? "text-brand-blue" : "text-gray-300"
                  }`}
                >
                  {i < stageIndex ? "✓" : "•"} {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {status === "done" && result && (
          <div className="bg-white rounded-2xl border border-brand-border p-6">
            <p className="text-sm text-gray-500 mb-1">Resume score</p>
            <p className="text-3xl font-semibold text-gray-900 mb-4">{result.resumeScore}/100</p>

            <p className="text-sm text-gray-500 mb-1">Primary domain</p>
            <p className="font-medium text-gray-900 mb-4">{result.primaryDomain}</p>

            <p className="text-sm text-gray-500 mb-2">Detected skills</p>
            <div className="flex flex-wrap gap-1.5 mb-6">
              {result.skills.map((s) => (
                <SkillChip key={s} label={s} variant="neutral" />
              ))}
            </div>

            <button
              onClick={() => navigate("/student/dashboard")}
              className="w-full bg-brand-blue text-white rounded-xl py-2.5 font-medium hover:opacity-90 transition"
            >
              Go to dashboard
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
