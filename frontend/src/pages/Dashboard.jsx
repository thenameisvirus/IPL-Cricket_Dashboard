import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import CustomBarChart from "../components/BarChart";
import TeamWinsChart from "../components/TeamWinsChart";
import CustomPieChart from "../components/PieChart";
import PlayerSearch from "../components/PlayerSearch";
import TeamComparison from "../components/TeamComparison";
import MatchPrediction from "../components/MatchPrediction";
import Analytics from "./Analytics";

import BASE_URL from "../services/api";
import { exportExcel } from "../utils/exportExcel";
// import { exportDashboardPDF } from "../utils/exportPDF";

function Dashboard() {
  const [matches, setMatches] = useState(0);
  const [teams, setTeams] = useState(0);
  const [players, setPlayers] = useState(0);

  const [orangeCap, setOrangeCap] = useState("");
  const [purpleCap, setPurpleCap] = useState("");

  const [topBatsmen, setTopBatsmen] = useState([]);
  const [topBowlers, setTopBowlers] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const matchRes = await axios.get(`${BASE_URL}/total_matches`);
      const teamRes = await axios.get(`${BASE_URL}/total_teams`);
      const playerRes = await axios.get(`${BASE_URL}/total_players`);
      const orangeRes = await axios.get(`${BASE_URL}/orange_cap`);
      const purpleRes = await axios.get(`${BASE_URL}/purple_cap`);
      const batsmanRes = await axios.get(`${BASE_URL}/top_batsman`);
      const bowlerRes = await axios.get(`${BASE_URL}/top_bowlers`);

      setMatches(matchRes.data["Total Matches"]);
      setTeams(teamRes.data["Total Teams"]);
      setPlayers(playerRes.data["Total Players"]);

      setOrangeCap(Object.keys(orangeRes.data)[0]);
      setPurpleCap(Object.keys(purpleRes.data)[0]);

      setTopBatsmen(Object.entries(batsmanRes.data));
      setTopBowlers(Object.entries(bowlerRes.data));
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="flex">

      <Sidebar />

      <div
        id="dashboard-content"
        className="flex-1 bg-slate-100 min-h-screen dark:bg-slate-900 transition-all duration-300"
      >

        <Navbar />

        <div className="p-6">

          {/* Buttons */}

          <div className="flex justify-end gap-4 mb-6">

            <button
              onClick={() => exportExcel(topBatsmen, topBowlers)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition"
            >
              📊 Download Excel
            </button>

            {/*
            <button
              onClick={() => exportDashboardPDF("dashboard-content")}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition"
            >
              📄 Download PDF
            </button>
            */}

          </div>

          {/* Dashboard Cards */}

          <div className="grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 gap-6">

            <DashboardCard
              title="Total Matches"
              value={matches}
            />

            <DashboardCard
              title="Total Teams"
              value={teams}
            />

            <DashboardCard
              title="Total Players"
              value={players}
            />

            <DashboardCard
              title="Orange Cap"
              value={orangeCap}
            />

            <DashboardCard
              title="Purple Cap"
              value={purpleCap}
            />

          </div>

          {/* ===== PART 2 FROM HERE ===== */}


                    {/* Top Tables */}

          <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 mt-8">

            {/* Top Batsmen */}

            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6">

              <h2 className="text-2xl font-bold mb-5 dark:text-white">
                🏏 Top 10 Batsmen
              </h2>

              <table className="w-full">

                <thead className="bg-blue-600 text-white">

                  <tr>
                    <th className="p-3">Rank</th>
                    <th className="p-3">Player</th>
                    <th className="p-3">Runs</th>
                  </tr>

                </thead>

                <tbody>

                  {topBatsmen.map((player, index) => (

                    <tr
                      key={index}
                      className="border-b hover:bg-blue-50 dark:hover:bg-slate-700 transition"
                    >

                      <td className="p-3 font-bold dark:text-white">
                        #{index + 1}
                      </td>

                      <td className="p-3 dark:text-white">
                        {player[0]}
                      </td>

                      <td className="p-3 font-bold text-blue-700">
                        {player[1]}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            {/* Top Bowlers */}

            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6">

              <h2 className="text-2xl font-bold mb-5 dark:text-white">
                🎯 Top 10 Bowlers
              </h2>

              <table className="w-full">

                <thead className="bg-red-600 text-white">

                  <tr>
                    <th className="p-3">Rank</th>
                    <th className="p-3">Bowler</th>
                    <th className="p-3">Wickets</th>
                  </tr>

                </thead>

                <tbody>

                  {topBowlers.map((player, index) => (

                    <tr
                      key={index}
                      className="border-b hover:bg-red-50 dark:hover:bg-slate-700 transition"
                    >

                      <td className="p-3 font-bold dark:text-white">
                        #{index + 1}
                      </td>

                      <td className="p-3 dark:text-white">
                        {player[0]}
                      </td>

                      <td className="p-3 font-bold text-red-600">
                        {player[1]}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

          {/* Charts */}

          <div className="mt-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6">

            <h2 className="text-2xl font-bold mb-5 dark:text-white">
              📊 Top Batsmen Runs
            </h2>

            <CustomBarChart data={topBatsmen} />

          </div>

          <div className="mt-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6">

            <h2 className="text-2xl font-bold mb-5 dark:text-white">
              🏆 Team Wins Chart
            </h2>

            <TeamWinsChart />

          </div>

          <div className="mt-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6">

            <h2 className="text-2xl font-bold mb-5 dark:text-white">
              🥧 Venue Statistics
            </h2>

            <CustomPieChart />

          </div>

          <div className="mt-8">
            <PlayerSearch />
          </div>

          <div className="mt-8">
            <TeamComparison />
          </div>

          <div className="mt-8">
            <MatchPrediction />
          </div>

          <div className="mt-8">
            <Analytics />
          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;
