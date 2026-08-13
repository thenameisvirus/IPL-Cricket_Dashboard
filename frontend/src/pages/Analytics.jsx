import { useEffect, useState } from "react";
import axios from "axios";

import {
  Activity,
  BarChart3,
  BrainCircuit,
  Flame,
  Gauge,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap,
  TrendingUp,
  CircleDot,
} from "lucide-react";

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

  const [teamWins, setTeamWins] = useState([]);
  const [topBatsmen, setTopBatsmen] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    loadAnalytics();
  }, []);

  // =========================================================
  // SAFE NUMBER
  // =========================================================

  function safeNumber(value) {
    if (
      value === null ||
      value === undefined ||
      typeof value === "object"
    ) {
      return 0;
    }

    const number = Number(value);

    return Number.isFinite(number) ? number : 0;
  }

  // =========================================================
  // EXTRACT NUMBER
  // =========================================================

  function extractNumber(data, keys = []) {
    if (typeof data === "number") {
      return safeNumber(data);
    }

    if (typeof data === "string") {
      return safeNumber(data);
    }

    if (!data || typeof data !== "object") {
      return 0;
    }

    for (const key of keys) {
      if (
        data[key] !== undefined &&
        data[key] !== null &&
        typeof data[key] !== "object"
      ) {
        const value = safeNumber(data[key]);

        if (Number.isFinite(value)) {
          return value;
        }
      }
    }

    return 0;
  }

  // =========================================================
  // NORMALIZE CAP
  // =========================================================

  function normalizeCap(data) {
    if (!data) {
      return "—";
    }

    if (
      typeof data === "object" &&
      !Array.isArray(data)
    ) {
      const source =
        data.data &&
        typeof data.data === "object"
          ? data.data
          : data;

      const entries = Object.entries(source);

      if (!entries.length) {
        return "—";
      }

      return String(entries[0][0]);
    }

    if (Array.isArray(data)) {
      const first = data[0];

      if (!first) {
        return "—";
      }

      if (typeof first === "object") {
        return String(
          first.Player ||
            first.player ||
            first.name ||
            first.Name ||
            first.Batter ||
            first.Bowler ||
            "—"
        );
      }

      return String(first);
    }

    return String(data);
  }

  // =========================================================
  // NORMALIZE BATSMEN
  // =========================================================

  function normalizeBatsmen(data) {
    if (!data) {
      return [];
    }

    if (
      typeof data === "object" &&
      !Array.isArray(data)
    ) {
      const source =
        data.data &&
        typeof data.data === "object"
          ? data.data
          : data;

      return Object.entries(source)
        .map(([name, value]) => ({
          Player: String(name),
          name: String(name),
          player: String(name),
          Batter: String(name),
          Runs: safeNumber(value),
          runs: safeNumber(value),
          value: safeNumber(value),
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
    }

    if (Array.isArray(data)) {
      return data
        .map((item, index) => {
          if (!item || typeof item !== "object") {
            return null;
          }

          const name =
            item.Player ||
            item.player ||
            item.Batter ||
            item.batter ||
            item.Name ||
            item.name ||
            `Player ${index + 1}`;

          const value =
            item.Runs ??
            item.runs ??
            item.RunsScored ??
            item.total_runs ??
            item.TotalRuns ??
            item.value ??
            0;

          return {
            ...item,
            Player: String(name),
            name: String(name),
            player: String(name),
            Runs: safeNumber(value),
            runs: safeNumber(value),
            value: safeNumber(value),
          };
        })
        .filter(Boolean)
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
    }

    return [];
  }

  // =========================================================
  // NORMALIZE TEAM WINS
  // =========================================================

  function normalizeTeamWins(data) {
    if (!data) {
      return [];
    }

    if (
      typeof data === "object" &&
      !Array.isArray(data)
    ) {
      const source =
        data.data &&
        typeof data.data === "object"
          ? data.data
          : data;

      return Object.entries(source)
        .map(([team, value]) => ({
          team: String(team),
          Team: String(team),
          team_name: String(team),
          name: String(team),
          wins: safeNumber(value),
          Wins: safeNumber(value),
          value: safeNumber(value),
        }))
        .sort((a, b) => b.wins - a.wins)
        .slice(0, 10);
    }

    if (Array.isArray(data)) {
      return data
        .map((item, index) => {
          if (!item || typeof item !== "object") {
            return null;
          }

          const team =
            item.team ||
            item.Team ||
            item.team_name ||
            item.TeamName ||
            item.name ||
            item.Name ||
            `Team ${index + 1}`;

          const value =
            item.wins ??
            item.Wins ??
            item.team_wins ??
            item.TeamWins ??
            item.total_wins ??
            item.TotalWins ??
            item.value ??
            0;

          return {
            ...item,
            team: String(team),
            Team: String(team),
            team_name: String(team),
            name: String(team),
            wins: safeNumber(value),
            Wins: safeNumber(value),
            value: safeNumber(value),
          };
        })
        .filter(Boolean)
        .sort((a, b) => b.wins - a.wins)
        .slice(0, 10);
    }

    return [];
  }

  // =========================================================
  // LOAD ANALYTICS
  // =========================================================

  async function loadAnalytics() {
    try {
      setRefreshing(true);
      setApiError(false);

      const results = await Promise.allSettled([
        axios.get(`${BASE_URL}/total_matches`),
        axios.get(`${BASE_URL}/total_teams`),
        axios.get(`${BASE_URL}/total_players`),
        axios.get(`${BASE_URL}/orange_cap`),
        axios.get(`${BASE_URL}/purple_cap`),
        axios.get(`${BASE_URL}/team_wins_chart`),
        axios.get(`${BASE_URL}/top_batsman`),
      ]);

      const [
        matchesRes,
        teamsRes,
        playersRes,
        orangeRes,
        purpleRes,
        winsRes,
        batsmenRes,
      ] = results;

      const matchesData =
        matchesRes.status === "fulfilled"
          ? matchesRes.value?.data
          : 0;

      const teamsData =
        teamsRes.status === "fulfilled"
          ? teamsRes.value?.data
          : 0;

      const playersData =
        playersRes.status === "fulfilled"
          ? playersRes.value?.data
          : 0;

      const orangeData =
        orangeRes.status === "fulfilled"
          ? orangeRes.value?.data
          : null;

      const purpleData =
        purpleRes.status === "fulfilled"
          ? purpleRes.value?.data
          : null;

      const winsData =
        winsRes.status === "fulfilled"
          ? winsRes.value?.data
          : {};

      const batsmenData =
        batsmenRes.status === "fulfilled"
          ? batsmenRes.value?.data
          : {};

      // COUNTERS

      setMatches(
        extractNumber(matchesData, [
          "total_matches",
          "matches",
          "count",
          "value",
          "total",
        ])
      );

      setTeams(
        extractNumber(teamsData, [
          "total_teams",
          "teams",
          "count",
          "value",
          "total",
        ])
      );

      setPlayers(
        extractNumber(playersData, [
          "total_players",
          "players",
          "count",
          "value",
          "total",
        ])
      );

      // CAPS

      setOrangeCap(
        normalizeCap(orangeData)
      );

      setPurpleCap(
        normalizeCap(purpleData)
      );

      // CHARTS

      const normalizedWins =
        normalizeTeamWins(winsData);

      const normalizedBatsmen =
        normalizeBatsmen(batsmenData);

      setTeamWins(normalizedWins);
      setTopBatsmen(normalizedBatsmen);

      console.log(
        "ANALYTICS TEAM WINS:",
        normalizedWins
      );

      console.log(
        "ANALYTICS BATSMEN:",
        normalizedBatsmen
      );

      if (
        results.some(
          (item) => item.status === "rejected"
        )
      ) {
        setApiError(true);
      }
    } catch (error) {
      console.error(
        "Analytics API Error:",
        error
      );

      setApiError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">

      {/* =====================================================
          AMBIENT BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full bg-blue-600/[0.07] blur-[150px]" />

        <div className="absolute right-[-220px] top-[25%] h-[600px] w-[600px] rounded-full bg-purple-600/[0.07] blur-[150px]" />

        <div className="absolute bottom-[-250px] left-[25%] h-[600px] w-[600px] rounded-full bg-orange-500/[0.05] blur-[150px]" />
      </div>

      {/* =====================================================
          APP LAYOUT
      ===================================================== */}

      <div className="relative z-10 flex min-h-screen">

        {/* SIDEBAR */}

        <aside className="hidden w-[250px] shrink-0 lg:block">
          <div className="fixed left-0 top-0 h-screen w-[250px] border-r border-white/[0.06] bg-[#080d18]/95 backdrop-blur-xl">
            <Sidebar />
          </div>
        </aside>

        {/* MAIN */}

        <main className="min-w-0 flex-1">

          {/* NAVBAR */}

          <div className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#050816]/85 backdrop-blur-2xl">
            <Navbar />
          </div>

          {/* CONTENT */}

          <div className="mx-auto w-full max-w-[1750px] px-4 pb-10 pt-10 sm:px-6 sm:pt-12 lg:px-8 lg:pt-14 xl:px-10">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <section className="mb-7">

              <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">

                <div>

                  <div className="mb-3 flex items-center gap-2">

                    <span className="relative flex h-2.5 w-2.5">

                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-60" />

                      <span className="relative h-2.5 w-2.5 rounded-full bg-blue-400" />

                    </span>

                    <span className="text-[10px] font-black uppercase tracking-[2.5px] text-blue-400">
                      IPL Intelligence Center
                    </span>

                  </div>

                  <h1 className="text-3xl font-black tracking-[-1.5px] sm:text-4xl lg:text-5xl">
                    Advanced Analytics
                  </h1>

                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
                    Explore IPL performance, team records,
                    venue distribution and player intelligence
                    through a single analytics workspace.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={loadAnalytics}
                  disabled={refreshing}
                  className="group inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-bold text-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400/30 hover:bg-blue-500/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw
                    size={15}
                    className={
                      refreshing
                        ? "animate-spin text-blue-400"
                        : "text-blue-400 transition-transform duration-500 group-hover:rotate-180"
                    }
                  />

                  {refreshing
                    ? "Refreshing..."
                    : "Refresh Data"}
                </button>

              </div>

            </section>

            {/* =================================================
                API WARNING
            ================================================= */}

            {apiError && (
              <div className="mb-7 rounded-2xl border border-orange-500/20 bg-orange-500/[0.05] p-4 sm:p-5">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10">

                      <Activity
                        size={18}
                        className="text-orange-400"
                      />

                    </div>

                    <div>

                      <p className="font-bold text-orange-300">
                        Some analytics data could not be loaded.
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        Check your FastAPI backend and refresh
                        the analytics.
                      </p>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={loadAnalytics}
                    className="rounded-lg bg-orange-500 px-4 py-2 text-xs font-black text-black transition hover:bg-orange-400"
                  >
                    Retry
                  </button>

                </div>

              </div>
            )}

            {/* =================================================
                HERO
            ================================================= */}

            <section className="relative mb-7 overflow-hidden rounded-[28px] border border-white/[0.08] bg-gradient-to-br from-[#101827] via-[#0a1220] to-[#080c16] shadow-[0_30px_100px_rgba(0,0,0,0.35)]">

              <div className="absolute inset-0">

                <div className="absolute -right-32 -top-32 h-[430px] w-[430px] rounded-full bg-blue-500/[0.09] blur-[100px]" />

                <div className="absolute bottom-[-180px] left-[30%] h-[400px] w-[400px] rounded-full bg-purple-500/[0.08] blur-[100px]" />

                <div className="absolute right-[30%] top-[35%] h-40 w-40 rounded-full bg-orange-500/[0.06] blur-3xl" />

                <div
                  className="absolute inset-0 opacity-[0.035]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
                    backgroundSize: "44px 44px",
                  }}
                />

              </div>

              <div className="relative grid gap-8 p-6 sm:p-8 lg:p-10 xl:grid-cols-[1fr_430px] xl:items-center">

                <div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3.5 py-2">

                    <span className="relative flex h-2 w-2">

                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

                      <span className="relative h-2 w-2 rounded-full bg-emerald-400" />

                    </span>

                    <span className="text-[9px] font-black uppercase tracking-[1.8px] text-emerald-300">
                      Analytics Engine: Online
                    </span>

                  </div>

                  <h2 className="mt-6 max-w-3xl text-4xl font-black leading-[1.02] tracking-[-2px] sm:text-5xl lg:text-6xl">
                    Read the game.

                    <span className="block bg-gradient-to-r from-blue-300 via-purple-400 to-orange-400 bg-clip-text text-transparent">
                      Through the data.
                    </span>
                  </h2>

                  <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                    Turn your IPL dataset into actionable insights
                    with team performance, venue statistics and
                    player-focused analytics.
                  </p>

                  <div className="mt-7 flex flex-wrap gap-3">

                    <HeroPill
                      icon={BarChart3}
                      label="Interactive Analytics"
                    />

                    <HeroPill
                      icon={TrendingUp}
                      label="Performance Trends"
                    />

                    <HeroPill
                      icon={BrainCircuit}
                      label="Data Intelligence"
                    />

                  </div>

                </div>

                <div className="grid grid-cols-2 gap-3">

                  <HeroStat
                    icon={Trophy}
                    label="MATCHES"
                    value={matches}
                    color="orange"
                  />

                  <HeroStat
                    icon={ShieldCheck}
                    label="TEAMS"
                    value={teams}
                    color="blue"
                  />

                  <HeroStat
                    icon={Users}
                    label="PLAYERS"
                    value={players}
                    color="purple"
                  />

                  <HeroStat
                    icon={Activity}
                    label="ENGINE"
                    value="READY"
                    color="green"
                  />

                </div>

              </div>

            </section>

            {/* =================================================
                KPI
            ================================================= */}

            <section className="mb-8">

              <SectionTitle
                icon={Gauge}
                eyebrow="Analytics Overview"
                title="Key performance indicators"
                description="Your most important IPL metrics at a glance."
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

                <MetricCard
                  title="Total Matches"
                  value={matches}
                  subtitle="Matches analysed"
                  icon={Trophy}
                  accent="orange"
                  trend="DATASET"
                  bars={[25, 38, 34, 48, 57, 52, 71, 82]}
                />

                <MetricCard
                  title="Total Teams"
                  value={teams}
                  subtitle="Franchises indexed"
                  icon={ShieldCheck}
                  accent="blue"
                  trend="ACTIVE"
                  bars={[38, 44, 52, 48, 61, 66, 70, 78]}
                />

                <MetricCard
                  title="Total Players"
                  value={players}
                  subtitle="Players indexed"
                  icon={Users}
                  accent="cyan"
                  trend="INDEXED"
                  bars={[28, 35, 42, 48, 55, 64, 73, 86]}
                />

                <MetricCard
                  title="Orange Cap"
                  value={orangeCap}
                  subtitle="Leading run scorer"
                  icon={Flame}
                  accent="orange"
                  trend="LEADER"
                  player
                  bars={[35, 43, 52, 48, 66, 73, 80, 92]}
                />

                <MetricCard
                  title="Purple Cap"
                  value={purpleCap}
                  subtitle="Leading wicket taker"
                  icon={Target}
                  accent="purple"
                  trend="LEADER"
                  player
                  bars={[28, 40, 48, 57, 53, 68, 77, 88]}
                />

              </div>

            </section>

            {/* =================================================
                TEAM WINS + DISTRIBUTION
            ================================================= */}

            <section className="mb-8">

              <SectionTitle
                icon={BarChart3}
                eyebrow="Visual Intelligence"
                title="Team & venue analytics"
                description="Understand winning records and team performance distribution."
              />

              <div className="grid gap-5 xl:grid-cols-2">

                <GlassPanel
                  eyebrow="Team Performance"
                  title="Team Wins"
                  description="Compare historical winning records across IPL franchises."
                  icon={Trophy}
                  accent="blue"
                  badge="LIVE DATA"
                >

                  {teamWins.length > 0 ? (
                    <TeamWinsChart data={teamWins} />
                  ) : (
                    <EmptyState label="No team wins data available." />
                  )}

                </GlassPanel>

                <GlassPanel
                  eyebrow="Team Distribution"
                  title="Performance Distribution"
                  description="Visual distribution of team-level IPL performance."
                  icon={BarChart3}
                  accent="purple"
                  badge="ANALYTICS"
                >

                  {teamWins.length > 0 ? (
                    <CustomPieChart data={teamWins} />
                  ) : (
                    <EmptyState label="No distribution data available." />
                  )}

                </GlassPanel>

              </div>

            </section>

            {/* =================================================
                BATTING
            ================================================= */}

            <section className="mb-8">

              <GlassPanel
                eyebrow="Player Performance"
                title="Batting performance"
                description="Visual comparison of leading run-scoring performances."
                icon={Flame}
                accent="orange"
                badge="TOP PERFORMERS"
              >

                {topBatsmen.length > 0 ? (
                  <CustomBarChart data={topBatsmen} />
                ) : (
                  <EmptyState label="No batting data available." />
                )}

              </GlassPanel>

            </section>

            {/* =================================================
                INSIGHTS
            ================================================= */}

            <section className="mb-8">

              <SectionTitle
                icon={Sparkles}
                eyebrow="Intelligence Signals"
                title="Analytics insights"
                description="Important signals generated from the current IPL dataset."
              />

              <div className="grid gap-4 lg:grid-cols-3">

                <InsightCard
                  icon={Flame}
                  title="Orange Cap"
                  value={
                    loading
                      ? "..."
                      : orangeCap
                  }
                  description="Current leading run scorer from the available dataset."
                  accent="orange"
                  badge="BATTING"
                />

                <InsightCard
                  icon={Target}
                  title="Purple Cap"
                  value={
                    loading
                      ? "..."
                      : purpleCap
                  }
                  description="Current leading wicket taker from the available dataset."
                  accent="purple"
                  badge="BOWLING"
                />

                <div className="relative overflow-hidden rounded-[24px] border border-emerald-400/10 bg-gradient-to-br from-emerald-500/[0.07] via-white/[0.025] to-blue-500/[0.04] p-6">

                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/[0.08] blur-3xl" />

                  <div className="relative">

                    <div className="flex items-start justify-between">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-500/10">

                        <Zap
                          size={19}
                          className="text-emerald-400"
                        />

                      </div>

                      <span className="rounded-full border border-emerald-400/10 bg-emerald-400/[0.05] px-3 py-1.5 text-[8px] font-black uppercase tracking-wider text-emerald-300">
                        SYSTEM
                      </span>

                    </div>

                    <p className="mt-6 text-[9px] font-black uppercase tracking-[2px] text-slate-600">
                      Analytics Engine
                    </p>

                    <h3 className="mt-2 text-2xl font-black text-emerald-400">
                      ONLINE
                    </h3>

                    <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">

                      <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-400" />

                    </div>

                    <p className="mt-3 text-xs leading-5 text-slate-500">
                      Dataset analysis system is operational and
                      ready for analytics requests.
                    </p>

                  </div>

                </div>

              </div>

            </section>

            {/* =================================================
                SUMMARY
            ================================================= */}

            <section className="mb-8">

              <div className="relative overflow-hidden rounded-[26px] border border-white/[0.08] bg-gradient-to-br from-[#101827] via-[#0a1220] to-[#080c16] p-6 sm:p-8">

                <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-purple-500/[0.07] blur-3xl" />

                <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

                  <div>

                    <div className="flex items-center gap-2">

                      <CircleDot
                        size={13}
                        className="text-blue-400"
                      />

                      <span className="text-[9px] font-black uppercase tracking-[2px] text-blue-400">
                        Dataset Summary
                      </span>

                    </div>

                    <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                      IPL analytics workspace
                    </h2>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                      Monitor your connected dataset and use
                      these analytics modules to understand
                      team and player performance.
                    </p>

                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                    <MiniStat
                      label="Matches"
                      value={matches}
                    />

                    <MiniStat
                      label="Teams"
                      value={teams}
                    />

                    <MiniStat
                      label="Players"
                      value={players}
                    />

                    <MiniStat
                      label="Engine"
                      value="ON"
                    />

                  </div>

                </div>

              </div>

            </section>

            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="border-t border-white/[0.06] pb-6 pt-7">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                    <BarChart3 size={16} />
                  </div>

                  <div>

                    <p className="text-sm font-black text-slate-300">
                      IPL Analytics
                    </p>

                    <p className="text-[10px] text-slate-700">
                      React • FastAPI • Machine Learning
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[1.5px] text-slate-700">

                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                  System Operational

                </div>

              </div>

            </footer>

          </div>
        </main>
      </div>
    </div>
  );
}

/* =============================================================
   SECTION TITLE
============================================================= */

function SectionTitle({
  icon: Icon,
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="mb-5">

      <div className="flex items-center gap-2">

        <Icon
          size={15}
          className="text-blue-400"
        />

        <span className="text-[9px] font-black uppercase tracking-[2.5px] text-blue-400">
          {eyebrow}
        </span>

      </div>

      <h2 className="mt-1.5 text-2xl font-black tracking-tight sm:text-3xl">
        {title}
      </h2>

      <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  );
}

/* =============================================================
   HERO PILL
============================================================= */

function HeroPill({
  icon: Icon,
  label,
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.035] px-3.5 py-2">

      <Icon
        size={13}
        className="text-slate-400"
      />

      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </span>

    </div>
  );
}

/* =============================================================
   HERO STAT
============================================================= */

function HeroStat({
  icon: Icon,
  label,
  value,
  color,
}) {
  const colors = {
    orange:
      "border-orange-400/10 bg-orange-500/[0.06] text-orange-400",

    blue:
      "border-blue-400/10 bg-blue-500/[0.06] text-blue-400",

    purple:
      "border-purple-400/10 bg-purple-500/[0.06] text-purple-400",

    green:
      "border-emerald-400/10 bg-emerald-500/[0.06] text-emerald-400",
  };

  return (
    <div
      className={`rounded-2xl border p-4 backdrop-blur-md sm:p-5 ${colors[color]}`}
    >

      <div className="flex items-center justify-between">

        <Icon size={17} />

        <span className="text-[8px] font-black uppercase tracking-wider opacity-50">
          Live
        </span>

      </div>

      <p className="mt-5 text-[9px] font-black uppercase tracking-[1.5px] text-slate-600">
        {label}
      </p>

      <p className="mt-1 truncate text-xl font-black text-white sm:text-2xl">
        {value}
      </p>

    </div>
  );
}

/* =============================================================
   METRIC CARD
============================================================= */

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
  trend,
  bars,
  player = false,
}) {
  const styles = {
    orange: {
      icon:
        "border-orange-400/10 bg-orange-500/10 text-orange-400",
      glow:
        "bg-orange-500/[0.06]",
      bar:
        "from-orange-600 to-orange-300",
      trend:
        "text-orange-300",
    },

    blue: {
      icon:
        "border-blue-400/10 bg-blue-500/10 text-blue-400",
      glow:
        "bg-blue-500/[0.06]",
      bar:
        "from-blue-700 to-blue-300",
      trend:
        "text-blue-300",
    },

    cyan: {
      icon:
        "border-cyan-400/10 bg-cyan-500/10 text-cyan-400",
      glow:
        "bg-cyan-500/[0.06]",
      bar:
        "from-cyan-700 to-cyan-300",
      trend:
        "text-cyan-300",
    },

    purple: {
      icon:
        "border-purple-400/10 bg-purple-500/10 text-purple-400",
      glow:
        "bg-purple-500/[0.06]",
      bar:
        "from-purple-700 to-purple-300",
      trend:
        "text-purple-300",
    },
  };

  const style =
    styles[accent] || styles.orange;

  return (
    <div className="group relative overflow-hidden rounded-[22px] border border-white/[0.07] bg-white/[0.035] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.13] hover:bg-white/[0.05]">

      <div
        className={`absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl ${style.glow}`}
      />

      <div className="relative">

        <div className="flex items-start justify-between gap-3">

          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${style.icon}`}
          >
            <Icon size={20} />
          </div>

          <div
            className={`flex items-center gap-1 text-[8px] font-black uppercase tracking-wider ${style.trend}`}
          >
            <TrendingUp size={11} />
            {trend}
          </div>

        </div>

        <p className="mt-5 text-[9px] font-black uppercase tracking-[1.8px] text-slate-600">
          {title}
        </p>

        <h3
          className={`mt-2 truncate font-black tracking-tight text-white ${
            player
              ? "text-base sm:text-lg"
              : "text-3xl"
          }`}
          title={String(value)}
        >
          {value}
        </h3>

        <p className="mt-1 truncate text-[10px] text-slate-700">
          {subtitle}
        </p>

        <div className="mt-5 flex h-8 items-end gap-1">

          {bars.map((height, index) => (
            <div
              key={index}
              className="flex-1 rounded-t-sm bg-white/[0.05] transition-all duration-300 group-hover:bg-white/[0.08]"
              style={{
                height: `${height}%`,
              }}
            >
              <div
                className={`h-full rounded-t-sm bg-gradient-to-t ${style.bar} opacity-40`}
              />
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

/* =============================================================
   GLASS PANEL
============================================================= */

function GlassPanel({
  eyebrow,
  title,
  description,
  icon: Icon,
  accent,
  badge,
  children,
}) {
  const accentClass = {
    orange:
      "text-orange-400 bg-orange-500/10 border-orange-400/10",

    blue:
      "text-blue-400 bg-blue-500/10 border-blue-400/10",

    purple:
      "text-purple-400 bg-purple-500/10 border-purple-400/10",
  }[accent] ||
  "text-orange-400 bg-orange-500/10 border-orange-400/10";

  return (
    <div className="overflow-hidden rounded-[26px] border border-white/[0.08] bg-white/[0.035] backdrop-blur-xl shadow-[0_20px_70px_rgba(0,0,0,0.22)]">

      <div className="border-b border-white/[0.06] p-5 sm:p-6">

        <div className="flex items-start justify-between gap-4">

          <div className="flex items-start gap-3">

            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${accentClass}`}
            >
              <Icon size={18} />
            </div>

            <div>

              <p className="text-[9px] font-black uppercase tracking-[2px] text-slate-600">
                {eyebrow}
              </p>

              <h3 className="mt-1 text-lg font-black text-white sm:text-xl">
                {title}
              </h3>

              <p className="mt-1 text-[10px] leading-5 text-slate-600">
                {description}
              </p>

            </div>

          </div>

          {badge && (
            <span className="shrink-0 rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-[8px] font-black uppercase tracking-wider text-slate-600">
              {badge}
            </span>
          )}

        </div>

      </div>

      <div className="p-3 sm:p-5">

        <div className="overflow-hidden rounded-2xl border border-white/[0.04] bg-black/[0.10] p-3 sm:p-5">
          {children}
        </div>

      </div>

    </div>
  );
}

/* =============================================================
   INSIGHT CARD
============================================================= */

function InsightCard({
  icon: Icon,
  title,
  value,
  description,
  accent,
  badge,
}) {
  const styles = {
    orange: {
      icon:
        "border-orange-400/10 bg-orange-500/10 text-orange-400",
      glow:
        "bg-orange-500/[0.06]",
      value:
        "text-orange-300",
    },

    purple: {
      icon:
        "border-purple-400/10 bg-purple-500/10 text-purple-400",
      glow:
        "bg-purple-500/[0.06]",
      value:
        "text-purple-300",
    },
  };

  const style =
    styles[accent] || styles.orange;

  return (
    <div className="group relative overflow-hidden rounded-[24px] border border-white/[0.07] bg-white/[0.035] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/[0.12]">

      <div
        className={`absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl ${style.glow}`}
      />

      <div className="relative">

        <div className="flex items-start justify-between">

          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl border ${style.icon}`}
          >
            <Icon size={19} />
          </div>

          <span className="rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-1.5 text-[8px] font-black uppercase tracking-wider text-slate-600">
            {badge}
          </span>

        </div>

        <p className="mt-6 text-[9px] font-black uppercase tracking-[2px] text-slate-600">
          {title}
        </p>

        <h3
          className={`mt-2 truncate text-2xl font-black ${style.value}`}
          title={String(value)}
        >
          {value}
        </h3>

        <p className="mt-3 text-xs leading-6 text-slate-500">
          {description}
        </p>

      </div>

    </div>
  );
}

/* =============================================================
   MINI STAT
============================================================= */

function MiniStat({
  label,
  value,
}) {
  return (
    <div className="min-w-[90px] rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3">

      <p className="text-[8px] font-black uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-1 text-lg font-black text-white">
        {value}
      </p>

    </div>
  );
}

export default Analytics;