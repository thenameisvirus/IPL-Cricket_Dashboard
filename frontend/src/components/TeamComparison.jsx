import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../services/api";

function TeamComparison() {
  const [teams, setTeams] = useState([]);
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadTeams();
  }, []);

  async function loadTeams() {
    try {
      const res = await axios.get(`${BASE_URL}/teams`);
      setTeams(res.data);

      if (res.data.length >= 2) {
        setTeam1(res.data[0]);
        setTeam2(res.data[1]);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function compare() {
    try {
      const res = await axios.get(`${BASE_URL}/compare_teams`, {
        params: {
          team1,
          team2,
        },
      });

      setResult(res.data);
    } catch (err) {
      console.log(err);
      alert("Comparison Failed");
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">

      <h2 className="text-3xl font-bold text-blue-700 mb-6">
        🏆 Team Comparison
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

        <select
          value={team1}
          onChange={(e) => setTeam1(e.target.value)}
          className="border rounded-xl p-4"
        >
          {teams.map((team) => (
            <option key={team}>{team}</option>
          ))}
        </select>

        <select
          value={team2}
          onChange={(e) => setTeam2(e.target.value)}
          className="border rounded-xl p-4"
        >
          {teams.map((team) => (
            <option key={team}>{team}</option>
          ))}
        </select>

      </div>

      <button
        onClick={compare}
        className="mt-6 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold"
      >
        Compare Teams
      </button>

      {result && (
        <div className="mt-8 grid md:grid-cols-2 gap-5">

          {Object.entries(result).map(([key, value]) => (

            <div
              key={key}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 shadow"
            >

              <p className="text-gray-500 text-sm">
                {key}
              </p>

              <h3 className="text-2xl font-bold mt-2">
                {String(value)}
              </h3>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default TeamComparison;