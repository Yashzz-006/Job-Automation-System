import { FiSearch, FiBell, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Topbar({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-brand-border bg-white flex items-center justify-between px-6 sticky top-0 z-10">
      <h1 className="font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5 text-sm text-gray-500 w-64">
          <FiSearch />
          <span>Search...</span>
        </div>
        <FiBell className="text-gray-500 text-lg" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-purple text-white text-xs flex items-center justify-center font-medium">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="text-gray-400 hover:text-gray-700"
            title="Logout"
          >
            <FiLogOut />
          </button>
        </div>
      </div>
    </header>
  );
}
