import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  Search,
  Users,
  UserRound,
  X,
  Loader2,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Activity,
  Target,
  Swords,
  Trophy,
  Calendar,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BASE_URL from "../services/api";

function Players() {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadPlayers();
  }, []);

  useEffect(() => {
    if (selectedPlayer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedPlayer]);

  async function loadPlayers() {
    try {
      setLoading(true);

      const res = await axios.get(`${BASE_URL}/players`);

      const rawData = res?.data;

      const data = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.players)
        ? rawData.players
        : Array.isArray(rawData?.data)
        ? rawData.data
        : [];

      setPlayers(data);
    } catch (error) {
      console.error("Players Error:", error);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  }

  function getName(player = {}) {
    return (
      player?.Name ||
      player?.name ||
      player?.longName ||
      player?.battingName ||
      player?.player_name ||
      "Unknown Player"
    );
  }

  function getImage(player = {}) {
    return (
      player?.imgUrl ||
      player?.image ||
      player?.imageUrl ||
      player?.photo ||
      player?.photoUrl ||
      ""
    );
  }

  function getRole(player = {}) {
    return (
      player?.playingRoles ||
      player?.playingRole ||
      player?.role ||
      "IPL Player"
    );
  }

  function getBatting(player = {}) {
    return (
      player?.longBattingStyles ||
      player?.battingStyles ||
      player?.battingStyle ||
      "Not Available"
    );
  }

  function getBowling(player = {}) {
    return (
      player?.longBowlingStyles ||
      player?.bowlingStyles ||
      player?.bowlingStyle ||
      "Not Available"
    );
  }

  function getDob(player = {}) {
    return (
      player?.dob ||
      player?.dateOfBirth ||
      player?.date_of_birth ||
      "Not Available"
    );
  }

  function getInitials(name = "") {
    const words = String(name)
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (!words.length) {
      return "PL";
    }

    return words
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }

  const filteredPlayers = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return players;
    }

    return players.filter((player) => {
      const name = getName(player).toLowerCase();
      const role = getRole(player).toLowerCase();
      const batting = getBatting(player).toLowerCase();
      const bowling = getBowling(player).toLowerCase();

      return (
        name.includes(query) ||
        role.includes(query) ||
        batting.includes(query) ||
        bowling.includes(query)
      );
    });
  }, [players, search]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#040711] text-white">
      {/* =====================================================
          MOBILE SIDEBAR
      ===================================================== */}

      <div className="lg:hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* =====================================================
          DESKTOP SIDEBAR
      ===================================================== */}

      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* =====================================================
          MAIN SHELL
      ===================================================== */}

      <div className="flex min-h-screen w-full min-w-0">
        {/* Exact 250px desktop sidebar reservation */}
        <div className="hidden w-[250px] shrink-0 lg:block" />

        {/* Main application */}
        <div className="min-w-0 flex-1 overflow-x-hidden">
          {/* =================================================
              NAVBAR
          ================================================= */}

          <div className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#040711]/90 backdrop-blur-2xl">
            <Navbar
              onMenuClick={() => setSidebarOpen(true)}
            />
          </div>

          {/* =================================================
              CONTENT
          ================================================= */}

          <main className="mx-auto w-full min-w-0 max-w-[1800px] overflow-x-hidden px-4 pb-12 pt-7 sm:px-6 sm:pt-9 lg:px-8 xl:px-10">
            {/* =================================================
                HERO
            ================================================= */}

            <section className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-gradient-to-br from-[#121a2a] via-[#0b1220] to-[#080c15] shadow-[0_30px_100px_rgba(0,0,0,0.38)]">
              <div className="pointer-events-none absolute -right-32 -top-32 h-[430px] w-[430px] rounded-full bg-orange-500/[0.085] blur-[110px]" />

              <div className="pointer-events-none absolute bottom-[-180px] left-[25%] h-[390px] w-[390px] rounded-full bg-blue-500/[0.05] blur-[110px]" />

              <div
                className="pointer-events-none absolute inset-0 opacity-[0.02]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
                  backgroundSize: "44px 44px",
                }}
              />

              <div className="relative p-5 sm:p-7 lg:p-9">
                <div className="flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
                  <div className="min-w-0 max-w-3xl">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/[0.07] px-4 py-2">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-50" />
                        <span className="relative h-2 w-2 rounded-full bg-orange-400" />
                      </span>

                      <Users
                        size={13}
                        className="text-orange-400"
                      />

                      <span className="text-[9px] font-black uppercase tracking-[2.3px] text-orange-300">
                        IPL Player Intelligence
                      </span>
                    </div>

                    <h1 className="text-4xl font-black tracking-[-1.8px] sm:text-5xl lg:text-6xl">
                      Player Universe
                    </h1>

                    <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                      Explore IPL players with premium profiles,
                      clean player imagery, roles, batting styles
                      and bowling intelligence.
                    </p>

                    <div className="mt-7 flex flex-wrap gap-3">
                      <HeroBadge
                        icon={Sparkles}
                        text="Player Database"
                      />

                      <HeroBadge
                        icon={ShieldCheck}
                        text="Verified Data"
                      />

                      <HeroBadge
                        icon={Activity}
                        text="Live API"
                      />
                    </div>
                  </div>

                  {/* HERO STATS */}

                  <div className="grid grid-cols-2 gap-3 sm:min-w-[360px]">
                    <HeroStat
                      icon={Users}
                      label="TOTAL PLAYERS"
                      value={players.length}
                    />

                    <HeroStat
                      icon={Search}
                      label="VISIBLE"
                      value={filteredPlayers.length}
                    />

                    <HeroStat
                      icon={Target}
                      label="SEARCH"
                      value={search ? "ACTIVE" : "READY"}
                    />

                    <HeroStat
                      icon={ShieldCheck}
                      label="DATABASE"
                      value={loading ? "SYNC" : "ONLINE"}
                    />
                  </div>
                </div>

                {/* =================================================
                    SEARCH
                ================================================= */}

                <div className="mt-8">
                  <div className="relative">
                    <Search
                      size={18}
                      className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search player name, role or style..."
                      className="h-14 w-full rounded-2xl border border-white/[0.08] bg-black/[0.25] pl-14 pr-14 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-400/35 focus:bg-black/[0.34] focus:ring-4 focus:ring-orange-400/[0.05]"
                    />

                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.07] hover:text-white"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                DIRECTORY HEADER
            ================================================= */}

            <section className="mt-9">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Users
                      size={15}
                      className="text-orange-400"
                    />

                    <span className="text-[9px] font-black uppercase tracking-[2.5px] text-orange-400">
                      Player Directory
                    </span>
                  </div>

                  <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                    {search ? "Search Results" : "All Players"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-600">
                    {filteredPlayers.length} players available
                  </p>
                </div>

                {search && (
                  <div className="w-fit rounded-xl border border-orange-400/10 bg-orange-500/[0.05] px-4 py-2">
                    <span className="text-[9px] font-black uppercase tracking-wider text-orange-300">
                      Searching:
                    </span>

                    <span className="ml-2 text-xs font-bold text-slate-300">
                      {search}
                    </span>
                  </div>
                )}
              </div>
            </section>

            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (
              <div className="mt-7 flex min-h-[420px] items-center justify-center rounded-[28px] border border-white/[0.07] bg-white/[0.025] backdrop-blur-xl">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-400/10 bg-orange-500/[0.07]">
                    <Loader2
                      size={28}
                      className="animate-spin text-orange-400"
                    />
                  </div>

                  <p className="mt-5 text-lg font-black text-slate-200">
                    Loading Player Universe
                  </p>

                  <p className="mt-2 text-xs text-slate-600">
                    Fetching premium player profiles...
                  </p>
                </div>
              </div>
            )}

            {/* =================================================
                EMPTY
            ================================================= */}

            {!loading && filteredPlayers.length === 0 && (
              <div className="mt-7 flex min-h-[360px] items-center justify-center rounded-[28px] border border-white/[0.07] bg-white/[0.025]">
                <div className="text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-white/[0.06] bg-white/[0.03]">
                    <UserRound
                      size={35}
                      className="text-slate-700"
                    />
                  </div>

                  <h3 className="mt-5 text-xl font-black">
                    No Players Found
                  </h3>

                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                    Try searching with another player name,
                    role or playing style.
                  </p>

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="mt-5 rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-black text-black transition hover:bg-orange-400"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* =================================================
                PLAYER GRID
            ================================================= */}

            {!loading && filteredPlayers.length > 0 && (
              <div className="mt-7 grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {filteredPlayers.map((player, index) => {
                  const name = getName(player);
                  const image = getImage(player);
                  const role = getRole(player);

                  return (
                    <button
                      key={
                        player.ID ||
                        player.id ||
                        `${name}-${index}`
                      }
                      type="button"
                      onClick={() => setSelectedPlayer(player)}
                      className="group relative min-w-0 overflow-hidden rounded-[28px] border border-white/[0.08] bg-gradient-to-b from-[#131c2d] via-[#0d1524] to-[#080c15] text-left shadow-[0_22px_70px_rgba(0,0,0,0.28)] transition-all duration-500 hover:-translate-y-1.5 hover:border-orange-400/25 hover:shadow-[0_30px_90px_rgba(0,0,0,0.42)]"
                    >
                      {/* IMAGE */}

                      <div className="relative h-[330px] overflow-hidden bg-[#0b1220] sm:h-[345px]">
                        {image ? (
                          <img
                            src={image}
                            alt={name}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover object-top transition duration-700 group-hover:scale-[1.045]"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";

                              const fallback =
                                e.currentTarget.nextElementSibling;

                              if (fallback) {
                                fallback.classList.remove("hidden");
                                fallback.classList.add("flex");
                              }
                            }}
                          />
                        ) : null}

                        {/* IMAGE FALLBACK */}

                        <div
                          className={`${
                            image ? "hidden" : "flex"
                          } absolute inset-0 items-center justify-center bg-gradient-to-br from-orange-500/[0.13] via-[#101827] to-[#070b12]`}
                        >
                          <div className="flex h-28 w-28 items-center justify-center rounded-full border border-orange-400/15 bg-orange-500/[0.08] text-5xl font-black text-orange-300 shadow-[0_0_60px_rgba(249,115,22,0.10)]">
                            {getInitials(name)}
                          </div>
                        </div>

                        {/* OVERLAY */}

                        <div className="absolute inset-0 bg-gradient-to-t from-[#070b12] via-[#070b12]/25 to-transparent" />

                        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#070b12] via-[#070b12]/80 to-transparent" />

                        {/* BADGE */}

                        <div className="absolute left-4 top-4">
                          <span className="rounded-full border border-white/[0.10] bg-black/45 px-3 py-1.5 text-[8px] font-black uppercase tracking-[1.6px] text-orange-300 backdrop-blur-xl">
                            IPL PLAYER
                          </span>
                        </div>

                        {/* OPEN */}

                        <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.10] bg-black/45 text-slate-300 backdrop-blur-xl transition duration-300 group-hover:border-orange-400/25 group-hover:bg-orange-500/10 group-hover:text-orange-300">
                          <ChevronRight size={17} />
                        </div>

                        {/* NAME */}

                        <div className="absolute bottom-5 left-5 right-5">
                          <div className="mb-2 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                            <span className="text-[7px] font-black uppercase tracking-[1.8px] text-emerald-300">
                              Profile Available
                            </span>
                          </div>

                          <h3
                            className="truncate text-2xl font-black tracking-tight text-white sm:text-[27px]"
                            title={name}
                          >
                            {name}
                          </h3>

                          <p
                            className="mt-1 truncate text-[9px] font-black uppercase tracking-[1.7px] text-slate-400"
                            title={role}
                          >
                            {role}
                          </p>
                        </div>
                      </div>

                      {/* BODY */}

                      <div className="p-5">
                        <div className="grid grid-cols-2 gap-3">
                          <PlayerInfo
                            icon={Activity}
                            label="Batting"
                            value={getBatting(player)}
                            accent="orange"
                          />

                          <PlayerInfo
                            icon={Swords}
                            label="Bowling"
                            value={getBowling(player)}
                            accent="purple"
                          />
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.05] pt-4">
                          <div className="flex min-w-0 items-center gap-2">
                            <ShieldCheck
                              size={13}
                              className="shrink-0 text-emerald-400"
                            />

                            <span className="truncate text-[8px] font-black uppercase tracking-[1.5px] text-slate-600">
                              Verified Dataset
                            </span>
                          </div>

                          <span className="shrink-0 text-[8px] font-black uppercase tracking-[1.5px] text-orange-400 transition group-hover:text-orange-300">
                            View Profile →
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* =====================================================
          PLAYER PROFILE MODAL
      ===================================================== */}

      {selectedPlayer && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 p-3 backdrop-blur-xl sm:p-6"
          onClick={() => setSelectedPlayer(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[94vh] w-full max-w-4xl overflow-hidden overflow-y-auto rounded-[30px] border border-white/[0.10] bg-[#080e18] shadow-[0_40px_140px_rgba(0,0,0,0.7)]"
          >
            {/* CLOSE */}

            <button
              type="button"
              onClick={() => setSelectedPlayer(null)}
              className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.10] bg-black/55 text-slate-300 backdrop-blur-xl transition hover:border-orange-400/20 hover:bg-orange-500/10 hover:text-orange-300 sm:right-5 sm:top-5"
            >
              <X size={18} />
            </button>

            <div className="grid md:grid-cols-[320px_1fr]">
              {/* PROFILE IMAGE */}

              <div className="relative min-h-[400px] overflow-hidden bg-[#0b1220] md:min-h-[520px]">
                {getImage(selectedPlayer) ? (
                  <img
                    src={getImage(selectedPlayer)}
                    alt={getName(selectedPlayer)}
                    className="h-full min-h-[400px] w-full object-cover object-top md:min-h-[520px]"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-full min-h-[400px] items-center justify-center bg-gradient-to-br from-orange-500/[0.12] via-[#101827] to-[#070b12] md:min-h-[520px]">
                    <div className="flex h-32 w-32 items-center justify-center rounded-full border border-orange-400/15 bg-orange-500/[0.08] text-6xl font-black text-orange-300">
                      {getInitials(
                        getName(selectedPlayer)
                      )}
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#070b12] via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6">
                  <span className="rounded-full border border-orange-400/15 bg-orange-500/10 px-3 py-1.5 text-[8px] font-black uppercase tracking-[1.6px] text-orange-300">
                    IPL PROFILE
                  </span>
                </div>
              </div>

              {/* PROFILE DATA */}

              <div className="p-6 sm:p-8">
                <p className="text-[9px] font-black uppercase tracking-[2.5px] text-orange-400">
                  Player Intelligence
                </p>

                <h2
                  className="mt-3 pr-10 text-3xl font-black tracking-tight text-white sm:text-4xl"
                  title={getName(selectedPlayer)}
                >
                  {getName(selectedPlayer)}
                </h2>

                <p className="mt-2 text-sm font-bold uppercase tracking-wider text-slate-500">
                  {getRole(selectedPlayer)}
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <ProfileInfo
                    icon={Activity}
                    label="Batting Style"
                    value={getBatting(selectedPlayer)}
                  />

                  <ProfileInfo
                    icon={Swords}
                    label="Bowling Style"
                    value={getBowling(selectedPlayer)}
                  />

                  <ProfileInfo
                    icon={ShieldCheck}
                    label="Player Role"
                    value={getRole(selectedPlayer)}
                  />

                  <ProfileInfo
                    icon={Calendar}
                    label="Date of Birth"
                    value={getDob(selectedPlayer)}
                  />
                </div>

                <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
                      <Trophy
                        size={17}
                        className="text-orange-400"
                      />
                    </div>

                    <div>
                      <p className="text-[8px] font-black uppercase tracking-[1.5px] text-slate-600">
                        IPL Database
                      </p>

                      <p className="mt-1 text-xs font-bold text-slate-300">
                        Player profile successfully loaded
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPlayer(null)}
                  className="mt-6 w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 py-4 text-sm font-black text-black shadow-[0_15px_35px_rgba(249,115,22,0.14)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(249,115,22,0.22)]"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   HERO BADGE
========================================================= */

function HeroBadge({ icon: Icon, text }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2">
      <Icon
        size={13}
        className="text-slate-400"
      />

      <span className="text-[8px] font-black uppercase tracking-wider text-slate-500">
        {text}
      </span>
    </div>
  );
}

/* =========================================================
   HERO STAT
========================================================= */

function HeroStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 backdrop-blur-md sm:p-5">
      <div className="flex items-center justify-between">
        <Icon
          size={16}
          className="text-orange-400"
        />

        <span className="text-[7px] font-black uppercase tracking-wider text-slate-700">
          IPL
        </span>
      </div>

      <p className="mt-4 text-[8px] font-black uppercase tracking-[1.5px] text-slate-600">
        {label}
      </p>

      <p className="mt-1 truncate text-xl font-black text-white">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   PLAYER INFO
========================================================= */

function PlayerInfo({
  icon: Icon,
  label,
  value,
  accent,
}) {
  const accentClass =
    accent === "purple"
      ? "text-purple-400 bg-purple-500/[0.07] border-purple-400/10"
      : "text-orange-400 bg-orange-500/[0.07] border-orange-400/10";

  return (
    <div className="min-w-0 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
      <div className="flex items-center gap-2">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${accentClass}`}
        >
          <Icon size={13} />
        </div>

        <p className="text-[7px] font-black uppercase tracking-[1.4px] text-slate-700">
          {label}
        </p>
      </div>

      <p
        className="mt-2 truncate text-[10px] font-bold text-slate-300"
        title={value}
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   PROFILE INFO
========================================================= */

function ProfileInfo({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-400/10 bg-orange-500/[0.07]">
          <Icon
            size={14}
            className="text-orange-400"
          />
        </div>

        <p className="text-[8px] font-black uppercase tracking-[1.5px] text-slate-600">
          {label}
        </p>
      </div>

      <p className="mt-3 break-words text-sm font-bold leading-6 text-slate-200">
        {value}
      </p>
    </div>
  );
}

export default Players;