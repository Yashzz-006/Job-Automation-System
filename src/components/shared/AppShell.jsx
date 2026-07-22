import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import AnimatedBackground from "./AnimatedBackground";

export default function AppShell({ title, children }) {
  return (
    <div className="flex min-h-screen bg-brand-bg">
      <Sidebar />
      <div className="flex-1 min-w-0 relative">
        {/* Global ambient background behind all content */}
        <AnimatedBackground />
        
        <Topbar title={title} />
        <motion.main
          key={title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative z-[1] p-6 max-w-6xl mx-auto"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}