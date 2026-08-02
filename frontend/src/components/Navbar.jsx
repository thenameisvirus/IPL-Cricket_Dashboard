import {
  Search,
  Bell,
  UserCircle,
  Moon,
  Sun,
  CalendarDays,
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const { darkMode, toggleTheme } = useTheme();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-indigo-700 px-10 py-6 shadow-xl">

      <div className="flex justify-between items-center">

        {/* Left */}

        <div>

          <h1 className="text-4xl font-extrabold text-white">
            🏏 IPL Analytics Dashboard
          </h1>

          <div className="flex items-center gap-2 mt-2 text-blue-100">

            <CalendarDays size={18} />

            <span>{today}</span>

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-5">

          {/* Search */}

          <div className="relative">

            <Search
              size={18}
              className="absolute left-4 top-3 text-gray-500"
            />

            <input
              type="text"
              placeholder="Search player, team..."
              className="w-72 pl-11 pr-4 py-3 rounded-full bg-white shadow-lg outline-none text-black"
            />

          </div>

          {/* Dark Mode */}

          <button
            onClick={toggleTheme}
            className="bg-white p-3 rounded-full shadow-lg hover:scale-110 transition"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Notification */}

          <button className="bg-white p-3 rounded-full shadow-lg hover:scale-110 transition relative">

            <Bell size={20} />

            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>

          </button>

          {/* User */}

          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-lg">

            <UserCircle
              size={34}
              className="text-blue-700"
            />

            <div>

              <h3 className="font-bold text-sm">
                Admin
              </h3>

              <p className="text-xs text-gray-500">
                IPL Analyst
              </p>

            </div>

          </div>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;