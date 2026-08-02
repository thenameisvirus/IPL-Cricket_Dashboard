import {
  LayoutDashboard,
  BarChart3,
  BrainCircuit,
  Search,
  Users,
  Trophy,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const menus = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
    },
    {
      name: "Analytics",
      icon: <BarChart3 size={20} />,
      path: "/analytics",
    },
    {
      name: "Players",
      icon: <Users size={20} />,
      path: "/dashboard",
    },
    {
      name: "Teams",
      icon: <Trophy size={20} />,
      path: "/dashboard",
    },
    {
      name: "Search",
      icon: <Search size={20} />,
      path: "/dashboard",
    },
    {
      name: "AI Prediction",
      icon: <BrainCircuit size={20} />,
      path: "/dashboard",
    },
    {
      name: "Settings",
      icon: <Settings size={20} />,
      path: "/dashboard",
    },
  ];

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  }

  return (
    <aside className="w-72 min-h-screen bg-slate-900 text-white flex flex-col shadow-2xl">

      {/* Logo */}

      <div className="p-8 border-b border-slate-700">

        <div className="flex items-center gap-3">

          <div className="text-5xl">🏏</div>

          <div>

            <h1 className="text-2xl font-bold">
              IPL Analytics
            </h1>

            <p className="text-slate-400 text-sm">
              Professional Dashboard
            </p>

          </div>

        </div>

      </div>

      {/* Menu */}

      <div className="flex-1 p-5">

        {menus.map((menu) => (

          <NavLink
            key={menu.name}
            to={menu.path}
            className={({ isActive }) =>
              `flex items-center gap-4 p-4 rounded-xl mb-3 transition-all duration-300 ${
                isActive
                  ? "bg-blue-600 shadow-lg"
                  : "hover:bg-slate-700"
              }`
            }
          >

            {menu.icon}

            <span className="font-semibold">
              {menu.name}
            </span>

          </NavLink>

        ))}

      </div>

      {/* Logout */}

      <div className="p-5 border-t border-slate-700">

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 rounded-xl py-3 font-bold transition"
        >

          <LogOut size={18} />

          Logout

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;