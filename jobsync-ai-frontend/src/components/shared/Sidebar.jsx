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
    <aside className="w-56 shrink-0 bg-white border-r border-brand-border h-screen sticky top-0 flex flex-col">
      <div className="px-5 py-5 font-semibold text-lg text-brand-blue">JobSync AI</div>
      <nav className="flex-1 px-3 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? "bg-indigo-50 text-brand-blue"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
