import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  BrainCircuit,
  Trophy,
  Sparkles,
  Target,
  MapPin,
  Coins,
  Zap,
  CheckCircle2,
  Loader2,
  Swords,
  Activity,
  ShieldCheck,
  TrendingUp,
  RotateCcw,
  ChevronDown,
  Gauge,
  Crown,
} from "lucide-react";

import BASE_URL from "../services/api";

/* =========================================================
   CURRENT IPL TEAMS - ONLY 10
========================================================= */

const CURRENT_TEAMS = [
  "Chennai Super Kings",
  "Delhi Capitals",
  "Gujarat Titans",
  "Kolkata Knight Riders",
  "Lucknow Super Giants",
  "Mumbai Indians",
  "Punjab Kings",
  "Rajasthan Royals",
  "Royal Challengers Bengaluru",
  "Sunrisers Hyderabad",
];

/* =========================================================
   CURRENT IPL HOME VENUES - ONLY 10
========================================================= */

const CURRENT_VENUES = [
  "M. A. Chidambaram Stadium",
  "Arun Jaitley Stadium",
  "Narendra Modi Stadium",
  "Eden Gardens",
  "BRSABV Ekana Cricket Stadium",
  "Wankhede Stadium",
  "New International Cricket Stadium, Mullanpur",
  "Sawai Mansingh Stadium",
  "M. Chinnaswamy Stadium",
  "Rajiv Gandhi International Cricket Stadium, Uppal",
];

function MatchPrediction() {
  const [teams, setTeams] = useState([]);
  const [venues, setVenues] = useState([]);

  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [tossWinner, setTossWinner] = useState("");
  const [tossDecision, setTossDecision] = useState("bat");
  const [venue, setVenue] = useState("");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  /* =======================================================
     LOAD DATA
  ======================================================== */

  async function loadData() {
    try {
      setDataLoading(true);
      setError("");

      /*
        Existing backend endpoints are still called,
        but dropdowns ALWAYS use our fixed 10 teams
        and fixed 10 venues.
      */
      await Promise.allSettled([
        axios.get(`${BASE_URL}/teams`),
        axios.get(`${BASE_URL}/venues`),
      ]);

      setTeams(CURRENT_TEAMS);
      setVenues(CURRENT_VENUES);

      setTeam1(CURRENT_TEAMS[0]);
      setTeam2(CURRENT_TEAMS[1]);
      setTossWinner(CURRENT_TEAMS[0]);
      setVenue(CURRENT_VENUES[0]);
    } catch (error) {
      console.error(
        "Prediction data loading error:",
        error
      );

      /*
        Even if backend team/venue endpoints fail,
        UI still keeps only the current 10 teams
        and current 10 venues.
      */
      setTeams(CURRENT_TEAMS);
      setVenues(CURRENT_VENUES);

      setTeam1(CURRENT_TEAMS[0]);
      setTeam2(CURRENT_TEAMS[1]);
      setTossWinner(CURRENT_TEAMS[0]);
      setVenue(CURRENT_VENUES[0]);
    } finally {
      setDataLoading(false);
    }
  }

  /* =======================================================
     PREDICT WINNER
  ======================================================== */

  async function predictWinner() {
    setError("");

    if (
      !team1 ||
      !team2 ||
      !tossWinner ||
      !venue
    ) {
      setError(
        "Please select all match details before predicting."
      );
      return;
    }

    if (team1 === team2) {
      setError(
        "Team 1 and Team 2 must be different."
      );
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const res = await axios.get(
        `${BASE_URL}/predict_match`,
        {
          params: {
            team1,
            team2,
            toss_winner: tossWinner,
            toss_decision: tossDecision,
            venue,
          },
        }
      );

      setResult(res?.data ?? null);
    } catch (error) {
      console.error(
        "Prediction error:",
        error
      );

      setError(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Prediction failed. Please check the backend."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =======================================================
     RESET
  ======================================================== */

  function resetPrediction() {
    setResult(null);
    setError("");

    setTeam1(CURRENT_TEAMS[0]);
    setTeam2(CURRENT_TEAMS[1]);
    setTossWinner(CURRENT_TEAMS[0]);
    setTossDecision("bat");
    setVenue(CURRENT_VENUES[0]);
  }

  /* =======================================================
     RESULT DATA
  ======================================================== */

  const probabilities =
    result?.["Winning Probability"] ||
    result?.winning_probability ||
    result?.probabilities ||
    {};

  const predictedWinner =
    result?.["Predicted Winner"] ||
    result?.predicted_winner ||
    result?.winner ||
    "";

  const probabilityEntries = useMemo(() => {
    if (
      !probabilities ||
      typeof probabilities !== "object"
    ) {
      return [];
    }

    return Object.entries(probabilities)
      .map(([team, probability]) => {
        const numeric = parseFloat(
          String(probability)
            .replace("%", "")
            .trim()
        );

        return {
          team,
          probability: Number.isFinite(numeric)
            ? numeric
            : 0,
          numeric: Math.min(
            100,
            Math.max(
              0,
              Number.isFinite(numeric)
                ? numeric
                : 0
            )
          ),
        };
      })
      .sort(
        (a, b) =>
          b.numeric - a.numeric
      );
  }, [probabilities]);

  const winnerProbability =
    probabilityEntries.find(
      (item) =>
        normalizeTeamName(item.team) ===
        normalizeTeamName(predictedWinner)
    )?.numeric || 0;

  const team1Probability =
    findTeamProbability(
      probabilityEntries,
      team1
    );

  const team2Probability =
    findTeamProbability(
      probabilityEntries,
      team2
    );

  return (
    <div className="relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#050911] text-white shadow-[0_35px_120px_rgba(0,0,0,0.45)]">

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -right-40 -top-40 h-[440px] w-[440px] rounded-full bg-orange-500/[0.075] blur-[125px]" />

        <div className="absolute -bottom-40 -left-40 h-[440px] w-[440px] rounded-full bg-purple-600/[0.065] blur-[125px]" />

        <div className="absolute left-[45%] top-[35%] h-[320px] w-[320px] rounded-full bg-blue-500/[0.035] blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

      </div>

      <div className="relative p-5 sm:p-7 lg:p-9">

        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="flex flex-col gap-6 border-b border-white/[0.06] pb-7 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-start gap-4">

            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[20px] border border-orange-400/20 bg-gradient-to-br from-orange-500/15 to-amber-400/[0.04] shadow-[0_0_40px_rgba(249,115,22,0.10)]">

              <div className="absolute inset-0 bg-orange-400/[0.035]" />

              <BrainCircuit
                size={29}
                className="relative text-orange-400"
              />

            </div>

            <div className="min-w-0">

              <div className="flex flex-wrap items-center gap-2">

                <Sparkles
                  size={13}
                  className="text-orange-400"
                />

                <span className="text-[9px] font-black uppercase tracking-[2.5px] text-orange-400">
                  Machine Learning Engine
                </span>

              </div>

              <h2 className="mt-1.5 text-2xl font-black tracking-[-0.6px] sm:text-3xl">
                AI Match Prediction
              </h2>

              <p className="mt-1.5 max-w-xl text-xs leading-6 text-slate-500 sm:text-sm">
                Configure a current IPL match and let the
                prediction engine estimate the most likely winner.
              </p>

            </div>

          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.05] px-4 py-2.5">

            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
            </span>

            <span className="text-[9px] font-black uppercase tracking-[1.5px] text-emerald-300">
              {loading
                ? "Model Running"
                : "Model Ready"}
            </span>

          </div>

        </div>

        {/* ===================================================
            DATA LOADING
        ==================================================== */}

        {dataLoading ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-400/10 bg-orange-500/[0.07]">

              <Loader2
                size={30}
                className="animate-spin text-orange-400"
              />

            </div>

            <p className="mt-5 text-sm font-black text-slate-300">
              Loading Prediction Engine
            </p>

            <p className="mt-2 text-xs text-slate-600">
              Preparing current IPL teams and venues...
            </p>

          </div>
        ) : (
          <>
            {/* =================================================
                ERROR
            ================================================== */}

            {error && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-400/10 bg-red-500/[0.05] p-4">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10">

                  <Activity
                    size={16}
                    className="text-red-400"
                  />

                </div>

                <div className="min-w-0">

                  <p className="text-xs font-black text-red-300">
                    Prediction issue
                  </p>

                  <p className="mt-1 break-words text-[10px] leading-5 text-red-400/70">
                    {error}
                  </p>

                </div>

              </div>
            )}

            {/* =================================================
                CONFIGURATION
            ================================================== */}

            <div className="mt-8">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                <div>

                  <div className="flex items-center gap-2">

                    <Activity
                      size={14}
                      className="text-orange-400"
                    />

                    <span className="text-[9px] font-black uppercase tracking-[2.2px] text-orange-400">
                      Match Configuration
                    </span>

                  </div>

                  <h3 className="mt-2 text-xl font-black sm:text-2xl">
                    Build Your Match
                  </h3>

                  <p className="mt-1 text-xs text-slate-600">
                    Current IPL teams and selected home venues only.
                  </p>

                </div>

                {result && (
                  <button
                    type="button"
                    onClick={resetPrediction}
                    className="flex w-fit items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-[9px] font-black uppercase tracking-wider text-slate-400 transition hover:border-orange-400/20 hover:text-orange-300"
                  >

                    <RotateCcw size={13} />

                    Reset

                  </button>
                )}

              </div>

              {/* TEAMS */}

              <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">

                <PredictionSelect
                  icon={Trophy}
                  label="Team 01"
                  value={team1}
                  onChange={(value) => {
                    if (value === team2) {
                      const alternative =
                        teams.find(
                          (team) =>
                            team !== value
                        );

                      if (alternative) {
                        setTeam2(alternative);
                      }
                    }

                    setTeam1(value);

                    if (
                      tossWinner !== value &&
                      tossWinner !== team2
                    ) {
                      setTossWinner(value);
                    }
                  }}
                  options={teams}
                  accent="orange"
                />

                <div className="hidden items-center justify-center lg:flex">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025]">

                    <Swords
                      size={18}
                      className="text-slate-500"
                    />

                  </div>

                </div>

                <div className="flex items-center justify-center lg:hidden">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025]">

                    <Swords
                      size={15}
                      className="text-slate-500"
                    />

                  </div>

                </div>

                <PredictionSelect
                  icon={Trophy}
                  label="Team 02"
                  value={team2}
                  onChange={(value) => {
                    if (value === team1) {
                      const alternative =
                        teams.find(
                          (team) =>
                            team !== value
                        );

                      if (alternative) {
                        setTeam1(alternative);
                      }
                    }

                    setTeam2(value);
                  }}
                  options={teams}
                  accent="blue"
                />

              </div>

              {/* TEAM SHOWCASE */}

              <div className="mt-5 grid gap-3 sm:grid-cols-2">

                <TeamShowcase
                  team={team1}
                  accent="orange"
                  label="TEAM 01"
                />

                <TeamShowcase
                  team={team2}
                  accent="blue"
                  label="TEAM 02"
                />

              </div>

              {/* DETAILS */}

              <div className="mt-5 grid gap-4 md:grid-cols-2">

                <PredictionSelect
                  icon={Coins}
                  label="Toss Winner"
                  value={tossWinner}
                  onChange={setTossWinner}
                  options={[
                    team1,
                    team2,
                  ].filter(Boolean)}
                  accent="purple"
                />

                <PredictionSelect
                  icon={Zap}
                  label="Toss Decision"
                  value={tossDecision}
                  onChange={setTossDecision}
                  options={[
                    {
                      value: "bat",
                      label: "Bat First",
                    },
                    {
                      value: "field",
                      label: "Field First",
                    },
                  ]}
                  accent="yellow"
                  objectOptions
                />

                <div className="md:col-span-2">

                  <PredictionSelect
                    icon={MapPin}
                    label="Match Venue"
                    value={venue}
                    onChange={setVenue}
                    options={venues}
                    accent="green"
                  />

                </div>

              </div>

            </div>

            {/* =================================================
                MATCH SNAPSHOT
            ================================================== */}

            <div className="mt-6 overflow-hidden rounded-[25px] border border-white/[0.07] bg-gradient-to-br from-white/[0.03] to-black/[0.18]">

              <div className="border-b border-white/[0.05] px-5 py-4">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <Target
                      size={14}
                      className="text-blue-400"
                    />

                    <span className="text-[9px] font-black uppercase tracking-[2px] text-slate-500">
                      Match Snapshot
                    </span>

                  </div>

                  <span className="rounded-full border border-blue-400/10 bg-blue-500/[0.05] px-3 py-1 text-[7px] font-black uppercase tracking-wider text-blue-300">
                    AI INPUT
                  </span>

                </div>

              </div>

              <div className="p-5 sm:p-6">

                <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">

                  <MatchTeamHero
                    team={team1}
                    accent="orange"
                    probability={
                      result
                        ? team1Probability
                        : null
                    }
                  />

                  <div className="mx-auto flex flex-col items-center">

                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/[0.08] bg-black/[0.25]">

                      <Swords
                        size={19}
                        className="text-slate-500"
                      />

                    </div>

                    <span className="mt-2 text-[7px] font-black uppercase tracking-[2px] text-slate-700">
                      VS
                    </span>

                  </div>

                  <MatchTeamHero
                    team={team2}
                    accent="blue"
                    probability={
                      result
                        ? team2Probability
                        : null
                    }
                  />

                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">

                  <MiniInfo
                    icon={Coins}
                    label="Toss"
                    value={
                      tossWinner ||
                      "Not selected"
                    }
                  />

                  <MiniInfo
                    icon={Zap}
                    label="Decision"
                    value={
                      tossDecision === "bat"
                        ? "Bat First"
                        : "Field First"
                    }
                  />

                  <MiniInfo
                    icon={MapPin}
                    label="Venue"
                    value={
                      venue ||
                      "Not selected"
                    }
                  />

                </div>

              </div>

            </div>

            {/* =================================================
                PREDICT BUTTON
            ================================================== */}

            <button
              type="button"
              onClick={predictWinner}
              disabled={loading}
              className="group mt-6 flex w-full items-center justify-center gap-3 rounded-[19px] bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 px-6 py-4 text-sm font-black text-black shadow-[0_16px_45px_rgba(249,115,22,0.15)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(249,115,22,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  ANALYSING MATCH...
                </>
              ) : (
                <>
                  <BrainCircuit
                    size={18}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />

                  PREDICT WINNER

                  <Sparkles
                    size={15}
                    className="transition-transform duration-300 group-hover:rotate-12"
                  />
                </>
              )}

            </button>

            {/* =================================================
                RESULT
            ================================================== */}

            {result && (
              <PredictionResult
                predictedWinner={predictedWinner}
                probabilityEntries={probabilityEntries}
                winnerProbability={winnerProbability}
                team1={team1}
                team2={team2}
              />
            )}

          </>
        )}

      </div>
    </div>
  );
}

/* =========================================================
   SELECT
========================================================= */

function PredictionSelect({
  icon: Icon,
  label,
  value,
  onChange,
  options,
  accent = "orange",
  objectOptions = false,
}) {
  const accentStyles = {
    orange: {
      icon:
        "border-orange-400/10 bg-orange-500/10 text-orange-400",
      focus:
        "focus:border-orange-400/30 focus:ring-orange-400/[0.04]",
    },

    blue: {
      icon:
        "border-blue-400/10 bg-blue-500/10 text-blue-400",
      focus:
        "focus:border-blue-400/30 focus:ring-blue-400/[0.04]",
    },

    purple: {
      icon:
        "border-purple-400/10 bg-purple-500/10 text-purple-400",
      focus:
        "focus:border-purple-400/30 focus:ring-purple-400/[0.04]",
    },

    yellow: {
      icon:
        "border-yellow-400/10 bg-yellow-500/10 text-yellow-400",
      focus:
        "focus:border-yellow-400/30 focus:ring-yellow-400/[0.04]",
    },

    green: {
      icon:
        "border-emerald-400/10 bg-emerald-500/10 text-emerald-400",
      focus:
        "focus:border-emerald-400/30 focus:ring-emerald-400/[0.04]",
    },
  };

  const style =
    accentStyles[accent] ||
    accentStyles.orange;

  return (
    <div className="group rounded-[20px] border border-white/[0.06] bg-white/[0.025] p-4 transition duration-300 hover:border-white/[0.10] hover:bg-white/[0.035]">

      <div className="mb-3 flex items-center gap-3">

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl border ${style.icon}`}
        >
          <Icon size={16} />
        </div>

        <div className="min-w-0">

          <p className="text-[8px] font-black uppercase tracking-[1.8px] text-slate-600">
            Match Input
          </p>

          <p className="mt-0.5 truncate text-xs font-black text-slate-300">
            {label}
          </p>

        </div>

      </div>

      <div className="relative">

        <select
          value={value}
          onChange={(e) =>
            onChange(
              e.target.value
            )
          }
          className={`w-full cursor-pointer appearance-none rounded-xl border border-white/[0.08] bg-[#0a111d] px-4 py-3.5 pr-10 text-sm font-semibold text-slate-200 outline-none transition focus:ring-4 ${style.focus}`}
        >

          {options.length === 0 && (
            <option
              value=""
              className="bg-[#0b1220] text-slate-500"
            >
              No options available
            </option>
          )}

          {options.map(
            (option, index) => {
              if (
                objectOptions
              ) {
                return (
                  <option
                    key={`${option.value}-${index}`}
                    value={option.value}
                    className="bg-[#0b1220] text-white"
                  >
                    {option.label}
                  </option>
                );
              }

              return (
                <option
                  key={`${option}-${index}`}
                  value={option}
                  className="bg-[#0b1220] text-white"
                >
                  {option}
                </option>
              );
            }
          )}

        </select>

        <ChevronDown
          size={15}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600"
        />

      </div>

    </div>
  );
}

/* =========================================================
   TEAM SHOWCASE
========================================================= */

function TeamShowcase({
  team,
  accent,
  label,
}) {
  const isOrange =
    accent === "orange";

  const initials = String(
    team || "TEAM"
  )
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(
      (word) => word[0]
    )
    .join("")
    .toUpperCase();

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-4 ${
        isOrange
          ? "border-orange-400/10 bg-orange-500/[0.045]"
          : "border-blue-400/10 bg-blue-500/[0.045]"
      }`}
    >

      <div
        className={`absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl ${
          isOrange
            ? "bg-orange-500/[0.07]"
            : "bg-blue-500/[0.07]"
        }`}
      />

      <div className="relative flex items-center gap-3">

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-xs font-black ${
            isOrange
              ? "border-orange-400/10 bg-orange-500/10 text-orange-300"
              : "border-blue-400/10 bg-blue-500/10 text-blue-300"
          }`}
        >
          {initials}
        </div>

        <div className="min-w-0">

          <p
            className={`text-[7px] font-black uppercase tracking-[1.6px] ${
              isOrange
                ? "text-orange-400"
                : "text-blue-400"
            }`}
          >
            {label}
          </p>

          <p
            className="mt-1 truncate text-sm font-black text-white"
            title={team}
          >
            {team}
          </p>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   MATCH TEAM
========================================================= */

function MatchTeamHero({
  team,
  accent,
  probability,
}) {
  const isOrange =
    accent === "orange";

  const code =
    CURRENT_TEAMS.find(
      (item) =>
        normalizeTeamName(item) ===
        normalizeTeamName(team)
    )?.split(" ")
      .map(
        (word) => word[0]
      )
      .join("")
      .slice(0, 3)
      .toUpperCase() ||
    String(team || "TM")
      .split(" ")
      .map(
        (word) => word[0]
      )
      .join("")
      .slice(0, 3)
      .toUpperCase();

  return (
    <div
      className={`relative overflow-hidden rounded-[22px] border p-5 ${
        isOrange
          ? "border-orange-400/10 bg-gradient-to-br from-orange-500/[0.07] to-black/[0.2]"
          : "border-blue-400/10 bg-gradient-to-br from-blue-500/[0.07] to-black/[0.2]"
      }`}
    >

      <div
        className={`absolute -right-16 -top-16 h-36 w-36 rounded-full blur-3xl ${
          isOrange
            ? "bg-orange-500/[0.08]"
            : "bg-blue-500/[0.08]"
        }`}
      />

      <div className="relative flex items-center gap-4">

        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border text-sm font-black ${
            isOrange
              ? "border-orange-400/15 bg-orange-500/10 text-orange-300"
              : "border-blue-400/15 bg-blue-500/10 text-blue-300"
          }`}
        >
          {code}
        </div>

        <div className="min-w-0 flex-1">

          <p
            className={`text-[8px] font-black uppercase tracking-[1.7px] ${
              isOrange
                ? "text-orange-400"
                : "text-blue-400"
            }`}
          >
            Team
          </p>

          <p
            className="mt-1 truncate text-base font-black text-white"
            title={team}
          >
            {team}
          </p>

        </div>

        {probability !== null &&
          probability !== undefined && (
            <div className="shrink-0 text-right">

              <p className="text-[7px] font-black uppercase tracking-wider text-slate-600">
                WIN
              </p>

              <p
                className={`mt-1 text-xl font-black ${
                  isOrange
                    ? "text-orange-300"
                    : "text-blue-300"
                }`}
              >
                {probability.toFixed(1)}%
              </p>

            </div>
          )}

      </div>

    </div>
  );
}

/* =========================================================
   MINI INFO
========================================================= */

function MiniInfo({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="min-w-0 rounded-xl border border-white/[0.05] bg-white/[0.025] px-3 py-3">

      <div className="flex items-center gap-1.5">

        <Icon
          size={11}
          className="text-slate-600"
        />

        <span className="text-[7px] font-black uppercase tracking-wider text-slate-600">
          {label}
        </span>

      </div>

      <p
        className="mt-1 truncate text-[10px] font-bold text-slate-400"
        title={value}
      >
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   PREDICTION RESULT
========================================================= */

function PredictionResult({
  predictedWinner,
  probabilityEntries,
  winnerProbability,
  team1,
  team2,
}) {
  return (
    <div className="mt-8 overflow-hidden rounded-[28px] border border-emerald-400/10 bg-gradient-to-br from-emerald-500/[0.07] via-white/[0.02] to-blue-500/[0.045] shadow-[0_25px_90px_rgba(0,0,0,0.28)]">

      {/* RESULT HEADER */}

      <div className="border-b border-white/[0.06] p-5 sm:p-7">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-500/10">

              <CheckCircle2
                size={22}
                className="text-emerald-400"
              />

            </div>

            <div>

              <p className="text-[9px] font-black uppercase tracking-[2px] text-emerald-400">
                AI Prediction Result
              </p>

              <h3 className="mt-1 text-xl font-black">
                Analysis Complete
              </h3>

            </div>

          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-purple-400/10 bg-purple-500/[0.05] px-3 py-2">

            <BrainCircuit
              size={12}
              className="text-purple-400"
            />

            <span className="text-[8px] font-black uppercase tracking-[1.4px] text-purple-300">
              Model Output
            </span>

          </div>

        </div>

        {/* WINNER HERO */}

        <div className="relative mt-6 overflow-hidden rounded-[26px] border border-emerald-400/10 bg-black/[0.22] p-6 text-center sm:p-9">

          <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-72 -translate-x-1/2 rounded-full bg-emerald-400/[0.07] blur-[80px]" />

          <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/15 bg-amber-500/10">

            <Crown
              size={29}
              className="text-amber-400"
            />

          </div>

          <p className="relative mt-5 text-[9px] font-black uppercase tracking-[2.5px] text-slate-600">
            AI Selected Winner
          </p>

          <h4 className="relative mt-2 break-words text-3xl font-black text-emerald-300 sm:text-5xl">
            {predictedWinner || "—"}
          </h4>

          {/* CONFIDENCE */}

          <div className="relative mx-auto mt-7 max-w-md">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2">

                <Gauge
                  size={12}
                  className="text-slate-600"
                />

                <span className="text-[8px] font-black uppercase tracking-[1.5px] text-slate-600">
                  Confidence
                </span>

              </div>

              <span className="text-sm font-black text-emerald-400">
                {winnerProbability.toFixed(1)}%
              </span>

            </div>

            <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/[0.05]">

              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-cyan-300 transition-all duration-1000"
                style={{
                  width: `${winnerProbability}%`,
                }}
              />

            </div>

            <p className="mt-3 text-[9px] text-slate-700">
              Prediction confidence based on the selected match conditions.
            </p>

          </div>

        </div>

      </div>

      {/* PROBABILITIES */}

      <div className="p-5 sm:p-7">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-[9px] font-black uppercase tracking-[2px] text-slate-600">
              Prediction Confidence
            </p>

            <h4 className="mt-1 text-xl font-black">
              Winning Probability
            </h4>

          </div>

          <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-wider text-slate-700">

            <TrendingUp size={12} />

            Model Comparison

          </div>

        </div>

        {/* TEAM PROBABILITIES */}

        <div className="mt-6 grid gap-4 md:grid-cols-2">

          {probabilityEntries.length > 0 ? (
            probabilityEntries.map(
              (
                {
                  team,
                  probability,
                  numeric,
                },
                index
              ) => {

                const isWinner =
                  normalizeTeamName(team) ===
                  normalizeTeamName(
                    predictedWinner
                  );

                const isFirst =
                  normalizeTeamName(team) ===
                  normalizeTeamName(team1);

                return (
                  <div
                    key={`${team}-${index}`}
                    className={`relative overflow-hidden rounded-2xl border p-5 ${
                      isWinner
                        ? "border-emerald-400/20 bg-emerald-500/[0.06]"
                        : isFirst
                        ? "border-orange-400/10 bg-orange-500/[0.04]"
                        : "border-blue-400/10 bg-blue-500/[0.04]"
                    }`}
                  >

                    {isWinner && (
                      <div className="absolute right-4 top-4 rounded-full border border-emerald-400/10 bg-emerald-400/[0.07] px-2.5 py-1 text-[7px] font-black uppercase tracking-wider text-emerald-300">
                        WINNER
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-4">

                      <div className="min-w-0">

                        <p className="text-[8px] font-black uppercase tracking-[1.5px] text-slate-600">
                          Team
                        </p>

                        <p
                          className="mt-1 truncate text-lg font-black text-white"
                          title={team}
                        >
                          {team}
                        </p>

                      </div>

                      <div className="shrink-0 text-right">

                        <p
                          className={`text-2xl font-black ${
                            isWinner
                              ? "text-emerald-300"
                              : isFirst
                              ? "text-orange-300"
                              : "text-blue-300"
                          }`}
                        >
                          {Number(
                            probability
                          ).toFixed(1)}
                          %
                        </p>

                      </div>

                    </div>

                    <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/[0.05]">

                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          isWinner
                            ? "bg-gradient-to-r from-emerald-600 to-cyan-300"
                            : isFirst
                            ? "bg-gradient-to-r from-orange-600 to-amber-300"
                            : "bg-gradient-to-r from-blue-700 to-cyan-300"
                        }`}
                        style={{
                          width: `${numeric}%`,
                        }}
                      />

                    </div>

                    <div className="mt-3 flex items-center justify-between">

                      <span className="text-[7px] font-black uppercase tracking-wider text-slate-700">
                        Model Probability
                      </span>

                      <span className="text-[8px] font-bold text-slate-500">
                        {numeric >= 50
                          ? "Higher likelihood"
                          : "Lower likelihood"}
                      </span>

                    </div>

                  </div>
                );
              }
            )
          ) : (
            <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6 text-center md:col-span-2">

              <Target
                size={20}
                className="mx-auto text-slate-600"
              />

              <p className="mt-2 text-xs font-bold text-slate-500">
                Probability data unavailable
              </p>

            </div>
          )}

        </div>

        {/* COMPARISON BAR */}

        {probabilityEntries.length >= 2 && (
          <div className="mt-5 rounded-2xl border border-white/[0.05] bg-white/[0.02] p-5">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2">

                <Swords
                  size={13}
                  className="text-slate-600"
                />

                <span className="text-[8px] font-black uppercase tracking-[1.5px] text-slate-600">
                  Probability Split
                </span>

              </div>

              <span className="text-[8px] font-black text-slate-700">
                100%
              </span>

            </div>

            <div className="mt-4 flex h-4 overflow-hidden rounded-full bg-white/[0.04]">

              <div
                className="h-full bg-gradient-to-r from-orange-600 to-orange-300 transition-all duration-1000"
                style={{
                  width: `${probabilityEntries[0].numeric}%`,
                }}
              />

              <div
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-300 transition-all duration-1000"
                style={{
                  width: `${probabilityEntries[1].numeric}%`,
                }}
              />

            </div>

            <div className="mt-3 flex items-center justify-between gap-3">

              <span className="truncate text-[8px] font-black text-orange-300">
                {probabilityEntries[0].team}
              </span>

              <span className="truncate text-right text-[8px] font-black text-blue-300">
                {probabilityEntries[1].team}
              </span>

            </div>

          </div>
        )}

        {/* SELECTED INPUT SUMMARY */}

        <div className="mt-5 grid gap-3 sm:grid-cols-3">

          <ResultInfo
            icon={Trophy}
            label="Team 01"
            value={team1}
          />

          <ResultInfo
            icon={Swords}
            label="Team 02"
            value={team2}
          />

          <ResultInfo
            icon={CheckCircle2}
            label="Predicted"
            value={
              predictedWinner || "—"
            }
          />

        </div>

      </div>
    </div>
  );
}

/* =========================================================
   RESULT INFO
========================================================= */

function ResultInfo({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="min-w-0 rounded-xl border border-white/[0.05] bg-white/[0.025] px-4 py-3">

      <div className="flex items-center gap-2">

        <Icon
          size={11}
          className="text-slate-600"
        />

        <span className="text-[7px] font-black uppercase tracking-wider text-slate-600">
          {label}
        </span>

      </div>

      <p
        className="mt-1 truncate text-[10px] font-bold text-slate-400"
        title={value}
      >
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function normalizeTeamName(
  value = ""
) {
  return String(value)
    .toLowerCase()
    .replace(
      /royal challengers bangalore/g,
      "royal challengers bengaluru"
    )
    .replace(
      /\s+/g,
      " "
    )
    .trim();
}

function findTeamProbability(
  entries,
  team
) {
  return (
    entries.find(
      (item) =>
        normalizeTeamName(
          item.team
        ) ===
        normalizeTeamName(
          team
        )
    )?.numeric || 0
  );
}

export default MatchPrediction;