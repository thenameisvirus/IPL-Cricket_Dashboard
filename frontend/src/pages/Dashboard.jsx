import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  Trophy,
  Users,
  Target,
  ShieldCheck,
  Flame,
  RefreshCw,
  AlertCircle,
  UserRound,
  BarChart3,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TeamWinsChart from "../components/TeamWinsChart";
import CustomPieChart from "../components/PieChart";
import PlayerSearch from "../components/PlayerSearch";
import BASE_URL from "../services/api";

function Dashboard() {
  const [matches, setMatches] = useState(0);
  const [teams, setTeams] = useState(0);
  const [players, setPlayers] = useState(0);

  const [orangeCap, setOrangeCap] = useState(null);
  const [purpleCap, setPurpleCap] = useState(null);

  const [topBatsmen, setTopBatsmen] = useState([]);
  const [topBowlers, setTopBowlers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function safeGet(url, fallback = null) {
    try {
      const response = await axios.get(url);
      return response?.data ?? fallback;
    } catch (err) {
      console.error("API ERROR:", url, err);
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
      ] = await Promise.all([
        safeGet(`${BASE_URL}/total_matches`, 0),
        safeGet(`${BASE_URL}/total_teams`, 0),
        safeGet(`${BASE_URL}/total_players`, 0),
        safeGet(`${BASE_URL}/orange_cap`, null),
        safeGet(`${BASE_URL}/purple_cap`, null),
        safeGet(`${BASE_URL}/top_batsman`, {}),
        safeGet(`${BASE_URL}/top_bowlers`, {}),
      ]);

      console.log("MATCHES:", matchesData);
      console.log("TEAMS:", teamsData);
      console.log("PLAYERS:", playersData);
      console.log("ORANGE:", orangeData);
      console.log("PURPLE:", purpleData);
      console.log("BATSMEN:", batsmenData);
      console.log("BOWLERS:", bowlersData);

      setMatches(extractNumber(matchesData));
      setTeams(extractNumber(teamsData));
      setPlayers(extractNumber(playersData));

      setOrangeCap(normalizeCap(orangeData));
      setPurpleCap(normalizeCap(purpleData));

      const batsmen = normalizeBatsmen(batsmenData);
      const bowlers = normalizeBowlers(bowlersData);

      setTopBatsmen(batsmen);
      setTopBowlers(bowlers);

      if (batsmen.length === 0 && bowlers.length === 0) {
        setError("Batting and bowling data not available.");
      }
    } catch (err) {
      console.error("Dashboard Error:", err);
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  const battingChartData = useMemo(() => {
    return topBatsmen.map((item) => ({
      name: item.name,
      value: item.value,
    }));
  }, [topBatsmen]);

  const bowlingChartData = useMemo(() => {
    return topBowlers.map((item) => ({
      name: item.name,
      value: item.value,
    }));
  }, [topBowlers]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#050914] text-white">
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div className="min-h-screen min-w-0 w-full lg:ml-[250px] lg:w-[calc(100vw-250px)]">
        {/* =====================================================
            NAVBAR
        ===================================================== */}

        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <main className="mx-auto w-full min-w-0 max-w-[1800px] overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-7 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full bg-orange-500" />

                <span className="text-[9px] font-black uppercase tracking-[3px] text-orange-400">
                  IPL Analytics
                </span>
              </div>

              <h1 className="truncate text-3xl font-black tracking-tight text-white sm:text-4xl">
                Cricket Dashboard
              </h1>

              <p className="mt-2 max-w-xl text-xs leading-5 text-slate-500 sm:text-sm">
                Explore IPL matches, teams, players, batting and bowling
                performance from your dataset.
              </p>
            </div>

            <button
              type="button"
              onClick={loadDashboard}
              disabled={loading}
              className="flex w-fit shrink-0 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-[9px] font-black uppercase tracking-wider text-slate-400 transition hover:border-orange-400/20 hover:text-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mb-6 flex min-w-0 items-start gap-3 rounded-2xl border border-red-400/10 bg-red-500/[0.05] p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <AlertCircle size={17} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-black text-red-300">
                  Dashboard Data Notice
                </p>

                <p className="mt-1 break-words text-[10px] text-red-400/70">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* =================================================
              STAT CARDS
          ================================================= */}

          <div className="grid w-full min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <MetricCard
              title="Total Matches"
              value={loading ? "..." : String(matches)}
              icon={Trophy}
              color="orange"
            />

            <MetricCard
              title="Total Teams"
              value={loading ? "..." : String(teams)}
              icon={ShieldCheck}
              color="blue"
            />

            <MetricCard
              title="Total Players"
              value={loading ? "..." : String(players)}
              icon={Users}
              color="purple"
            />

            <MetricCard
              title="Orange Cap"
              value={
                loading
                  ? "..."
                  : orangeCap?.name || "N/A"
              }
              icon={Target}
              color="orange"
              compact
            />

            <MetricCard
              title="Purple Cap"
              value={
                loading
                  ? "..."
                  : purpleCap?.name || "N/A"
              }
              icon={Flame}
              color="purple"
              compact
            />
          </div>

          {/* =================================================
              CAP CARDS
          ================================================= */}

          <div className="mt-6 grid w-full min-w-0 gap-4 lg:grid-cols-2">
            {/* ORANGE CAP */}

            <div className="min-w-0 overflow-hidden rounded-[22px] border border-orange-400/10 bg-gradient-to-br from-orange-500/[0.07] to-[#0a101d] p-5">
              <div className="flex min-w-0 items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[8px] font-black uppercase tracking-[2px] text-orange-400">
                    Orange Cap
                  </p>

                  <h2
                    className="mt-2 truncate text-xl font-black text-white"
                    title={orangeCap?.name || "No Data"}
                  >
                    {orangeCap?.name || "No Data"}
                  </h2>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
                  <Trophy size={21} />
                </div>
              </div>

              <div className="mt-5">
                <p className="text-[8px] font-black uppercase tracking-wider text-slate-600">
                  Total Runs
                </p>

                <p className="mt-1 text-3xl font-black text-orange-300">
                  {Number(orangeCap?.value) || 0}
                </p>
              </div>
            </div>

            {/* PURPLE CAP */}

            <div className="min-w-0 overflow-hidden rounded-[22px] border border-purple-400/10 bg-gradient-to-br from-purple-500/[0.07] to-[#0a101d] p-5">
              <div className="flex min-w-0 items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[8px] font-black uppercase tracking-[2px] text-purple-400">
                    Purple Cap
                  </p>

                  <h2
                    className="mt-2 truncate text-xl font-black text-white"
                    title={purpleCap?.name || "No Data"}
                  >
                    {purpleCap?.name || "No Data"}
                  </h2>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
                  <Flame size={21} />
                </div>
              </div>

              <div className="mt-5">
                <p className="text-[8px] font-black uppercase tracking-wider text-slate-600">
                  Total Wickets
                </p>

                <p className="mt-1 text-3xl font-black text-purple-300">
                  {Number(purpleCap?.value) || 0}
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              BATTING + BOWLING
          ================================================= */}

          <div className="mt-6 grid w-full min-w-0 gap-5 xl:grid-cols-2">
            {/* TOP BATSMEN */}

            <div className="min-w-0 overflow-hidden rounded-[22px] border border-white/[0.06] bg-[#080e1a] p-5">
              <div className="mb-5 flex min-w-0 items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[8px] font-black uppercase tracking-[2px] text-orange-400">
                    Batting
                  </p>

                  <h2 className="truncate text-lg font-black text-white">
                    Top 10 Batsmen
                  </h2>
                </div>

                <Target
                  size={19}
                  className="shrink-0 text-orange-400"
                />
              </div>

              {battingChartData.length > 0 ? (
                <div className="h-[390px] w-full min-w-0">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
                      data={battingChartData}
                      margin={{
                        top: 10,
                        right: 15,
                        left: 0,
                        bottom: 75,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="rgba(255,255,255,0.08)"
                      />

                      <XAxis
                        dataKey="name"
                        interval={0}
                        angle={-35}
                        textAnchor="end"
                        height={85}
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
                        formatter={(value) => [
                          `${Number(value).toLocaleString()} Runs`,
                          "Runs",
                        ]}
                        labelFormatter={(label) =>
                          String(label)
                        }
                        contentStyle={{
                          background: "#0b1220",
                          border:
                            "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "12px",
                          color: "#fff",
                        }}
                      />

                      <Bar
                        dataKey="value"
                        name="Runs"
                        fill="#f97316"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={45}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState text="No batting data available" />
              )}
            </div>

            {/* TOP BOWLERS */}

            <div className="min-w-0 overflow-hidden rounded-[22px] border border-white/[0.06] bg-[#080e1a] p-5">
              <div className="mb-5 flex min-w-0 items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[8px] font-black uppercase tracking-[2px] text-purple-400">
                    Bowling
                  </p>

                  <h2 className="truncate text-lg font-black text-white">
                    Top 10 Bowlers
                  </h2>
                </div>

                <ShieldCheck
                  size={19}
                  className="shrink-0 text-purple-400"
                />
              </div>

              {bowlingChartData.length > 0 ? (
                <div className="h-[390px] w-full min-w-0">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
                      data={bowlingChartData}
                      margin={{
                        top: 10,
                        right: 15,
                        left: 0,
                        bottom: 75,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="rgba(255,255,255,0.08)"
                      />

                      <XAxis
                        dataKey="name"
                        interval={0}
                        angle={-35}
                        textAnchor="end"
                        height={85}
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
                        formatter={(value) => [
                          `${Number(value).toLocaleString()} Wickets`,
                          "Wickets",
                        ]}
                        labelFormatter={(label) =>
                          String(label)
                        }
                        contentStyle={{
                          background: "#0b1220",
                          border:
                            "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "12px",
                          color: "#fff",
                        }}
                      />

                      <Bar
                        dataKey="value"
                        name="Wickets"
                        fill="#a855f7"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={45}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState text="No bowling data available" />
              )}
            </div>
          </div>

          {/* =================================================
              TOP BATSMEN TABLE
          ================================================= */}

          <div className="mt-6 min-w-0 overflow-hidden rounded-[22px] border border-white/[0.06] bg-[#080e1a] p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[8px] font-black uppercase tracking-[2px] text-orange-400">
                  Leaderboard
                </p>

                <h2 className="mt-1 text-lg font-black text-white">
                  Top Batsmen
                </h2>
              </div>

              <UserRound
                size={19}
                className="shrink-0 text-orange-400"
              />
            </div>

            {topBatsmen.length > 0 ? (
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="px-4 py-3 text-left text-[8px] font-black uppercase tracking-wider text-slate-600">
                        #
                      </th>

                      <th className="px-4 py-3 text-left text-[8px] font-black uppercase tracking-wider text-slate-600">
                        Player
                      </th>

                      <th className="px-4 py-3 text-right text-[8px] font-black uppercase tracking-wider text-slate-600">
                        Runs
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {topBatsmen.map((item, index) => (
                      <tr
                        key={`${item.name}-${index}`}
                        className="border-b border-white/[0.04] transition hover:bg-white/[0.02]"
                      >
                        <td className="px-4 py-4 text-xs font-black text-slate-600">
                          {String(index + 1).padStart(2, "0")}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-[9px] font-black text-orange-400">
                              {getInitials(item.name)}
                            </div>

                            <span className="whitespace-nowrap text-xs font-bold text-slate-300">
                              {item.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-right text-sm font-black text-orange-300">
                          {Number(item.value || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState text="No batting data available" />
            )}
          </div>

          {/* =================================================
              TEAM CHARTS
          ================================================= */}

          <div className="mt-6 grid w-full min-w-0 gap-5 xl:grid-cols-2">
            <div className="min-w-0 overflow-hidden rounded-[22px] border border-white/[0.06] bg-[#080e1a] p-5">
              <div className="mb-5 flex items-center gap-3">
                <BarChart3
                  size={19}
                  className="text-blue-400"
                />

                <h2 className="text-lg font-black text-white">
                  Team Performance
                </h2>
              </div>

              <div className="min-w-0 max-w-full overflow-hidden">
                <TeamWinsChart />
              </div>
            </div>

            <div className="min-w-0 overflow-hidden rounded-[22px] border border-white/[0.06] bg-[#080e1a] p-5">
              <div className="mb-5 flex items-center gap-3">
                <BarChart3
                  size={19}
                  className="text-emerald-400"
                />

                <h2 className="text-lg font-black text-white">
                  Team Distribution
                </h2>
              </div>

              <div className="min-w-0 max-w-full overflow-hidden">
                <CustomPieChart />
              </div>
            </div>
          </div>

          {/* =================================================
              PLAYER SEARCH
          ================================================= */}

          <div className="mt-6 min-w-0 max-w-full">
            <PlayerSearch />
          </div>
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({
  title,
  value,
  icon: Icon,
  color = "orange",
  compact = false,
}) {
  const styles = {
    orange: {
      icon: "border-orange-400/10 bg-orange-500/10 text-orange-400",
      glow: "bg-orange-500/[0.05]",
      bar: "from-orange-700 to-orange-300",
    },

    blue: {
      icon: "border-blue-400/10 bg-blue-500/10 text-blue-400",
      glow: "bg-blue-500/[0.05]",
      bar: "from-blue-700 to-blue-300",
    },

    purple: {
      icon: "border-purple-400/10 bg-purple-500/10 text-purple-400",
      glow: "bg-purple-500/[0.05]",
      bar: "from-purple-700 to-purple-300",
    },
  };

  const style = styles[color] || styles.orange;

  return (
    <div className="group relative min-w-0 w-full overflow-hidden rounded-[22px] border border-white/[0.07] bg-white/[0.035] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/[0.12]">
      <div
        className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-3xl ${style.glow}`}
      />

      <div className="relative min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${style.icon}`}
          >
            <Icon size={20} />
          </div>

          <span className="shrink-0 text-[8px] font-black uppercase tracking-wider text-slate-600">
            Live Data
          </span>
        </div>

        <p className="mt-5 truncate text-[9px] font-black uppercase tracking-[1.8px] text-slate-600">
          {title}
        </p>

        <h3
          className={`mt-2 min-w-0 truncate font-black tracking-tight text-white ${
            compact
              ? "text-xl sm:text-2xl"
              : "text-3xl"
          }`}
          title={String(value)}
        >
          {value}
        </h3>

        <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/[0.05]">
          <div
            className={`h-full w-[72%] rounded-full bg-gradient-to-r ${style.bar} opacity-60`}
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   NUMBER EXTRACTOR
========================================================= */

function extractNumber(data) {
  if (typeof data === "number") {
    return Number.isFinite(data) ? data : 0;
  }

  if (typeof data === "string") {
    const value = Number(data);
    return Number.isFinite(value) ? value : 0;
  }

  if (!data || typeof data !== "object") {
    return 0;
  }

  const keys = [
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

  for (const key of keys) {
    if (
      data[key] !== undefined &&
      data[key] !== null
    ) {
      const value = Number(data[key]);

      if (Number.isFinite(value)) {
        return value;
      }
    }
  }

  return 0;
}

/* =========================================================
   BATSMEN NORMALIZER
========================================================= */

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
        name: String(name),
        value: Number(value) || 0,
      }))
      .filter(
        (item) =>
          item.name &&
          item.name !== "undefined" &&
          Number.isFinite(item.value)
      )
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }

  if (Array.isArray(data)) {
    return data
      .map((item) => {
        if (!item) {
          return null;
        }

        if (
          typeof item === "object" &&
          !Array.isArray(item)
        ) {
          const name =
            item.Batter ||
            item.batter ||
            item.Player ||
            item.player ||
            item.Name ||
            item.name;

          const value =
            item.Runs ??
            item.runs ??
            item.BatsmanRun ??
            item.value ??
            0;

          return {
            name: String(name || ""),
            value: Number(value) || 0,
          };
        }

        return null;
      })
      .filter(
        (item) =>
          item &&
          item.name &&
          item.name !== "undefined"
      )
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }

  return [];
}

/* =========================================================
   BOWLERS NORMALIZER
========================================================= */

function normalizeBowlers(data) {
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
        name: String(name),
        value: Number(value) || 0,
      }))
      .filter(
        (item) =>
          item.name &&
          item.name !== "undefined" &&
          Number.isFinite(item.value)
      )
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }

  if (Array.isArray(data)) {
    return data
      .map((item) => {
        if (!item) {
          return null;
        }

        if (
          typeof item === "object" &&
          !Array.isArray(item)
        ) {
          const name =
            item.Bowler ||
            item.bowler ||
            item.Player ||
            item.player ||
            item.Name ||
            item.name;

          const value =
            item.Wickets ??
            item.wickets ??
            item.value ??
            0;

          return {
            name: String(name || ""),
            value: Number(value) || 0,
          };
        }

        return null;
      })
      .filter(
        (item) =>
          item &&
          item.name &&
          item.name !== "undefined"
      )
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }

  return [];
}

/* =========================================================
   CAP NORMALIZER
========================================================= */

function normalizeCap(data) {
  if (!data) {
    return null;
  }

  if (Array.isArray(data)) {
    if (!data.length) {
      return null;
    }

    const item = data[0];

    if (
      typeof item === "object" &&
      !Array.isArray(item)
    ) {
      const name =
        item.Player ||
        item.player ||
        item.Name ||
        item.name ||
        item.Batter ||
        item.Bowler;

      const value =
        item.Runs ??
        item.Wickets ??
        item.value ??
        item.runs ??
        item.wickets ??
        0;

      return {
        name: String(name || "N/A"),
        value: Number(value) || 0,
      };
    }
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
      return null;
    }

    const [name, value] = entries[0];

    return {
      name: String(name),
      value: Number(value) || 0,
    };
  }

  return null;
}

/* =========================================================
   INITIALS
========================================================= */

function getInitials(name) {
  const value = String(name || "").trim();

  if (!value) {
    return "PL";
  }

  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({ text }) {
  return (
    <div className="flex min-h-[260px] w-full flex-col items-center justify-center rounded-2xl border border-white/[0.04] bg-white/[0.015] px-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.03]">
        <AlertCircle
          size={20}
          className="text-slate-700"
        />
      </div>

      <p className="mt-3 text-xs font-bold text-slate-500">
        {text}
      </p>

      <p className="mt-1 text-[9px] text-slate-700">
        Check the backend API response.
      </p>
    </div>
  );
}

/* Compatibility alias */
function EmptyData({ text }) {
  return <EmptyState text={text} />;
}

export default Dashboard;