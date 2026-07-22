import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { FiGrid, FiUploadCloud, FiBriefcase, FiUsers, FiPlusCircle } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const studentLinks = [
  { to: "/student/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/student/resume", label: "Resume", icon: FiUploadCloud },
  { to: "/student/jobs", label: "Jobs", icon: FiBriefcase },
];

const recruiterLinks = [
  { to: "/recruiter/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/recruiter/post-job", label: "Post a job", icon: FiPlusCircle },
  { to: "/recruiter/candidates", label: "Candidates", icon: FiUsers },
];

export default function Sidebar() {
  const { user } = useAuth();
  const links = user?.role === "recruiter" ? recruiterLinks : studentLinks;

  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 flex flex-col relative overflow-hidden bg-brand-surface/90 backdrop-blur-md">
      {/* Subtle gradient edge */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-brand-blue/20 via-brand-border to-brand-purple/20" />
      
      {/* Ambient glow orb */}
      <div
        className="absolute -top-20 -left-20 w-40 h-40 rounded-full blur-3xl opacity-[0.08] animate-float-a"
        style={{ background: "radial-gradient(circle, #4DE6B6, transparent 70%)" }}
      />

      {/* Brand */}
      <div className="px-5 py-6 border-b border-brand-border/50 relative">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-blue animate-glow-pulse" />
          <div className="font-display font-semibold text-lg text-ink tracking-tight">JobSync</div>
        </div>
        <div className="font-mono text-[10px] tracking-widest text-brand-blue/70 mt-0.5 ml-4">AI MATCH ENGINE</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, label, icon: Icon }, index) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group ${
                isActive
                  ? "text-ink"
                  : "text-muted hover:text-ink hover:bg-brand-surface/50"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active background with glow */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: "linear-gradient(135deg, rgba(77,230,182,0.1), rgba(129,140,248,0.05))",
                      border: "1px solid rgba(77,230,182,0.15)",
                      boxShadow: "0 0 20px rgba(77,230,182,0.05)",
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}

                {/* Active glow bar */}
                {isActive && (
                  <motion.span
                    layoutId="sidebar-glow-bar"
                    className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
                    style={{
                      background: "linear-gradient(to bottom, #4DE6B6, #818CF8)",
                      boxShadow: "0 0 8px #4DE6B6",
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}

                <motion.div
                  className={`relative z-10 flex items-center gap-3 ${isActive ? "text-brand-blue" : ""}`}
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Icon className={`text-base ${isActive ? "text-brand-blue" : "group-hover:text-brand-blue"} transition-colors`} />
                  <span className="relative z-10">{label}</span>
                </motion.div>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-brand-border/50 font-mono text-[10px] text-muted/50 tracking-wide">
        {user?.role === "recruiter" ? "ROLE · RECRUITER" : "ROLE · STUDENT"}
      </div>
    </aside>
  );
}