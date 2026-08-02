import { useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import BASE_URL from "../services/api";

function PlayerSearch() {
  const [player, setPlayer] = useState("");
  const [data, setData] = useState(null);

  async function searchPlayer() {
    if (!player) return;

    try {
      const res = await axios.get(`${BASE_URL}/player_profile`, {
        params: {
          player: player,
        },
      });

      setData(res.data);
    } catch (err) {
      console.log(err);
      alert("Player Not Found");
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">

      <h2 className="text-3xl font-bold text-blue-700 mb-6">
        🔍 Search IPL Player
      </h2>

      <div className="flex gap-4">

        <input
          type="text"
          placeholder="Enter Player Name..."
          value={player}
          onChange={(e) => setPlayer(e.target.value)}
          className="flex-1 border rounded-xl p-4"
        />

        <button
          onClick={searchPlayer}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl flex items-center gap-2"
        >
          <Search size={18} />
          Search
        </button>

      </div>

      {data && (

        <div className="mt-8 rounded-2xl bg-blue-50 p-6 shadow">

          <h3 className="text-2xl font-bold mb-4">
            🏏 Player Profile
          </h3>

          <div className="grid md:grid-cols-2 gap-4">

            {Object.entries(data).map(([key, value]) => (

              <div
                key={key}
                className="bg-white rounded-xl p-4 shadow"
              >

                <p className="text-gray-500 text-sm">
                  {key}
                </p>

                <h4 className="font-bold text-lg mt-2">
                  {String(value)}
                </h4>

              </div>

            ))}

          </div>

        </div>

      )}

    </div>
  );
}

export default PlayerSearch;