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
  Search,
  X,
  Activity,
  ChevronRight,
  Medal,
  Star,
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
    logo: "https://scores.iplt20.com/ipl/teamlogos/CSK.png",
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
    logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Delhi_Capitals_Logo.png",
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
    logo: "https://upload.wikimedia.org/wikipedia/en/0/09/Gujarat_Titans_Logo.svg",
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
    logo: "https://scores.iplt20.com/ipl/teamlogos/KKR.png",
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
    logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Lucknow_logo.v1.png",
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
    logo: "https://upload.wikimedia.org/wikipedia/en/c/cd/Mumbai_Indians_Logo.svg",
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
    logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Kings_XI_Punjab_Logo.png",
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
    logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Rajasthan_Royals_Logo.png",

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
    logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/रॉयल_चैलेंजर्स_बेंगलुरु_लोगो.png",
    color: "from-red-600/20 via-red-500/10 to-transparent",
    border: "border-red-500/30",
    accent: "text-red-400",
    badge: "bg-red-500/10",
    trophies: 2,
  },
  {
    code: "SRH",
    name: "Sunrisers Hyderabad",
    short: "SRH",
    captain: "Ishan Kishan",
    logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Sunrisers_Hyderabad.jpg",
    color: "from-orange-600/20 via-orange-500/10 to-transparent",
    border: "border-orange-500/30",
    accent: "text-orange-400",
    badge: "bg-orange-500/10",
    trophies: 1,
  },
];

function Teams() {
  const [winsData, setWinsData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    loadTeamData();
  }, []);

  async function loadTeamData() {
    try {
      setLoading(true);

      let response;

      try {
        response = await axios.get(`${BASE_URL}/team_wins`);
      } catch (firstError) {
        console.warn(
          "Primary team_wins endpoint failed. Trying team_wins_chart."
        );

        response = await axios.get(
          `${BASE_URL}/team_wins_chart`
        );
      }

      const data = response?.data;

      if (Array.isArray(data)) {
        setWinsData(data);
      } else if (Array.isArray(data?.teams)) {
        setWinsData(data.teams);
      } else if (Array.isArray(data?.data)) {
        setWinsData(data.data);
      } else if (
        data &&
        typeof data === "object"
      ) {
        setWinsData(
          Object.entries(data).map(
            ([team, wins]) => ({
              team,
              wins: Number(wins) || 0,
            })
          )
        );
      } else {
        setWinsData([]);
      }
    } catch (error) {
      console.error(
        "Team wins API unavailable:",
        error
      );

      setWinsData([]);
    } finally {
      setLoading(false);
    }
  }

  function normalizeName(name = "") {
    return String(name)
      .toLowerCase()
      .replace(
        /royal challengers bangalore/g,
        "royal challengers bengaluru"
      )
      .replace(
        /royal challengers bengaluru/g,
        "royal challengers bengaluru"
      )
      .replace(/\s+/g, " ")
      .trim();
  }

  function safeNumber(value) {
    const number = Number(value);

    return Number.isFinite(number)
      ? number
      : 0;
  }

  function getTeamWins(teamName) {
    const target = normalizeName(teamName);

    const found = winsData.find((item) => {
      const itemName =
        item?.team_name ||
        item?.team ||
        item?.Team ||
        item?.name ||
        item?.Name ||
        "";

      return (
        normalizeName(itemName) === target
      );
    });

    if (!found) {
      return 0;
    }

    return safeNumber(
      found?.wins ??
        found?.Wins ??
        found?.total_wins ??
        found?.win_count ??
        found?.value ??
        0
    );
  }

  const filteredTeams = useMemo(() => {
    const query = search
      .toLowerCase()
      .trim();

    if (!query) {
      return IPL_2026_TEAMS;
    }

    return IPL_2026_TEAMS.filter(
      (team) =>
        team.name
          .toLowerCase()
          .includes(query) ||
        team.short
          .toLowerCase()
          .includes(query) ||
        team.captain
          .toLowerCase()
          .includes(query)
    );
  }, [search]);

  const totalWinningTeams = useMemo(() => {
    return IPL_2026_TEAMS.filter(
      (team) => getTeamWins(team.name) > 0
    ).length;
  }, [winsData]);

  const totalTrophies = useMemo(() => {
    return IPL_2026_TEAMS.reduce(
      (sum, team) =>
        sum + safeNumber(team.trophies),
      0
    );
  }, []);

  const highestWinsTeam = useMemo(() => {
    if (!winsData.length) {
      return null;
    }

    return (
      IPL_2026_TEAMS.map(
        (team) => ({
          ...team,
          wins: getTeamWins(team.name),
        })
      ).sort(
        (a, b) => b.wins - a.wins
      )[0] || null
    );
  }, [winsData]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#040711] text-white">

      {/* =====================================================
          AMBIENT BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-48 -top-48 h-[580px] w-[580px] rounded-full bg-amber-500/[0.045] blur-[160px]" />

        <div className="absolute right-[-220px] top-[18%] h-[620px] w-[620px] rounded-full bg-blue-500/[0.045] blur-[160px]" />

        <div className="absolute bottom-[-250px] left-[28%] h-[560px] w-[560px] rounded-full bg-purple-500/[0.04] blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "46px 46px",
          }}
        />

      </div>

      {/* =====================================================
          APP LAYOUT
      ====================================================== */}

      <div className="relative z-10 flex min-h-screen">

        {/* SIDEBAR */}

        <aside className="hidden w-[250px] shrink-0 lg:block">
          <div className="fixed left-0 top-0 h-screen w-[250px] border-r border-white/[0.06] bg-[#080d18]/96 backdrop-blur-2xl">
            <Sidebar />
          </div>
        </aside>

        {/* MAIN */}

        <main className="min-w-0 flex-1">

          {/* NAVBAR */}

          <div className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#040711]/88 backdrop-blur-2xl">
            <Navbar />
          </div>

          {/* CONTENT */}

          <div className="mx-auto w-full max-w-[1750px] px-4 pb-12 pt-10 sm:px-6 sm:pt-12 lg:px-8 lg:pt-14 xl:px-10">

            {/* =================================================
                HERO
            ================================================== */}

            <section className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-gradient-to-br from-[#121a2a] via-[#0b1220] to-[#080c15] shadow-[0_30px_100px_rgba(0,0,0,0.38)]">

              <div className="absolute -right-32 -top-32 h-[430px] w-[430px] rounded-full bg-amber-500/[0.075] blur-[115px]" />

              <div className="absolute bottom-[-190px] left-[25%] h-[420px] w-[420px] rounded-full bg-blue-500/[0.05] blur-[120px]" />

              <div
                className="absolute inset-0 opacity-[0.025]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
                  backgroundSize: "44px 44px",
                }}
              />

              <div className="relative p-6 sm:p-8 lg:p-10">

                <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">

                  <div className="max-w-3xl">

                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/[0.07] px-4 py-2">

                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-50" />
                        <span className="relative h-2 w-2 rounded-full bg-amber-400" />
                      </span>

                      <Sparkles
                        size={13}
                        className="text-amber-400"
                      />

                      <span className="text-[9px] font-black uppercase tracking-[2.4px] text-amber-300">
                        IPL Team Intelligence
                      </span>

                    </div>

                    <h1 className="text-4xl font-black tracking-[-1.8px] sm:text-5xl lg:text-6xl">
                      Team
                      <span className="block bg-gradient-to-r from-white via-slate-200 to-amber-300 bg-clip-text text-transparent">
                        Universe
                      </span>
                    </h1>

                    <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                      Explore IPL franchises, captains,
                      championship history and live team
                      performance from your analytics dataset.
                    </p>

                    <div className="mt-7 flex flex-wrap gap-3">

                      <HeroPill
                        icon={Trophy}
                        text="10 Franchises"
                      />

                      <HeroPill
                        icon={Crown}
                        text="2026 Captains"
                      />

                      <HeroPill
                        icon={Activity}
                        text="Live Wins Data"
                      />

                    </div>

                  </div>

                  {/* HERO STATS */}

                  <div className="grid grid-cols-2 gap-3 sm:min-w-[370px]">

                    <HeroStat
                      icon={Users}
                      label="FRANCHISES"
                      value="10"
                    />

                    <HeroStat
                      icon={Crown}
                      label="CAPTAINS"
                      value="10"
                    />

                    <HeroStat
                      icon={Trophy}
                      label="TITLES"
                      value={totalTrophies}
                    />

                    <HeroStat
                      icon={Shield}
                      label="STATUS"
                      value={
                        loading
                          ? "SYNC"
                          : "ONLINE"
                      }
                    />

                  </div>

                </div>

                {/* SEARCH */}

                <div className="mt-9">

                  <div className="relative">

                    <Search
                      size={18}
                      className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type="text"
                      value={search}
                      onChange={(e) =>
                        setSearch(
                          e.target.value
                        )
                      }
                      placeholder="Search team, short code or captain..."
                      className="h-14 w-full rounded-2xl border border-white/[0.08] bg-black/[0.25] pl-14 pr-14 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-amber-400/30 focus:bg-black/[0.34] focus:ring-4 focus:ring-amber-400/[0.05]"
                    />

                    {search && (
                      <button
                        type="button"
                        onClick={() =>
                          setSearch("")
                        }
                        className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.07] hover:text-white"
                      >
                        <X size={16} />
                      </button>
                    )}

                  </div>

                </div>

              </div>
            </section>

            {/* =================================================
                STATS
            ================================================== */}

            <section className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <SummaryCard
                icon={Users}
                title="Active Franchises"
                value="10"
                text="Current IPL team universe"
                accent="blue"
              />

              <SummaryCard
                icon={Crown}
                title="Captains"
                value="10"
                text="Leadership profiles indexed"
                accent="purple"
              />

              <SummaryCard
                icon={Trophy}
                title="Winning Teams"
                value={totalWinningTeams}
                text="Teams with recorded wins"
                accent="amber"
              />

              <SummaryCard
                icon={Star}
                title="Championships"
                value={totalTrophies}
                text="Titles represented"
                accent="orange"
              />

            </section>

            {/* =================================================
                DIRECTORY HEADER
            ================================================== */}

            <section className="mt-10">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                <div>

                  <div className="flex items-center gap-2">

                    <Users
                      size={15}
                      className="text-amber-400"
                    />

                    <span className="text-[9px] font-black uppercase tracking-[2.5px] text-amber-400">
                      Franchise Directory
                    </span>

                  </div>

                  <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                    Teams & Captains
                  </h2>

                  <p className="mt-1 text-sm text-slate-600">
                    {filteredTeams.length} teams available
                  </p>

                </div>

                <div className="flex items-center gap-3">

                  {search && (
                    <div className="rounded-xl border border-amber-400/10 bg-amber-500/[0.05] px-4 py-2">

                      <span className="text-[9px] font-black uppercase tracking-wider text-amber-300">
                        Searching:
                      </span>

                      <span className="ml-2 text-xs font-bold text-slate-300">
                        {search}
                      </span>

                    </div>
                  )}

                  <button
                    type="button"
                    onClick={loadTeamData}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2.5 text-xs font-bold text-slate-300 transition hover:border-amber-400/25 hover:bg-amber-400/[0.05] hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    <RefreshCw
                      size={14}
                      className={
                        loading
                          ? "animate-spin"
                          : ""
                      }
                    />

                    <span className="hidden sm:inline">
                      Refresh
                    </span>

                  </button>

                </div>

              </div>

            </section>

            {/* =================================================
                TOP TEAM
            ================================================== */}

            {highestWinsTeam &&
              highestWinsTeam.wins > 0 && (
                <section className="mt-6">

                  <div className="relative overflow-hidden rounded-[24px] border border-emerald-400/10 bg-gradient-to-r from-emerald-500/[0.06] via-white/[0.025] to-blue-500/[0.05] p-5 sm:p-6">

                    <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/[0.07] blur-3xl" />

                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                      <div className="flex items-center gap-4">

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/10 bg-emerald-500/10">

                          <Trophy
                            size={24}
                            className="text-emerald-400"
                          />

                        </div>

                        <div>

                          <p className="text-[8px] font-black uppercase tracking-[2px] text-emerald-400">
                            Current Wins Leader
                          </p>

                          <h3 className="mt-1 text-xl font-black text-white">
                            {highestWinsTeam.name}
                          </h3>

                          <p className="mt-1 text-xs text-slate-600">
                            {highestWinsTeam.wins} recorded wins
                          </p>

                        </div>

                      </div>

                      <div className="flex h-12 items-center rounded-xl border border-white/[0.06] bg-black/[0.16] px-5">

                        <span className="text-2xl font-black text-emerald-300">
                          {highestWinsTeam.wins}
                        </span>

                        <span className="ml-2 text-[8px] font-black uppercase tracking-wider text-slate-600">
                          Wins
                        </span>

                      </div>

                    </div>

                  </div>

                </section>
              )}

            {/* =================================================
                TEAM GRID
            ================================================== */}

            <section className="mt-7">

              {filteredTeams.length === 0 ? (
                <div className="flex min-h-[330px] items-center justify-center rounded-[28px] border border-white/[0.07] bg-white/[0.025]">

                  <div className="text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.025]">
                      <Search
                        size={26}
                        className="text-slate-700"
                      />
                    </div>

                    <h3 className="mt-4 text-xl font-black">
                      No Teams Found
                    </h3>

                    <p className="mt-2 text-sm text-slate-600">
                      Try a different team name,
                      code or captain.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setSearch("")
                      }
                      className="mt-5 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-black text-black transition hover:bg-amber-300"
                    >
                      Clear Search
                    </button>

                  </div>

                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

                  {filteredTeams.map(
                    (team, index) => {
                      const wins =
                        getTeamWins(
                          team.name
                        );

                      return (
                        <button
                          key={team.code}
                          type="button"
                          onClick={() =>
                            setSelectedTeam({
                              ...team,
                              wins,
                            })
                          }
                          className={`group relative overflow-hidden rounded-[28px] border ${team.border} bg-gradient-to-br ${team.color} bg-[#0b111c] text-left shadow-[0_20px_65px_rgba(0,0,0,0.3)] transition-all duration-500 hover:-translate-y-2 hover:border-white/[0.16] hover:shadow-[0_30px_85px_rgba(0,0,0,0.5)]`}
                        >

                          {/* GLOW */}

                          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/[0.025] blur-3xl transition duration-500 group-hover:scale-125" />

                          <div className="pointer-events-none absolute bottom-[-60px] left-[30%] h-32 w-32 rounded-full bg-white/[0.02] blur-3xl" />

                          {/* TOP ROW */}

                          <div className="relative z-10 flex items-center justify-between px-5 pt-5">

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-black/25 text-[9px] font-black text-slate-500">

                              {String(
                                index + 1
                              ).padStart(
                                2,
                                "0"
                              )}

                            </div>

                            <div className="flex items-center gap-1.5">

                              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

                              <span className="text-[8px] font-black uppercase tracking-[1.4px] text-emerald-400">
                                Active
                              </span>

                            </div>

                          </div>

                          {/* LOGO */}

                          <div className="relative z-10 flex justify-center px-5 pb-3 pt-7">

                            <div
                              className={`relative flex h-32 w-32 items-center justify-center rounded-[30px] border border-white/[0.08] ${team.badge} bg-black/20 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition duration-500 group-hover:scale-105`}
                            >

                              <div className="absolute inset-0 rounded-[30px] bg-white/[0.015]" />

                              <img
                                src={team.logo}
                                alt={`${team.name} logo`}
                                className="relative h-full w-full object-contain transition duration-500 group-hover:scale-105"
                                onError={(event) => {
                                  event.currentTarget.style.display =
                                    "none";

                                  const fallback =
                                    event.currentTarget
                                      .nextElementSibling;

                                  if (fallback) {
                                    fallback.classList.remove(
                                      "hidden"
                                    );
                                    fallback.classList.add(
                                      "flex"
                                    );
                                  }
                                }}
                              />

                              <div className="absolute inset-0 hidden items-center justify-center rounded-[30px] bg-black/10">

                                <span
                                  className={`text-3xl font-black ${team.accent}`}
                                >
                                  {team.short}
                                </span>

                              </div>

                            </div>

                          </div>

                          {/* TEAM NAME */}

                          <div className="relative z-10 px-5 pb-5 text-center">

                            <p
                              className={`text-[9px] font-black uppercase tracking-[2px] ${team.accent}`}
                            >
                              {team.short} • IPL FRANCHISE
                            </p>

                            <h3 className="mt-2 text-xl font-black leading-6 text-white">
                              {team.name}
                            </h3>

                            {/* CAPTAIN */}

                            <div className="mt-5 rounded-2xl border border-white/[0.06] bg-black/20 p-4 text-left">

                              <div className="flex items-center justify-between">

                                <div className="flex items-center gap-2">

                                  <Crown
                                    size={14}
                                    className="text-amber-400"
                                  />

                                  <span className="text-[8px] font-black uppercase tracking-[1.5px] text-slate-600">
                                    Captain
                                  </span>

                                </div>

                                <span className="rounded-full border border-amber-400/10 bg-amber-400/[0.05] px-2 py-1 text-[7px] font-black uppercase tracking-wider text-amber-300">
                                  2026
                                </span>

                              </div>

                              <p className="mt-2 text-base font-black text-white">
                                {team.captain}
                              </p>

                            </div>

                            {/* STATS */}

                            <div className="mt-3 grid grid-cols-2 gap-3">

                              <TeamStat
                                icon={TrendingUp}
                                label="Wins"
                                value={wins}
                              />

                              <TeamStat
                                icon={Trophy}
                                label="Titles"
                                value={team.trophies}
                              />

                            </div>

                            {/* FOOTER */}

                            <div className="mt-4 flex items-center justify-between border-t border-white/[0.05] pt-4">

                              <span className="text-[8px] font-black uppercase tracking-[1.5px] text-slate-700">
                                View team
                              </span>

                              <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-[1.5px] text-amber-400/80 transition group-hover:text-amber-300">

                                Explore

                                <ChevronRight
                                  size={12}
                                />

                              </span>

                            </div>

                          </div>

                        </button>
                      );
                    }
                  )}

                </div>
              )}

            </section>

            {/* =================================================
                FOOTER
            ================================================== */}

            <footer className="mt-10 border-t border-white/[0.06] pb-4 pt-7">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
                    <Trophy size={16} />
                  </div>

                  <div>

                    <p className="text-sm font-black text-slate-300">
                      IPL Teams
                    </p>

                    <p className="text-[10px] text-slate-700">
                      Team intelligence workspace
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[1.5px] text-slate-700">

                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                  Analytics Connected

                </div>

              </div>

            </footer>

          </div>
        </main>
      </div>

      {/* =====================================================
          TEAM MODAL
      ====================================================== */}

      {selectedTeam && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl sm:p-6"
          onClick={() =>
            setSelectedTeam(null)
          }
        >

          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            className="relative max-h-[92vh] w-full max-w-2xl overflow-hidden overflow-y-auto rounded-[30px] border border-white/[0.10] bg-[#080e18] shadow-[0_40px_140px_rgba(0,0,0,0.7)]"
          >

            <button
              type="button"
              onClick={() =>
                setSelectedTeam(null)
              }
              className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-black/50 text-slate-300 backdrop-blur-xl transition hover:border-amber-400/20 hover:bg-amber-400/10 hover:text-amber-300"
            >
              <X size={18} />
            </button>

            <div
              className={`relative overflow-hidden bg-gradient-to-br ${selectedTeam.color} p-7 sm:p-9`}
            >

              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/[0.025] blur-3xl" />

              <div className="relative flex flex-col items-center text-center">

                <div className="flex h-32 w-32 items-center justify-center rounded-[30px] border border-white/[0.09] bg-black/20 p-6 shadow-2xl">

                  <img
                    src={selectedTeam.logo}
                    alt={`${selectedTeam.name} logo`}
                    className="h-full w-full object-contain"
                  />

                </div>

                <p
                  className={`mt-6 text-[9px] font-black uppercase tracking-[2.5px] ${selectedTeam.accent}`}
                >
                  {selectedTeam.short} • IPL FRANCHISE
                </p>

                <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                  {selectedTeam.name}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Premium team profile
                </p>

              </div>

            </div>

            <div className="p-6 sm:p-8">

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">

                  <div className="flex items-center gap-2">

                    <Crown
                      size={16}
                      className="text-amber-400"
                    />

                    <span className="text-[8px] font-black uppercase tracking-[1.6px] text-slate-600">
                      Captain
                    </span>

                  </div>

                  <p className="mt-3 text-xl font-black text-white">
                    {selectedTeam.captain}
                  </p>

                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">

                  <div className="flex items-center gap-2">

                    <TrendingUp
                      size={16}
                      className="text-emerald-400"
                    />

                    <span className="text-[8px] font-black uppercase tracking-[1.6px] text-slate-600">
                      Wins
                    </span>

                  </div>

                  <p className="mt-3 text-xl font-black text-white">
                    {selectedTeam.wins}
                  </p>

                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">

                  <div className="flex items-center gap-2">

                    <Medal
                      size={16}
                      className="text-blue-400"
                    />

                    <span className="text-[8px] font-black uppercase tracking-[1.6px] text-slate-600">
                      Championships
                    </span>

                  </div>

                  <p className="mt-3 text-xl font-black text-white">
                    {selectedTeam.trophies}
                  </p>

                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">

                  <div className="flex items-center gap-2">

                    <Shield
                      size={16}
                      className="text-purple-400"
                    />

                    <span className="text-[8px] font-black uppercase tracking-[1.6px] text-slate-600">
                      Status
                    </span>

                  </div>

                  <p className="mt-3 text-xl font-black text-emerald-400">
                    ACTIVE
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedTeam(null)
                }
                className="mt-6 w-full rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 py-4 text-sm font-black text-black shadow-[0_15px_40px_rgba(245,158,11,0.14)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(245,158,11,0.22)]"
              >
                Close Team Profile
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}

/* =========================================================
   HERO PILL
========================================================= */

function HeroPill({
  icon: Icon,
  text,
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3.5 py-2">

      <Icon
        size={13}
        className="text-slate-400"
      />

      <span className="text-[8px] font-black uppercase tracking-wider text-slate-500">
        {text}
      </span>

    </div>
  );
}

/* =========================================================
   HERO STAT
========================================================= */

function HeroStat({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 backdrop-blur-md sm:p-5">

      <div className="flex items-center justify-between">

        <Icon
          size={16}
          className="text-amber-400"
        />

        <span className="text-[7px] font-black uppercase tracking-wider text-slate-700">
          IPL
        </span>

      </div>

      <p className="mt-4 text-[8px] font-black uppercase tracking-[1.5px] text-slate-600">
        {label}
      </p>

      <p className="mt-1 truncate text-xl font-black text-white">
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  icon: Icon,
  title,
  value,
  text,
  accent,
}) {
  const styles = {
    blue: {
      icon: "bg-blue-500/10 text-blue-400",
      border: "border-blue-400/10",
    },
    purple: {
      icon: "bg-purple-500/10 text-purple-400",
      border: "border-purple-400/10",
    },
    amber: {
      icon: "bg-amber-500/10 text-amber-400",
      border: "border-amber-400/10",
    },
    orange: {
      icon: "bg-orange-500/10 text-orange-400",
      border: "border-orange-400/10",
    },
  };

  const style =
    styles[accent] || styles.blue;

  return (
    <div
      className={`group rounded-[22px] border ${style.border} bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.04]`}
    >

      <div className="flex items-start justify-between">

        <div>

          <p className="text-[8px] font-black uppercase tracking-[1.8px] text-slate-600">
            {title}
          </p>

          <p className="mt-3 text-3xl font-black text-white">
            {value}
          </p>

          <p className="mt-1 text-[10px] text-slate-700">
            {text}
          </p>

        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${style.icon}`}
        >
          <Icon size={19} />
        </div>

      </div>

    </div>
  );
}

/* =========================================================
   TEAM STAT
========================================================= */

function TeamStat({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.025] px-3 py-3">

      <div className="flex items-center gap-2">

        <Icon
          size={13}
          className="text-slate-500"
        />

        <span className="text-[8px] font-black uppercase tracking-wider text-slate-600">
          {label}
        </span>

      </div>

      <p className="mt-1 text-xl font-black text-white">
        {value}
      </p>

    </div>
  );
}

export default Teams;