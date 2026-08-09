import { NavLink } from "react-router-dom";

function Sidebar() {
  const navigation = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "▦",
    },
    {
      name: "Players",
      path: "/players",
      icon: "♟",
    },
    {
      name: "Teams",
      path: "/teams",
      icon: "♜",
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: "◫",
    },
    {
      name: "Match Prediction",
      path: "/prediction",
      icon: "✦",
    },
    {
      name: "Team Comparison",
      path: "/comparison",
      icon: "⚔",
    },
  ];

  return (
    <aside className="h-full w-full bg-[#0b101c] text-white">

      <div className="flex h-full flex-col">

        {/* BRAND */}

        <div className="flex h-[82px] items-center border-b border-white/[0.06] px-6">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 shadow-[0_0_25px_rgba(245,158,11,0.08)]">
              <span className="text-xl">
                🏏
              </span>
            </div>

            <div>
              <h1 className="text-[15px] font-black tracking-tight text-white">
                IPL Analytics
              </h1>

              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                Cricket Intelligence
              </p>
            </div>

          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 overflow-y-auto px-3 py-6">

          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
            Main Menu
          </p>

          <div className="space-y-1.5">

            {navigation.map((item) => (

              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-amber-500 text-[#090d15] shadow-[0_8px_25px_rgba(245,158,11,0.12)]"
                      : "text-slate-400 hover:bg-white/[0.045] hover:text-white"
                  }`
                }
              >

                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base transition ${
                        isActive
                          ? "bg-black/10"
                          : "bg-white/[0.035] group-hover:bg-white/[0.07]"
                      }`}
                    >
                      {item.icon}
                    </span>

                    <span className="whitespace-nowrap">
                      {item.name}
                    </span>

                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#090d15]" />
                    )}
                  </>
                )}

              </NavLink>

            ))}

          </div>

          {/* DIVIDER */}

          <div className="my-7 h-px bg-white/[0.06]" />

          {/* SYSTEM */}

          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
            System
          </p>

          <div className="space-y-1.5">

            <button
              type="button"
              className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-400 transition hover:bg-white/[0.045] hover:text-white"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.035] text-base group-hover:bg-white/[0.07]">
                ⚙
              </span>

              <span className="whitespace-nowrap">
                Settings
              </span>
            </button>

            <button
              type="button"
              className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-400 transition hover:bg-red-500/[0.08] hover:text-red-400"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.035] text-base group-hover:bg-red-500/10">
                ↪
              </span>

              <span className="whitespace-nowrap">
                Logout
              </span>
            </button>

          </div>

        </nav>

        {/* BOTTOM STATUS */}

        <div className="border-t border-white/[0.06] p-4">

          <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.04] px-4 py-3">

            <div className="flex items-center gap-2">

              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>

              <span className="text-[11px] font-bold text-emerald-400">
                API ONLINE
              </span>

            </div>

            <p className="mt-1 text-[10px] text-slate-600">
              IPL Analytics System
            </p>

          </div>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;