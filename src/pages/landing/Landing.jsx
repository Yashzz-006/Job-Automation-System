import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FiFileText, FiSliders, FiBriefcase, FiCheck } from "react-icons/fi";
import { PiSpiralLight } from "react-icons/pi";

function StarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#FBBF24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );
}

function Nav() {
  const navigate = useNavigate();
  return (
    <nav className="max-w-6xl mx-auto px-6 h-24 flex items-center justify-between text-ganda-text">
      <div className="flex items-center gap-2">
        <PiSpiralLight className="text-3xl text-white/80" />
        <span className="font-display font-bold text-xl italic tracking-wide text-white">Ganda</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/90">
        <Link to="#" className="hover:text-white transition">Home</Link>
        <Link to="#" className="hover:text-white transition">How Its Work</Link>
        <Link to="#" className="hover:text-white transition">Pricing</Link>
        <button onClick={() => navigate("/login")} className="hover:text-white transition">Log in</button>
      </div>
      <button onClick={() => navigate("/register")} className="bg-ganda-button-bg text-ganda-button-text font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-white/90 transition shadow-lg">
        GET STARTED
      </button>
    </nav>
  );
}

function FeatureCard({ icon: Icon, title, description, glowColor, glowPosition }) {
  return (
    <div className="relative group perspective-1000">
      {/* Background Glow */}
      <div 
        className={`absolute w-3/4 h-24 rounded-[100%] blur-3xl opacity-50 transition duration-500 group-hover:opacity-70 ${glowColor}`} 
        style={{ [glowPosition]: '-20px', left: '12.5%' }}
      />
      
      {/* Card Container */}
      <div className="relative h-full bg-ganda-card border border-ganda-card-border rounded-t-3xl rounded-b-[40px] p-8 flex flex-col items-center text-center overflow-hidden z-10 shadow-2xl transition duration-500 group-hover:translate-y-[-4px]">
        {/* Subtle top inner gradient */}
        <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
        
        {/* Icon Circle */}
        <div className="w-16 h-16 rounded-full bg-[#2C3150] border border-white/10 flex items-center justify-center mb-6 shadow-inner relative z-10">
          <Icon className="text-2xl text-white/90" />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-4 relative z-10">{title}</h3>
        <p className="text-sm text-ganda-muted leading-relaxed mb-8 relative z-10 flex-grow">
          {description}
        </p>
        
        <button className="text-xs font-bold text-[#4DE6B6] tracking-widest uppercase hover:text-white transition relative z-10">
          LEARN MORE
        </button>

        {/* Bottom subtle gradient based on glowColor */}
        <div className={`absolute bottom-0 inset-x-0 h-16 opacity-30 blur-xl ${glowColor}`} />
      </div>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-ganda-bg font-sans overflow-x-hidden selection:bg-[#4DE6B6]/30">
      <Nav />

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-[3.5rem] leading-[1.15] font-bold text-white max-w-4xl mx-auto mb-8"
        >
          Upload Your Resume<br/>
          Watch Ai Make Hundreds Of<br/>
          Applications While You Enjoy Life
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-ganda-muted mb-8"
        >
          <span>Smart & Founcational</span>
          <span className="w-1.5 h-1.5 rounded-full bg-ganda-muted/50" />
          <span>Secure & Reliable</span>
          <span className="w-1.5 h-1.5 rounded-full bg-ganda-muted/50" />
          <span>Reasonably Priced</span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row items-center justify-center gap-4 mb-20"
        >
          <div className="flex gap-1">
            <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
          </div>
          <div className="text-left text-sm text-ganda-muted leading-tight">
            <span className="text-white font-bold">4.9 Start Review</span> Average In<br/>
            The Ai After <span className="text-white font-bold">4 Yers In Market</span>
          </div>
        </motion.div>

        {/* Cards Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
          {/* Background decorative arrows/lines */}
          <div className="absolute top-1/2 -left-[10%] w-[120%] h-px bg-gradient-to-r from-transparent via-[#4DE6B6]/30 to-transparent -z-10" />
          <div className="absolute top-1/2 -left-[10%] w-[120%] flex justify-between -z-10 text-[#4DE6B6]/30 -translate-y-1/2">
             <div className="flex flex-col gap-2">
                <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#4DE6B6]/40" />
                <div className="h-px w-32 bg-gradient-to-r from-transparent to-[#4DE6B6]/40" />
                <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#4DE6B6]/40" />
             </div>
             <div className="flex flex-col gap-2 items-end">
                <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#F87171]/40" />
                <div className="h-px w-32 bg-gradient-to-l from-transparent to-[#F87171]/40" />
                <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#F87171]/40" />
             </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <FeatureCard 
              icon={FiFileText}
              title="Upload Resume"
              description="Simply Upload Your Resume, And Let Our Ai Analyze Your Skills To Find The Best Job Opportunities For You."
              glowColor="bg-teal-400"
              glowPosition="bottom"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <FeatureCard 
              icon={FiSliders}
              title="Your Preferences"
              description="Select Your Preferred Companies And Industries To Get Personalized Job Matches."
              glowColor="bg-emerald-400"
              glowPosition="bottom"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <FeatureCard 
              icon={FiBriefcase}
              title="AI-Powered Search"
              description="Our Ai Bot Curates A Personalized Job List Based On Your Preferences And Resume."
              glowColor="bg-orange-400"
              glowPosition="bottom"
            />
          </motion.div>
        </div>
      </main>

      {/* How Easy Get Jobs Section */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center border-t border-white/5 relative">
        <h2 className="text-3xl font-bold text-white mb-6">How Easy Get Jobs</h2>
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-ganda-muted mb-16">
          <span>Upload Resume</span>
          <span className="w-1.5 h-1.5 rounded-full bg-ganda-muted/50" />
          <span>Your Preferences</span>
          <span className="w-1.5 h-1.5 rounded-full bg-ganda-muted/50" />
          <span>AI-Powered Search</span>
        </div>

        {/* Abstract UI Mockup Image Placeholder */}
        <div className="relative mx-auto max-w-3xl h-64 bg-ganda-card border border-ganda-card-border rounded-t-3xl overflow-hidden pt-8 px-8 flex justify-center">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#4DE6B6]/50 to-transparent" />
            <div className="w-full h-full bg-[#1A1D36] rounded-t-2xl border-t border-x border-white/10 relative overflow-hidden flex flex-col">
               <div className="h-12 border-b border-white/10 flex items-center px-4">
                  <div className="w-1/3 h-4 bg-white/5 rounded-full" />
               </div>
               <div className="flex-1 p-6 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-8 rounded-full border border-[#4DE6B6]/50 bg-[#4DE6B6]/10 flex items-center justify-center text-[#4DE6B6] font-bold text-xs tracking-wider">
                     AI-POWERED SEARCH
                  </div>
               </div>
            </div>
            
            {/* Floating abstract icons */}
            <div className="absolute left-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#2C3150] border border-[#4DE6B6]/30 flex items-center justify-center shadow-[0_0_15px_rgba(77,230,182,0.3)]">
               <FiFileText className="text-[#4DE6B6]" />
            </div>
            <div className="absolute right-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#2C3150] border border-[#F87171]/30 flex items-center justify-center shadow-[0_0_15px_rgba(248,113,113,0.3)]">
               <FiBriefcase className="text-[#F87171]" />
            </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold text-white mb-8">
          Flexible Pricing<br/>For Teams Of All Sizes
        </h2>
        
        {/* Toggle */}
        <div className="inline-flex bg-ganda-card p-1 rounded-full mb-16 border border-ganda-card-border">
          <button className="px-6 py-2 rounded-full bg-white text-ganda-bg font-bold text-sm shadow-sm transition">
            MONTHLY
          </button>
          <button className="px-6 py-2 rounded-full text-ganda-muted font-semibold text-sm hover:text-white transition">
            ANNUAL
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-end max-w-3xl mx-auto">
          {/* Pro Plan ($80) */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-ganda-card border border-[#4DE6B6]/30 rounded-3xl p-8 pb-10 text-left relative overflow-hidden shadow-[0_0_30px_rgba(77,230,182,0.1)]"
          >
            <div className="absolute -top-16 -left-16 w-32 h-32 bg-[#4DE6B6]/20 blur-3xl rounded-full" />
            
            <div className="w-12 h-12 rounded-full bg-[#4DE6B6]/10 flex items-center justify-center mb-6">
              <PiSpiralLight className="text-2xl text-[#4DE6B6]" />
            </div>
            
            <div className="mb-8">
              <div className="flex items-end gap-1 mb-1">
                <span className="text-3xl font-bold text-[#4DE6B6]">$80</span>
                <span className="text-sm font-medium text-ganda-muted mb-1">/MO</span>
              </div>
              <p className="text-sm text-ganda-muted">Most popular plan</p>
            </div>

            <ul className="space-y-4 mb-10 text-sm text-white/80">
              <li className="flex items-center gap-3"><FiCheck className="text-[#4DE6B6] shrink-0" /> All Starter features</li>
              <li className="flex items-center gap-3"><FiCheck className="text-[#4DE6B6] shrink-0" /> <span className="font-semibold text-white">1TB</span> additional storage</li>
              <li className="flex items-center gap-3"><FiCheck className="text-[#4DE6B6] shrink-0" /> <span className="font-semibold text-white">Unlimited</span> Projects</li>
              <li className="flex items-center gap-3"><FiCheck className="text-[#4DE6B6] shrink-0" /> Analytics</li>
              <li className="flex items-center gap-3"><FiCheck className="text-[#4DE6B6] shrink-0" /> <span className="font-semibold text-white">24/7</span> Support</li>
            </ul>

            <button onClick={() => navigate("/register")} className="w-full bg-white text-ganda-bg font-bold py-3.5 rounded-xl hover:bg-white/90 transition shadow-lg">
              GET STARTED
            </button>
            <div className="absolute bottom-0 inset-x-0 h-16 bg-[#4DE6B6]/20 blur-2xl rounded-b-3xl" />
          </motion.div>

          {/* Teams Plan ($39) - Looks like a folded corner card in screenshot */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-[#2C3150] border border-ganda-card-border rounded-[2rem] rounded-tr-[4rem] p-8 pb-10 text-left relative overflow-hidden h-[95%]"
          >
             <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-[4rem]" />

            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <PiSpiralLight className="text-xl text-white/70" />
            </div>
            
            <div className="mb-8">
              <div className="flex items-end gap-1 mb-1">
                <span className="text-2xl font-bold text-white">$39</span>
                <span className="text-xs font-medium text-ganda-muted mb-1">/MO</span>
              </div>
              <p className="text-xs text-ganda-muted">Exclusively for teams</p>
            </div>

            <ul className="space-y-3 mb-10 text-xs text-white/70">
              <li className="flex items-center gap-2"><FiCheck className="text-white/50 shrink-0" /> All Starter features</li>
              <li className="flex items-center gap-2"><FiCheck className="text-white/50 shrink-0" /> <span className="font-semibold text-white">100+</span> prompt templates</li>
              <li className="flex items-center gap-2"><FiCheck className="text-white/50 shrink-0" /> <span className="font-semibold text-white">10</span> Projects</li>
              <li className="flex items-center gap-2"><FiCheck className="text-white/50 shrink-0" /> <span className="font-semibold text-white">24/7</span> Support</li>
            </ul>

            <button onClick={() => navigate("/register")} className="w-full bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition backdrop-blur-md">
              GET STARTED
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="border-t border-white/10 mt-12 py-8 text-center">
         <p className="text-xs text-ganda-muted">© 2026 Ganda AI. Matched and Explained.</p>
      </footer>
    </div>
  );
}