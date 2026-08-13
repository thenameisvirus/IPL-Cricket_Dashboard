import { useState } from "react";
import axios from "axios";

import {
  Search,
  User,
  Trophy,
  Target,
  ShieldCheck,
  Star,
  Calendar,
  Sparkles,
  Loader2,
  X,
  ChevronRight,
} from "lucide-react";

import BASE_URL from "../services/api";

function PlayerSearch() {
  const [player, setPlayer] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function searchPlayer() {
    const searchValue = player.trim();

    if (!searchValue) {
      return;
    }

    try {
      setLoading(true);
      setData(null);

      const res = await axios.get(`${BASE_URL}/player_profile`, {
        params: {
          player: searchValue,
        },
      });

      if (res.data) {
        setData(res.data);
      } else {
        setData(null);
      }
    } catch (err) {
      console.error("Player Search Error:", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  function clearSearch() {
    setPlayer("");
    setData(null);
  }

  function formatKey(key) {
    return String(key)
      .replaceAll("_", " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function formatValue(value) {
    if (value === null || value === undefined || value === "") {
      return "Not Available";
    }

    if (typeof value === "object") {
      try {
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    }

    return String(value);
  }

  const playerName =
    data?.Name ||
    data?.name ||
    data?.longName ||
    data?.player_name ||
    data?.player ||
    player;

  const initials =
    playerName
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "PL";

  const detailEntries = data
    ? Object.entries(data).filter(
        ([key, value]) =>
          key !== "Name" &&
          key !== "name" &&
          key !== "longName" &&
          key !== "player_name" &&
          key !== "player" &&
          value !== null &&
          value !== undefined &&
          value !== ""
      )
    : [];

  return (
    <div className="relative overflow-hidden rounded-[22px] border border-white/[0.06] bg-[#080e1a]">
      {/* BACKGROUND GLOW */}

      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-orange-500/[0.06] blur-[100px]" />

      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-purple-500/[0.04] blur-[100px]" />

      {/* SEARCH AREA */}

      <div className="relative border-b border-white/[0.06] p-5 sm:p-6">
        <div className="flex flex-col gap-5">
          {/* HEADER */}

          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-400/10 bg-orange-500/10 text-orange-400">
              <Search size={19} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Sparkles
                  size={11}
                  className="text-orange-400"
                />

                <span className="text-[8px] font-black uppercase tracking-[2px] text-orange-400">
                  Player Intelligence
                </span>
              </div>

              <h3 className="mt-1 text-lg font-black text-white sm:text-xl">
                Find an IPL Player
              </h3>

              <p className="mt-1 text-[10px] leading-5 text-slate-600 sm:text-xs">
                Search the player database and explore available profile
                information.
              </p>
            </div>
          </div>

          {/* SEARCH INPUT */}

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
              />

              <input
                type="text"
                value={player}
                placeholder="Enter player name..."
                onChange={(e) => setPlayer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    searchPlayer();
                  }
                }}
                className="h-12 w-full rounded-xl border border-white/[0.07] bg-black/[0.22] pl-11 pr-11 text-sm font-semibold text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-orange-400/25 focus:bg-black/[0.3]"
              />

              {player && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-600 transition hover:bg-white/[0.05] hover:text-slate-300"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={searchPlayer}
              disabled={loading || !player.trim()}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-6 text-[10px] font-black uppercase tracking-wider text-white shadow-[0_10px_30px_rgba(249,115,22,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_15px_35px_rgba(249,115,22,0.2)] disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[125px]"
            >
              {loading ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  Searching
                </>
              ) : (
                <>
                  <Search size={16} />
                  Search
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* LOADING */}

      {loading && (
        <div className="relative flex min-h-[260px] flex-col items-center justify-center p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-400/10 bg-orange-500/[0.06]">
            <Loader2
              size={24}
              className="animate-spin text-orange-400"
            />
          </div>

          <p className="mt-4 text-sm font-black text-slate-300">
            Searching player database...
          </p>

          <p className="mt-1 text-[10px] text-slate-700">
            Please wait while we retrieve the profile.
          </p>
        </div>
      )}

      {/* EMPTY STATE */}

      {!loading && !data && (
        <div className="relative flex min-h-[230px] flex-col items-center justify-center px-6 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.025]">
            <User
              size={23}
              className="text-slate-700"
            />
          </div>

          <p className="mt-4 text-[9px] font-black uppercase tracking-[2px] text-slate-700">
            Player Database
          </p>

          <h4 className="mt-2 text-lg font-black text-slate-400">
            Search for a player
          </h4>

          <p className="mt-1 max-w-sm text-[10px] leading-5 text-slate-700">
            Enter an IPL player name above to view the information available
            in your dataset.
          </p>
        </div>
      )}

      {/* PLAYER RESULT */}

      {!loading && data && (
        <div className="relative p-5 sm:p-6">
          {/* RESULT HEADER */}

          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-500/10">
                <ShieldCheck
                  size={19}
                  className="text-emerald-400"
                />
              </div>

              <div>
                <p className="text-[8px] font-black uppercase tracking-[2px] text-emerald-400">
                  Profile Found
                </p>

                <h3 className="mt-1 text-lg font-black text-white">
                  Player Profile
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={clearSearch}
              className="flex w-fit items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2 text-[8px] font-black uppercase tracking-wider text-slate-600 transition hover:border-white/[0.1] hover:text-slate-400"
            >
              New Search
              <Search size={12} />
            </button>
          </div>

          {/* PROFILE GRID */}

          <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
            {/* PLAYER CARD */}

            <div className="relative overflow-hidden rounded-2xl border border-orange-400/10 bg-gradient-to-br from-orange-500/[0.08] via-[#101827] to-[#090e18] p-6">
              <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-orange-500/[0.1] blur-[70px]" />

              <div className="relative flex flex-col items-center text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-[26px] border border-orange-400/15 bg-gradient-to-br from-orange-500/20 to-orange-500/[0.04] text-2xl font-black text-orange-300 shadow-[0_15px_40px_rgba(249,115,22,0.1)]">
                  {initials}
                </div>

                <h4
                  className="mt-5 max-w-full truncate text-xl font-black text-white"
                  title={playerName}
                >
                  {playerName || "Unknown Player"}
                </h4>

                <p className="mt-1 text-[8px] font-black uppercase tracking-[1.8px] text-slate-600">
                  IPL Player
                </p>

                <div className="mt-5 flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-500/[0.05] px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                  <span className="text-[7px] font-black uppercase tracking-[1.3px] text-emerald-400">
                    Dataset Match
                  </span>
                </div>
              </div>
            </div>

            {/* DETAILS */}

            <div className="grid gap-3 sm:grid-cols-2">
              {detailEntries.length > 0 ? (
                detailEntries.map(([key, value], index) => {
                  const icons = [
                    User,
                    Trophy,
                    Target,
                    ShieldCheck,
                    Calendar,
                    Star,
                  ];

                  const Icon = icons[index % icons.length];

                  return (
                    <div
                      key={`${key}-${index}`}
                      className="group rounded-2xl border border-white/[0.05] bg-white/[0.018] p-4 transition duration-200 hover:border-white/[0.09] hover:bg-white/[0.03]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.025] text-slate-500 transition group-hover:text-orange-400">
                            <Icon size={14} />
                          </div>

                          <div className="min-w-0">
                            <p className="text-[7px] font-black uppercase tracking-[1.5px] text-slate-700">
                              {formatKey(key)}
                            </p>

                            <p
                              className="mt-1 break-words text-xs font-bold text-slate-300"
                              title={formatValue(value)}
                            >
                              {formatValue(value)}
                            </p>
                          </div>
                        </div>

                        <ChevronRight
                          size={13}
                          className="shrink-0 text-slate-800 transition group-hover:text-slate-600"
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center rounded-2xl border border-white/[0.05] bg-white/[0.018] p-8 sm:col-span-2">
                  <p className="text-sm font-bold text-slate-600">
                    No additional profile information available.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* QUICK INSIGHTS */}

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <QuickInfo
              icon={Trophy}
              title="Performance"
              text="Profile data"
              accent="orange"
            />

            <QuickInfo
              icon={Target}
              title="Batting"
              text="Player statistics"
              accent="purple"
            />

            <QuickInfo
              icon={ShieldCheck}
              title="Bowling"
              text="Player details"
              accent="emerald"
            />

            <QuickInfo
              icon={Calendar}
              title="Career"
              text="Available data"
              accent="blue"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function QuickInfo({
  icon: Icon,
  title,
  text,
  accent,
}) {
  const styles = {
    orange: {
      border: "border-orange-400/10",
      bg: "bg-orange-500/[0.06]",
      icon: "text-orange-400",
    },
    purple: {
      border: "border-purple-400/10",
      bg: "bg-purple-500/[0.06]",
      icon: "text-purple-400",
    },
    emerald: {
      border: "border-emerald-400/10",
      bg: "bg-emerald-500/[0.06]",
      icon: "text-emerald-400",
    },
    blue: {
      border: "border-blue-400/10",
      bg: "bg-blue-500/[0.06]",
      icon: "text-blue-400",
    },
  };

  const style = styles[accent] || styles.orange;

  return (
    <div
      className={`rounded-2xl border ${style.border} ${style.bg} p-4`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl border ${style.border} bg-black/[0.12] ${style.icon}`}
        >
          <Icon size={16} />
        </div>

        <div>
          <p className="text-[8px] font-black uppercase tracking-[1.5px] text-slate-600">
            {title}
          </p>

          <p className="mt-1 text-[10px] font-bold text-slate-400">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PlayerSearch;