import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiMail, FiLock } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import MatchScoreRing from "../../components/shared/MatchScoreRing";

function AmbientBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -top-24 -left-20 w-[320px] h-[320px] rounded-full bg-brand-blue/20 blur-[100px]"
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 -right-24 w-[360px] h-[360px] rounded-full bg-brand-purple/20 blur-[110px]"
        animate={{ x: [0, -20, 0], y: [0, -25, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </div>
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
        className="absolute w-[420px] h-[420px] rounded-full"
        style={{
          x, y,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(13,148,136,0.16) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

function FormField({ label, icon: Icon, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="mb-4">
      <label className="block font-mono text-[10px] uppercase tracking-wider text-muted mb-1.5">
        {label}
      </label>
      <div
        className={`flex items-center gap-2 border rounded-lg px-3 transition ${
          focused ? "border-brand-blue ring-2 ring-brand-blue/15" : "border-brand-border"
        }`}
      >
        <Icon className={`w-3.5 h-3.5 shrink-0 transition ${focused ? "text-brand-blue" : "text-muted"}`} />
        <input
          {...props}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full py-2.5 text-sm outline-none text-ink bg-transparent"
        />
      </div>
    </div>
  );
}

export default function Login() {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState(searchParams.get("role") || "student");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const user = await login(email || "demo@jobsync.ai", role);
    setLoading(false);
    navigate(`/${user.role}/dashboard`);
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-brand-bg">
      {/* Brand panel */}
      <div className="hidden md:flex relative bg-ink text-white overflow-hidden flex-col justify-between p-10">
        <div className="absolute inset-0 bg-grid opacity-[0.04] pointer-events-none" />
        <AmbientBlobs />
        <Spotlight />

        <Link to="/" className="relative font-display font-semibold tracking-tight z-10">
          JobSync
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10"
        >
          <h2 className="font-display text-2xl font-semibold leading-tight max-w-xs">
            Every match comes with a reason.
          </h2>
          <p className="text-white/50 text-sm mt-3 max-w-xs leading-relaxed">
            Skill overlap, semantic fit, and exactly what's missing — before you apply, not after.
          </p>

          <div className="mt-8 inline-flex items-center gap-4 bg-white/[0.05] backdrop-blur-md border border-white/10 rounded-2xl px-6 py-5">
            <MatchScoreRing score={87} size={64} theme="dark" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">Sample reading</p>
              <p className="text-sm text-white/80 mt-1">Skill overlap · 82%</p>
              <p className="text-sm text-white/80">Semantic fit · 91%</p>
            </div>
          </div>
        </motion.div>

        <p className="relative z-10 font-mono text-[10px] uppercase tracking-widest text-white/30">
          Matched and explained
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-6 py-16">
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          onSubmit={handleSubmit}
          className="w-full max-w-sm"
        >
          <span className="font-mono text-[10px] uppercase tracking-widest text-brand-blue md:hidden">
            JobSync AI
          </span>
          <h1 className="font-display text-2xl font-semibold text-ink mt-2 mb-1">Welcome back</h1>
          <p className="text-sm text-muted mb-7">Log in to continue</p>

          <div className="relative flex rounded-lg bg-brand-surface p-1 mb-6 border border-brand-border">
            {["student", "recruiter"].map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setRole(r)}
                className="relative flex-1 py-2 rounded-md text-sm font-medium capitalize transition text-center z-10"
                style={{ color: role === r ? "var(--color-brand-blue)" : "var(--color-muted)" }}
              >
                {role === r && (
                  <motion.span
                    layoutId="role-pill"
                    className="absolute inset-0 bg-white rounded-md shadow-sm -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {r === "student" ? "Job Seeker" : "Recruiter"}
              </button>
            ))}
          </div>

          <FormField
            label="Email"
            icon={FiMail}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          <FormField label="Password" icon={FiLock} type="password" placeholder="••••••••" />

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-brand-blue text-white rounded-lg py-2.5 mt-2 font-medium hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Logging in...
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  Log in <FiArrowRight />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <p className="text-center text-sm text-muted mt-5">
            No account?{" "}
            <Link to="/register" className="text-brand-blue font-medium">
              Register
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
}