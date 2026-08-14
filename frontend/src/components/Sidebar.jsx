import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  BarChart3,
  Sparkles,
  GitCompare,
  Settings,
  LogOut,
  X,
  Trophy,
  ChevronRight,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar({
  isOpen = false,
  onClose = () => {},
}) {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Players",
      path: "/players",
      icon: Users,
    },
    {
      name: "Teams",
      path: "/teams",
      icon: ShieldCheck,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: BarChart3,
    },
    {
      name: "Match Prediction",
      path: "/prediction",
      icon: Sparkles,
    },
    {
      name: "Team Comparison",
      path: "/comparison",
      icon: GitCompare,
    },
  ];

  const systemItems = [
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  function handleNavigation() {
    onClose();
  }

  function handleLogout() {
    /* =========================================
       CLEAR ALL AUTH STATE
    ========================================= */

    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("iplLoggedIn");
    localStorage.removeItem("iplUsername");
    localStorage.removeItem("iplRememberMe");

    /* =========================================
       CLOSE MOBILE SIDEBAR
    ========================================= */

    onClose();

    /* =========================================
       GO BACK TO ROOT

       App.jsx will automatically render
       Login because iplLoggedIn is removed.
    ========================================= */

    window.location.href = "/";
  }

  return (
    <>
      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}

      <div
        className={`fixed inset-0 z-[998] bg-black/75 backdrop-blur-sm transition-all duration-300 lg:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-[999]
          flex
          h-[100dvh]
          w-[250px]
          max-w-[85vw]
          flex-col
          border-r
          border-white/[0.06]
          bg-[#050914]/98
          shadow-[20px_0_70px_rgba(0,0,0,0.35)]
          backdrop-blur-2xl
          transition-transform
          duration-300
          ease-out
          lg:translate-x-0
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* =================================================
            LOGO HEADER
        ================================================== */}

        <div className="flex min-h-[82px] shrink-0 items-center justify-between border-b border-white/[0.06] px-4 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-400/20 bg-gradient-to-br from-orange-500/15 to-orange-500/[0.03] shadow-[0_0_24px_rgba(249,115,22,0.08)] sm:h-11 sm:w-11">
              <Trophy
                size={20}
                className="text-orange-400"
              />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-sm font-black tracking-tight text-white">
                IPL Analytics
              </h1>

              <p className="mt-0.5 truncate text-[7px] font-black uppercase tracking-[1.8px] text-slate-600">
                Cricket Intelligence
              </p>
            </div>
          </div>

          {/* MOBILE CLOSE */}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-600 transition hover:bg-white/[0.05] hover:text-white lg:hidden"
          >
            <X size={17} />
          </button>
        </div>

        {/* =================================================
            NAVIGATION
        ================================================== */}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:py-5">
          {/* MAIN MENU */}

          <div>
            <p className="mb-3 px-3 text-[8px] font-black uppercase tracking-[2.5px] text-slate-700">
              Main Menu
            </p>

            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleNavigation}
                    className={({ isActive }) =>
                      `
                      group
                      flex
                      min-h-[44px]
                      w-full
                      items-center
                      gap-3
                      rounded-xl
                      px-3
                      py-2
                      transition-all
                      duration-200
                      ${
                        isActive
                          ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-[0_8px_25px_rgba(249,115,22,0.18)]"
                          : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"
                      }
                      `
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div
                          className={`
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            transition-all
                            ${
                              isActive
                                ? "bg-white/15"
                                : "bg-white/[0.025] group-hover:bg-white/[0.06]"
                            }
                          `}
                        >
                          <Icon size={15} />
                        </div>

                        <span className="min-w-0 flex-1 truncate text-[11px] font-black">
                          {item.name}
                        </span>

                        {isActive ? (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                        ) : (
                          <ChevronRight
                            size={13}
                            className="shrink-0 text-slate-800 opacity-0 transition group-hover:translate-x-0.5 group-hover:text-slate-500 group-hover:opacity-100"
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* SYSTEM */}

          <div className="mt-7 border-t border-white/[0.05] pt-5">
            <p className="mb-3 px-3 text-[8px] font-black uppercase tracking-[2.5px] text-slate-700">
              System
            </p>

            <div className="space-y-1">
              {systemItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleNavigation}
                    className={({ isActive }) =>
                      `
                      group
                      flex
                      min-h-[44px]
                      w-full
                      items-center
                      gap-3
                      rounded-xl
                      px-3
                      py-2
                      transition-all
                      ${
                        isActive
                          ? "bg-orange-500/10 text-orange-400"
                          : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"
                      }
                      `
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div
                          className={`
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            ${
                              isActive
                                ? "bg-orange-500/10"
                                : "bg-white/[0.025]"
                            }
                          `}
                        >
                          <Icon size={15} />
                        </div>

                        <span className="min-w-0 flex-1 truncate text-[11px] font-black">
                          {item.name}
                        </span>

                        {isActive && (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}

              {/* =================================================
                  LOGOUT
              ================================================== */}

              <button
                type="button"
                onClick={handleLogout}
                className="
                  group
                  flex
                  min-h-[44px]
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-2
                  text-left
                  text-slate-500
                  transition-all
                  hover:bg-red-500/[0.06]
                  hover:text-red-400
                "
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.025] transition group-hover:bg-red-500/[0.08]">
                  <LogOut size={15} />
                </div>

                <span className="min-w-0 flex-1 truncate text-[11px] font-black">
                  Logout
                </span>

                <ChevronRight
                  size={13}
                  className="shrink-0 text-slate-800 transition group-hover:translate-x-0.5 group-hover:text-red-400"
                />
              </button>
            </div>
          </div>
        </div>

        {/* =================================================
            API STATUS
        ================================================== */}

        <div className="shrink-0 border-t border-white/[0.06] bg-[#050914] p-3">
          <div className="rounded-xl border border-emerald-400/10 bg-emerald-500/[0.04] p-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

              <span className="text-[8px] font-black uppercase tracking-[1.5px] text-emerald-400">
                API Online
              </span>
            </div>

            <p className="mt-1 truncate text-[8px] text-slate-700">
              IPL Analytics System
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

