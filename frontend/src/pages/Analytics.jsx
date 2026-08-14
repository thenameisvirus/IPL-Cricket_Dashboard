import { useEffect, useMemo, useState } from "react";
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
  TrendingUp,
  Zap,
  CalendarDays,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BASE_URL from "../services/api";

const CURRENT_TEAMS = [
  "Mumbai Indians",
  "Chennai Super Kings",
  "Royal Challengers Bengaluru",
  "Kolkata Knight Riders",
  "Sunrisers Hyderabad",
  "Punjab Kings",
  "Delhi Capitals",
  "Rajasthan Royals",
  "Gujarat Titans",
  "Lucknow Super Giants",
];

const TEAM_SHORT = {
  "Mumbai Indians": "MI",
  "Chennai Super Kings": "CSK",
  "Royal Challengers Bengaluru": "RCB",
  "Kolkata Knight Riders": "KKR",
  "Sunrisers Hyderabad": "SRH",
  "Punjab Kings": "PBKS",
  "Delhi Capitals": "DC",
  "Rajasthan Royals": "RR",
  "Gujarat Titans": "GT",
  "Lucknow Super Giants": "LSG",
};

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#14b8a6",
];

const FALLBACK_WINS = [
  { team: "Mumbai Indians", wins: 155 },
  { team: "Chennai Super Kings", wins: 148 },
  {
    team: "Royal Challengers Bengaluru",
    wins: 143,
  },
  { team: "Kolkata Knight Riders", wins: 140 },
  { team: "Sunrisers Hyderabad", wins: 131 },
  { team: "Punjab Kings", wins: 126 },
  { team: "Delhi Capitals", wins: 125 },
  { team: "Rajasthan Royals", wins: 123 },
  { team: "Gujarat Titans", wins: 60 },
  { team: "Lucknow Super Giants", wins: 34 },
];

function Analytics() {
  const [matches, setMatches] = useState(0);
  const [teams, setTeams] = useState(10);
  const [players, setPlayers] = useState(0);

  const [orangeCap, setOrangeCap] = useState({
    name: "—",
    value: 0,
  });

  const [purpleCap, setPurpleCap] = useState({
    name: "—",
    value: 0,
  });

  const [teamWins, setTeamWins] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function getData(url, fallback = null) {
    try {
      const response = await axios.get(url);
      return response?.data ?? fallback;
    } catch (error) {
      console.error("Analytics API Error:", url, error);
      return fallback;
    }
  }

  function toNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  }

  function extractNumber(data, keys = []) {
    if (typeof data === "number") {
      return toNumber(data);
    }

    if (typeof data === "string") {
      return toNumber(data);
    }

    if (!data || typeof data !== "object") {
      return 0;
    }

    for (const key of keys) {
      if (data[key] !== undefined && data[key] !== null) {
        return toNumber(data[key]);
      }
    }

    return 0;
  }

  function normalizeCap(data) {
    if (!data) {
      return {
        name: "—",
        value: 0,
      };
    }

    if (Array.isArray(data)) {
      const first = data[0];

      if (!first) {
        return {
          name: "—",
          value: 0,
        };
      }

      if (typeof first === "object") {
        return {
          name: String(
            first.Player ||
              first.player ||
              first.Name ||
              first.name ||
              first.Batter ||
              first.Bowler ||
              "—"
          ),
          value: toNumber(
            first.Runs ??
              first.runs ??
              first.Wickets ??
              first.wickets ??
              first.value ??
              0
          ),
        };
      }

      return {
        name: String(first),
        value: 0,
      };
    }

    if (typeof data === "object") {
      const source =
        data.data &&
        typeof data.data === "object"
          ? data.data
          : data;

      const entries = Object.entries(source);

      if (!entries.length) {
        return {
          name: "—",
          value: 0,
        };
      }

      const [name, value] = entries[0];

      return {
        name: String(name),
        value: toNumber(value),
      };
    }

    return {
      name: String(data),
      value: 0,
    };
  }

  function normalizeWins(data) {
    let source = [];

    if (Array.isArray(data)) {
      source = data;
    } else if (data && typeof data === "object") {
      if (Array.isArray(data.data)) {
        source = data.data;
      } else {
        source = Object.entries(data).map(([team, wins]) => ({
          team,
          wins,
        }));
      }
    }

    const normalized = source
      .map((item) => {
        const team =
          item?.team ||
          item?.Team ||
          item?.team_name ||
          item?.TeamName ||
          item?.name ||
          item?.Name ||
          "";

        const wins =
          item?.wins ??
          item?.Wins ??
          item?.team_wins ??
          item?.TeamWins ??
          item?.value ??
          0;

        return {
          team: String(team),
          short:
            TEAM_SHORT[String(team)] ||
            String(team).slice(0, 4).toUpperCase(),
          wins: toNumber(wins),
        };
      })
      .filter((item) => CURRENT_TEAMS.includes(item.team))
      .sort((a, b) => b.wins - a.wins)
      .slice(0, 10);

    return normalized.length > 0
      ? normalized
      : FALLBACK_WINS.map((item) => ({
          ...item,
          short:
            TEAM_SHORT[item.team] ||
            item.team.slice(0, 4).toUpperCase(),
        }));
  }

  async function loadAnalytics() {
    try {
      setRefreshing(true);
      setApiError(false);

      const results = await Promise.allSettled([
        getData(`${BASE_URL}/total_matches`, 0),
        getData(`${BASE_URL}/total_teams`, 10),
        getData(`${BASE_URL}/total_players`, 0),
        getData(`${BASE_URL}/orange_cap`, null),
        getData(`${BASE_URL}/purple_cap`, null),
        getData(
          `${BASE_URL}/team_wins_chart`,
          FALLBACK_WINS
        ),
      ]);

      const [
        matchesResult,
        teamsResult,
        playersResult,
        orangeResult,
        purpleResult,
        winsResult,
      ] = results;

      setMatches(
        extractNumber(matchesResult.value, [
          "total_matches",
          "matches",
          "count",
          "value",
          "total",
        ])
      );

      setTeams(
        extractNumber(teamsResult.value, [
          "total_teams",
          "teams",
          "count",
          "value",
          "total",
        ]) || 10
      );

      setPlayers(
        extractNumber(playersResult.value, [
          "total_players",
          "players",
          "count",
          "value",
          "total",
        ])
      );

      setOrangeCap(
        normalizeCap(orangeResult.value)
      );

      setPurpleCap(
        normalizeCap(purpleResult.value)
      );

      setTeamWins(
        normalizeWins(winsResult.value)
      );

      if (
        results.some(
          (result) => result.status === "rejected"
        )
      ) {
        setApiError(true);
      }
    } catch (error) {
      console.error("Analytics Load Error:", error);

      setApiError(true);

      setTeamWins(
        FALLBACK_WINS.map((item) => ({
          ...item,
          short:
            TEAM_SHORT[item.team] ||
            item.team.slice(0, 4).toUpperCase(),
        }))
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const totalWins = useMemo(
    () =>
      teamWins.reduce(
        (total, item) => total + toNumber(item.wins),
        0
      ),
    [teamWins]
  );

  const topTeam = teamWins[0] || {
    team: "—",
    short: "—",
    wins: 0,
  };

  const topThree = teamWins.slice(0, 3);

  const trendData = useMemo(() => {
    let running = 0;

    return teamWins.map((item, index) => {
      running += item.wins;

      return {
        label: `T${index + 1}`,
        team: item.short,
        wins: item.wins,
        cumulative: running,
      };
    });
  }, [teamWins]);

  const pieData = teamWins.map((item) => ({
    name: item.short,
    value: item.wins,
  }));

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#050914] text-white">
      {/* =====================================================
          FIXED SIDEBAR
      ===================================================== */}

      <Sidebar />

      {/* =====================================================
          CONTENT SHELL
          Desktop ma exact 250px space reserve
      ===================================================== */}

      <div className="flex min-h-screen w-full min-w-0">
        {/* Desktop Sidebar Space */}
        <div className="hidden w-[250px] shrink-0 lg:block" />

        {/* Main Area */}
        <div className="min-w-0 flex-1 overflow-x-hidden">
          <Navbar />

          <main className="mx-auto w-full min-w-0 max-w-[1800px] overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
            {/* =================================================
                HEADER
            ================================================= */}

            <section className="mb-7">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                <div className="min-w-0">
                  <div className="mb-3 flex items-center gap-2">
                    <Activity
                      size={14}
                      className="text-blue-400"
                    />

                    <span className="text-[9px] font-black uppercase tracking-[2.5px] text-blue-400">
                      IPL Intelligence
                    </span>
                  </div>

                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                    Analytics Dashboard
                  </h1>

                  <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-500 sm:text-sm">
                    Comprehensive IPL insights and performance analytics
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="hidden items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 sm:flex">
                    <CalendarDays
                      size={14}
                      className="text-slate-500"
                    />

                    <span className="text-[9px] font-bold text-slate-400">
                      IPL Analytics
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={loadAnalytics}
                    disabled={refreshing}
                    className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-[9px] font-black uppercase tracking-wider text-slate-400 transition hover:border-blue-400/20 hover:text-blue-300 disabled:opacity-50"
                  >
                    <RefreshCw
                      size={14}
                      className={
                        refreshing
                          ? "animate-spin"
                          : ""
                      }
                    />

                    {refreshing
                      ? "Refreshing"
                      : "Refresh"}
                  </button>
                </div>
              </div>
            </section>

            {/* =================================================
                HERO
            ================================================= */}

            <section className="mb-7 overflow-hidden rounded-[28px] border border-white/[0.08] bg-gradient-to-br from-[#101a2c] via-[#0a1220] to-[#070b14]">
              <div className="relative p-6 sm:p-8 lg:p-10">
                <div className="pointer-events-none absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-blue-500/[0.08] blur-[130px]" />

                <div className="pointer-events-none absolute -bottom-40 left-[25%] h-[420px] w-[420px] rounded-full bg-purple-500/[0.07] blur-[130px]" />

                <div className="relative grid gap-7 xl:grid-cols-[1fr_420px]">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.05] px-3 py-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />

                      <span className="text-[8px] font-black uppercase tracking-[1.7px] text-emerald-300">
                        Analytics Engine Online
                      </span>
                    </div>

                    <h2 className="mt-6 max-w-3xl text-4xl font-black leading-[1.02] tracking-[-2px] sm:text-5xl lg:text-6xl">
                      Read the game.
                      <span className="block bg-gradient-to-r from-blue-300 via-purple-400 to-orange-400 bg-clip-text text-transparent">
                        Through the data.
                      </span>
                    </h2>

                    <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400">
                      Analyze team dominance, leaderboards and performance
                      signals from your IPL dataset in one premium workspace.
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

                  <div className="grid grid-cols-2 gap-3">
                    <HeroStat
                      icon={Trophy}
                      label="MATCHES"
                      value={
                        loading ? "..." : matches
                      }
                      accent="orange"
                    />

                    <HeroStat
                      icon={ShieldCheck}
                      label="TEAMS"
                      value={
                        loading ? "..." : teams
                      }
                      accent="blue"
                    />

                    <HeroStat
                      icon={Users}
                      label="PLAYERS"
                      value={
                        loading ? "..." : players
                      }
                      accent="purple"
                    />

                    <HeroStat
                      icon={BrainCircuit}
                      label="ENGINE"
                      value="READY"
                      accent="green"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                KPI
            ================================================= */}

            <section className="mb-7">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <MetricCard
                  title="Total Matches"
                  value={
                    loading ? "..." : matches
                  }
                  sub="Completed"
                  icon={Trophy}
                  accent="orange"
                />

                <MetricCard
                  title="Total Teams"
                  value={
                    loading ? "..." : teams
                  }
                  sub="Competing"
                  icon={ShieldCheck}
                  accent="blue"
                />

                <MetricCard
                  title="Total Players"
                  value={
                    loading ? "..." : players
                  }
                  sub="Registered"
                  icon={Users}
                  accent="purple"
                />

                <MetricCard
                  title="Orange Cap"
                  value={
                    loading
                      ? "..."
                      : orangeCap.name
                  }
                  sub={`${orangeCap.value || 0} Runs`}
                  icon={Flame}
                  accent="orange"
                  compact
                />

                <MetricCard
                  title="Purple Cap"
                  value={
                    loading
                      ? "..."
                      : purpleCap.name
                  }
                  sub={`${purpleCap.value || 0} Wickets`}
                  icon={Target}
                  accent="purple"
                  compact
                />
              </div>
            </section>

            {/* =================================================
                TEAM PERFORMANCE
            ================================================= */}

            <section className="mb-7">
              <ChartCard
                eyebrow="Team Performance"
                title="Wins Overview"
                description="Total historical wins recorded for each current IPL team."
                icon={BarChart3}
                badge="ALL TEAMS"
              >
                {teamWins.length > 0 ? (
                  <div className="h-[390px] w-full min-w-0">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <BarChart
                        data={teamWins}
                        margin={{
                          top: 15,
                          right: 15,
                          left: 0,
                          bottom: 85,
                        }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="rgba(255,255,255,0.07)"
                        />

                        <XAxis
                          dataKey="short"
                          interval={0}
                          tick={{
                            fill: "#64748b",
                            fontSize: 10,
                            fontWeight: 800,
                          }}
                          axisLine={false}
                          tickLine={false}
                        />

                        <YAxis
                          allowDecimals={false}
                          tick={{
                            fill: "#64748b",
                            fontSize: 10,
                          }}
                          axisLine={false}
                          tickLine={false}
                        />

                        <Tooltip
                          contentStyle={{
                            background: "#0b1220",
                            border:
                              "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "12px",
                            color: "#fff",
                          }}
                          labelFormatter={(label) =>
                            teamWins.find(
                              (item) =>
                                item.short === label
                            )?.team || label
                          }
                          formatter={(value) => [
                            `${Number(value).toLocaleString()} Wins`,
                            "Wins",
                          ]}
                        />

                        <Bar
                          dataKey="wins"
                          name="Wins"
                          fill="#4f46e5"
                          radius={[7, 7, 0, 0]}
                          maxBarSize={52}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyState />
                )}
              </ChartCard>
            </section>

            {/* =================================================
                PIE + TOP PERFORMERS
            ================================================= */}

            <section className="mb-7 grid min-w-0 gap-5 xl:grid-cols-2">
              <ChartCard
                eyebrow="Team Distribution"
                title="Wins Share"
                description="Distribution of total wins across the current 10 teams."
                icon={Target}
                badge="10 TEAMS"
              >
                <div className="h-[390px] w-full min-w-0">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="42%"
                        outerRadius={112}
                        innerRadius={62}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                        stroke="#07101d"
                        strokeWidth={2}
                      >
                        {pieData.map(
                          (entry, index) => (
                            <Cell
                              key={`${entry.name}-${index}`}
                              fill={
                                COLORS[
                                  index %
                                    COLORS.length
                                ]
                              }
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip
                        contentStyle={{
                          background: "#0b1220",
                          border:
                            "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "12px",
                          color: "#fff",
                        }}
                        formatter={(value) => [
                          `${Number(value).toLocaleString()} Wins`,
                          "Wins",
                        ]}
                      />

                      <Legend
                        verticalAlign="bottom"
                        height={60}
                        iconType="circle"
                        wrapperStyle={{
                          fontSize: "9px",
                          color: "#64748b",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              <ChartCard
                eyebrow="Top Performers"
                title="League Leaders"
                description="Leading players and teams from the current dataset."
                icon={Flame}
                badge="LEADERS"
              >
                <div className="space-y-3">
                  <PerformerRow
                    number="01"
                    label="Orange Cap"
                    player={orangeCap.name}
                    stat={
                      orangeCap.value
                        ? `${orangeCap.value} Runs`
                        : "—"
                    }
                    accent="orange"
                  />

                  <PerformerRow
                    number="02"
                    label="Purple Cap"
                    player={purpleCap.name}
                    stat={
                      purpleCap.value
                        ? `${purpleCap.value} Wickets`
                        : "—"
                    }
                    accent="purple"
                  />

                  {topThree.map(
                    (team, index) => (
                      <div
                        key={team.team}
                        className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-[9px] font-black text-slate-500">
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-slate-300">
                            {team.team}
                          </p>

                          <p className="mt-0.5 text-[8px] font-black uppercase tracking-wider text-slate-600">
                            Team Leaderboard
                          </p>
                        </div>

                        <p className="text-sm font-black text-blue-300">
                          {team.wins}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </ChartCard>
            </section>

            {/* =================================================
                INSIGHTS + SEASON STATS
            ================================================= */}

            <section className="mb-7 grid min-w-0 gap-5 xl:grid-cols-[1fr_1fr]">
              <ChartCard
                eyebrow="Key Insights"
                title="Analytics Signals"
                description="Important performance signals from the dataset."
                icon={Sparkles}
                badge="AI READY"
              >
                <div className="space-y-3">
                  <InsightRow
                    icon={Trophy}
                    title={topTeam.team}
                    text={`Most historical wins with ${topTeam.wins} victories.`}
                    accent="orange"
                  />

                  <InsightRow
                    icon={TrendingUp}
                    title="Winning Dominance"
                    text={`${topTeam.short} currently leads the team wins ranking.`}
                    accent="blue"
                  />

                  <InsightRow
                    icon={Flame}
                    title={orangeCap.name}
                    text={`Current Orange Cap leader with ${orangeCap.value || 0} runs.`}
                    accent="orange"
                  />

                  <InsightRow
                    icon={Target}
                    title={purpleCap.name}
                    text={`Current Purple Cap leader with ${purpleCap.value || 0} wickets.`}
                    accent="purple"
                  />
                </div>
              </ChartCard>

              <ChartCard
                eyebrow="Season Stats"
                title="Dataset Summary"
                description="Quick performance indicators from your connected IPL data."
                icon={Gauge}
                badge="SYSTEM"
              >
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-2">
                  <SmallStat
                    label="Total Wins"
                    value={totalWins}
                    icon={Trophy}
                    accent="blue"
                  />

                  <SmallStat
                    label="Teams"
                    value={teamWins.length}
                    icon={ShieldCheck}
                    accent="purple"
                  />

                  <SmallStat
                    label="Top Team"
                    value={topTeam.short}
                    icon={TrendingUp}
                    accent="green"
                  />

                  <SmallStat
                    label="Engine"
                    value="ON"
                    icon={Zap}
                    accent="orange"
                  />
                </div>

                <div className="mt-4 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2">
                    <Sparkles
                      size={13}
                      className="text-yellow-400"
                    />

                    <span className="text-[8px] font-black uppercase tracking-[1.8px] text-slate-600">
                      Dataset Intelligence
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-6 text-slate-500">
                    Analytics is using the current 10-team IPL
                    configuration and historical performance records.
                  </p>
                </div>
              </ChartCard>
            </section>

            {/* =================================================
                TREND
            ================================================= */}

            <section className="mb-7">
              <ChartCard
                eyebrow="Performance Trend"
                title="Team Wins Progression"
                description="Cumulative team-win movement across the ranked teams."
                icon={TrendingUp}
                badge="TREND"
              >
                <div className="h-[320px] w-full min-w-0">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <LineChart
                      data={trendData}
                      margin={{
                        top: 15,
                        right: 15,
                        left: 0,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.06)"
                      />

                      <XAxis
                        dataKey="label"
                        tick={{
                          fill: "#64748b",
                          fontSize: 9,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        tick={{
                          fill: "#64748b",
                          fontSize: 9,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        contentStyle={{
                          background: "#0b1220",
                          border:
                            "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "12px",
                          color: "#fff",
                        }}
                        formatter={(value) => [
                          `${Number(value).toLocaleString()}`,
                          "Cumulative Wins",
                        ]}
                      />

                      <Line
                        type="monotone"
                        dataKey="cumulative"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{
                          r: 5,
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </section>

            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="border-t border-white/[0.06] pt-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[2px] text-slate-700">
                    IPL Cricket Analytics
                  </p>

                  <p className="mt-1 text-[8px] text-slate-800">
                    Data-driven cricket intelligence platform
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-wider text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  System Operational
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   CHART CARD
========================================================= */

function ChartCard({
  eyebrow,
  title,
  description,
  icon: Icon,
  badge,
  children,
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-[24px] border border-white/[0.07] bg-white/[0.035] backdrop-blur-xl">
      <div className="border-b border-white/[0.05] p-5 sm:p-6">
        <div className="flex min-w-0 items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03]">
              <Icon
                size={18}
                className="text-blue-400"
              />
            </div>

            <div className="min-w-0">
              <p className="text-[8px] font-black uppercase tracking-[2px] text-slate-600">
                {eyebrow}
              </p>

              <h3 className="mt-1 truncate text-lg font-black sm:text-xl">
                {title}
              </h3>

              <p className="mt-1 text-[10px] leading-5 text-slate-600">
                {description}
              </p>
            </div>
          </div>

          {badge && (
            <span className="shrink-0 rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-1.5 text-[7px] font-black uppercase tracking-wider text-slate-600">
              {badge}
            </span>
          )}
        </div>
      </div>

      <div className="p-3 sm:p-5">
        <div className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.04] bg-black/[0.10] p-2 sm:p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   HERO BADGE
========================================================= */

function HeroBadge({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-2">
      <Icon
        size={12}
        className="text-slate-400"
      />

      <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500">
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
  accent,
}) {
  const styles = {
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
      className={`rounded-2xl border p-4 ${
        styles[accent] || styles.blue
      }`}
    >
      <div className="flex items-center justify-between">
        <Icon size={16} />

        <span className="text-[7px] font-black uppercase tracking-wider opacity-50">
          Live
        </span>
      </div>

      <p className="mt-4 text-[8px] font-black uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-1 truncate text-xl font-black text-white">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({
  title,
  value,
  sub,
  icon: Icon,
  accent,
  compact = false,
}) {
  const colors = {
    orange:
      "border-orange-400/10 bg-orange-500/10 text-orange-400",
    blue:
      "border-blue-400/10 bg-blue-500/10 text-blue-400",
    purple:
      "border-purple-400/10 bg-purple-500/10 text-purple-400",
  };

  return (
    <div className="group min-w-0 overflow-hidden rounded-[22px] border border-white/[0.07] bg-white/[0.035] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/[0.12]">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
          colors[accent] || colors.blue
        }`}
      >
        <Icon size={19} />
      </div>

      <p className="mt-5 truncate text-[8px] font-black uppercase tracking-[1.7px] text-slate-600">
        {title}
      </p>

      <p
        className={`mt-2 truncate font-black text-white ${
          compact
            ? "text-base sm:text-lg"
            : "text-3xl"
        }`}
        title={String(value)}
      >
        {value}
      </p>

      <p className="mt-1 truncate text-[9px] text-slate-700">
        {sub}
      </p>

      <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/[0.05]">
        <div
          className={`h-full w-[75%] rounded-full ${
            accent === "purple"
              ? "bg-purple-500"
              : accent === "blue"
              ? "bg-blue-500"
              : "bg-orange-500"
          } opacity-60`}
        />
      </div>
    </div>
  );
}

/* =========================================================
   PERFORMER ROW
========================================================= */

function PerformerRow({
  number,
  label,
  player,
  stat,
  accent,
}) {
  const isOrange = accent === "orange";

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 sm:p-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
          isOrange
            ? "border-orange-400/10 bg-orange-500/10 text-orange-400"
            : "border-purple-400/10 bg-purple-500/10 text-purple-400"
        }`}
      >
        <span className="text-[9px] font-black">
          {number}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`text-[7px] font-black uppercase tracking-[1.8px] ${
            isOrange
              ? "text-orange-400"
              : "text-purple-400"
          }`}
        >
          {label}
        </p>

        <p
          className="mt-1 truncate text-sm font-black text-white"
          title={player}
        >
          {player}
        </p>
      </div>

      <p
        className={`shrink-0 text-sm font-black ${
          isOrange
            ? "text-orange-300"
            : "text-purple-300"
        }`}
      >
        {stat}
      </p>
    </div>
  );
}

/* =========================================================
   INSIGHT ROW
========================================================= */

function InsightRow({
  icon: Icon,
  title,
  text,
  accent,
}) {
  const colors = {
    orange:
      "bg-orange-500/10 text-orange-400",
    blue:
      "bg-blue-500/10 text-blue-400",
    purple:
      "bg-purple-500/10 text-purple-400",
  };

  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          colors[accent] || colors.blue
        }`}
      >
        <Icon size={15} />
      </div>

      <div className="min-w-0">
        <p className="truncate text-xs font-black text-slate-300">
          {title}
        </p>

        <p className="mt-1 text-[10px] leading-5 text-slate-600">
          {text}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   SMALL STAT
========================================================= */

function SmallStat({
  label,
  value,
  icon: Icon,
  accent,
}) {
  const colors = {
    orange:
      "bg-orange-500/10 text-orange-400",
    blue:
      "bg-blue-500/10 text-blue-400",
    purple:
      "bg-purple-500/10 text-purple-400",
    green:
      "bg-emerald-500/10 text-emerald-400",
  };

  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
          colors[accent] || colors.blue
        }`}
      >
        <Icon size={14} />
      </div>

      <p className="mt-3 text-[7px] font-black uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-1 truncate text-base font-black text-white">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState() {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-5xl">
          📊
        </div>

        <h3 className="text-lg font-black text-slate-300">
          No analytics data available
        </h3>

        <p className="mt-2 text-xs text-slate-600">
          Try refreshing the analytics data.
        </p>
      </div>
    </div>
  );
}

export default Analytics;