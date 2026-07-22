import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50 flex flex-col items-center justify-center px-6 text-center">
      <span className="text-brand-blue font-medium text-sm mb-3">JobSync AI</span>
      <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 max-w-2xl leading-tight">
        AI-powered recruitment, matched and explained
      </h1>
      <p className="text-gray-500 mt-4 max-w-xl">
        Helping students find the right opportunities and helping recruiters discover
        the right talent — with a match score you can actually see the reasoning behind.
      </p>
      <div className="flex gap-4 mt-8">
        <button
          onClick={() => navigate("/login?role=student")}
          className="px-6 py-3 rounded-xl bg-brand-blue text-white font-medium hover:opacity-90 transition"
        >
          I'm a Student
        </button>
        <button
          onClick={() => navigate("/login?role=recruiter")}
          className="px-6 py-3 rounded-xl bg-white border border-brand-border text-gray-700 font-medium hover:bg-gray-50 transition"
        >
          I'm a Recruiter
        </button>
      </div>
    </div>
  );
}
