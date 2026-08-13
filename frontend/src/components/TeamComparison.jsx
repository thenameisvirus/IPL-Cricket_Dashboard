import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  Swords,
  Trophy,
  Sparkles,
  ShieldCheck,
  Target,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Crown,
  Activity,
  Medal,
  X,
} from "lucide-react";

import BASE_URL from "../services/api";

function TeamComparison() {
  const [teams, setTeams] = useState([]);
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTeams();
  }, []);

  async function loadTeams() {
    try {
      setDataLoading(true);
      setError("");

      const res = await axios.get(`${BASE_URL}/teams`);

      const raw = res?.data;

      let teamData = [];

      if (Array.isArray(raw)) {
        teamData = raw;
      } else if (Array.isArray(raw?.teams)) {
        teamData = raw.teams;
      } else if (Array.isArray(raw?.data)) {
        teamData = raw.data;
      }

      teamData = teamData
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          if (item && typeof item === "object") {
            return (
              item.team_name ||
              item.team ||
              item.name ||
              item.Team ||
              ""
            );
          }

          return "";
        })
        .filter(Boolean);

      const uniqueTeams = [...new Set(teamData)];

      setTeams(uniqueTeams);

      if (uniqueTeams.length >= 2) {
        setTeam1(uniqueTeams[0]);
        setTeam2(uniqueTeams[1]);
      }
    } catch (err) {
      console.error("Team loading error:", err);
      setError("Unable to load teams.");
      setTeams([]);
    } finally {
      setDataLoading(false);
    }
  }

  async function compare() {
    if (!team1 || !team2) {
      setError("Please select both teams.");
      return;
    }

    if (team1 === team2) {
      setError("Please select two different teams.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const res = await axios.get(
        `${BASE_URL}/compare_teams`,
        {
          params: {
            team1,
            team2,
          },
        }
      );

      setResult(res?.data ?? null);
    } catch (err) {
      console.error("Comparison error:", err);

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Comparison failed. Please check the backend."
      );
    } finally {
      setLoading(false);
    }
  }

  function resetComparison() {
    setResult(null);
    setError("");

    if (teams.length >= 2) {
      setTeam1(teams[0]);
      setTeam2(teams[1]);
    }
  }

  const resultEntries = useMemo(() => {
    if (!result || typeof result !== "object") {
      return [];
    }

    return Object.entries(result);
  }, [result]);

  return (
    <section className="relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-gradient-to-br from-[#111827] via-[#0b1220] to-[#070b13] shadow-[0_30px_100px_rgba(0,0,0,0.35)]">

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -right-32 top-[25%] h-96 w-96 rounded-full bg-purple-500/[0.08] blur-[120px]" />

        <div className="absolute -bottom-32 left-[30%] h-80 w-80 rounded-full bg-orange-500/[0.06] blur-[110px]" />

        <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-blue-500/[0.045] blur-[110px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />

      </div>

      <div className="relative p-5 sm:p-7 lg:p-9">

        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="flex flex-col gap-5 border-b border-white/[0.06] pb-7 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-start gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-400/15 bg-blue-500/10 shadow-[0_0_35px_rgba(59,130,246,0.08)]">

              <Swords
                size={27}
                className="text-blue-400"
              />

            </div>

            <div className="min-w-0">

              <div className="flex items-center gap-2">

                <Sparkles
                  size={13}
                  className="text-blue-400"
                />

                <span className="text-[9px] font-black uppercase tracking-[2.5px] text-blue-400">
                  Team Intelligence
                </span>

              </div>

              <h2 className="mt-1.5 text-2xl font-black tracking-tight sm:text-3xl">
                Team Comparison
              </h2>

              <p className="mt-1.5 max-w-xl text-xs leading-5 text-slate-500 sm:text-sm">
                Compare two IPL teams using historical performance data.
              </p>

            </div>

          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.05] px-3 py-2">

            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
            </span>

            <span className="text-[9px] font-black uppercase tracking-[1.5px] text-emerald-300">
              Analytics Ready
            </span>

          </div>

        </div>

        {/* ===================================================
            ERROR
        ==================================================== */}

        {error && (
          <div className="mt-6 flex items-start justify-between gap-4 rounded-2xl border border-red-400/10 bg-red-500/[0.05] p-4">

            <div className="flex items-start gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10">

                <Activity
                  size={16}
                  className="text-red-400"
                />

              </div>

              <div>

                <p className="text-xs font-black text-red-300">
                  Comparison issue
                </p>

                <p className="mt-1 text-[10px] leading-5 text-red-400/60">
                  {error}
                </p>

              </div>

            </div>

            {result && (
              <button
                type="button"
                onClick={() => setError("")}
                className="text-slate-600 transition hover:text-slate-300"
              >
                <X size={15} />
              </button>
            )}

          </div>
        )}

        {/* ===================================================
            LOADING TEAMS
        ==================================================== */}

        {dataLoading ? (
          <div className="flex min-h-[340px] flex-col items-center justify-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/10 bg-blue-500/[0.06]">

              <Loader2
                size={30}
                className="animate-spin text-blue-400"
              />

            </div>

            <p className="mt-5 text-sm font-black text-slate-300">
              Loading Team Intelligence
            </p>

            <p className="mt-2 text-xs text-slate-600">
              Preparing comparison engine...
            </p>

          </div>
        ) : teams.length < 2 ? (
          <div className="flex min-h-[340px] items-center justify-center">

            <div className="text-center">

              <ShieldCheck
                size={40}
                className="mx-auto text-slate-600"
              />

              <h3 className="mt-4 text-lg font-black text-white">
                Teams Unavailable
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                Unable to load enough teams for comparison.
              </p>

              <button
                type="button"
                onClick={loadTeams}
                className="mt-5 rounded-xl bg-blue-500 px-5 py-2.5 text-xs font-black text-white transition hover:bg-blue-400"
              >
                Reload Teams
              </button>

            </div>

          </div>
        ) : (
          <>
            {/* =================================================
                TEAM SELECTION
            ================================================== */}

            <div className="mt-7">

              <div className="mb-4 flex items-center justify-between">

                <div>

                  <p className="text-[9px] font-black uppercase tracking-[2px] text-slate-600">
                    Comparison Setup
                  </p>

                  <h3 className="mt-1 text-lg font-black text-white">
                    Choose your teams
                  </h3>

                </div>

                {result && (
                  <button
                    type="button"
                    onClick={resetComparison}
                    className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[8px] font-black uppercase tracking-wider text-slate-500 transition hover:border-blue-400/20 hover:text-blue-300"
                  >
                    Reset
                  </button>
                )}

              </div>

              <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">

                <TeamSelect
                  label="Team 01"
                  value={team1}
                  onChange={setTeam1}
                  teams={teams}
                  accent="orange"
                />

                <div className="hidden h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.035] lg:flex">

                  <Swords
                    size={18}
                    className="text-slate-500"
                  />

                </div>

                <div className="flex items-center justify-center lg:hidden">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.035]">

                    <Swords
                      size={15}
                      className="text-slate-500"
                    />

                  </div>

                </div>

                <TeamSelect
                  label="Team 02"
                  value={team2}
                  onChange={setTeam2}
                  teams={teams}
                  accent="blue"
                />

              </div>

            </div>

            {/* =================================================
                PREVIEW
            ================================================== */}

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.06] bg-black/[0.18]">

              <div className="border-b border-white/[0.05] px-4 py-4 sm:px-5">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <BarChart3
                      size={14}
                      className="text-purple-400"
                    />

                    <span className="text-[9px] font-black uppercase tracking-[2px] text-slate-500">
                      Comparison Preview
                    </span>

                  </div>

                  <span className="text-[8px] font-black uppercase tracking-wider text-slate-700">
                    Historical Data
                  </span>

                </div>

              </div>

              <div className="p-4 sm:p-5">

                <div className="grid gap-4 md:grid-cols-2">

                  <PreviewTeam
                    team={team1}
                    accent="orange"
                    number="01"
                  />

                  <PreviewTeam
                    team={team2}
                    accent="blue"
                    number="02"
                  />

                </div>

              </div>

            </div>

            {/* =================================================
                COMPARE BUTTON
            ================================================== */}

            <button
              type="button"
              onClick={compare}
              disabled={loading}
              className="group mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-purple-500 px-6 py-4 text-sm font-black text-white shadow-[0_12px_35px_rgba(59,130,246,0.15)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(59,130,246,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  ANALYSING TEAMS...
                </>
              ) : (
                <>
                  <Swords
                    size={18}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />

                  COMPARE TEAMS

                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </>
              )}

            </button>

            {/* =================================================
                RESULT
            ================================================== */}

            {result && (
              <div className="mt-8">

                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-500/10">

                      <CheckCircle2
                        size={21}
                        className="text-emerald-400"
                      />

                    </div>

                    <div>

                      <p className="text-[9px] font-black uppercase tracking-[2px] text-emerald-400">
                        Analysis Complete
                      </p>

                      <h3 className="mt-1 text-lg font-black">
                        Team Performance Breakdown
                      </h3>

                    </div>

                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-2">

                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                    <span className="text-[8px] font-black uppercase tracking-wider text-slate-600">
                      Result Ready
                    </span>

                  </div>

                </div>

                {/* TEAM RESULT HEADER */}

                <div className="mb-5 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">

                  <ResultTeam
                    team={team1}
                    accent="orange"
                  />

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025]">

                    <Swords
                      size={17}
                      className="text-slate-500"
                    />

                  </div>

                  <ResultTeam
                    team={team2}
                    accent="blue"
                  />

                </div>

                {/* RESULT CARDS */}

                {resultEntries.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">

                    {resultEntries.map(
                      ([key, value], index) => (
                        <ResultCard
                          key={`${key}-${index}`}
                          label={key}
                          value={value}
                          index={index}
                        />
                      )
                    )}

                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-8 text-center">

                    <Target
                      size={25}
                      className="mx-auto text-slate-600"
                    />

                    <p className="mt-3 text-sm font-bold text-slate-500">
                      Comparison result data unavailable.
                    </p>

                  </div>
                )}

              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
}

/* =========================================================
   TEAM SELECT
========================================================= */

function TeamSelect({
  label,
  value,
  onChange,
  teams,
  accent,
}) {
  const styles = {
    orange: {
      icon:
        "border-orange-400/10 bg-orange-500/10 text-orange-400",
      focus:
        "focus:border-orange-400/30 focus:ring-4 focus:ring-orange-400/[0.04]",
    },

    blue: {
      icon:
        "border-blue-400/10 bg-blue-500/10 text-blue-400",
      focus:
        "focus:border-blue-400/30 focus:ring-4 focus:ring-blue-400/[0.04]",
    },
  };

  const style =
    styles[accent] || styles.orange;

  return (
    <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 transition duration-300 hover:border-white/[0.10] hover:bg-white/[0.035]">

      <div className="mb-4 flex items-center gap-3">

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl border ${style.icon}`}
        >
          <ShieldCheck size={16} />
        </div>

        <div>

          <p className="text-[8px] font-black uppercase tracking-[1.8px] text-slate-600">
            Select
          </p>

          <p className="text-xs font-black text-slate-300">
            {label}
          </p>

        </div>

      </div>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className={`w-full cursor-pointer rounded-xl border border-white/[0.08] bg-[#0b1220] px-4 py-3.5 text-sm font-semibold text-slate-200 outline-none transition ${style.focus}`}
      >

        {teams.map((team, index) => (
          <option
            key={`${team}-${index}`}
            value={team}
            className="bg-[#0b1220] text-white"
          >
            {team}
          </option>
        ))}

      </select>

    </div>
  );
}

/* =========================================================
   PREVIEW TEAM
========================================================= */

function PreviewTeam({
  team,
  accent,
  number,
}) {
  const styles = {
    orange: {
      border: "border-orange-400/10",
      bg: "bg-orange-500/[0.05]",
      text: "text-orange-400",
      badge: "bg-orange-500/10",
    },

    blue: {
      border: "border-blue-400/10",
      bg: "bg-blue-500/[0.05]",
      text: "text-blue-400",
      badge: "bg-blue-500/10",
    },
  };

  const style =
    styles[accent] || styles.orange;

  const initials = String(team || "TM")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${style.border} ${style.bg} p-4 sm:p-5`}
    >

      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/[0.02] blur-3xl" />

      <div className="relative flex items-center gap-4">

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${style.border} ${style.badge} text-xs font-black ${style.text}`}
        >
          {initials || number}
        </div>

        <div className="min-w-0 flex-1">

          <div className="flex items-center gap-2">

            <span
              className={`text-[8px] font-black uppercase tracking-[1.5px] ${style.text}`}
            >
              Team {number}
            </span>

          </div>

          <p
            className="mt-1 truncate text-base font-black text-white"
            title={team}
          >
            {team || "Not selected"}
          </p>

        </div>

        <Trophy
          size={18}
          className={`${style.text} shrink-0 opacity-60`}
        />

      </div>

    </div>
  );
}

/* =========================================================
   RESULT TEAM
========================================================= */

function ResultTeam({
  team,
  accent,
}) {
  const isOrange =
    accent === "orange";

  return (
    <div
      className={`rounded-2xl border p-4 text-center ${
        isOrange
          ? "border-orange-400/10 bg-orange-500/[0.05]"
          : "border-blue-400/10 bg-blue-500/[0.05]"
      }`}
    >

      <p
        className={`text-[8px] font-black uppercase tracking-[1.6px] ${
          isOrange
            ? "text-orange-400"
            : "text-blue-400"
        }`}
      >
        Selected Team
      </p>

      <p className="mt-2 truncate text-lg font-black text-white">
        {team}
      </p>

    </div>
  );
}

/* =========================================================
   RESULT CARD
========================================================= */

function ResultCard({
  label,
  value,
  index,
}) {
  const icons = [
    Trophy,
    TrendingUp,
    Target,
    BarChart3,
    ShieldCheck,
    Swords,
    Medal,
    Crown,
  ];

  const colors = [
    "orange",
    "blue",
    "purple",
    "cyan",
    "emerald",
    "pink",
    "amber",
    "indigo",
  ];

  const Icon =
    icons[index % icons.length];

  const color =
    colors[index % colors.length];

  const colorStyles = {
    orange:
      "border-orange-400/10 bg-orange-500/[0.05] text-orange-400",

    blue:
      "border-blue-400/10 bg-blue-500/[0.05] text-blue-400",

    purple:
      "border-purple-400/10 bg-purple-500/[0.05] text-purple-400",

    cyan:
      "border-cyan-400/10 bg-cyan-500/[0.05] text-cyan-400",

    emerald:
      "border-emerald-400/10 bg-emerald-500/[0.05] text-emerald-400",

    pink:
      "border-pink-400/10 bg-pink-500/[0.05] text-pink-400",

    amber:
      "border-amber-400/10 bg-amber-500/[0.05] text-amber-400",

    indigo:
      "border-indigo-400/10 bg-indigo-500/[0.05] text-indigo-400",
  };

  return (
    <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-white/[0.10] hover:bg-white/[0.035]">

      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">

          <p className="text-[8px] font-black uppercase tracking-[2px] text-slate-600">
            Comparison Metric
          </p>

          <p
            className="mt-2 truncate text-xs font-bold text-slate-400"
            title={label}
          >
            {label}
          </p>

        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${colorStyles[color]}`}
        >
          <Icon size={17} />
        </div>

      </div>

      <div className="mt-5 border-t border-white/[0.05] pt-4">

        <p
          className="break-words text-2xl font-black text-white"
          title={String(value)}
        >
          {formatValue(value)}
        </p>

      </div>

    </div>
  );
}

/* =========================================================
   FORMAT RESULT
========================================================= */

function formatValue(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value.toLocaleString();
  }

  if (
    typeof value === "object"
  ) {
    try {
      return JSON.stringify(value);
    } catch {
      return "—";
    }
  }

  return String(value);
}

export default TeamComparison;