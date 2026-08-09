import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search,
  Users,
  UserRound,
  X,
  Loader2,
  ChevronRight,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BASE_URL from "../services/api";

function Players() {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/players`);

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.players || [];

      setPlayers(data);
    } catch (error) {
      console.error("Players Error:", error);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  const getName = (player) =>
    player.Name ||
    player.name ||
    player.longName ||
    player.battingName ||
    "Unknown Player";

  const getImage = (player) =>
    player.imgUrl ||
    player.image ||
    player.imageUrl ||
    player.photo ||
    "";

  const getRole = (player) =>
    player.playingRoles ||
    player.playingRole ||
    player.role ||
    "IPL Player";

  const getBatting = (player) =>
    player.longBattingStyles ||
    player.battingStyles ||
    player.battingStyle ||
    "Not Available";

  const getBowling = (player) =>
    player.longBowlingStyles ||
    player.bowlingStyles ||
    player.bowlingStyle ||
    "Not Available";

  const filteredPlayers = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return players;

    return players.filter((player) => {
      const name = getName(player).toLowerCase();
      const role = getRole(player).toLowerCase();

      return name.includes(query) || role.includes(query);
    });
  }, [players, search]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#060b16] text-white">
      {/* FIXED APP LAYOUT */}

      <div className="flex min-h-screen w-full flex-row">
        {/* SIDEBAR WRAPPER */}

        <div className="w-[288px] min-w-[288px] shrink-0">
          <Sidebar />
        </div>

        {/* MAIN CONTENT */}

        <div className="min-w-0 flex-1">
          <Navbar />

          <main className="w-full p-5 md:p-7 lg:p-9">
            {/* HERO */}

            <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-r from-[#101a30] via-[#0c1425] to-[#1c1718] p-7 shadow-2xl md:p-9">
              <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

              <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

              <div className="relative z-10">
                <div className="flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-xs font-bold tracking-widest text-orange-400">
                      <Users size={15} />
                      IPL PLAYERS
                    </div>

                    <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                      Player Universe
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
                      Explore IPL players and discover player information,
                      roles, batting styles and bowling details.
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-white/10 bg-black/20 px-6 py-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                      <Users size={24} />
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-500">
                        Total Players
                      </p>

                      <h2 className="text-3xl font-black">
                        {players.length}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* SEARCH */}

                <div className="relative mt-8 w-full">
                  <Search
                    size={20}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search IPL player..."
                    className="h-14 w-full rounded-2xl border border-white/10 bg-[#070d19]/80 pl-14 pr-12 text-sm font-medium text-white outline-none transition placeholder:text-slate-600 focus:border-orange-400/50 focus:ring-2 focus:ring-orange-400/10"
                  />

                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:bg-white/10 hover:text-white"
                    >
                      <X size={17} />
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* SECTION HEADER */}

            <div className="mt-9 flex items-end justify-between">
              <div>
                <p className="text-xs font-bold tracking-[0.3em] text-orange-400">
                  PLAYER DIRECTORY
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  {search ? "Search Results" : "All Players"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredPlayers.length} players available
                </p>
              </div>
            </div>

            {/* LOADING */}

            {loading && (
              <div className="mt-8 flex min-h-[320px] items-center justify-center rounded-[28px] border border-white/10 bg-[#0b1220]">
                <div className="text-center">
                  <Loader2
                    size={42}
                    className="mx-auto animate-spin text-orange-400"
                  />

                  <p className="mt-5 font-bold">
                    Loading Players...
                  </p>
                </div>
              </div>
            )}

            {/* EMPTY */}

            {!loading && filteredPlayers.length === 0 && (
              <div className="mt-8 flex min-h-[300px] items-center justify-center rounded-[28px] border border-white/10 bg-[#0b1220]">
                <div className="text-center">
                  <UserRound
                    size={50}
                    className="mx-auto text-slate-700"
                  />

                  <h3 className="mt-5 text-xl font-black">
                    No Players Found
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Try another player name.
                  </p>
                </div>
              </div>
            )}

            {/* PLAYERS */}

            {!loading && filteredPlayers.length > 0 && (
              <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {filteredPlayers.map((player, index) => {
                  const name = getName(player);
                  const image = getImage(player);

                  return (
                    <button
                      key={
                        player.ID ||
                        player.id ||
                        `${name}-${index}`
                      }
                      onClick={() => setSelectedPlayer(player)}
                      className="group overflow-hidden rounded-[25px] border border-white/10 bg-gradient-to-b from-[#111b2d] to-[#090f1b] text-left shadow-xl transition duration-300 hover:-translate-y-1 hover:border-orange-400/30"
                    >
                      {/* IMAGE */}

                      <div className="relative h-56 overflow-hidden bg-[#0d1525]">
                        {image ? (
                          <img
                            src={image}
                            alt={name}
                            className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              e.currentTarget.nextElementSibling.style.display =
                                "flex";
                            }}
                          />
                        ) : null}

                        <div
                          className={`${
                            image ? "hidden" : "flex"
                          } h-full w-full items-center justify-center bg-gradient-to-br from-orange-500/10 to-slate-950`}
                        >
                          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-orange-400/20 bg-orange-400/10 text-4xl font-black text-orange-400">
                            {name.charAt(0).toUpperCase()}
                          </div>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#090f1b] to-transparent" />

                        <span className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[10px] font-bold tracking-wider text-orange-400 backdrop-blur">
                          IPL
                        </span>
                      </div>

                      {/* INFO */}

                      <div className="p-5">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-lg font-black">
                              {name}
                            </h3>

                            <p className="mt-1 truncate text-xs text-slate-500">
                              {getRole(player)}
                            </p>
                          </div>

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-slate-500 transition group-hover:bg-orange-400/10 group-hover:text-orange-400">
                            <ChevronRight size={17} />
                          </div>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3">
                          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">
                              Batting
                            </p>

                            <p className="mt-1 truncate text-xs font-semibold text-slate-300">
                              {getBatting(player)}
                            </p>
                          </div>

                          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">
                              Bowling
                            </p>

                            <p className="mt-1 truncate text-xs font-semibold text-slate-300">
                              {getBowling(player)}
                            </p>
                          </div>
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

      {/* PLAYER MODAL */}

      {selectedPlayer && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-5 backdrop-blur-md"
          onClick={() => setSelectedPlayer(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden overflow-y-auto rounded-[30px] border border-white/10 bg-[#0b1220] shadow-2xl"
          >
            <button
              onClick={() => setSelectedPlayer(null)}
              className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-black/50 text-slate-300 hover:bg-white/10 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="grid md:grid-cols-[240px_1fr]">
              <div className="min-h-[320px] bg-gradient-to-br from-slate-800 to-slate-950">
                {getImage(selectedPlayer) ? (
                  <img
                    src={getImage(selectedPlayer)}
                    alt={getName(selectedPlayer)}
                    className="h-full min-h-[320px] w-full object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full min-h-[320px] items-center justify-center">
                    <div className="flex h-28 w-28 items-center justify-center rounded-full bg-orange-400/10 text-5xl font-black text-orange-400">
                      {getName(selectedPlayer)
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8">
                <p className="text-xs font-bold tracking-[0.25em] text-orange-400">
                  PLAYER PROFILE
                </p>

                <h2 className="mt-4 text-3xl font-black">
                  {getName(selectedPlayer)}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {getRole(selectedPlayer)}
                </p>

                <div className="mt-7 space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                      Batting Style
                    </p>

                    <p className="mt-2 text-sm font-semibold text-slate-200">
                      {getBatting(selectedPlayer)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                      Bowling Style
                    </p>

                    <p className="mt-2 text-sm font-semibold text-slate-200">
                      {getBowling(selectedPlayer)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPlayer(null)}
                  className="mt-7 w-full rounded-2xl bg-orange-500 py-4 font-black text-black transition hover:bg-orange-400"
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

export default Players;