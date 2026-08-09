import { useState } from "react";
import {
  Search,
  Bell,
  UserCircle,
  Moon,
  Sun,
  CalendarDays,
  Trophy,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const { darkMode, toggleTheme } = useTheme();

  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header
      className={`
      sticky
      top-0
      z-50
      backdrop-blur-xl
      border-b
      transition-all
      duration-500

      ${
        darkMode
          ? "bg-slate-900/80 border-slate-700"
          : "bg-white/80 border-gray-200"
      }
      `}
    >
      <div className="px-8 py-5">

        {/* Top Navbar */}

        <div className="flex items-center justify-between">

          {/* ========================= */}
          {/* LEFT SECTION */}
          {/* ========================= */}

          <div className="flex items-center gap-4">

            {/* Mobile Menu */}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="
              lg:hidden
              p-3
              rounded-xl
              transition
              hover:scale-105
              "
            >
              {menuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>

            {/* Logo */}

            <div
              className="
              w-16
              h-16
              rounded-2xl
              bg-gradient-to-br
              from-orange-500
              via-red-500
              to-pink-600
              flex
              items-center
              justify-center
              shadow-xl
              "
            >
              <Trophy
                size={30}
                className="text-white"
              />
            </div>

            {/* Title */}

            <div>

              <h1
                className="
                text-3xl
                font-black
                tracking-wide
                "
              >
                IPL Cricket Dashboard
              </h1>

              <div
                className="
                flex
                items-center
                gap-2
                mt-1
                text-sm
                text-gray-500
                "
              >
                <CalendarDays size={16} />

                <span>{today}</span>

              </div>

            </div>

          </div>



                    {/* ========================= */}
          {/* RIGHT SECTION */}
          {/* ========================= */}

          <div className="flex items-center gap-5">

            {/* Search Box */}

            <div className="hidden md:flex relative">

              <Search
                size={18}
                className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
                "
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Player, Team..."
                className={`
                w-80
                pl-12
                pr-5
                py-3
                rounded-2xl
                outline-none
                border
                transition-all
                duration-300
                focus:ring-2
                focus:ring-orange-500

                ${
                  darkMode
                    ? "bg-slate-800 border-slate-700 text-white placeholder-gray-400"
                    : "bg-gray-100 border-gray-200 text-gray-800"
                }
                `}
              />

            </div>

            {/* Theme Button */}

            <button
              onClick={toggleTheme}
              className={`
              p-3
              rounded-2xl
              transition-all
              duration-300
              hover:scale-110

              ${
                darkMode
                  ? "bg-slate-800"
                  : "bg-white shadow-lg"
              }
              `}
            >
              {darkMode ? (
                <Sun className="text-yellow-400" size={20} />
              ) : (
                <Moon className="text-indigo-700" size={20} />
              )}
            </button>

            {/* Notification */}

            <button
              className={`
              relative
              p-3
              rounded-2xl
              transition-all
              duration-300
              hover:scale-110

              ${
                darkMode
                  ? "bg-slate-800"
                  : "bg-white shadow-lg"
              }
              `}
            >

              <Bell size={20} />

              <span
                className="
                absolute
                top-2
                right-2
                w-2.5
                h-2.5
                rounded-full
                bg-red-500
                animate-pulse
                "
              ></span>

            </button>

            {/* Profile */}

            <div
              className={`
              flex
              items-center
              gap-3
              px-4
              py-2
              rounded-2xl
              cursor-pointer
              transition-all
              duration-300
              hover:scale-105

              ${
                darkMode
                  ? "bg-slate-800"
                  : "bg-white shadow-lg"
              }
              `}
            >

              <UserCircle
                size={42}
                className="text-orange-500"
              />

              <div className="hidden md:block">

                <h3 className="font-bold">
                  Admin
                </h3>

                <p
                  className={`
                  text-xs

                  ${
                    darkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }
                  `}
                >
                  IPL Analyst
                </p>

              </div>

              <ChevronDown
                size={18}
                className="text-gray-500"
              />

            </div>

          </div>

        </div> 
         

                 {/* Mobile Search */}

        <div className="mt-5 md:hidden">

          <div className="relative">

            <Search
              size={18}
              className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-gray-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Player..."
              className={`
              w-full
              pl-12
              pr-4
              py-3
              rounded-2xl
              outline-none
              border

              ${
                darkMode
                  ? "bg-slate-800 border-slate-700 text-white placeholder-gray-400"
                  : "bg-gray-100 border-gray-200"
              }
              `}
            />

          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;