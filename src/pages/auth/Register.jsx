import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiMail, FiLock, FiUser, FiCheck, FiEye, FiEyeOff } from "react-icons/fi";
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

const PASSWORD_RULES = [
  { test: (v) => v.length >= 8, label: "8+ characters" },
  { test: (v) => /[0-9]/.test(v), label: "A number" },
];

export default function Register() {
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const passwordOk = PASSWORD_RULES.every((r) => r.test(password));
  const matchOk = confirm.length === 0 || confirm === password;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!passwordOk) {
      setError("Password doesn't meet the requirements below.");
      return;
    }
    if (confirm !== password) {
      setError("Passwords don't match.");
      return;
    }
    setError("");
    setLoading(true);
    const user = await register(name || "New User", email || "demo@jobsync.ai", role);
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
            Start with a real answer, not a black box.
          </h2>
          <p className="text-muted text-sm max-w-sm leading-relaxed">
            Upload once. See your skill overlap, semantic fit, and what's missing in seconds.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            <FeaturePill text="Instant Matching" />
            <FeaturePill text="AI Parsing" />
            <FeaturePill text="Clear Explanations" />
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

          <h1 className="font-display text-3xl font-bold text-ink mb-1">Create your account</h1>
          <p className="text-sm text-muted mb-8">Get your first match reading in seconds</p>

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
                    layoutId="role-pill-register"
                    className="absolute inset-0 bg-brand-bg rounded-lg shadow-sm border border-brand-border -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {r === "student" ? "Job Seeker" : "Recruiter"}
              </button>
            ))}
          </div>

          <FormField
            label="Full name"
            icon={FiUser}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jordan Lee"
          />

          <FormField
            label="Email"
            icon={FiMail}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          <FormField
            label="Password"
            icon={FiLock}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          {password.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex gap-4 -mt-3 mb-5"
            >
              {PASSWORD_RULES.map((r) => {
                const ok = r.test(password);
                return (
                  <span
                    key={r.label}
                    className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                      ok ? "text-brand-blue" : "text-muted"
                    }`}
                  >
                    <FiCheck className={`w-3.5 h-3.5 ${ok ? "opacity-100" : "opacity-30"}`} />
                    {r.label}
                  </span>
                );
              })}
            </motion.div>
          )}

          <FormField
            label="Confirm password"
            icon={FiLock}
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
          />
          {!matchOk && (
            <p className="font-mono text-[10px] uppercase tracking-wider text-match-bad -mt-4 mb-4">
              Passwords don't match
            </p>
          )}

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-match-bad mb-5"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3 mt-2 font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg"
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
                  Creating account...
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  Create account <FiArrowRight />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-blue font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
}