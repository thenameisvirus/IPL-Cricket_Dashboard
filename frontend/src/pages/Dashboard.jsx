import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import TeamWinsChart from "../components/TeamWinsChart";
import CustomBarChart from "../components/BarChart";
import CustomPieChart from "../components/PieChart";
import PlayerSearch from "../components/PlayerSearch";
import TeamComparison from "../components/TeamComparison";
import MatchPrediction from "../components/MatchPrediction";

import BASE_URL from "../services/api";

function Dashboard() {
  const [matches, setMatches] = useState(0);
  const [teams, setTeams] = useState(0);
  const [players, setPlayers] = useState(0);

  const [orangeCap, setOrangeCap] = useState("-");
  const [purpleCap, setPurpleCap] = useState("-");

  const [topBatsmen, setTopBatsmen] = useState([]);
  const [topBowlers, setTopBowlers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setApiError(false);

      const results = await Promise.allSettled([
        axios.get(`${BASE_URL}/total_matches`),
        axios.get(`${BASE_URL}/total_teams`),
        axios.get(`${BASE_URL}/total_players`),
        axios.get(`${BASE_URL}/orange_cap`),
        axios.get(`${BASE_URL}/purple_cap`),
        axios.get(`${BASE_URL}/top_batsman`),
        axios.get(`${BASE_URL}/top_bowlers`),
      ]);

      const [
        matchesRes,
        teamsRes,
        playersRes,
        orangeRes,
        purpleRes,
        batsmanRes,
        bowlerRes,
      ] = results;

      if (matchesRes.status === "fulfilled") {
        setMatches(matchesRes.value.data?.total_matches ?? 0);
      }

      if (teamsRes.status === "fulfilled") {
        setTeams(teamsRes.value.data?.total_teams ?? 0);
      }

      if (playersRes.status === "fulfilled") {
        setPlayers(playersRes.value.data?.total_players ?? 0);
      }

      if (orangeRes.status === "fulfilled") {
        setOrangeCap(
          orangeRes.value.data?.player ||
            orangeRes.value.data?.name ||
            "-"
        );
      }

      if (purpleRes.status === "fulfilled") {
        setPurpleCap(
          purpleRes.value.data?.player ||
            purpleRes.value.data?.name ||
            "-"
        );
      }

      if (batsmanRes.status === "fulfilled") {
        setTopBatsmen(
          Array.isArray(batsmanRes.value.data)
            ? batsmanRes.value.data
            : []
        );
      }

      if (bowlerRes.status === "fulfilled") {
        setTopBowlers(
          Array.isArray(bowlerRes.value.data)
            ? bowlerRes.value.data
            : []
        );
      }

      if (results.some((item) => item.status === "rejected")) {
        setApiError(true);
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
      setApiError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-slate-700" />

            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-500 animate-spin" />
          </div>

          <h2 className="mt-7 text-2xl font-bold text-white">
            Loading IPL Analytics
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Preparing your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200">

      {/* =====================================================
          APPLICATION LAYOUT
      ====================================================== */}

      <div className="flex min-h-screen">

        {/* SIDEBAR */}

        <aside className="hidden lg:block w-[250px] shrink-0">
          <div className="fixed left-0 top-0 h-screen w-[250px] border-r border-white/[0.06] bg-[#0b101c]">
            <Sidebar />
          </div>
        </aside>

        {/* MAIN AREA */}

        <main className="flex-1 min-w-0">

          {/* TOP NAVBAR */}

          <div className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#070b14]/90 backdrop-blur-xl">
            <Navbar />
          </div>

          {/* CONTENT */}

          <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 lg:py-8">

            {/* =================================================
                PAGE INTRO
            ================================================== */}

            <section className="mb-7">

              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

                <div>

                  <div className="flex items-center gap-2 mb-3">

                    <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]" />

                    <span className="text-xs uppercase tracking-[0.2em] font-bold text-amber-500">
                      IPL Analytics
                    </span>

                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                    Cricket Dashboard
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm sm:text-base text-slate-500 leading-7">
                    Monitor IPL statistics, player performance, team
                    records and machine learning insights from one place.
                  </p>

                </div>

                <button
                  onClick={loadDashboard}
                  className="self-start md:self-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-sm font-semibold text-slate-200 transition"
                >
                  <span>↻</span>
                  Refresh Data
                </button>

              </div>

            </section>

            {/* =================================================
                API WARNING
            ================================================== */}

            {apiError && (
              <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] px-5 py-4">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  <div>
                    <p className="font-bold text-amber-400">
                      Some live data could not be loaded.
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      Check your FastAPI backend and try refreshing.
                    </p>
                  </div>

                  <button
                    onClick={loadDashboard}
                    className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition"
                  >
                    Retry
                  </button>

                </div>

              </div>
            )}

            {/* =================================================
                HERO / SUMMARY BANNER
            ================================================== */}

            <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-[#111827] via-[#0c1424] to-[#0a0f19] shadow-2xl">

              {/* Background image */}

              <div className="absolute inset-0">

                <img
                  src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1800&q=80"
                  alt="Cricket stadium"
                  className="w-full h-full object-cover opacity-[0.08]"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-[#0b101c] via-[#0b101c]/95 to-[#0b101c]/80" />

              </div>

              {/* Glow */}

              <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-amber-500/[0.07] blur-3xl" />

              <div className="relative z-10 p-6 sm:p-8 lg:p-10">

                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

                  {/* LEFT */}

                  <div className="max-w-2xl">

                    <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/[0.08] px-4 py-2 text-xs font-bold uppercase tracking-wider text-amber-400">

                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />

                      Analytics Engine Online

                    </span>

                    <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-white">

                      Everything IPL.
                      <span className="block text-amber-400">
                        One Dashboard.
                      </span>

                    </h2>

                    <p className="mt-4 max-w-xl text-sm sm:text-base leading-7 text-slate-400">
                      Explore historical match data, player statistics,
                      team performance and AI-powered predictions with
                      a clean analytics experience.
                    </p>

                  </div>

                  {/* STATUS */}

                  <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 gap-3 xl:w-[330px]">

                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.035] p-5">

                      <p className="text-xs font-medium text-slate-500">
                        Matches
                      </p>

                      <p className="mt-2 text-3xl font-black text-white">
                        {matches}
                      </p>

                    </div>

                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.035] p-5">

                      <p className="text-xs font-medium text-slate-500">
                        Teams
                      </p>

                      <p className="mt-2 text-3xl font-black text-white">
                        {teams}
                      </p>

                    </div>

                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.035] p-5">

                      <p className="text-xs font-medium text-slate-500">
                        Players
                      </p>

                      <p className="mt-2 text-3xl font-black text-white">
                        {players}
                      </p>

                    </div>

                    <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.05] p-5">

                      <p className="text-xs font-medium text-slate-500">
                        AI Status
                      </p>

                      <p className="mt-2 text-xl font-black text-emerald-400">
                        ONLINE
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </section>

            {/* =================================================
                PRIMARY STAT CARDS
            ================================================== */}

            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mt-6">

              <DashboardCard
                title="Total Matches"
                value={matches}
                icon="🏏"
                color="from-amber-500 to-orange-600"
              />

              <DashboardCard
                title="Total Teams"
                value={teams}
                icon="🏆"
                color="from-slate-600 to-slate-800"
              />

              <DashboardCard
                title="Total Players"
                value={players}
                icon="👥"
                color="from-emerald-600 to-emerald-800"
              />

              <DashboardCard
                title="Orange Cap"
                value={orangeCap}
                icon="🟠"
                color="from-orange-500 to-amber-600"
              />

              <DashboardCard
                title="Purple Cap"
                value={purpleCap}
                icon="🟣"
                color="from-purple-600 to-indigo-700"
              />

            </section>

            {/* =================================================
                TOP PERFORMERS
            ================================================== */}

            <section className="grid xl:grid-cols-2 gap-6 mt-8">

              {/* ORANGE CAP */}

              <div className="overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0c121e]">

                <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">

                  <div>

                    <p className="text-xs font-bold uppercase tracking-wider text-amber-500">
                      Batting
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-white">
                      Top Batsmen
                    </h2>

                  </div>

                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-lg">
                    🏏
                  </span>

                </div>

                <div className="overflow-x-auto">

                  <table className="w-full text-sm">

                    <thead>
                      <tr className="border-b border-white/[0.05] text-slate-500">

                        <th className="px-6 py-4 text-left font-semibold">
                          #
                        </th>

                        <th className="px-6 py-4 text-left font-semibold">
                          Player
                        </th>

                        <th className="px-6 py-4 text-right font-semibold">
                          Runs
                        </th>

                      </tr>
                    </thead>

                    <tbody>

                      {topBatsmen.length > 0 ? (
                        topBatsmen.slice(0, 10).map((player, index) => (

                          <tr
                            key={index}
                            className="border-b border-white/[0.04] hover:bg-white/[0.025] transition"
                          >

                            <td className="px-6 py-4 text-amber-500 font-bold">
                              {String(index + 1).padStart(2, "0")}
                            </td>

                            <td className="px-6 py-4 font-semibold text-slate-200">
                              {player.Batter ||
                                player.batter ||
                                player.Name ||
                                player.name ||
                                "Unknown"}
                            </td>

                            <td className="px-6 py-4 text-right font-black text-white">
                              {player.Runs ??
                                player.runs ??
                                player.RunsScored ??
                                0}
                            </td>

                          </tr>

                        ))
                      ) : (

                        <tr>

                          <td
                            colSpan="3"
                            className="px-6 py-12 text-center text-slate-500"
                          >
                            No batting data available
                          </td>

                        </tr>

                      )}

                    </tbody>

                  </table>

                </div>

              </div>

              {/* PURPLE CAP */}

              <div className="overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0c121e]">

                <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">

                  <div>

                    <p className="text-xs font-bold uppercase tracking-wider text-purple-400">
                      Bowling
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-white">
                      Top Bowlers
                    </h2>

                  </div>

                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-lg">
                    🎯
                  </span>

                </div>

                <div className="overflow-x-auto">

                  <table className="w-full text-sm">

                    <thead>

                      <tr className="border-b border-white/[0.05] text-slate-500">

                        <th className="px-6 py-4 text-left font-semibold">
                          #
                        </th>

                        <th className="px-6 py-4 text-left font-semibold">
                          Bowler
                        </th>

                        <th className="px-6 py-4 text-right font-semibold">
                          Wickets
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {topBowlers.length > 0 ? (
                        topBowlers.slice(0, 10).map((player, index) => (

                          <tr
                            key={index}
                            className="border-b border-white/[0.04] hover:bg-white/[0.025] transition"
                          >

                            <td className="px-6 py-4 text-purple-400 font-bold">
                              {String(index + 1).padStart(2, "0")}
                            </td>

                            <td className="px-6 py-4 font-semibold text-slate-200">
                              {player.Bowler ||
                                player.bowler ||
                                player.Name ||
                                player.name ||
                                "Unknown"}
                            </td>

                            <td className="px-6 py-4 text-right font-black text-white">
                              {player.Wickets ??
                                player.wickets ??
                                0}
                            </td>

                          </tr>

                        ))
                      ) : (

                        <tr>

                          <td
                            colSpan="3"
                            className="px-6 py-12 text-center text-slate-500"
                          >
                            No bowling data available
                          </td>

                        </tr>

                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            </section>

            {/* =================================================
                ANALYTICS CHARTS
            ================================================== */}

            <section className="grid xl:grid-cols-2 gap-6 mt-8">

              <div className="rounded-3xl border border-white/[0.06] bg-[#0c121e] p-6">

                <div className="mb-6">

                  <p className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    Performance
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-white">
                    Team Wins
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Compare historical winning records.
                  </p>

                </div>

                <TeamWinsChart />

              </div>

              <div className="rounded-3xl border border-white/[0.06] bg-[#0c121e] p-6">

                <div className="mb-6">

                  <p className="text-xs font-bold uppercase tracking-wider text-purple-400">
                    Venues
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-white">
                    Venue Statistics
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Match distribution across stadiums.
                  </p>

                </div>

                <CustomPieChart />

              </div>

            </section>

            {/* =================================================
                BATTING ANALYTICS
            ================================================== */}

            <section className="mt-8">

              <div className="rounded-3xl border border-white/[0.06] bg-[#0c121e] p-6">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

                  <div>

                    <p className="text-xs font-bold uppercase tracking-wider text-amber-500">
                      Performance Analytics
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-white">
                      Batting Performance
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      Compare leading run scorers.
                    </p>

                  </div>

                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-xs font-semibold text-slate-400">
                    TOP 10
                  </div>

                </div>

                <CustomBarChart />

              </div>

            </section>

            {/* =================================================
                PLAYER SEARCH
            ================================================== */}

            <section className="mt-8">

              <div className="rounded-3xl border border-white/[0.06] bg-[#0c121e] p-6 sm:p-8">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-7">

                  <div>

                    <p className="text-xs font-bold uppercase tracking-wider text-blue-400">
                      Player Database
                    </p>

                    <h2 className="mt-1 text-2xl font-black text-white">
                      Search Players
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      Find player profiles and detailed statistics.
                    </p>

                  </div>

                  <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-xl">
                    🔍
                  </div>

                </div>

                <PlayerSearch />

              </div>

            </section>

            {/* =================================================
                TEAM COMPARISON
            ================================================== */}

            <section className="mt-8">

              <div className="rounded-3xl border border-white/[0.06] bg-[#0c121e] p-6 sm:p-8">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-7">

                  <div>

                    <p className="text-xs font-bold uppercase tracking-wider text-orange-400">
                      Team Analytics
                    </p>

                    <h2 className="mt-1 text-2xl font-black text-white">
                      Team Comparison
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      Compare IPL teams using historical statistics.
                    </p>

                  </div>

                  <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-xl">
                    ⚔️
                  </div>

                </div>

                <TeamComparison />

              </div>

            </section>

            {/* =================================================
                AI MATCH PREDICTION
            ================================================== */}

            <section className="mt-8">

              <div className="relative overflow-hidden rounded-3xl border border-amber-500/10 bg-gradient-to-br from-[#111827] to-[#0b101c]">

                <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-amber-500/[0.06] blur-3xl" />

                <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-blue-500/[0.05] blur-3xl" />

                <div className="relative z-10 p-6 sm:p-8 lg:p-10">

                  <div className="flex items-center gap-3">

                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-lg">
                      🤖
                    </span>

                    <div>

                      <p className="text-xs font-bold uppercase tracking-wider text-amber-500">
                        Machine Learning
                      </p>

                      <h2 className="text-2xl sm:text-3xl font-black text-white">
                        AI Match Prediction
                      </h2>

                    </div>

                  </div>

                  <p className="mt-5 max-w-3xl text-sm sm:text-base leading-7 text-slate-400">
                    Predict IPL match outcomes using the machine learning
                    model trained on historical IPL match data.
                  </p>

                  <div className="mt-8">

                    <MatchPrediction />

                  </div>

                </div>

              </div>

            </section>

            {/* =================================================
                FOOTER
            ================================================== */}

            <footer className="mt-10 border-t border-white/[0.06] pt-7 pb-4">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>

                  <p className="font-bold text-white">
                    IPL Analytics
                  </p>

                  <p className="text-xs text-slate-600 mt-1">
                    React • FastAPI • Machine Learning
                  </p>

                </div>

                <p className="text-xs text-slate-600">
                  Cricket analytics platform
                </p>

              </div>

            </footer>

          </div>

        </main>

      </div>

    </div>
  );
}

export default Dashboard;
