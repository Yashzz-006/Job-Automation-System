import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const user = await register(name || "New User", email || "demo@jobsync.ai", role);
    setLoading(false);
    navigate(`/${user.role}/dashboard`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-brand-border shadow-sm p-8 w-full max-w-sm"
      >
        <h1 className="text-xl font-semibold text-gray-900 mb-1">Create your account</h1>
        <p className="text-sm text-gray-500 mb-6">Join JobSync AI</p>

        <div className="flex rounded-xl bg-gray-50 p-1 mb-5">
          {["student", "recruiter"].map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition ${
                role === r ? "bg-white shadow-sm text-brand-blue" : "text-gray-500"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <label className="block text-sm text-gray-600 mb-1">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full border border-brand-border rounded-xl px-3 py-2 mb-4 text-sm outline-none focus:border-brand-blue"
        />

        <label className="block text-sm text-gray-600 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full border border-brand-border rounded-xl px-3 py-2 mb-4 text-sm outline-none focus:border-brand-blue"
        />

        <label className="block text-sm text-gray-600 mb-1">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          className="w-full border border-brand-border rounded-xl px-3 py-2 mb-6 text-sm outline-none focus:border-brand-blue"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-blue text-white rounded-xl py-2.5 font-medium hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-blue font-medium">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
