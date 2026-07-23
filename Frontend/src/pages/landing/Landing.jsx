import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FiFileText, FiSliders, FiBriefcase, FiCheck } from "react-icons/fi";
import { PiSpiralLight } from "react-icons/pi";
import ThemeToggle from "../../components/shared/ThemeToggle";

function StarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#FBBF24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );
}

function Nav() {
  const navigate = useNavigate();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="max-w-6xl mx-auto px-6 h-24 flex items-center justify-between text-ink">
      <div className="flex items-center gap-2">
        <PiSpiralLight className="text-3xl text-brand-blue" />
        <span className="font-display font-bold text-xl italic tracking-wide text-ink">JobSync</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-ink/80">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-brand-blue transition">Home</button>
        <button onClick={() => scrollTo("how-it-works")} className="hover:text-brand-blue transition">How It Works</button>
        <button onClick={() => scrollTo("pricing")} className="hover:text-brand-blue transition">Pricing</button>
        <button onClick={() => navigate("/login")} className="hover:text-brand-blue transition">Log in</button>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle size="sm" />
        <button onClick={() => navigate("/register")} className="bg-brand-blue text-brand-bg font-semibold text-sm px-6 py-2.5 rounded-full hover:opacity-90 transition shadow-lg">
          GET STARTED
        </button>
      </div>
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
      <div className="relative h-full bg-brand-surface border border-brand-border rounded-t-3xl rounded-b-[40px] p-8 flex flex-col items-center text-center overflow-hidden z-10 shadow-2xl transition duration-500 group-hover:translate-y-[-4px]">
        {/* Subtle top inner gradient */}
        <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
        
        {/* Icon Circle */}
        <div className="w-16 h-16 rounded-full bg-brand-border/40 border border-brand-border flex items-center justify-center mb-6 shadow-inner relative z-10">
          <Icon className="text-2xl text-ink/90" />
        </div>
        
        <h3 className="text-xl font-bold text-ink mb-4 relative z-10">{title}</h3>
        <p className="text-sm text-muted leading-relaxed mb-8 relative z-10 flex-grow">
          {description}
        </p>

        {/* Bottom subtle gradient based on glowColor */}
        <div className={`absolute bottom-0 inset-x-0 h-16 opacity-30 blur-xl ${glowColor}`} />
      </div>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-brand-bg font-sans overflow-x-hidden selection:bg-brand-blue/30">
      <Nav />

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-[3.5rem] leading-[1.15] font-bold text-ink max-w-4xl mx-auto mb-8"
        >
          Upload Your Resume<br/>
          Watch AI Make Hundreds Of<br/>
          Applications While You Enjoy Life
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-muted mb-8"
        >
          <span>Smart & Foundational</span>
          <span className="w-1.5 h-1.5 rounded-full bg-muted/50" />
          <span>Secure & Reliable</span>
          <span className="w-1.5 h-1.5 rounded-full bg-muted/50" />
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
          <div className="text-left text-sm text-muted leading-tight">
            <span className="text-ink font-bold">4.9 Star Review</span> Average In<br/>
            The AI After <span className="text-ink font-bold">4 Years In Market</span>
          </div>
        </motion.div>


      </main>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-6 py-24 text-center border-t border-brand-border/30 relative">
        <h2 className="text-3xl font-bold text-ink mb-6">How Easy To Get Jobs</h2>
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-muted mb-16">
          <span>Upload Resume</span>
          <span className="w-1.5 h-1.5 rounded-full bg-muted/50" />
          <span>Your Preferences</span>
          <span className="w-1.5 h-1.5 rounded-full bg-muted/50" />
          <span>AI-Powered Search</span>
        </div>

        {/* Step-by-step Process */}
        <div className="relative mx-auto max-w-4xl mt-12">
          {/* Connecting line */}
          <div className="absolute top-12 left-[15%] right-[15%] h-0.5 bg-brand-border hidden md:block overflow-hidden">
            <motion.div 
               className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-brand-blue to-transparent shadow-[0_0_8px_rgba(77,230,182,0.8)]" 
               animate={{ left: ["-33%", "100%", "100%"] }}
               transition={{ 
                 duration: 9,
                 repeat: Infinity, 
                 times: [0, 0.28, 1], // 2 seconds to cross, 23 seconds wait
                 ease: "linear"
               }}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center">
               <div className="w-24 h-24 rounded-2xl bg-brand-surface border border-brand-border flex items-center justify-center shadow-xl mb-6 relative group transition-transform hover:-translate-y-2">
                  <div className="absolute inset-0 bg-brand-blue/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <FiFileText className="text-4xl text-brand-blue" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-brand-bg border-2 border-brand-blue flex items-center justify-center font-mono font-bold text-sm text-ink shadow-lg">1</div>
               </div>
               <h3 className="text-xl font-bold text-ink mb-2">Upload Resume</h3>
               <p className="text-sm text-muted px-4">Drag and drop your existing PDF resume. We'll automatically parse your skills and experience.</p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center">
               <div className="w-24 h-24 rounded-2xl bg-brand-surface border border-brand-border flex items-center justify-center shadow-xl mb-6 relative group transition-transform hover:-translate-y-2">
                  <div className="absolute inset-0 bg-amber-400/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <FiSliders className="text-4xl text-amber-400" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-brand-bg border-2 border-amber-400 flex items-center justify-center font-mono font-bold text-sm text-ink shadow-lg">2</div>
               </div>
               <h3 className="text-xl font-bold text-ink mb-2">Set Preferences</h3>
               <p className="text-sm text-muted px-4">Tell us your target roles, salary expectations, and preferred locations. We'll handle the rest.</p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center">
               <div className="w-24 h-24 rounded-2xl bg-brand-surface border border-brand-border flex items-center justify-center shadow-xl mb-6 relative group transition-transform hover:-translate-y-2">
                  <div className="absolute inset-0 bg-match-bad/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <FiBriefcase className="text-4xl text-match-bad" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-brand-bg border-2 border-match-bad flex items-center justify-center font-mono font-bold text-sm text-ink shadow-lg">3</div>
               </div>
               <h3 className="text-xl font-bold text-ink mb-2">Get Matched</h3>
               <p className="text-sm text-muted px-4">Our AI scores your fit against thousands of live jobs and provides instant explanations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold text-ink mb-8">
          Flexible Pricing<br/>For Teams Of All Sizes
        </h2>
        
        {/* Toggle */}
        <div className="inline-flex bg-brand-surface p-1 rounded-full mb-16 border border-brand-border">
          <button className="px-6 py-2 rounded-full bg-brand-blue text-brand-bg font-bold text-sm shadow-sm transition">
            MONTHLY
          </button>
          <button className="px-6 py-2 rounded-full text-muted font-semibold text-sm hover:text-ink transition">
            ANNUAL
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-end max-w-3xl mx-auto">
          {/* Pro Plan ($80) */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-brand-surface border border-brand-blue/30 rounded-3xl p-8 pb-10 text-left relative overflow-hidden shadow-[0_0_30px_rgba(77,230,182,0.1)]"
          >
            <div className="absolute -top-16 -left-16 w-32 h-32 bg-brand-blue/20 blur-3xl rounded-full" />
            
            <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center mb-6">
              <PiSpiralLight className="text-2xl text-brand-blue" />
            </div>
            
            <div className="mb-8">
              <div className="flex items-end gap-1 mb-1">
                <span className="text-3xl font-bold text-brand-blue">$80</span>
                <span className="text-sm font-medium text-muted mb-1">/MO</span>
              </div>
              <p className="text-sm text-muted">Most popular plan</p>
            </div>

            <ul className="space-y-4 mb-10 text-sm text-ink/80">
              <li className="flex items-center gap-3"><FiCheck className="text-brand-blue shrink-0" /> All Starter features</li>
              <li className="flex items-center gap-3"><FiCheck className="text-brand-blue shrink-0" /> <span className="font-semibold text-ink">1TB</span> additional storage</li>
              <li className="flex items-center gap-3"><FiCheck className="text-brand-blue shrink-0" /> <span className="font-semibold text-ink">Unlimited</span> Projects</li>
              <li className="flex items-center gap-3"><FiCheck className="text-brand-blue shrink-0" /> Analytics</li>
              <li className="flex items-center gap-3"><FiCheck className="text-brand-blue shrink-0" /> <span className="font-semibold text-ink">24/7</span> Support</li>
            </ul>

            <button onClick={() => navigate("/register")} className="w-full bg-brand-blue text-brand-bg font-bold py-3.5 rounded-xl hover:opacity-90 transition shadow-lg">
              GET STARTED
            </button>
            <div className="absolute bottom-0 inset-x-0 h-16 bg-brand-blue/20 blur-2xl rounded-b-3xl" />
          </motion.div>

          {/* Teams Plan ($39) */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-brand-surface border border-brand-border rounded-[2rem] rounded-tr-[4rem] p-8 pb-10 text-left relative overflow-hidden h-[95%]"
          >
             <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-brand-border/40 to-transparent rounded-bl-[4rem]" />

            <div className="w-10 h-10 rounded-full bg-brand-border/30 flex items-center justify-center mb-6">
              <PiSpiralLight className="text-xl text-muted" />
            </div>
            
            <div className="mb-8">
              <div className="flex items-end gap-1 mb-1">
                <span className="text-2xl font-bold text-ink">$39</span>
                <span className="text-xs font-medium text-muted mb-1">/MO</span>
              </div>
              <p className="text-xs text-muted">Exclusively for teams</p>
            </div>

            <ul className="space-y-3 mb-10 text-xs text-ink/70">
              <li className="flex items-center gap-2"><FiCheck className="text-muted shrink-0" /> All Starter features</li>
              <li className="flex items-center gap-2"><FiCheck className="text-muted shrink-0" /> <span className="font-semibold text-ink">100+</span> prompt templates</li>
              <li className="flex items-center gap-2"><FiCheck className="text-muted shrink-0" /> <span className="font-semibold text-ink">10</span> Projects</li>
              <li className="flex items-center gap-2"><FiCheck className="text-muted shrink-0" /> <span className="font-semibold text-ink">24/7</span> Support</li>
            </ul>

            <button onClick={() => navigate("/register")} className="w-full bg-brand-border/50 text-ink font-bold py-3 rounded-xl hover:bg-brand-border transition backdrop-blur-md">
              GET STARTED
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-brand-border/30 mt-12 py-8 text-center">
         <p className="text-xs text-muted">© 2026 JobSync AI. Matched and Explained.</p>
      </footer>
    </div>
  );
}