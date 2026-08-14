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
  Zap,
  TrendingUp,
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

const COLORS = [
  "#f97316",
  "#a855f7",
  "#3b82f6",
  "#06b6d4",
  "#10b981",
  "#ec4899",
  "#eab308",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
];

function Analytics() {
  const [matches, setMatches] = useState(0);
  const [teams, setTeams] = useState(10);
  const [players, setPlayers] = useState(0);

  const [orangeCap, setOrangeCap] = useState("—");
  const [purpleCap, setPurpleCap] = useState("—");

  const [teamWins, setTeamWins] = useState(
    FALLBACK_WINS
  );

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function getData(url, fallback) {
    try {
      const response = await axios.get(url);
      return response?.data ?? fallback;
    } catch (error) {
      console.error("API ERROR:", url, error);
      return fallback;
    }
  }

  function numberValue(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function extractNumber(data, keys) {
    if (typeof data === "number") {
      return numberValue(data);
    }

    if (typeof data === "string") {
      return numberValue(data);
    }

    if (!data || typeof data !== "object") {
      return 0;
    }

    for (const key of keys) {
      if (
        data[key] !== undefined &&
        data[key] !== null
      ) {
        const value = numberValue(data[key]);

        if (value || value === 0) {
          return value;
        }
      }
    }

    return 0;
  }

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
            first.Name ||
            first.name ||
            first.Batter ||
            first.Bowler ||
            "—"
        );
      }

      return String(first);
    }

    return String(data);
  }

  function normalizeWins(data) {
    let items = [];

    if (Array.isArray(data)) {
      items = data;
    } else if (
      data &&
      typeof data === "object"
    ) {
      if (Array.isArray(data.data)) {
        items = data.data;
      } else {
        items = Object.entries(data).map(
          ([team, wins]) => ({
            team,
            wins,
          })
        );
      }
    }

    const normalized = items
      .map((item) => {
        const team =
          item?.team ||
          item?.Team ||
          item?.team_name ||
          item?.TeamName ||
          item?.name ||
          item?.Name;

        const wins =
          item?.wins ??
          item?.Wins ??
          item?.team_wins ??
          item?.TeamWins ??
          item?.value ??
          0;

        return {
          team: String(team || ""),
          wins: numberValue(wins),
        };
      })
      .filter(
        (item) =>
          CURRENT_TEAMS.includes(item.team)
      );

    if (normalized.length > 0) {
      return normalized.sort(
        (a, b) => b.wins - a.wins
      );
    }

    return FALLBACK_WINS;
  }

  async function loadAnalytics() {
    try {
      setRefreshing(true);
      setApiError(false);

      const results =
        await Promise.allSettled([
          getData(
            `${BASE_URL}/total_matches`,
            0
          ),
          getData(
            `${BASE_URL}/total_teams`,
            10
          ),
          getData(
            `${BASE_URL}/total_players`,
            0
          ),
          getData(
            `${BASE_URL}/orange_cap`,
            null
          ),
          getData(
            `${BASE_URL}/purple_cap`,
            null
          ),
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
        extractNumber(
          matchesResult.value,
          [
            "total_matches",
            "matches",
            "count",
            "value",
            "total",
          ]
        )
      );

      setTeams(
        extractNumber(
          teamsResult.value,
          [
            "total_teams",
            "teams",
            "count",
            "value",
            "total",
          ]
        ) || 10
      );

      setPlayers(
        extractNumber(
          playersResult.value,
          [
            "total_players",
            "players",
            "count",
            "value",
            "total",
          ]
        )
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
          (result) =>
            result.status === "rejected"
        )
      ) {
        setApiError(true);
      }
    } catch (error) {
      console.error(
        "Analytics ERROR:",
        error
      );

      setApiError(true);
      setTeamWins(FALLBACK_WINS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const totalWins = useMemo(() => {
    return teamWins.reduce(
      (total, item) =>
        total + numberValue(item.wins),
      0
    );
  }, [teamWins]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050816] text-white">
      <Sidebar />

      <div className="min-h-screen lg:ml-[250px]">
        <Navbar />

        <main className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-6 lg:px-8">
          {/* HEADER */}
          <section className="mb-8">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-400" />

                  <span className="text-[9px] font-black uppercase tracking-[2.5px] text-blue-400">
                    IPL Intelligence Center
                  </span>
                </div>

                <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                  Advanced Analytics
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                  Explore team dominance, player performance
                  and IPL statistics in one analytics workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={loadAnalytics}
                disabled={refreshing}
                className="flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-bold text-slate-300 transition hover:border-blue-400/30 hover:text-white disabled:opacity-50"
              >
                <RefreshCw
                  size={15}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                {refreshing
                  ? "Refreshing..."
                  : "Refresh Data"}
              </button>
            </div>
          </section>

          {/* API STATUS */}
          <section className="mb-7 rounded-[24px] border border-emerald-400/10 bg-emerald-500/[0.04] p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Activity
                    size={18}
                    className="text-emerald-400"
                  />
                </div>

                <div>
                  <p className="text-xs font-black text-emerald-300">
                    Analytics Engine
                  </p>

                  <p className="mt-1 text-[10px] text-slate-600">
                    {apiError
                      ? "Using protected fallback data"
                      : "Backend data connected"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-300">
                  {loading
                    ? "Loading"
                    : "Connected"}
                </span>
              </div>
            </div>
          </section>

          {/* KPI CARDS */}
          <section className="mb-8">
            <div className="mb-4">
              <p className="text-[9px] font-black uppercase tracking-[2px] text-slate-600">
                Overview
              </p>

              <h2 className="mt-1 text-2xl font-black">
                Key Metrics
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <Metric
                icon={Trophy}
                title="Matches"
                value={matches}
                accent="orange"
              />

              <Metric
                icon={ShieldCheck}
                title="Teams"
                value={teams}
                accent="blue"
              />

              <Metric
                icon={Users}
                title="Players"
                value={players}
                accent="purple"
              />

              <Metric
                icon={Flame}
                title="Orange Cap"
                value={orangeCap}
                accent="orange"
              />

              <Metric
                icon={Target}
                title="Purple Cap"
                value={purpleCap}
                accent="purple"
              />
            </div>
          </section>

          {/* TEAM PERFORMANCE */}
          <section className="mb-8">
            <div className="mb-4">
              <p className="text-[9px] font-black uppercase tracking-[2px] text-blue-400">
                Performance
              </p>

              <h2 className="mt-1 text-2xl font-black">
                Team Performance
              </h2>

              <p className="mt-1 text-xs text-slate-600">
                Historical winning records of the current 10 IPL teams.
              </p>
            </div>

            <div className="overflow-hidden rounded-[26px] border border-white/[0.07] bg-white/[0.035] p-4 sm:p-6">
              <div className="h-[420px] w-full">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={teamWins}
                    margin={{
                      top: 20,
                      right: 20,
                      left: 0,
                      bottom: 90,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="rgba(255,255,255,0.08)"
                    />

                    <XAxis
                      dataKey="team"
                      interval={0}
                      angle={-35}
                      textAnchor="end"
                      height={100}
                      tick={{
                        fill: "#64748b",
                        fontSize: 10,
                        fontWeight: 700,
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
                      cursor={{
                        fill: "rgba(255,255,255,0.03)",
                      }}
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

                    <Bar
                      dataKey="wins"
                      name="Wins"
                      fill="#3b82f6"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={55}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* PIE + SUMMARY */}
          <section className="mb-8 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            {/* PIE */}
            <div className="overflow-hidden rounded-[26px] border border-white/[0.07] bg-white/[0.035] p-4 sm:p-6">
              <div className="mb-4">
                <p className="text-[9px] font-black uppercase tracking-[2px] text-purple-400">
                  Distribution
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  Team Wins Distribution
                </h2>

                <p className="mt-1 text-xs text-slate-600">
                  Visual share of historical team wins.
                </p>
              </div>

              <div className="h-[420px] w-full">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>
                    <Pie
                      data={teamWins}
                      cx="50%"
                      cy="45%"
                      outerRadius={125}
                      innerRadius={65}
                      paddingAngle={2}
                      dataKey="wins"
                      nameKey="team"
                      stroke="rgba(5,8,22,0.9)"
                      strokeWidth={2}
                    >
                      {teamWins.map(
                        (entry, index) => (
                          <Cell
                            key={`${entry.team}-${index}`}
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
                      height={65}
                      iconType="circle"
                      wrapperStyle={{
                        fontSize: "9px",
                        color: "#64748b",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* SUMMARY */}
            <div className="overflow-hidden rounded-[26px] border border-white/[0.07] bg-gradient-to-br from-[#0e1727] to-[#080d18] p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-400/10 bg-orange-500/10">
                  <BrainCircuit
                    size={19}
                    className="text-orange-400"
                  />
                </div>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-[2px] text-orange-400">
                    Intelligence
                  </p>

                  <h2 className="mt-1 text-xl font-black">
                    Team Insights
                  </h2>
                </div>
              </div>

              <div className="mt-7 space-y-4">
                <InsightRow
                  label="Most Wins"
                  value={
                    teamWins[0]?.team ||
                    "—"
                  }
                  icon={Trophy}
                  color="orange"
                />

                <InsightRow
                  label="Wins"
                  value={
                    teamWins[0]?.wins ??
                    0
                  }
                  icon={TrendingUp}
                  color="blue"
                />

                <InsightRow
                  label="Total Wins"
                  value={totalWins}
                  icon={BarChart3}
                  color="purple"
                />

                <InsightRow
                  label="Teams Analysed"
                  value={teamWins.length}
                  icon={ShieldCheck}
                  color="green"
                />
              </div>

              <div className="mt-7 rounded-2xl border border-white/[0.06] bg-black/[0.15] p-5">
                <div className="flex items-center gap-2">
                  <Sparkles
                    size={14}
                    className="text-yellow-400"
                  />

                  <span className="text-[9px] font-black uppercase tracking-[2px] text-slate-500">
                    Dataset Status
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Analytics is currently processing performance
                  records for the latest 10 IPL teams configured in
                  your system.
                </p>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="border-t border-white/[0.06] pt-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[9px] font-black uppercase tracking-[1.8px] text-slate-700">
                IPL Cricket Analytics
              </p>

              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-wider text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Analytics Ready
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

function Metric({
  icon: Icon,
  title,
  value,
  accent,
}) {
  const styles = {
    orange:
      "border-orange-400/10 bg-orange-500/10 text-orange-400",
    blue:
      "border-blue-400/10 bg-blue-500/10 text-blue-400",
    purple:
      "border-purple-400/10 bg-purple-500/10 text-purple-400",
  };

  return (
    <div className="overflow-hidden rounded-[22px] border border-white/[0.07] bg-white/[0.035] p-5">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
          styles[accent] || styles.orange
        }`}
      >
        <Icon size={20} />
      </div>

      <p className="mt-5 text-[8px] font-black uppercase tracking-[1.8px] text-slate-600">
        {title}
      </p>

      <p
        className="mt-2 truncate text-xl font-black text-white"
        title={String(value)}
      >
        {value}
      </p>
    </div>
  );
}

function InsightRow({
  label,
  value,
  icon: Icon,
  color,
}) {
  const colorClasses = {
    orange: "text-orange-400 bg-orange-500/10",
    blue: "text-blue-400 bg-blue-500/10",
    purple:
      "text-purple-400 bg-purple-500/10",
    green:
      "text-emerald-400 bg-emerald-500/10",
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            colorClasses[color] ||
            colorClasses.blue
          }`}
        >
          <Icon size={15} />
        </div>

        <span className="truncate text-xs font-bold text-slate-500">
          {label}
        </span>
      </div>

      <span
        className="max-w-[55%] truncate text-sm font-black text-white"
        title={String(value)}
      >
        {value}
      </span>
    </div>
  );
}

export default Analytics;