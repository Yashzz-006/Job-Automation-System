import { FiSearch, FiBell, FiLogOut } from "react-icons/fi";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Topbar({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-brand-border bg-brand-surface flex items-center justify-between px-6 sticky top-0 z-10">
      <h1 className="font-display font-semibold text-lg text-ink tracking-tight">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 border border-brand-border rounded-lg px-3 py-1.5 text-sm text-muted w-64 transition-colors focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/15">
          <FiSearch className="shrink-0" />
          <input
            type="text"
            placeholder="Search…"
            className="w-full bg-transparent outline-none text-ink placeholder:text-muted"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="text-muted hover:text-ink transition"
          title="Notifications"
        >
          <FiBell className="text-lg" />
        </motion.button>

        <div className="flex items-center gap-2 pl-3 border-l border-brand-border">
          <div className="w-8 h-8 rounded-md bg-ink text-white text-xs flex items-center justify-center font-mono font-medium">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="text-muted hover:text-brand-blue transition"
            title="Log out"
          >
            <FiLogOut />
          </motion.button>
        </div>
      </div>
    </header>
  );
}