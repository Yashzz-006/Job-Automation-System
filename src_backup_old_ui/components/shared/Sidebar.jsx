import { NavLink } from "react-router-dom";
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
    <aside className="w-60 shrink-0 bg-ink h-screen sticky top-0 flex flex-col">
      <div className="px-5 py-6 border-b border-white/10">
        <div className="font-display font-semibold text-lg text-white tracking-tight">JobSync</div>
        <div className="font-mono text-[10px] tracking-widest text-brand-blue mt-0.5">AI MATCH ENGINE</div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition relative ${
                isActive ? "bg-white/5 text-white" : "text-white/50 hover:text-white/80 hover:bg-white/5"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full transition ${
                    isActive ? "bg-brand-blue" : "bg-transparent"
                  }`}
                />
                <Icon className={isActive ? "text-brand-blue" : ""} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-white/10 font-mono text-[10px] text-white/30 tracking-wide">
        {user?.role === "recruiter" ? "ROLE · RECRUITER" : "ROLE · STUDENT"}
      </div>
    </aside>
  );
}