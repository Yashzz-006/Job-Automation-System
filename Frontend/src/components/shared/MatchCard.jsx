import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronRight, FiBriefcase, FiMapPin, FiBookOpen } from "react-icons/fi";
import MatchScoreRing from "./MatchScoreRing";

export default function MatchCard({ data, rank, type = "job" }) {
  const navigate = useNavigate();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const isTopMatch = rank === 0;
  const mainTitle = type === "job" ? data.title : data.name;
  const subTitle = type === "job" ? data.company : data.education;
  const metaInfo = type === "job" ? data.location : data.experience;
  const initials = (type === "job" ? data.company : data.name)?.substring(0, 2).toUpperCase() || "AI";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.5, delay: rank * 0.05, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -4, scale: 1.01 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      onClick={() =>
        navigate(type === "job" ? `/student/jobs/${data.id}` : `/recruiter/candidates/${data.id}`)
      }
      className="group relative cursor-pointer"
    >
      {/* Premium Glass Container */}
      <div className={`relative w-full rounded-2xl overflow-hidden backdrop-blur-xl border transition-all duration-500 ${
        isTopMatch ? "border-match-good/40 bg-brand-surface/70" : "border-brand-border/40 bg-gradient-to-br from-brand-surface/90 to-brand-surface/40 hover:border-brand-blue/30"
      }`}>
        
        {/* Dynamic Hover Spotlight */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(77,230,182,0.08), transparent 40%)`
          }}
        />

        {/* Top Match ambient glow */}
        {isTopMatch && (
          <div className="absolute top-0 left-1/4 w-1/2 h-full bg-match-good/5 blur-3xl rounded-full pointer-events-none" />
        )}

        <div className="relative z-10 p-5 flex items-center justify-between gap-6">
          
          <div className="flex items-center gap-5 flex-1 min-w-0">
            {/* Elegant Avatar/Logo Box */}
            <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center font-display font-bold text-xl tracking-wider transition-colors duration-300 ${
              isTopMatch ? "bg-match-good/10 text-match-good border border-match-good/20 shadow-[0_0_15px_rgba(77,230,182,0.2)]" : "bg-brand-bg border border-brand-border text-brand-blue group-hover:border-brand-blue/30 group-hover:bg-brand-blue/5 group-hover:shadow-[0_0_15px_rgba(129,140,248,0.15)]"
            }`}>
              {initials}
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                {isTopMatch && (
                  <span className="font-mono text-[9px] uppercase tracking-widest text-brand-bg bg-match-good px-2 py-0.5 rounded-full font-bold shadow-[0_0_10px_rgba(77,230,182,0.4)]">
                    ★ Top Match
                  </span>
                )}
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted truncate">
                  {subTitle}
                </p>
              </div>
              
              <h3 className="font-display text-xl font-semibold text-ink truncate group-hover:text-brand-blue transition-colors duration-300">
                {mainTitle}
              </h3>
              
              <div className="flex items-center gap-4 mt-1.5 font-mono text-xs text-muted/80">
                <span className="flex items-center gap-1.5">
                  {type === "job" ? <FiMapPin className="text-muted/60" /> : <FiBriefcase className="text-muted/60" />}
                  <span className="truncate">{metaInfo}</span>
                </span>
                
                {data.skills && data.skills.length > 0 && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-brand-border" />
                    <span className="truncate">{data.skills.slice(0, 2).join(" · ")}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Score & Action */}
          <div className="shrink-0 flex items-center gap-6 border-l border-brand-border/30 pl-6">
            <div className="flex flex-col items-center gap-1">
              <MatchScoreRing score={data.matchScore} size={68} />
            </div>
            
            <div className="w-8 h-8 rounded-full bg-brand-bg border border-brand-border flex items-center justify-center text-muted group-hover:bg-brand-blue group-hover:border-brand-blue group-hover:text-brand-bg group-hover:shadow-[0_0_12px_rgba(129,140,248,0.4)] transition-all duration-300">
              <FiChevronRight className="text-lg translate-x-[-1px] group-hover:translate-x-[1px] transition-transform" />
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}