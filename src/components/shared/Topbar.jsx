import { FiSearch, FiBell, FiLogOut } from "react-icons/fi";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Topbar({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-brand-border/50 flex items-center justify-between px-6 sticky top-0 z-10 relative"
      style={{ background: "rgba(15, 17, 32, 0.8)", backdropFilter: "blur(16px)" }}
    >
      <h1 className="font-display font-semibold text-lg text-ink tracking-tight">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm text-muted w-64 transition-all duration-300 focus-within:ring-2 focus-within:ring-brand-blue/30 focus-within:border-brand-blue/50"
          style={{ background: "rgba(26, 29, 53, 0.6)", border: "1px solid rgba(42, 46, 74, 0.5)" }}
        >
          <FiSearch className="shrink-0" />
          <input
            type="text"
            placeholder="Search…"
            className="w-full bg-transparent outline-none text-ink placeholder:text-muted"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative text-muted hover:text-ink transition"
          title="Notifications"
        >
          <FiBell className="text-lg" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-brand-blue animate-glow-pulse" />
        </motion.button>

        <div className="flex items-center gap-2 pl-3 border-l border-brand-border/50">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs"
            style={{
              background: "linear-gradient(135deg, #4DE6B6, #818CF8)",
              color: "#0F1120",
            }}
          >
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