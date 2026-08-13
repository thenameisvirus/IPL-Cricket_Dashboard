import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  Activity,
  ArrowUpRight,
  BarChart3,
  ChevronRight,
  Crown,
  Flame,
  Loader2,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import CustomBarChart from "../components/BarChart";
import TeamWinsChart from "../components/TeamWinsChart";
import CustomPieChart from "../components/PieChart";
import PlayerSearch from "../components/PlayerSearch";
import TeamComparison from "../components/TeamComparison";
import MatchPrediction from "../components/MatchPrediction";

import BASE_URL from "../services/api";

function Dashboard() {
  const [matches, setMatches] = useState(0);
  const [teams, setTeams] = useState(0);
  const [players, setPlayers] = useState(0);

  const [orangeCap, setOrangeCap] = useState(null);
  const [purpleCap, setPurpleCap] = useState(null);

  const [topBatsmen, setTopBatsmen] = useState([]);
  const [topBowlers, setTopBowlers] = useState([]);
  const [teamWins, setTeamWins] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    loadDashboard();
  }, []);

  async function safeGet(url, fallback = null) {
    try {
      const response = await axios.get(url);
      return response?.data ?? fallback;
    } catch (err) {
      console.error(`API Error: ${url}`, err);
      return fallback;
    }
  }

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [
        matchesData,
        teamsData,
        playersData,
        orangeData,
        purpleData,
        batsmenData,
        bowlersData,
        winsData,
      ] = await Promise.all([
        safeGet(`${BASE_URL}/total_matches`, 0),
        safeGet(`${BASE_URL}/total_teams`, 0),
        safeGet(`${BASE_URL}/total_players`, 0),
        safeGet(`${BASE_URL}/orange_cap`, null),
        safeGet(`${BASE_URL}/purple_cap`, null),
        safeGet(`${BASE_URL}/top_batsman`, {}),
        safeGet(`${BASE_URL}/top_bowlers`, {}),
        safeGet(`${BASE_URL}/team_wins_chart`, {}),
      ]);

      console.log("========== IPL DASHBOARD ==========");
      console.log("MATCHES:", matchesData);
      console.log("TEAMS:", teamsData);
      console.log("PLAYERS:", playersData);
      console.log("ORANGE CAP:", orangeData);
      console.log("PURPLE CAP:", purpleData);
      console.log("BATSMEN:", batsmenData);
      console.log("BOWLERS:", bowlersData);
      console.log("TEAM WINS:", winsData);
      console.log("===================================");

      setMatches(extractNumber(matchesData));
      setTeams(extractNumber(teamsData));
      setPlayers(extractNumber(playersData));

      setOrangeCap(normalizeCap(orangeData, "batting"));
      setPurpleCap(normalizeCap(purpleData, "bowling"));

      setTopBatsmen(normalizeBattingData(batsmenData));
      setTopBowlers(normalizeBowlingData(bowlersData));
      setTeamWins(normalizeTeamWins(winsData));
    } catch (err) {
      console.error("Dashboard Error:", err);

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  }

  const orangePlayer = useMemo(
    () => getPlayerName(orangeCap),
    [orangeCap]
  );

  const purplePlayer = useMemo(
    () => getPlayerName(purpleCap),
    [purpleCap]
  );

  const orangeRuns = useMemo(
    () =>
      getPlayerStat(orangeCap, [
        "runs",
        "Runs",
        "total_runs",
        "TotalRuns",
        "totalRuns",
        "value",
      ]),
    [orangeCap]
  );

  const purpleWickets = useMemo(
    () =>
      getPlayerStat(purpleCap, [
        "wickets",
        "Wickets",
        "total_wickets",
        "TotalWickets",
        "totalWickets",
        "value",
      ]),
    [purpleCap]
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050816] text-white">

      {/* =====================================================
          AMBIENT BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-orange-500/[0.045] blur-[140px]" />

        <div className="absolute right-[-180px] top-[20%] h-[550px] w-[550px] rounded-full bg-purple-600/[0.05] blur-[150px]" />

        <div className="absolute bottom-[-180px] left-[35%] h-[500px] w-[500px] rounded-full bg-blue-500/[0.04] blur-[140px]" />

        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* =====================================================
          APPLICATION SHELL
      ====================================================== */}

      <div className="relative z-10 flex min-h-screen">

        {/* SIDEBAR */}

        <aside className="hidden w-[250px] shrink-0 lg:block">
          <div className="fixed left-0 top-0 h-screen w-[250px] border-r border-white/[0.06] bg-[#080d18]/95 backdrop-blur-2xl">
            <Sidebar />
          </div>
        </aside>

        {/* MAIN */}

        <main className="min-w-0 flex-1">

          {/* NAVBAR */}

          <div className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#050816]/85 backdrop-blur-2xl">
            <Navbar />
          </div>

          {/* CONTENT */}

          <div className="relative z-10 mx-auto w-full max-w-[1750px] px-4 pb-10 pt-10 sm:px-6 sm:pt-12 lg:px-8 lg:pt-14 xl:px-10">

            {/* =================================================
                HERO
            ================================================== */}

            <section className="relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-gradient-to-br from-[#111a2c] via-[#0b1322] to-[#080c15] shadow-[0_30px_100px_rgba(0,0,0,0.35)]">

              <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-orange-500/[0.09] blur-[110px]" />

              <div className="absolute bottom-[-180px] left-[35%] h-96 w-96 rounded-full bg-purple-500/[0.06] blur-[120px]" />

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

                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/[0.07] px-4 py-2">

                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-50" />
                        <span className="relative h-2 w-2 rounded-full bg-orange-400" />
                      </span>

                      <Sparkles
                        size={13}
                        className="text-orange-400"
                      />

                      <span className="text-[9px] font-black uppercase tracking-[2.5px] text-orange-300">
                        IPL Cricket Intelligence
                      </span>

                    </div>

                    <h1 className="text-4xl font-black tracking-[-1.8px] sm:text-5xl lg:text-6xl">

                      Welcome to your

                      <span className="block bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
                        IPL Command Center
                      </span>

                    </h1>

                    <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                      Explore IPL statistics, player performance,
                      team dominance, batting leaders and bowling
                      intelligence — all from one premium dashboard.
                    </p>

                    <div className="mt-7 flex flex-wrap gap-3">

                      <HeroBadge
                        icon={Activity}
                        text="Live Analytics"
                      />

                      <HeroBadge
                        icon={ShieldCheck}
                        text="Verified Dataset"
                      />

                      <HeroBadge
                        icon={Zap}
                        text="Fast API"
                      />

                    </div>

                  </div>

                  <div className="min-w-[280px] rounded-[26px] border border-white/[0.07] bg-black/[0.18] p-5 backdrop-blur-xl sm:min-w-[340px]">

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-[8px] font-black uppercase tracking-[2px] text-slate-600">
                          System Status
                        </p>

                        <p className="mt-2 text-lg font-black text-white">
                          IPL Analytics Engine
                        </p>

                      </div>

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-500/10">
                        <Activity
                          size={20}
                          className="text-emerald-400"
                        />
                      </div>

                    </div>

                    <div className="mt-5 flex items-center gap-3">

                      <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                        <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      </span>

                      <span className="text-[9px] font-black uppercase tracking-[1.5px] text-emerald-300">
                        {loading
                          ? "Synchronizing"
                          : "All Systems Operational"}
                      </span>

                    </div>

                    <div className="mt-5 h-px bg-white/[0.05]" />

                    <div className="mt-4 flex items-center justify-between">

                      <span className="text-[8px] font-black uppercase tracking-wider text-slate-700">
                        API
                      </span>

                      <span className="text-[9px] font-bold text-slate-400">
                        Connected
                      </span>

                    </div>

                  </div>

                </div>

              </div>
            </section>

            {/* =================================================
                ERROR
            ================================================== */}

            {error && (
              <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-red-400/10 bg-red-500/[0.05] px-5 py-4">

                <div>

                  <p className="text-sm font-bold text-red-300">
                    Dashboard connection issue
                  </p>

                  <p className="mt-1 text-xs text-red-400/60">
                    {error}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={loadDashboard}
                  className="rounded-xl border border-red-400/10 bg-red-500/10 px-4 py-2 text-[9px] font-black uppercase tracking-wider text-red-300 transition hover:bg-red-500/20"
                >
                  Retry
                </button>

              </div>
            )}

            {/* =================================================
                STAT CARDS
            ================================================== */}

            <section className="mt-7">

              <div className="mb-4 flex items-end justify-between">

                <div>

                  <p className="text-[9px] font-black uppercase tracking-[2.5px] text-orange-400">
                    Overview
                  </p>

                  <h2 className="mt-1 text-xl font-black sm:text-2xl">
                    League Intelligence
                  </h2>

                </div>

                <div className="hidden items-center gap-2 sm:flex">

                  <Activity
                    size={13}
                    className="text-emerald-400"
                  />

                  <span className="text-[8px] font-black uppercase tracking-[1.5px] text-slate-600">
                    Updated Live
                  </span>

                </div>

              </div>

              {loading ? (
                <LoadingCards />
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

                  <DashboardCard
                    title="Total Matches"
                    value={safeDisplayNumber(matches)}
                    icon={Trophy}
                    accent="orange"
                    subtitle="League Data"
                  />

                  <DashboardCard
                    title="Total Teams"
                    value={safeDisplayNumber(teams)}
                    icon={ShieldCheck}
                    accent="blue"
                    subtitle="Teams Active"
                  />

                  <DashboardCard
                    title="Total Players"
                    value={safeDisplayNumber(players)}
                    icon={Users}
                    accent="purple"
                    subtitle="Player Database"
                  />

                  <DashboardCard
                    title="Orange Cap"
                    value={orangePlayer}
                    icon={Crown}
                    accent="orange"
                    subtitle="Batting Leader"
                  />

                  <DashboardCard
                    title="Purple Cap"
                    value={purplePlayer}
                    icon={Target}
                    accent="purple"
                    subtitle="Bowling Leader"
                  />

                </div>
              )}

            </section>

            {/* =================================================
                CAP LEADERS
            ================================================== */}

            <section className="mt-8 grid gap-5 lg:grid-cols-2">

              <LeaderCard
                type="Orange Cap"
                icon={Crown}
                player={orangePlayer}
                stat={orangeRuns}
                statLabel="Runs"
                accent="orange"
              />

              <LeaderCard
                type="Purple Cap"
                icon={Target}
                player={purplePlayer}
                stat={purpleWickets}
                statLabel="Wickets"
                accent="purple"
              />

            </section>

            {/* =================================================
                PLAYER SEARCH
            ================================================== */}

            <section className="mt-8">

              <GlassPanel
                eyebrow="Player Intelligence"
                title="Search IPL Players"
                description="Find players and explore their available profile information."
                icon={Users}
                accent="orange"
                badge="PLAYER DATABASE"
              >
                <PlayerSearch />
              </GlassPanel>

            </section>

            {/* =================================================
                CHARTS
            ================================================== */}

            <section className="mt-8">

              <div className="mb-5">

                <p className="text-[9px] font-black uppercase tracking-[2.5px] text-purple-400">
                  Performance Analytics
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  League Performance
                </h2>

                <p className="mt-1 text-xs text-slate-600">
                  Understand batting trends and team dominance.
                </p>

              </div>

              <div className="grid gap-5 xl:grid-cols-2">

                <GlassPanel
                  eyebrow="Batting"
                  title="Top Batsmen"
                  description="Highest-performing batsmen from the available IPL dataset."
                  icon={Flame}
                  accent="orange"
                  badge="TOP 10"
                >
                  <div className="min-h-[320px]">

                    {topBatsmen.length > 0 ? (
                      <CustomBarChart data={topBatsmen} />
                    ) : (
                      <EmptyState
                        label="No batting data available."
                      />
                    )}

                  </div>
                </GlassPanel>

                <GlassPanel
                  eyebrow="Team Performance"
                  title="Team Wins"
                  description="Historical wins comparison across IPL teams."
                  icon={Trophy}
                  accent="purple"
                  badge="HISTORICAL"
                >
                  <div className="min-h-[320px]">

                    {teamWins.length > 0 ? (
                      <TeamWinsChart data={teamWins} />
                    ) : (
                      <EmptyState
                        label="No team wins data available."
                      />
                    )}

                  </div>
                </GlassPanel>

              </div>

            </section>

            {/* =================================================
                TOP BATSMEN + BOWLERS
            ================================================== */}

            <section className="mt-8 grid gap-5 xl:grid-cols-2">

              <PlayerRankingPanel
                title="Top 10 Batsmen"
                eyebrow="Batting Leaders"
                icon={Flame}
                players={topBatsmen}
                accent="orange"
                statKeys={[
                  "runs",
                  "Runs",
                  "total_runs",
                  "TotalRuns",
                  "totalRuns",
                  "value",
                ]}
                statLabel="Runs"
              />

              <PlayerRankingPanel
                title="Top 10 Bowlers"
                eyebrow="Bowling Leaders"
                icon={Target}
                players={topBowlers}
                accent="purple"
                statKeys={[
                  "wickets",
                  "Wickets",
                  "total_wickets",
                  "TotalWickets",
                  "totalWickets",
                  "value",
                ]}
                statLabel="Wickets"
              />

            </section>

            {/* =================================================
                PIE CHART
            ================================================== */}

            <section className="mt-8">

              <GlassPanel
                eyebrow="Distribution"
                title="Team Performance Distribution"
                description="Visual representation of team-level IPL performance."
                icon={BarChart3}
                accent="purple"
                badge="ANALYTICS"
              >

                <div className="min-h-[350px]">

                  {teamWins.length > 0 ? (
                    <CustomPieChart data={teamWins} />
                  ) : (
                    <EmptyState
                      label="No distribution data available."
                    />
                  )}

                </div>

              </GlassPanel>

            </section>

            {/* =================================================
                QUICK INSIGHTS
            ================================================== */}

            <section className="mt-8">

              <div className="mb-5">

                <div className="flex items-center gap-2">

                  <Sparkles
                    size={14}
                    className="text-orange-400"
                  />

                  <span className="text-[9px] font-black uppercase tracking-[2.5px] text-orange-400">
                    Performance Insights
                  </span>

                </div>

                <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                  Cricket Analytics
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Key intelligence generated from the available
                  dashboard data.
                </p>

              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                <InsightCard
                  icon={Trophy}
                  title="League Matches"
                  value={safeDisplayNumber(matches)}
                  description="Total matches available in the dataset."
                  accent="orange"
                />

                <InsightCard
                  icon={Users}
                  title="Player Database"
                  value={safeDisplayNumber(players)}
                  description="Players available for analytics and search."
                  accent="blue"
                />

                <InsightCard
                  icon={ShieldCheck}
                  title="Teams"
                  value={safeDisplayNumber(teams)}
                  description="Teams represented in the dashboard dataset."
                  accent="purple"
                />

                <InsightCard
                  icon={Crown}
                  title="Orange Cap"
                  value={orangePlayer}
                  description={
                    orangeRuns
                      ? `${orangeRuns} runs recorded for the current leader.`
                      : "Current batting leader."
                  }
                  accent="orange"
                />

                <InsightCard
                  icon={Target}
                  title="Purple Cap"
                  value={purplePlayer}
                  description={
                    purpleWickets
                      ? `${purpleWickets} wickets recorded for the current leader.`
                      : "Current bowling leader."
                  }
                  accent="purple"
                />

                <InsightCard
                  icon={Activity}
                  title="Analytics Status"
                  value={loading ? "SYNCING" : "READY"}
                  description="Dashboard analytics engine status."
                  accent="emerald"
                />

              </div>

            </section>

            {/* =================================================
                TEAM COMPARISON
            ================================================== */}

            <section className="mt-8">
              <TeamComparison />
            </section>

            {/* =================================================
                MATCH PREDICTION
            ================================================== */}

            <section className="mt-8">
              <MatchPrediction />
            </section>

            {/* =================================================
                FOOTER
            ================================================== */}

            <footer className="mt-10 border-t border-white/[0.05] py-7">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-[9px] font-black uppercase tracking-[2px] text-slate-700">
                    IPL Cricket Dashboard
                  </p>

                  <p className="mt-1 text-[10px] text-slate-800">
                    Premium cricket analytics platform
                  </p>

                </div>

                <div className="flex items-center gap-2">

                  <ShieldCheck
                    size={13}
                    className="text-emerald-500/60"
                  />

                  <span className="text-[8px] font-black uppercase tracking-[1.5px] text-slate-700">
                    API Connected
                  </span>

                  <ArrowUpRight
                    size={12}
                    className="text-slate-700"
                  />

                </div>

              </div>

            </footer>

          </div>
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   HERO BADGE
========================================================= */

function HeroBadge({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2">
      <Icon
        size={13}
        className="text-orange-400"
      />

      <span className="text-[8px] font-black uppercase tracking-wider text-slate-500">
        {text}
      </span>
    </div>
  );
}

/* =========================================================
   LOADING CARDS
========================================================= */

function LoadingCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="h-[190px] animate-pulse rounded-[24px] border border-white/[0.06] bg-white/[0.025]"
        />
      ))}
    </div>
  );
}

/* =========================================================
   LEADER CARD
========================================================= */

function LeaderCard({
  type,
  icon: Icon,
  player,
  stat,
  statLabel,
  accent,
}) {
  const isOrange = accent === "orange";

  return (
    <div
      className={`relative overflow-hidden rounded-[26px] border p-5 sm:p-6 ${
        isOrange
          ? "border-orange-400/10 bg-gradient-to-br from-orange-500/[0.08] via-[#111827] to-[#090d17]"
          : "border-purple-400/10 bg-gradient-to-br from-purple-500/[0.08] via-[#111827] to-[#090d17]"
      }`}
    >

      <div
        className={`absolute -right-20 -top-20 h-44 w-44 rounded-full blur-[80px] ${
          isOrange
            ? "bg-orange-500/[0.12]"
            : "bg-purple-500/[0.12]"
        }`}
      />

      <div className="relative flex items-start justify-between gap-4">

        <div className="flex items-center gap-3">

          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
              isOrange
                ? "border-orange-400/10 bg-orange-500/10 text-orange-400"
                : "border-purple-400/10 bg-purple-500/10 text-purple-400"
            }`}
          >
            <Icon size={20} />
          </div>

          <div>

            <p
              className={`text-[9px] font-black uppercase tracking-[2px] ${
                isOrange
                  ? "text-orange-400"
                  : "text-purple-400"
              }`}
            >
              {type}
            </p>

            <p className="mt-1 text-xs font-bold text-slate-500">
              Current leader
            </p>

          </div>

        </div>

        <span className="rounded-lg border border-white/[0.06] bg-black/[0.15] px-2.5 py-1.5 text-[7px] font-black uppercase tracking-wider text-slate-600">
          LEADER
        </span>

      </div>

      <div className="relative mt-6 flex items-end justify-between gap-4">

        <div className="min-w-0">

          <p className="truncate text-2xl font-black text-white sm:text-3xl">
            {String(player || "Not Available")}
          </p>

          <p className="mt-1 text-[8px] font-black uppercase tracking-[1.5px] text-slate-700">
            IPL Player
          </p>

        </div>

        <div className="shrink-0 text-right">

          <p
            className={`text-2xl font-black ${
              isOrange
                ? "text-orange-300"
                : "text-purple-300"
            }`}
          >
            {String(stat ?? "-")}
          </p>

          <p className="text-[7px] font-black uppercase tracking-[1.5px] text-slate-700">
            {statLabel}
          </p>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   PLAYER RANKING PANEL
========================================================= */

function PlayerRankingPanel({
  title,
  eyebrow,
  icon: Icon,
  players,
  accent,
  statKeys,
  statLabel,
}) {
  const isOrange = accent === "orange";

  const safePlayers = Array.isArray(players)
    ? players
    : [];

  const maxStat = Math.max(
    ...safePlayers.map(
      (player) => Number(getStat(player, statKeys)) || 0
    ),
    1
  );

  return (
    <GlassPanel
      eyebrow={eyebrow}
      title={title}
      description={`Performance leaders ranked by ${statLabel.toLowerCase()}.`}
      icon={Icon}
      accent={isOrange ? "orange" : "purple"}
      badge="TOP 10"
    >
      {safePlayers.length === 0 ? (
        <EmptyState
          label={`No ${statLabel.toLowerCase()} data available.`}
        />
      ) : (
        <div className="space-y-2">

          {safePlayers.slice(0, 10).map((player, index) => {

            const name = getPlayerName(player);
            const stat = getStat(player, statKeys);

            const numericStat =
              Number(stat) || 0;

            const width = Math.max(
              5,
              Math.min(
                100,
                (numericStat / maxStat) * 100
              )
            );

            return (
              <RankingRow
                key={`${name}-${index}`}
                rank={index + 1}
                name={name}
                stat={stat}
                label={statLabel}
                width={width}
                isOrange={isOrange}
              />
            );
          })}

        </div>
      )}
    </GlassPanel>
  );
}

/* =========================================================
   RANKING ROW
========================================================= */

function RankingRow({
  rank,
  name,
  stat,
  label,
  width,
  isOrange,
}) {
  const initials =
    String(name || "PL")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((x) => x[0])
      .join("")
      .toUpperCase() || "PL";

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.018] px-3 py-3 transition hover:border-white/[0.08] hover:bg-white/[0.035]">

      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[9px] font-black ${
          rank === 1
            ? "bg-orange-500/10 text-orange-300"
            : rank === 2
            ? "bg-white/[0.06] text-slate-300"
            : rank === 3
            ? "bg-amber-500/10 text-amber-300"
            : "bg-white/[0.025] text-slate-700"
        }`}
      >
        #{rank}
      </div>

      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-xs font-black ${
          isOrange
            ? "border-orange-400/10 bg-orange-500/10 text-orange-300"
            : "border-purple-400/10 bg-purple-500/10 text-purple-300"
        }`}
      >
        {initials}
      </div>

      <div className="min-w-0 flex-1">

        <div className="flex items-center justify-between gap-3">

          <div className="min-w-0">

            <p className="truncate text-sm font-bold text-slate-200">
              {name}
            </p>

            <p className="mt-0.5 text-[8px] font-bold uppercase tracking-wider text-slate-700">
              IPL Player
            </p>

          </div>

          <div className="shrink-0 text-right">

            <p
              className={`text-sm font-black ${
                isOrange
                  ? "text-orange-300"
                  : "text-purple-300"
              }`}
            >
              {String(stat || "-")}
            </p>

            <p className="text-[7px] font-black uppercase tracking-wider text-slate-700">
              {label}
            </p>

          </div>

        </div>

        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.04]">

          <div
            className={`h-full rounded-full bg-gradient-to-r ${
              isOrange
                ? "from-orange-600 to-orange-300"
                : "from-purple-700 to-purple-300"
            }`}
            style={{
              width: `${width}%`,
            }}
          />

        </div>

      </div>

      <ChevronRight
        size={14}
        className="hidden shrink-0 text-slate-800 transition group-hover:text-slate-500 sm:block"
      />

    </div>
  );
}

/* =========================================================
   GLASS PANEL
========================================================= */

function GlassPanel({
  eyebrow,
  title,
  description,
  icon: Icon,
  accent,
  badge,
  children,
}) {
  const accentClass =
    {
      orange:
        "text-orange-400 bg-orange-500/10 border-orange-400/10",

      blue:
        "text-blue-400 bg-blue-500/10 border-blue-400/10",

      purple:
        "text-purple-400 bg-purple-500/10 border-purple-400/10",

      emerald:
        "text-emerald-400 bg-emerald-500/10 border-emerald-400/10",
    }[accent] ||
    "text-orange-400 bg-orange-500/10 border-orange-400/10";

  return (
    <div className="overflow-hidden rounded-[26px] border border-white/[0.08] bg-white/[0.035] p-4 backdrop-blur-xl sm:p-5">

      <div className="mb-5 flex items-start justify-between gap-4">

        <div className="flex items-start gap-3">

          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${accentClass}`}
          >
            <Icon size={18} />
          </div>

          <div>

            <p className="text-[9px] font-black uppercase tracking-[2px] text-slate-600">
              {eyebrow}
            </p>

            <h3 className="mt-1 text-lg font-black text-white">
              {title}
            </h3>

            <p className="mt-1 text-[10px] leading-5 text-slate-600">
              {description}
            </p>

          </div>

        </div>

        {badge && (
          <span className="shrink-0 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[8px] font-black tracking-wider text-slate-600">
            {badge}
          </span>
        )}

      </div>

      <div className="overflow-hidden rounded-2xl border border-white/[0.04] bg-black/[0.1] p-3 sm:p-4">
        {children}
      </div>

    </div>
  );
}

/* =========================================================
   INSIGHT CARD
========================================================= */

function InsightCard({
  icon: Icon,
  title,
  value,
  description,
  accent,
}) {
  const styles = {
    orange: {
      border: "border-orange-400/10",
      bg: "bg-orange-500/[0.05]",
      icon: "text-orange-400",
    },

    blue: {
      border: "border-blue-400/10",
      bg: "bg-blue-500/[0.05]",
      icon: "text-blue-400",
    },

    purple: {
      border: "border-purple-400/10",
      bg: "bg-purple-500/[0.05]",
      icon: "text-purple-400",
    },

    emerald: {
      border: "border-emerald-400/10",
      bg: "bg-emerald-500/[0.05]",
      icon: "text-emerald-400",
    },
  };

  const style =
    styles[accent] || styles.orange;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border ${style.border} bg-gradient-to-br from-[#111a2b] to-[#090e18] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/[0.12]`}
    >

      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/[0.02] blur-2xl transition duration-500 group-hover:scale-125" />

      <div className="relative flex items-start justify-between gap-4">

        <div>

          <p className="text-[8px] font-black uppercase tracking-[2px] text-slate-600">
            {title}
          </p>

          <p className="mt-3 truncate text-2xl font-black text-white">
            {String(value ?? "-")}
          </p>

        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${style.border} ${style.bg}`}
        >
          <Icon
            size={18}
            className={style.icon}
          />
        </div>

      </div>

      <div className="relative mt-5 border-t border-white/[0.05] pt-4">

        <p className="text-[10px] leading-5 text-slate-600">
          {description}
        </p>

      </div>

    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.05] bg-white/[0.025]">

        <Users
          size={20}
          className="text-slate-700"
        />

      </div>

      <p className="mt-4 text-sm font-bold text-slate-600">
        {label}
      </p>

      <p className="mt-1 text-[10px] text-slate-800">
        Try refreshing the dashboard.
      </p>

    </div>
  );
}

/* =========================================================
   NUMBER HELPER
========================================================= */

function extractNumber(data) {
  if (typeof data === "number") {
    return Number.isFinite(data)
      ? data
      : 0;
  }

  if (typeof data === "string") {
    const parsed = Number(data);
    return Number.isFinite(parsed)
      ? parsed
      : 0;
  }

  if (!data || typeof data !== "object") {
    return 0;
  }

  const possibleKeys = [
    "value",
    "count",
    "total",
    "matches",
    "total_matches",
    "totalMatches",
    "teams",
    "total_teams",
    "totalTeams",
    "players",
    "total_players",
    "totalPlayers",
  ];

  for (const key of possibleKeys) {
    if (
      data[key] !== undefined &&
      data[key] !== null &&
      typeof data[key] !== "object"
    ) {
      const parsed = Number(data[key]);

      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return 0;
}

/* =========================================================
   CAP NORMALIZER
========================================================= */

function normalizeCap(data, type = "batting") {
  if (!data) {
    return null;
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

    const entries =
      Object.entries(source);

    if (!entries.length) {
      return null;
    }

    const [name, value] =
      entries[0];

    const number =
      Number(value);

    return {
      Player: String(name),
      name: String(name),
      value: Number.isFinite(number)
        ? number
        : 0,
      Runs:
        type === "batting"
          ? Number.isFinite(number)
            ? number
            : 0
          : 0,
      Wickets:
        type === "bowling"
          ? Number.isFinite(number)
            ? number
            : 0
          : 0,
    };
  }

  if (Array.isArray(data)) {
    if (!data.length) {
      return null;
    }

    const item = data[0];

    if (
      item &&
      typeof item === "object"
    ) {
      const name =
        item.Player ||
        item.player ||
        item.name ||
        item.Name ||
        item.Batter ||
        item.Bowler ||
        "Unknown";

      const value =
        item.value ??
        item.Runs ??
        item.runs ??
        item.Wickets ??
        item.wickets ??
        0;

      return {
        ...item,
        Player: String(name),
        name: String(name),
        value: Number(value) || 0,
      };
    }
  }

  return null;
}

/* =========================================================
   BATTING NORMALIZER
========================================================= */

function normalizeBattingData(data) {
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
      .map(([name, value]) => {
        const number =
          Number(value);

        return {
          Player: String(name),
          name: String(name),
          player: String(name),
          Batter: String(name),
          Runs: Number.isFinite(number)
            ? number
            : 0,
          runs: Number.isFinite(number)
            ? number
            : 0,
          value: Number.isFinite(number)
            ? number
            : 0,
        };
      })
      .sort(
        (a, b) => b.value - a.value
      )
      .slice(0, 10);
  }

  if (Array.isArray(data)) {
    return data
      .map((item, index) => {
        if (
          !item ||
          typeof item !== "object"
        ) {
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
          Runs: Number(value) || 0,
          value: Number(value) || 0,
        };
      })
      .filter(Boolean)
      .sort(
        (a, b) => b.value - a.value
      )
      .slice(0, 10);
  }

  return [];
}

/* =========================================================
   BOWLING NORMALIZER
========================================================= */

function normalizeBowlingData(data) {
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
      .map(([name, value]) => {
        const number =
          Number(value);

        return {
          Player: String(name),
          name: String(name),
          player: String(name),
          Bowler: String(name),
          Wickets: Number.isFinite(number)
            ? number
            : 0,
          wickets: Number.isFinite(number)
            ? number
            : 0,
          value: Number.isFinite(number)
            ? number
            : 0,
        };
      })
      .sort(
        (a, b) => b.value - a.value
      )
      .slice(0, 10);
  }

  if (Array.isArray(data)) {
    return data
      .map((item, index) => {
        if (
          !item ||
          typeof item !== "object"
        ) {
          return null;
        }

        const name =
          item.Player ||
          item.player ||
          item.Bowler ||
          item.bowler ||
          item.Name ||
          item.name ||
          `Player ${index + 1}`;

        const value =
          item.Wickets ??
          item.wickets ??
          item.total_wickets ??
          item.TotalWickets ??
          item.value ??
          0;

        return {
          ...item,
          Player: String(name),
          name: String(name),
          player: String(name),
          Wickets: Number(value) || 0,
          value: Number(value) || 0,
        };
      })
      .filter(Boolean)
      .sort(
        (a, b) => b.value - a.value
      )
      .slice(0, 10);
  }

  return [];
}

/* =========================================================
   TEAM WINS NORMALIZER
========================================================= */

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
      .map(([team, value]) => {
        const number =
          Number(value);

        return {
          team: String(team),
          Team: String(team),
          team_name: String(team),
          name: String(team),
          wins: Number.isFinite(number)
            ? number
            : 0,
          Wins: Number.isFinite(number)
            ? number
            : 0,
          value: Number.isFinite(number)
            ? number
            : 0,
        };
      })
      .filter(
        (item) =>
          item.team &&
          item.team !== "undefined"
      )
      .sort(
        (a, b) => b.wins - a.wins
      )
      .slice(0, 10);
  }

  if (Array.isArray(data)) {
    return data
      .map((item, index) => {
        if (
          !item ||
          typeof item !== "object"
        ) {
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

        const wins =
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
          wins: Number(wins) || 0,
          Wins: Number(wins) || 0,
          value: Number(wins) || 0,
        };
      })
      .filter(Boolean)
      .sort(
        (a, b) => b.wins - a.wins
      )
      .slice(0, 10);
  }

  return [];
}

/* =========================================================
   PLAYER NAME
========================================================= */

function getPlayerName(player) {
  if (!player) {
    return "-";
  }

  if (typeof player === "string") {
    return player;
  }

  if (typeof player !== "object") {
    return String(player);
  }

  const possibleKeys = [
    "Player",
    "player",
    "player_name",
    "playerName",
    "name",
    "Name",
    "longName",
    "long_name",
    "Batter",
    "batter",
    "Bowler",
    "bowler",
  ];

  for (const key of possibleKeys) {
    const value =
      player[key];

    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    ) {
      return String(value);
    }
  }

  return "-";
}

/* =========================================================
   PLAYER STAT
========================================================= */

function getPlayerStat(
  player,
  keys = []
) {
  if (
    !player ||
    typeof player !== "object"
  ) {
    return null;
  }

  for (const key of keys) {
    const value =
      player[key];

    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      return value;
    }
  }

  return null;
}

/* =========================================================
   GENERIC STAT
========================================================= */

function getStat(
  player,
  keys = []
) {
  if (
    !player ||
    typeof player !== "object"
  ) {
    return 0;
  }

  for (const key of keys) {
    const value =
      player[key];

    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      return value;
    }
  }

  return 0;
}

/* =========================================================
   SAFE DISPLAY NUMBER
========================================================= */

function safeDisplayNumber(value) {
  const number =
    Number(value);

  return Number.isFinite(number)
    ? String(number)
    : "0";
}

export default Dashboard;