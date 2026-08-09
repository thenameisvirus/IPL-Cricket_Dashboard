import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TeamWinsChart from "../components/TeamWinsChart";
import CustomBarChart from "../components/BarChart";
import CustomPieChart from "../components/PieChart";
import BASE_URL from "../services/api";

function Analytics() {
  const [matches, setMatches] = useState(0);
  const [teams, setTeams] = useState(0);
  const [players, setPlayers] = useState(0);
  const [orangeCap, setOrangeCap] = useState("—");
  const [purpleCap, setPurpleCap] = useState("—");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [
        matchesRes,
        teamsRes,
        playersRes,
        orangeRes,
        purpleRes,
      ] = await Promise.all([
        axios.get(`${BASE_URL}/total_matches`),
        axios.get(`${BASE_URL}/total_teams`),
        axios.get(`${BASE_URL}/total_players`),
        axios.get(`${BASE_URL}/orange_cap`),
        axios.get(`${BASE_URL}/purple_cap`),
      ]);

      setMatches(matchesRes.data?.total_matches ?? 0);
      setTeams(teamsRes.data?.total_teams ?? 0);
      setPlayers(playersRes.data?.total_players ?? 0);

      setOrangeCap(
        orangeRes.data?.player ||
        orangeRes.data?.name ||
        "—"
      );

      setPurpleCap(
        purpleRes.data?.player ||
        purpleRes.data?.name ||
        "—"
      );
    } catch (error) {
      console.error("Analytics API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const metricCards = [
    {
      title: "Total Matches",
      value: matches,
      icon: "🏏",
    },
    {
      title: "Total Teams",
      value: teams,
      icon: "🏆",
    },
    {
      title: "Total Players",
      value: players,
      icon: "👥",
    },
    {
      title: "Orange Cap",
      value: orangeCap,
      icon: "🟠",
    },
    {
      title: "Purple Cap",
      value: purpleCap,
      icon: "🟣",
    },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-white">

      <div className="flex min-h-screen">

        {/* SIDEBAR */}

        <div className="hidden w-72 shrink-0 lg:block">
          <Sidebar />
        </div>

        {/* MAIN */}

        <div className="min-w-0 flex-1">

          <Navbar />

          <main className="p-5 md:p-8 lg:p-10">

            {/* HERO */}

            <section className="relative overflow-hidden rounded-[30px] border border-white/[0.06] bg-gradient-to-br from-[#111827] via-[#0c1424] to-[#090d16] p-7 shadow-2xl md:p-10">

              <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />

              <div className="absolute -bottom-32 left-20 h-72 w-72 rounded-full bg-orange-600/10 blur-3xl" />

              <div className="relative">

                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-400">
                  📊 IPL Intelligence Center
                </div>

                <div className="max-w-4xl">

                  <h1 className="text-4xl font-black tracking-tight md:text-5xl lg:text-6xl">
                    Advanced Analytics
                  </h1>

                  <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
                    Explore IPL performance through interactive charts,
                    team statistics, venue distribution and player
                    performance insights.
                  </p>

                </div>

              </div>

            </section>

            {/* METRICS */}

            <section className="mt-8">

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">

                {metricCards.map((card) => (

                  <div
                    key={card.title}
                    className="group rounded-[24px] border border-white/[0.06] bg-[#0d1422] p-5 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-amber-500/20"
                  >

                    <div className="flex items-start justify-between">

                      <div>

                        <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                          {card.title}
                        </p>

                        <h2 className="mt-3 truncate text-2xl font-black text-white">
                          {loading ? "..." : card.value}
                        </h2>

                      </div>

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-xl transition group-hover:bg-amber-500/20">
                        {card.icon}
                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </section>

            {/* TEAM WINS + VENUE */}

            <section className="mt-8 grid gap-8 xl:grid-cols-2">

              {/* TEAM WINS */}

              <div className="overflow-hidden rounded-[30px] border border-white/[0.06] bg-[#0d1422] shadow-2xl">

                <div className="border-b border-white/[0.06] p-7">

                  <div className="flex items-center justify-between gap-4">

                    <div>

                      <div className="flex items-center gap-3">

                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-xl">
                          🏆
                        </span>

                        <h2 className="text-2xl font-black">
                          Team Wins
                        </h2>

                      </div>

                      <p className="mt-3 text-sm leading-6 text-slate-500">
                        Compare winning records across IPL teams.
                      </p>

                    </div>

                    <span className="hidden rounded-full border border-emerald-400/10 bg-emerald-400/5 px-3 py-1.5 text-xs font-bold text-emerald-400 sm:block">
                      LIVE DATA
                    </span>

                  </div>

                </div>

                <div className="p-6 md:p-7">

                  <TeamWinsChart />

                </div>

              </div>

              {/* VENUE */}

              <div className="overflow-hidden rounded-[30px] border border-white/[0.06] bg-[#0d1422] shadow-2xl">

                <div className="border-b border-white/[0.06] p-7">

                  <div className="flex items-center justify-between gap-4">

                    <div>

                      <div className="flex items-center gap-3">

                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                          🏟️
                        </span>

                        <h2 className="text-2xl font-black">
                          Venue Statistics
                        </h2>

                      </div>

                      <p className="mt-3 text-sm leading-6 text-slate-500">
                        Match distribution across major IPL venues.
                      </p>

                    </div>

                    <span className="hidden rounded-full border border-blue-400/10 bg-blue-400/5 px-3 py-1.5 text-xs font-bold text-blue-400 sm:block">
                      VENUES
                    </span>

                  </div>

                </div>

                <div className="p-6 md:p-7">

                  <CustomPieChart />

                </div>

              </div>

            </section>

            {/* BATTING ANALYSIS */}

            <section className="mt-8 overflow-hidden rounded-[30px] border border-white/[0.06] bg-[#0d1422] shadow-2xl">

              <div className="border-b border-white/[0.06] p-7">

                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                  <div>

                    <div className="flex items-center gap-3">

                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-xl">
                        🏏
                      </span>

                      <h2 className="text-2xl font-black">
                        Batting Performance
                      </h2>

                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      Visual comparison of top batting performances.
                    </p>

                  </div>

                  <div className="rounded-full border border-amber-400/10 bg-amber-400/5 px-4 py-2 text-xs font-bold text-amber-400">
                    PERFORMANCE
                  </div>

                </div>

              </div>

              <div className="p-6 md:p-8">

                <CustomBarChart />

              </div>

            </section>

            {/* INSIGHTS */}

            <section className="mt-8 grid gap-8 lg:grid-cols-3">

              <div className="rounded-[28px] border border-white/[0.06] bg-[#0d1422] p-7 shadow-xl">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-xl">
                  🟠
                </div>

                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-600">
                  Orange Cap
                </p>

                <h3 className="mt-2 truncate text-2xl font-black">
                  {loading ? "..." : orangeCap}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Current leading run scorer from the available dataset.
                </p>

              </div>

              <div className="rounded-[28px] border border-white/[0.06] bg-[#0d1422] p-7 shadow-xl">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-xl">
                  🟣
                </div>

                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-600">
                  Purple Cap
                </p>

                <h3 className="mt-2 truncate text-2xl font-black">
                  {loading ? "..." : purpleCap}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Current leading wicket taker from the available dataset.
                </p>

              </div>

              <div className="rounded-[28px] border border-white/[0.06] bg-gradient-to-br from-[#17130a] to-[#0d1422] p-7 shadow-xl">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-xl">
                  ⚡
                </div>

                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-600">
                  Analytics Engine
                </p>

                <h3 className="mt-2 text-2xl font-black text-emerald-400">
                  ONLINE
                </h3>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">

                  <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-amber-500 to-emerald-400" />

                </div>

                <p className="mt-3 text-xs font-semibold text-slate-500">
                  Dataset analysis system operational
                </p>

              </div>

            </section>

            {/* FOOTER */}

            <section className="mt-8 rounded-[30px] border border-white/[0.06] bg-gradient-to-r from-[#111827] to-[#0d1422] p-7 shadow-xl md:p-9">

              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-400">
                    IPL Analytics
                  </p>

                  <h2 className="mt-2 text-2xl font-black">
                    Data-driven cricket intelligence.
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    Analyze teams, players and match performance through
                    your connected IPL dataset.
                  </p>

                </div>

                <div className="flex flex-wrap gap-3">

                  <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-xs font-bold text-slate-400">
                    React
                  </span>

                  <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-xs font-bold text-slate-400">
                    FastAPI
                  </span>

                  <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-xs font-bold text-slate-400">
                    Analytics
                  </span>

                </div>

              </div>

            </section>

          </main>

        </div>

      </div>

    </div>
  );
}

export default Analytics;