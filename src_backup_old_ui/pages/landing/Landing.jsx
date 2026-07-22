import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  useInView,
  animate,
} from "framer-motion";
import { FiUploadCloud, FiCpu, FiTarget, FiArrowRight, FiStar } from "react-icons/fi";
import MatchScoreRing from "../../components/shared/MatchScoreRing";

const STEPS = [
  { icon: FiUploadCloud, title: "Upload", body: "Drop in a resume or a job post. No forms to fill out by hand." },
  { icon: FiCpu, title: "Analyze", body: "The engine reads skills, domain, and context — not just keywords." },
  { icon: FiTarget, title: "Match", body: "Get a score with a reason attached: overlap, fit, and what's missing." },
];

const DOMAINS = ["Full Stack", "DevOps", "AI / ML", "Cybersecurity", "Testing", "Salesforce", "Data Science", "Cloud"];

const BADGES = [
  { label: "React", top: "8%", left: "-8%", delay: 0 },
  { label: "Node.js", top: "62%", left: "-14%", delay: 0.6 },
  { label: "Python", top: "20%", left: "104%", delay: 0.3 },
  { label: "AWS", top: "70%", left: "100%", delay: 0.9 },
];

const STATS = [
  { value: 12400, suffix: "+", label: "Resumes analyzed" },
  { value: 94, suffix: "%", label: "Match accuracy" },
  { value: 340, suffix: "+", label: "Companies hiring" },
  { value: 3, suffix: "s", label: "Avg. time to match" },
];

const TESTIMONIALS = [
  {
    quote: "The breakdown told me exactly which skills to add before I applied again. Went from silence to three interviews in a month.",
    name: "Asha R.",
    role: "Backend Engineer",
    initials: "AR",
  },
  {
    quote: "We stopped guessing at fit. Every applicant comes in with a reason attached, so screening calls actually start at the right question.",
    name: "Marcus T.",
    role: "Technical Recruiter",
    initials: "MT",
  },
  {
    quote: "Seeing the semantic fit score next to the keyword overlap changed how I write my resume entirely.",
    name: "Priya K.",
    role: "DevOps Engineer",
    initials: "PK",
  },
];

function Counter({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className="font-mono">
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

function Spotlight() {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 60, damping: 20 });
  const y = useSpring(my, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const handle = (e) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      mx.set(e.clientX - rect.left);
      my.set(e.clientY - rect.top);
    };
    const el = ref.current;
    el?.addEventListener("mousemove", handle);
    return () => el?.removeEventListener("mousemove", handle);
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-[520px] h-[520px] rounded-full"
        style={{
          x, y,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(13,148,136,0.18) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

function AmbientBlobs({ parallaxY }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        style={{ y: parallaxY }}
        className="absolute -top-32 -left-24 w-[380px] h-[380px] rounded-full bg-brand-blue/20 blur-[100px]"
        animate={{ x: [0, 40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{ y: parallaxY }}
        className="absolute top-1/3 -right-32 w-[420px] h-[420px] rounded-full bg-brand-purple/20 blur-[110px]"
        animate={{ x: [0, -30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 inset-x-0 z-30 transition-colors ${
        scrolled ? "bg-ink/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between text-white">
        <span className="font-display font-semibold tracking-tight">JobSync</span>
        <div className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-wider text-white/50">
          <span>How it works</span>
          <span>For recruiters</span>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-lg border border-white/15 hover:bg-white/5 transition"
        >
          Log in
        </button>
      </div>
    </motion.header>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const gaugeY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  useEffect(() => {
    const t = setTimeout(() => setScore(87), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg overflow-x-hidden">
      <Nav />

      {/* Hero */}
      <div ref={heroRef} className="relative bg-ink text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.04] pointer-events-none" />
        <AmbientBlobs parallaxY={parallaxY} />
        <Spotlight />

        <div className="max-w-6xl mx-auto px-6 pt-36 pb-24 grid md:grid-cols-2 gap-12 items-center relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.span
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-brand-blue uppercase border border-brand-blue/30 rounded-full px-3 py-1 bg-brand-blue/5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
              JobSync AI
            </motion.span>

            <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight mt-5">
              Recruitment,
              <br />
              <span className="bg-gradient-to-r from-brand-blue via-teal-300 to-brand-blue bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient-shift_4s_linear_infinite]">
                matched and explained.
              </span>
            </h1>

            <p className="text-white/60 mt-5 max-w-md leading-relaxed">
              Every match comes with a reading, not just a percentage — skill overlap,
              semantic fit, and exactly what's missing. For students and recruiters alike.
            </p>

            <div className="flex gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/login?role=student")}
                className="px-6 py-3 rounded-lg bg-brand-blue text-white font-medium shadow-[0_0_24px_rgba(13,148,136,0.35)]"
              >
                I'm a job seeker
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.06)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/login?role=recruiter")}
                className="px-6 py-3 rounded-lg border border-white/15 text-white font-medium"
              >
                I'm a recruiter
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            style={{ y: gaugeY }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="relative flex justify-center"
          >
            {BADGES.map((b) => (
              <motion.div
                key={b.label}
                className="hidden md:block absolute z-10 font-mono text-[11px] px-3 py-1.5 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/10 text-white/70"
                style={{ top: b.top, left: b.left }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
              >
                {b.label}
              </motion.div>
            ))}

            <div className="relative bg-ink-soft/80 backdrop-blur-xl border border-white/10 rounded-2xl p-10 flex flex-col items-center gap-5 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
              <span className="absolute -top-px -left-px w-5 h-5 border-t border-l border-brand-blue/50 rounded-tl-2xl" />
              <span className="absolute -top-px -right-px w-5 h-5 border-t border-r border-brand-blue/50 rounded-tr-2xl" />
              <span className="absolute -bottom-px -left-px w-5 h-5 border-b border-l border-brand-blue/50 rounded-bl-2xl" />
              <span className="absolute -bottom-px -right-px w-5 h-5 border-b border-r border-brand-blue/50 rounded-br-2xl" />

              <MatchScoreRing score={score} size={180} label="Match reading" theme="dark" />
              <div className="flex gap-3 font-mono text-[10px] uppercase tracking-wider text-white/40">
                <span>Skill overlap · 82%</span>
                <span className="text-white/20">·</span>
                <span>Semantic fit · 91%</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Marquee strip */}
        <div className="relative border-t border-white/10 py-5 overflow-hidden">
          <motion.div
            className="flex gap-10 whitespace-nowrap font-mono text-xs uppercase tracking-widest text-white/30 marquee-fade"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          >
            {[...DOMAINS, ...DOMAINS].map((d, i) => (
              <span key={i} className="flex items-center gap-10">
                {d}
                <span className="w-1 h-1 rounded-full bg-white/20" />
              </span>
            ))}
          </motion.div>
        </div>

        {/* Smooth fade into the light section below */}
        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-b from-transparent to-brand-bg pointer-events-none" />
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-5">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -3, borderColor: "var(--color-brand-blue)" }}
            className="text-center md:text-left bg-brand-surface border border-brand-border rounded-xl p-5 transition-colors"
          >
            <div className="text-3xl md:text-4xl font-semibold text-ink">
              <Counter value={s.value} suffix={s.suffix} />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted mt-1.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* How it works */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <p className="font-mono text-[10px] uppercase tracking-widest text-brand-blue text-center mb-2">
          How it works
        </p>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink text-center mb-14">
          Three steps to a real answer
        </h2>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <motion.div
              key={title}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" }}
            >
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-6 left-[calc(100%-1rem)] w-[calc(100%-2rem)] border-t border-dashed border-brand-border" />
              )}
              <motion.div whileHover={{ y: -4 }} className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-ink text-white flex items-center justify-center text-lg shrink-0">
                  <Icon />
                </div>
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
              </motion.div>
              <h3 className="font-display font-semibold text-ink mb-1.5">{title}</h3>
              <p className="text-sm text-muted leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-brand-blue/[0.03] border-y border-brand-border">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-[10px] uppercase tracking-widest text-brand-blue text-center mb-2">
            From the reading
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink text-center mb-14">
            What the score actually changed
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                whileHover={{ y: -4 }}
                className="relative bg-white border border-brand-border rounded-2xl p-7 flex flex-col shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
              >
                <div className="flex gap-0.5 text-brand-blue mb-4" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <FiStar key={s} className="w-3.5 h-3.5" fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm text-ink leading-relaxed flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-brand-border">
                  <div className="w-9 h-9 rounded-full bg-ink text-white flex items-center justify-center font-mono text-[11px] font-semibold shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink leading-tight">{t.name}</p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted mt-0.5">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Closing CTA */}
      <div className="relative bg-ink text-white overflow-hidden mt-8">
        <div className="absolute inset-0 bg-grid opacity-[0.04] pointer-events-none" />
        <motion.div
          className="absolute left-1/2 top-1/2 w-[500px] h-[500px] rounded-full bg-brand-blue/15 blur-[120px]"
          style={{ translateX: "-50%", translateY: "-50%" }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="relative max-w-3xl mx-auto px-6 py-24 text-center"
        >
          <h2 className="font-display text-3xl md:text-4xl font-semibold">
            Ready to see your match reading?
          </h2>
          <p className="text-white/60 mt-4 max-w-lg mx-auto">
            Upload a resume or post a job — the engine does the rest in seconds.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/register")}
            className="mt-8 inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-brand-blue text-white font-medium shadow-[0_0_30px_rgba(13,148,136,0.4)]"
          >
            Get started <FiArrowRight />
          </motion.button>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="border-t border-brand-border">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted">JobSync AI</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Matched and explained</span>
        </div>
      </div>
    </div>
  );
}