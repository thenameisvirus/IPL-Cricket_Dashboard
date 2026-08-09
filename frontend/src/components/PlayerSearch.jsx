import { useState } from "react";
import axios from "axios";
import {
  Search,
  User,
  Trophy,
  Target,
  Shield,
  Calendar,
  Star,
} from "lucide-react";

import BASE_URL from "../services/api";

function PlayerSearch() {
  const [player, setPlayer] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function searchPlayer() {
    if (!player.trim()) return;

    try {
      setLoading(true);

      const res = await axios.get(`${BASE_URL}/player_profile`, {
        params: {
          player,
        },
      });

      setData(res.data);
    } catch (err) {
      console.log(err);
      alert("Player Not Found");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[35px] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700">

      {/* ================= HERO ================= */}

      <div className="relative bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 p-10">

        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_#ffffff33,_transparent_50%)]"></div>

        <div className="relative z-10">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-3xl bg-orange-500 flex items-center justify-center text-white">

              <Search size={30} />

            </div>

            <div>

              <h2 className="text-4xl font-black text-white">

                Search IPL Player

              </h2>

              <p className="text-slate-300 mt-2">

                Search any IPL player and view complete profile instantly.

              </p>

            </div>

          </div>

          {/* SEARCH BOX */}

          <div className="mt-10 flex flex-col md:flex-row gap-5">

            <input
              type="text"
              placeholder="Enter Player Name..."
              value={player}
              onChange={(e) => setPlayer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") searchPlayer();
              }}
              className="flex-1 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl px-6 py-5 text-white placeholder:text-slate-300 outline-none"
            />

            <button
              onClick={searchPlayer}
              disabled={loading}
              className="px-8 py-5 rounded-2xl bg-orange-500 hover:bg-orange-600 transition text-white font-bold flex items-center justify-center gap-3"
            >
              <Search size={20} />

              {loading ? "Searching..." : "Search"}
            </button>

          </div>

        </div>

      </div>

      {/* ================= RESULT ================= */}

      {data && (
        <div className="bg-slate-100 dark:bg-slate-950 p-8">

          <div className="grid lg:grid-cols-3 gap-8">

            {/* PROFILE */}

            <div className="rounded-3xl bg-white dark:bg-slate-900 shadow-xl p-8 text-center">

              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-orange-500 to-red-500 mx-auto flex items-center justify-center">

                <User size={60} color="white" />

              </div>

              <h2 className="mt-6 text-3xl font-black dark:text-white">

                {data.Name || data.name || "Unknown"}

              </h2>

              <p className="mt-2 text-gray-500">

                IPL Player

              </p>

            </div>

            {/* DETAILS */}

            <div className="lg:col-span-2 grid md:grid-cols-2 gap-5">

              {Object.entries(data).map(([key, value]) => (
                <div
                  key={key}
                  className="rounded-3xl bg-white dark:bg-slate-900 shadow-xl p-6 hover:scale-[1.02] transition"
                >
                  <p className="text-sm uppercase tracking-wider text-gray-500">

                    {key}

                  </p>

                  <h3 className="mt-3 text-xl font-bold dark:text-white break-words">

                    {String(value)}

                  </h3>

                </div>
              ))}

            </div>

          </div>

          {/* QUICK INFO */}

          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mt-10">

            <div className="rounded-3xl bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">

              <Trophy size={34} />

              <h3 className="mt-4 text-xl font-bold">

                Orange Cap

              </h3>

            </div>

            <div className="rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-6">

              <Target size={34} />

              <h3 className="mt-4 text-xl font-bold">

                Batting

              </h3>

            </div>

            <div className="rounded-3xl bg-gradient-to-r from-green-600 to-emerald-700 text-white p-6">

              <Shield size={34} />

              <h3 className="mt-4 text-xl font-bold">

                Bowling

              </h3>

            </div>

            <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">

              <Star size={34} />

              <h3 className="mt-4 text-xl font-bold">

                Career

              </h3>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default PlayerSearch;