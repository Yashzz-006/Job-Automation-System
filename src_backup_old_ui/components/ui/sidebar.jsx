import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiGrid,
  FiBriefcase,
  FiUsers,
  FiUser,
  FiFileText,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const STUDENT_LINKS = [
  { to: "/student/dashboard", label: "Dashboard", icon: FiGrid, end: true },
  { to: "/student/jobs", label: "Jobs", icon: FiBriefcase },
  { to: "/student/profile", label: "Profile", icon: FiUser },
];

const RECRUITER_LINKS = [
  { to: "/recruiter/dashboard", label: "Dashboard", icon: FiGrid, end: true },
  { to: "/recruiter/candidates", label: "Candidates", icon: FiUsers },
  { to: "/recruiter/jobs", label: "Job posts", icon: FiFileText },
];

export default function Sidebar() {
  const { user } = useAuth();
  const links = user?.role === "recruiter" ? RECRUITER_LINKS : STUDENT_LINKS;

  return (
    <aside className="hidden md:flex w-56 shrink-0 flex-col bg-brand-surface border-r border-brand-border">
      <div className="h-16 flex items-center px-6 border-b border-brand-border">
        <span className="font-display font-semibold text-ink tracking-tight">JobSync</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}>
            {({ isActive }) => (
              <div className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-brand-blue/10 rounded-lg"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon
                  className={`relative w-4 h-4 shrink-0 transition-colors ${
                    isActive ? "text-brand-blue" : "text-muted"
                  }`}
                />
                <span className={`relative transition-colors ${isActive ? "text-brand-blue" : "text-ink"}`}>
                  {label}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-5 border-t border-brand-border">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">JobSync AI</p>
      </div>
    </aside>
  );
}