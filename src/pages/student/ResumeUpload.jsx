import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AppShell from "../../components/shared/AppShell";
import UploadZone from "../../components/shared/UploadZone";
import SkillChip from "../../components/shared/SkillChip";
import MatchScoreRing from "../../components/shared/MatchScoreRing";
import { uploadResume } from "../../api/client";

const STAGES = [
  "Parsing PDF structure...",
  "Extracting semantic text layers...",
  "Running NLP skill detection...",
  "Classifying primary domain...",
  "Generating match vectors..."
];

export default function ResumeUpload() {
  const [status, setStatus] = useState("idle");
  const [stageIndex, setStageIndex] = useState(0);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  async function handleFile(file) {
    setStatus("processing");
    setStageIndex(0);

    const stageDuration = 400; // time per stage for simulation
    const interval = setInterval(() => {
      setStageIndex((i) => {
        if (i >= STAGES.length - 1) {
          clearInterval(interval);
          return i;
        }
        return i + 1;
      });
    }, stageDuration);

    const profile = await uploadResume(file);
    
    // Ensure the animation has time to show all stages before jumping to done
    setTimeout(() => {
      setResult(profile);
      setStatus("done");
    }, stageDuration * STAGES.length);
  }

  return (
    <AppShell title="Upload Resume">
      <div className="max-w-2xl mx-auto py-4">
        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="font-display text-2xl font-semibold text-ink mb-2">Update your profile</h2>
                <p className="text-muted text-sm">Upload your latest resume to get AI-ranked matches for jobs.</p>
              </div>
              <UploadZone onFileSelected={handleFile} />
            </motion.div>
          )}

          {status === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-brand-surface rounded-xl border border-brand-border p-8 glass-card relative overflow-hidden"
            >
              {/* Animated laser line scanner */}
              <motion.div
                className="absolute left-0 right-0 h-px"
                style={{
                  background: "linear-gradient(90deg, transparent, #4DE6B6, transparent)",
                  boxShadow: "0 0 10px #4DE6B6",
                }}
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 2.5, ease: "linear", repeat: Infinity }}
              />

              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-full border-t-2 border-brand-blue animate-spin" />
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">Analyzing Resume</h3>
                  <p className="font-mono text-xs text-muted mt-1">Jobsync Match Engine v2.0</p>
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                {STAGES.map((s, i) => {
                  const isActive = i === stageIndex;
                  const isDone = i < stageIndex;
                  return (
                    <motion.div
                      key={s}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: i <= stageIndex ? 1 : 0.4, x: 0 }}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        isActive ? "bg-brand-blue/5 border-brand-blue/30 text-brand-blue" :
                        isDone ? "bg-brand-bg/50 border-brand-border text-muted" :
                        "border-transparent text-muted/50"
                      }`}
                    >
                      <div className="w-5 flex justify-center shrink-0">
                        {isDone ? (
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-match-good">✓</motion.span>
                        ) : isActive ? (
                          <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 rounded-full bg-brand-blue" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-muted/30" />
                        )}
                      </div>
                      <span className={`font-mono text-xs tracking-wide ${isActive ? "text-brand-blue" : ""}`}>{s}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {status === "done" && result && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="gradient-border rounded-xl"
            >
              <div className="bg-brand-surface rounded-xl p-8 glass-card">
                <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                  <div className="shrink-0">
                    <MatchScoreRing score={result.resumeScore} size={110} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-1">
                        Primary domain
                      </p>
                      <p className="font-display text-2xl font-semibold text-ink mb-4">{result.primaryDomain}</p>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-2">
                        Detected skills
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {result.skills.map((s, i) => (
                          <motion.div
                            key={s}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + i * 0.05 }}
                          >
                            <SkillChip label={s} variant="neutral" />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  onClick={() => navigate("/student/dashboard")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-brand-blue text-brand-bg rounded-lg py-3 font-semibold hover:opacity-90 transition shadow-[0_0_20px_rgba(77,230,182,0.3)]"
                >
                  View recommended jobs
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}