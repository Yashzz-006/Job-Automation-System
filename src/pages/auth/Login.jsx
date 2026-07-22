import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { PiSpiralLight } from "react-icons/pi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import MatchScoreRing from "../../components/shared/MatchScoreRing";
import ThemeToggle from "../../components/shared/ThemeToggle";

/* ─── Ambient animated blobs for brand panel ─── */
function AmbientBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -top-32 -left-24 w-[400px] h-[400px] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(77,230,182,0.3), transparent 70%)" }}
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 -right-32 w-[440px] h-[440px] rounded-full blur-[130px]"
        style={{ background: "radial-gradient(circle, rgba(129,140,248,0.25), transparent 70%)" }}
        animate={{ x: [0, -30, 0], y: [0, -35, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full blur-[100px]"
        style={{ background: "radial-gradient(circle, rgba(248,113,113,0.15), transparent 70%)" }}
        animate={{ x: [0, 20, -20, 0], y: [0, -40, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </div>
  );
}

/* ─── Mouse spotlight effect ─── */
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
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          x, y,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(77,230,182,0.12) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

/* ─── Form input field ─── */
function FormField({ label, icon: Icon, type: initialType, ...props }) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = initialType === "password";
  const type = isPassword && showPassword ? "text" : initialType;

  return (
    <div className="mb-5">
      <label className="block font-mono text-[10px] uppercase tracking-wider text-muted mb-2">
        {label}
      </label>
      <div
        className={`flex items-center gap-3 border rounded-xl px-4 transition-all duration-300 ${
          focused
            ? "border-brand-blue ring-2 ring-brand-blue/20 bg-brand-blue/[0.03]"
            : "border-brand-border bg-brand-surface/50"
        }`}
      >
        <Icon className={`w-4 h-4 shrink-0 transition-colors duration-300 ${focused ? "text-brand-blue" : "text-muted"}`} />
        <input
          {...props}
          type={type}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full py-3 text-sm outline-none text-ink bg-transparent placeholder:text-muted/60"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-muted hover:text-ink transition-colors shrink-0"
            tabIndex={-1}
          >
            {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Feature pill for brand panel ─── */
function FeaturePill({ text }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium bg-brand-blue/10 text-brand-blue border border-brand-blue/20">
      <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
      {text}
    </span>
  );
}

export default function Login() {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState(searchParams.get("role") || "student");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const user = await login(email || "demo@jobsync.ai", role);
    setLoading(false);
    navigate(`/${user.role}/dashboard`);
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-brand-bg relative">
      {/* ─── Brand Panel (left) ─── */}
      <div className="hidden md:flex relative overflow-hidden flex-col justify-between p-10"
        style={{
          background: theme === "dark"
            ? "linear-gradient(135deg, #0C0E1A 0%, #151832 50%, #0F1120 100%)"
            : "linear-gradient(135deg, #EBF4FF 0%, #F0FDF4 50%, #F8F9FC 100%)",
        }}
      >
        <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />
        <AmbientBlobs />
        <Spotlight />

        {/* Top: Brand */}
        <div className="relative z-10 flex items-center gap-2">
          <PiSpiralLight className="text-2xl text-brand-blue" />
          <Link to="/" className="font-display font-bold text-xl text-ink tracking-tight">
            JobSync
          </Link>
          <span className="font-mono text-[9px] uppercase tracking-widest text-brand-blue/70 ml-1 mt-0.5">AI</span>
        </div>

        {/* Center: Hero content */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 space-y-6"
        >
          <h2 className="font-display text-3xl font-bold leading-tight max-w-sm text-ink">
            Every match comes with a reason.
          </h2>
          <p className="text-muted text-sm max-w-sm leading-relaxed">
            Skill overlap, semantic fit, and exactly what's missing — before you apply, not after.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            <FeaturePill text="Skill Analysis" />
            <FeaturePill text="Semantic Matching" />
            <FeaturePill text="Gap Detection" />
          </div>

          {/* Match score preview card */}
          <div className="mt-6 inline-flex items-center gap-5 glass-card rounded-2xl px-6 py-5">
            <MatchScoreRing score={87} size={68} theme={theme} />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Sample reading</p>
              <p className="text-sm text-ink/80 mt-1">Skill overlap · 82%</p>
              <p className="text-sm text-ink/80">Semantic fit · 91%</p>
            </div>
          </div>
        </motion.div>

        {/* Bottom: Tagline */}
        <p className="relative z-10 font-mono text-[10px] uppercase tracking-widest text-muted/50">
          Matched and explained
        </p>
      </div>

      {/* ─── Form Panel (right) ─── */}
      <div className="flex items-center justify-center px-6 py-16 relative">
        {/* Theme toggle */}
        <div className="absolute top-6 right-6 z-20">
          <ThemeToggle />
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          onSubmit={handleSubmit}
          className="w-full max-w-sm"
        >
          {/* Mobile brand */}
          <div className="flex items-center gap-2 md:hidden mb-6">
            <PiSpiralLight className="text-2xl text-brand-blue" />
            <span className="font-display font-bold text-lg text-ink">JobSync AI</span>
          </div>

          <h1 className="font-display text-3xl font-bold text-ink mb-1">Welcome back</h1>
          <p className="text-sm text-muted mb-8">Log in to continue to your dashboard</p>

          {/* Role toggle */}
          <div className="relative flex rounded-xl bg-brand-surface p-1 mb-7 border border-brand-border">
            {["student", "recruiter"].map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setRole(r)}
                className="relative flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all text-center z-10"
                style={{ color: role === r ? "var(--color-brand-blue)" : "var(--color-muted)" }}
              >
                {role === r && (
                  <motion.span
                    layoutId="role-pill"
                    className="absolute inset-0 bg-brand-bg rounded-lg shadow-sm border border-brand-border -z-10"
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

          {/* Forgot password link */}
          <div className="flex justify-end -mt-3 mb-5">
            <button type="button" className="text-xs text-brand-blue hover:underline font-medium">
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3 font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg"
            style={{
              background: "linear-gradient(135deg, var(--color-brand-blue), #818CF8)",
              color: theme === "dark" ? "#0F1120" : "#FFFFFF",
              boxShadow: "0 4px 20px rgba(77, 230, 182, 0.25)",
            }}
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="32" strokeDashoffset="12" />
                  </svg>
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

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-brand-border" />
            <span className="text-[11px] text-muted uppercase tracking-wider font-mono">or</span>
            <div className="flex-1 h-px bg-brand-border" />
          </div>

          {/* Social placeholders */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-brand-border bg-brand-surface/50 text-sm font-medium text-ink hover:bg-brand-surface transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-brand-border bg-brand-surface/50 text-sm font-medium text-ink hover:bg-brand-surface transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>

          <p className="text-center text-sm text-muted">
            Don't have an account?{" "}
            <Link to="/register" className="text-brand-blue font-semibold hover:underline">
              Register
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
}