import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  Trophy,
  Users,
  TrendingUp,
  Shield,
  Crown,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BASE_URL from "../services/api";

const IPL_2026_TEAMS = [
  {
    code: "CSK",
    name: "Chennai Super Kings",
    short: "CSK",
    captain: "Ruturaj Gaikwad",
    logo: "https://documents.iplt20.com/ipl/teamlogos/CSK.png",
    color: "from-yellow-500/20 via-yellow-500/10 to-transparent",
    border: "border-yellow-500/30",
    accent: "text-yellow-400",
    badge: "bg-yellow-500/10",
    trophies: 5,
  },
  {
    code: "DC",
    name: "Delhi Capitals",
    short: "DC",
    captain: "Axar Patel",
    logo: "https://documents.iplt20.com/ipl/teamlogos/DC.png",
    color: "from-blue-500/20 via-blue-500/10 to-transparent",
    border: "border-blue-500/30",
    accent: "text-blue-400",
    badge: "bg-blue-500/10",
    trophies: 0,
  },
  {
    code: "GT",
    name: "Gujarat Titans",
    short: "GT",
    captain: "Shubman Gill",
    logo: "https://documents.iplt20.com/ipl/teamlogos/GT.png",
    color: "from-indigo-500/20 via-blue-500/10 to-transparent",
    border: "border-indigo-500/30",
    accent: "text-indigo-300",
    badge: "bg-indigo-500/10",
    trophies: 1,
  },
  {
    code: "KKR",
    name: "Kolkata Knight Riders",
    short: "KKR",
    captain: "Ajinkya Rahane",
    logo: "https://documents.iplt20.com/ipl/teamlogos/KKR.png",
    color: "from-purple-600/20 via-purple-500/10 to-transparent",
    border: "border-purple-500/30",
    accent: "text-purple-400",
    badge: "bg-purple-500/10",
    trophies: 3,
  },
  {
    code: "LSG",
    name: "Lucknow Super Giants",
    short: "LSG",
    captain: "Rishabh Pant",
    logo: "https://documents.iplt20.com/ipl/teamlogos/LSG.png",
    color: "from-cyan-500/20 via-blue-500/10 to-transparent",
    border: "border-cyan-500/30",
    accent: "text-cyan-400",
    badge: "bg-cyan-500/10",
    trophies: 0,
  },
  {
    code: "MI",
    name: "Mumbai Indians",
    short: "MI",
    captain: "Hardik Pandya",
    logo: "https://documents.iplt20.com/ipl/teamlogos/MI.png",
    color: "from-blue-600/20 via-blue-500/10 to-transparent",
    border: "border-blue-500/30",
    accent: "text-blue-400",
    badge: "bg-blue-500/10",
    trophies: 5,
  },
  {
    code: "PBKS",
    name: "Punjab Kings",
    short: "PBKS",
    captain: "Shreyas Iyer",
    logo: "https://documents.iplt20.com/ipl/teamlogos/PBKS.png",
    color: "from-red-500/20 via-red-400/10 to-transparent",
    border: "border-red-400/30",
    accent: "text-red-300",
    badge: "bg-red-400/10",
    trophies: 0,
  },
  {
    code: "RR",
    name: "Rajasthan Royals",
    short: "RR",
    captain: "Riyan Parag",
    logo: "https://documents.iplt20.com/ipl/teamlogos/RR.png",
    color: "from-pink-500/20 via-pink-400/10 to-transparent",
    border: "border-pink-500/30",
    accent: "text-pink-400",
    badge: "bg-pink-500/10",
    trophies: 1,
  },
  {
    code: "RCB",
    name: "Royal Challengers Bengaluru",
    short: "RCB",
    captain: "Rajat Patidar",
    logo: "https://documents.iplt20.com/ipl/teamlogos/RCB.png",
    color: "from-red-600/20 via-red-500/10 to-transparent",
    border: "border-red-500/30",
    accent: "text-red-400",
    badge: "bg-red-500/10",
    trophies: 1,
  },
  {
    code: "SRH",
    name: "Sunrisers Hyderabad",
    short: "SRH",
    captain: "Ishan Kishan",
    logo: "https://documents.iplt20.com/ipl/teamlogos/SRH.png",
    color: "from-orange-600/20 via-orange-500/10 to-transparent",
    border: "border-orange-500/30",
    accent: "text-orange-400",
    badge: "bg-orange-500/10",
    trophies: 1,
  },
];

function Teams() {
  const [winsData, setWinsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${BASE_URL}/team_wins`);

      const data = response.data;

      if (Array.isArray(data)) {
        setWinsData(data);
      } else if (Array.isArray(data?.teams)) {
        setWinsData(data.teams);
      } else if (Array.isArray(data?.data)) {
        setWinsData(data.data);
      } else {
        setWinsData([]);
      }
    } catch (error) {
      console.log("Team wins API unavailable:", error);
      setWinsData([]);
    } finally {
      setLoading(false);
    }
  };

  const normalizeName = (name = "") => {
    return name
      .toLowerCase()
      .replace(
        /royal challengers bangalore/g,
        "royal challengers bengaluru"
      )
      .replace(
        /royal challengers bengaluru/g,
        "royal challengers bengaluru"
      )
      .trim();
  };

  const getTeamWins = (teamName) => {
    const target = normalizeName(teamName);

    const found = winsData.find((item) => {
      const itemName =
        item?.team_name ||
        item?.team ||
        item?.Team ||
        item?.name ||
        "";

      return normalizeName(itemName) === target;
    });

    return (
      found?.wins ??
      found?.Wins ??
      found?.total_wins ??
      found?.win_count ??
      0
    );
  };

  const totalWinningTeams = useMemo(() => {
    return IPL_2026_TEAMS.filter(
      (team) => getTeamWins(team.name) > 0
    ).length;
  }, [winsData]);

  return (
    <div className="min-h-screen bg-[#050912] text-white">
      <div className="flex min-h-screen">

        {/* ================================================= */}
        {/* SIDEBAR */}
        {/* ================================================= */}

        <aside className="hidden lg:block w-[288px] shrink-0">
          <div className="fixed left-0 top-0 h-screen w-[288px]">
            <Sidebar />
          </div>
        </aside>

        {/* ================================================= */}
        {/* MAIN AREA */}
        {/* ================================================= */}

        <div className="min-w-0 flex-1 bg-[#050912]">

          {/* NAVBAR */}

          <div className="sticky top-0 z-50">
            <Navbar />
          </div>

          {/* CONTENT */}

          <main className="w-full px-4 py-5 sm:px-6 lg:px-8 xl:px-10">

            {/* ================================================= */}
            {/* HERO */}
            {/* ================================================= */}

            <section className="relative overflow-hidden rounded-[30px] border border-white/[0.07] bg-gradient-to-br from-[#111827] via-[#0b1424] to-[#070b13] px-6 py-8 shadow-2xl sm:px-8 lg:px-10">

              <div className="pointer-events-none absolute -right-32 -top-32 h-[350px] w-[350px] rounded-full bg-amber-500/[0.07] blur-3xl" />

              <div className="pointer-events-none absolute -bottom-32 left-20 h-[300px] w-[300px] rounded-full bg-blue-600/[0.06] blur-3xl" />

              <div className="relative z-10">

                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/[0.08] px-4 py-2">
                  <Sparkles
                    size={14}
                    className="text-amber-400"
                  />

                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">
                    IPL 2026
                  </span>
                </div>

                <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                  IPL Team{" "}
                  <span className="text-amber-400">
                    Universe
                  </span>
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                  Explore all 10 active IPL franchises and
                  their current 2026 captains.
                </p>

              </div>
            </section>

            {/* ================================================= */}
            {/* SUMMARY CARDS */}
            {/* ================================================= */}

            <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <div className="rounded-[22px] border border-white/[0.06] bg-[#0c1320] p-5 transition hover:-translate-y-1">
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                      Franchises
                    </p>

                    <h2 className="mt-2 text-4xl font-black">
                      10
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Active IPL teams
                    </p>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">
                    <Users
                      size={25}
                      className="text-blue-400"
                    />
                  </div>

                </div>
              </div>

              <div className="rounded-[22px] border border-white/[0.06] bg-[#0c1320] p-5 transition hover:-translate-y-1">
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                      Captains
                    </p>

                    <h2 className="mt-2 text-4xl font-black">
                      10
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      2026 leadership
                    </p>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10">
                    <Crown
                      size={25}
                      className="text-purple-400"
                    />
                  </div>

                </div>
              </div>

              <div className="rounded-[22px] border border-white/[0.06] bg-[#0c1320] p-5 transition hover:-translate-y-1">
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                      Winning Records
                    </p>

                    <h2 className="mt-2 text-4xl font-black">
                      {totalWinningTeams}
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Teams with wins
                    </p>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10">
                    <Trophy
                      size={25}
                      className="text-amber-400"
                    />
                  </div>

                </div>
              </div>

              <div className="rounded-[22px] border border-white/[0.06] bg-[#0c1320] p-5 transition hover:-translate-y-1">
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                      System
                    </p>

                    <h2 className="mt-2 text-2xl font-black text-emerald-400">
                      ONLINE
                    </h2>

                    <p className="mt-2 text-xs text-slate-500">
                      Analytics engine active
                    </p>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10">
                    <Shield
                      size={25}
                      className="text-emerald-400"
                    />
                  </div>

                </div>
              </div>

            </section>

            {/* ================================================= */}
            {/* TEAM HEADER */}
            {/* ================================================= */}

            <div className="mt-9 flex items-center justify-between">

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-400">
                  Franchise Directory
                </p>

                <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                  Teams & Captains
                </h2>
              </div>

              <button
                onClick={loadTeamData}
                className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2.5 text-xs font-bold text-slate-300 transition hover:border-amber-400/30 hover:bg-amber-400/5 hover:text-amber-400"
              >
                <RefreshCw
                  size={15}
                  className={loading ? "animate-spin" : ""}
                />

                <span className="hidden sm:inline">
                  Refresh
                </span>
              </button>

            </div>

            {/* ================================================= */}
            {/* TEAM GRID */}
            {/* ================================================= */}

            <section className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

              {IPL_2026_TEAMS.map((team, index) => {

                const wins = getTeamWins(team.name);

                return (
                  <article
                    key={team.code}
                    className={`
                      group
                      relative
                      overflow-hidden
                      rounded-[26px]
                      border
                      ${team.border}
                      bg-gradient-to-br
                      ${team.color}
                      bg-[#0b111c]
                      shadow-[0_18px_45px_rgba(0,0,0,0.35)]
                      transition-all
                      duration-500
                      hover:-translate-y-2
                      hover:shadow-[0_25px_65px_rgba(0,0,0,0.55)]
                    `}
                  >

                    {/* Glow */}

                    <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/[0.025] blur-3xl" />

                    {/* TOP */}

                    <div className="relative z-10 flex items-center justify-between px-5 pt-5">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-black/30 text-sm font-black text-white">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">
                          Active
                        </span>
                      </div>

                    </div>

                    {/* TEAM CONTENT */}

                    <div className="relative z-10 px-5 pb-5 pt-7">

                      <div className="flex items-center gap-5">

                        {/* LOGO */}

                        <div
                          className={`
                            flex
                            h-24
                            w-24
                            shrink-0
                            items-center
                            justify-center
                            rounded-[24px]
                            border
                            border-white/[0.08]
                            ${team.badge}
                            bg-black/25
                            p-4
                            shadow-xl
                            transition
                            duration-500
                            group-hover:scale-105
                          `}
                        >
                          <img
                            src={team.logo}
                            alt={`${team.name} logo`}
                            className="h-full w-full object-contain"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                              event.currentTarget.parentElement.innerHTML = `
                                <span class="text-2xl font-black text-white">
                                  ${team.short}
                                </span>
                              `;
                            }}
                          />
                        </div>

                        {/* NAME */}

                        <div className="min-w-0">

                          <p
                            className={`text-[10px] font-black uppercase tracking-[0.2em] ${team.accent}`}
                          >
                            {team.short} • IPL FRANCHISE
                          </p>

                          <h3 className="mt-2 text-xl font-black leading-6 text-white">
                            {team.name}
                          </h3>

                        </div>

                      </div>

                      {/* CAPTAIN */}

                      <div className="mt-6 rounded-2xl border border-white/[0.06] bg-black/20 p-4">

                        <div className="flex items-center gap-2">

                          <Crown
                            size={15}
                            className="text-amber-400"
                          />

                          <span className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">
                            Captain • 2026
                          </span>

                        </div>

                        <p className="mt-2 text-lg font-black text-white">
                          {team.captain}
                        </p>

                      </div>

                      {/* STATS */}

                      <div className="mt-4 grid grid-cols-2 gap-3">

                        <div className="rounded-xl border border-white/[0.05] bg-white/[0.025] px-3 py-3">

                          <div className="flex items-center gap-2">

                            <TrendingUp
                              size={14}
                              className="text-emerald-400"
                            />

                            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                              Wins
                            </span>

                          </div>

                          <p className="mt-1 text-xl font-black text-white">
                            {wins}
                          </p>

                        </div>

                        <div className="rounded-xl border border-white/[0.05] bg-white/[0.025] px-3 py-3">

                          <div className="flex items-center gap-2">

                            <Trophy
                              size={14}
                              className="text-amber-400"
                            />

                            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                              Titles
                            </span>

                          </div>

                          <p className="mt-1 text-xl font-black text-white">
                            {team.trophies}
                          </p>

                        </div>

                      </div>

                    </div>

                  </article>
                );
              })}

            </section>

            {/* ================================================= */}
            {/* FOOTER */}
            {/* ================================================= */}

            <div className="mt-8 mb-6 flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-[#0b111c] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10">

                  <Crown
                    size={17}
                    className="text-amber-400"
                  />

                </div>

                <p className="text-xs text-slate-400">

                  Current captain information for{" "}

                  <span className="font-bold text-white">
                    IPL 2026
                  </span>

                  .

                </p>

              </div>

              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                10 Active Franchises • IPL Analytics
              </p>

            </div>

          </main>

        </div>

      </div>
    </div>
  );
}

export default Teams;