import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../services/api";

function MatchPrediction() {
  const [teams, setTeams] = useState([]);
  const [venues, setVenues] = useState([]);

  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [tossWinner, setTossWinner] = useState("");
  const [tossDecision, setTossDecision] = useState("bat");
  const [venue, setVenue] = useState("");

  const [result, setResult] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const teamRes = await axios.get(`${BASE_URL}/teams`);
      const venueRes = await axios.get(`${BASE_URL}/venues`);

      setTeams(teamRes.data);
      setVenues(venueRes.data);

      if (teamRes.data.length > 1) {
        setTeam1(teamRes.data[0]);
        setTeam2(teamRes.data[1]);
        setTossWinner(teamRes.data[0]);
      }

      if (venueRes.data.length > 0) {
        setVenue(venueRes.data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function predictWinner() {
    try {
      const res = await axios.get(`${BASE_URL}/predict_match`, {
        params: {
          team1,
          team2,
          toss_winner: tossWinner,
          toss_decision: tossDecision,
          venue,
        },
      });

      setResult(res.data);
    } catch (error) {
      console.log(error);
      alert("Prediction Failed");
    }
  }

  return (
    <div className="mt-10 bg-white rounded-3xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-center text-purple-700 mb-8">
        🤖 AI Match Winner Prediction
      </h2>

      <div className="grid md:grid-cols-2 gap-5">

        <div>
          <label className="font-semibold">Team 1</label>
          <select
            value={team1}
            onChange={(e) => setTeam1(e.target.value)}
            className="w-full mt-2 p-3 rounded-xl border"
          >
            {teams.map((team) => (
              <option key={team}>{team}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold">Team 2</label>
          <select
            value={team2}
            onChange={(e) => setTeam2(e.target.value)}
            className="w-full mt-2 p-3 rounded-xl border"
          >
            {teams.map((team) => (
              <option key={team}>{team}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold">Toss Winner</label>
          <select
            value={tossWinner}
            onChange={(e) => setTossWinner(e.target.value)}
            className="w-full mt-2 p-3 rounded-xl border"
          >
            {teams.map((team) => (
              <option key={team}>{team}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold">Toss Decision</label>
          <select
            value={tossDecision}
            onChange={(e) => setTossDecision(e.target.value)}
            className="w-full mt-2 p-3 rounded-xl border"
          >
            <option value="bat">Bat</option>
            <option value="field">Field</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="font-semibold">Venue</label>
          <select
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            className="w-full mt-2 p-3 rounded-xl border"
          >
            {venues.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>

      </div>

      <button
        onClick={predictWinner}
        className="mt-8 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold"
      >
        Predict Winner
      </button>

      {result && (
        <div className="mt-8 bg-gray-100 rounded-2xl p-6">

          <h3 className="text-2xl font-bold text-green-700">
            🏆 Predicted Winner
          </h3>

          <p className="text-3xl font-bold mt-3">
            {result["Predicted Winner"]}
          </p>

          <h3 className="text-xl font-bold mt-6 mb-3">
            Winning Probability
          </h3>

          <table className="w-full">
            <thead>
              <tr>
                <th>Team</th>
                <th>Probability</th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(result["Winning Probability"]).map(
                ([team, prob]) => (
                  <tr key={team}>
                    <td>{team}</td>
                    <td>{prob}%</td>
                  </tr>
                )
              )}
            </tbody>
          </table>

        </div>
      )}
    </div>
  );
}

export default MatchPrediction;