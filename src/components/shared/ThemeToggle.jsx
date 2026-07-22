import { motion, AnimatePresence } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle({ size = "md" }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const sizeClasses = size === "sm" ? "w-8 h-8" : "w-9 h-9";
  const iconSize = size === "sm" ? "text-sm" : "text-base";

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`${sizeClasses} rounded-xl flex items-center justify-center relative overflow-hidden transition-colors duration-300`}
      style={{
        background: isDark
          ? "rgba(77, 230, 182, 0.1)"
          : "rgba(251, 191, 36, 0.15)",
        border: `1px solid ${isDark ? "rgba(77, 230, 182, 0.2)" : "rgba(251, 191, 36, 0.3)"}`,
      }}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <FiMoon className={`${iconSize} text-brand-blue`} />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <FiSun className={`${iconSize} text-amber-500`} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
