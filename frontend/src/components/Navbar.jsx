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

function Navbar({ onMenuClick }) {
  const { darkMode, toggleTheme } = useTheme();

  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  function handleMenuClick() {
    setMenuOpen((prev) => !prev);

    if (typeof onMenuClick === "function") {
      onMenuClick();
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-2xl transition-all duration-300 ${
        darkMode
          ? "border-slate-700/70 bg-slate-900/90"
          : "border-gray-200 bg-white/90"
      }`}
    >
      <div className="w-full px-3 py-3 sm:px-4 sm:py-4 md:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1800px]">

          {/* =====================================================
              MAIN NAV ROW
          ====================================================== */}

          <div className="flex min-w-0 items-center justify-between gap-2 sm:gap-3">

            {/* LEFT */}

            <div className="flex min-w-0 items-center gap-2 sm:gap-3 md:gap-4">

              {/* MOBILE MENU */}

              <button
                type="button"
                onClick={handleMenuClick}
                aria-label="Open navigation menu"
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition sm:h-11 sm:w-11 ${
                  darkMode
                    ? "bg-slate-800/80 text-slate-200 hover:bg-slate-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } lg:hidden`}
              >
                {menuOpen ? (
                  <X size={20} />
                ) : (
                  <Menu size={20} />
                )}
              </button>

              {/* LOGO */}

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 shadow-lg sm:h-12 sm:w-12 sm:rounded-2xl">
                <Trophy
                  size={21}
                  className="text-white sm:size-[24px]"
                />
              </div>

              {/* TITLE */}

              <div className="min-w-0">

                <h1
                  className={`truncate text-sm font-black tracking-wide sm:text-base md:text-lg lg:text-xl xl:text-2xl ${
                    darkMode
                      ? "text-white"
                      : "text-gray-900"
                  }`}
                  title="IPL Cricket Dashboard"
                >
                  IPL Cricket Dashboard
                </h1>

                <div
                  className={`mt-0.5 hidden items-center gap-1.5 text-[10px] sm:flex sm:text-xs ${
                    darkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  <CalendarDays
                    size={12}
                    className="shrink-0 sm:size-[14px]"
                  />

                  <span className="truncate">
                    {today}
                  </span>
                </div>

              </div>

            </div>

            {/* RIGHT */}

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">

              {/* DESKTOP SEARCH */}

              <div className="relative hidden lg:block">

                <Search
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search Player, Team..."
                  className={`h-10 w-[220px] rounded-xl border pl-10 pr-4 text-xs outline-none transition-all duration-300 xl:w-[280px] ${
                    darkMode
                      ? "border-slate-700 bg-slate-800/80 text-white placeholder-gray-500 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10"
                      : "border-gray-200 bg-gray-100 text-gray-800 placeholder-gray-400 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10"
                  }`}
                />

              </div>

              {/* THEME */}

              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 hover:scale-105 sm:h-11 sm:w-11 sm:rounded-2xl ${
                  darkMode
                    ? "bg-slate-800/80 hover:bg-slate-700"
                    : "bg-white shadow-md hover:bg-gray-50"
                }`}
              >
                {darkMode ? (
                  <Sun
                    className="text-yellow-400"
                    size={18}
                  />
                ) : (
                  <Moon
                    className="text-indigo-700"
                    size={18}
                  />
                )}
              </button>

              {/* NOTIFICATION */}

              <button
                type="button"
                aria-label="Notifications"
                className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 hover:scale-105 sm:h-11 sm:w-11 sm:rounded-2xl ${
                  darkMode
                    ? "bg-slate-800/80 hover:bg-slate-700"
                    : "bg-white shadow-md hover:bg-gray-50"
                }`}
              >
                <Bell
                  size={18}
                  className={
                    darkMode
                      ? "text-slate-200"
                      : "text-gray-700"
                  }
                />

                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
              </button>

              {/* PROFILE */}

              <div
                className={`flex h-10 cursor-pointer items-center gap-2 rounded-xl px-2 sm:h-11 sm:gap-2.5 sm:px-3 md:rounded-2xl md:px-4 ${
                  darkMode
                    ? "bg-slate-800/80 hover:bg-slate-700"
                    : "bg-white shadow-md hover:bg-gray-50"
                } transition-all duration-300`}
              >

                <UserCircle
                  size={27}
                  className="shrink-0 text-orange-500 sm:size-[32px] md:size-[36px]"
                />

                <div className="hidden xl:block">
                  <h3
                    className={`text-xs font-bold ${
                      darkMode
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    Admin
                  </h3>

                  <p
                    className={`text-[10px] ${
                      darkMode
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    IPL Analyst
                  </p>
                </div>

                <ChevronDown
                  size={15}
                  className="hidden text-gray-500 sm:block"
                />

              </div>

            </div>

          </div>

          {/* =====================================================
              MOBILE DATE
          ====================================================== */}

          <div
            className={`mt-2 flex items-center gap-1.5 text-[10px] sm:hidden ${
              darkMode
                ? "text-gray-500"
                : "text-gray-500"
            }`}
          >
            <CalendarDays size={12} />

            <span className="truncate">
              {today}
            </span>
          </div>

          {/* =====================================================
              MOBILE / TABLET SEARCH
          ====================================================== */}

          <div className="mt-3 lg:hidden">

            <div className="relative">

              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search Player, Team..."
                className={`h-11 w-full rounded-xl border pl-10 pr-4 text-xs outline-none transition-all duration-300 sm:h-12 sm:text-sm ${
                  darkMode
                    ? "border-slate-700 bg-slate-800/80 text-white placeholder-gray-500 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10"
                    : "border-gray-200 bg-gray-100 text-gray-800 placeholder-gray-400 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10"
                }`}
              />

            </div>

          </div>

        </div>
      </div>
    </header>
  );
}

export default Navbar;