import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../services/api";

function Analytics() {
  const [teamWins, setTeamWins] = useState({});
  const [venueStats, setVenueStats] = useState({});
  const [cityStats, setCityStats] = useState({});

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      const team = await axios.get(`${BASE_URL}/team_wins`);
      const venue = await axios.get(`${BASE_URL}/venue_statistics`);
      const city = await axios.get(`${BASE_URL}/city_statistics`);

      setTeamWins(team.data);
      setVenueStats(venue.data);
      setCityStats(city.data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="p-8">

      <h1 className="text-4xl font-bold mb-8 text-blue-700">
        📊 IPL Analytics
      </h1>

      {/* Team Wins */}

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">

        <h2 className="text-2xl font-bold mb-4">
          🏆 Team Wins
        </h2>

        <table className="w-full">

          <thead>
            <tr>
              <th>Team</th>
              <th>Wins</th>
            </tr>
          </thead>

          <tbody>

            {Object.entries(teamWins).map(([team, win]) => (

              <tr key={team}>
                <td>{team}</td>
                <td>{win}</td>
              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Venue */}

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">

        <h2 className="text-2xl font-bold mb-4">
          🏟 Venue Statistics
        </h2>

        <table className="w-full">

          <thead>

            <tr>
              <th>Venue</th>
              <th>Matches</th>
            </tr>

          </thead>

          <tbody>

            {Object.entries(venueStats).map(([venue, total]) => (

              <tr key={venue}>
                <td>{venue}</td>
                <td>{total}</td>
              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* City */}

      <div className="bg-white rounded-xl shadow-lg p-6">

        <h2 className="text-2xl font-bold mb-4">
          🌆 City Statistics
        </h2>

        <table className="w-full">

          <thead>

            <tr>
              <th>City</th>
              <th>Matches</th>
            </tr>

          </thead>

          <tbody>

            {Object.entries(cityStats).map(([city, total]) => (

              <tr key={city}>
                <td>{city}</td>
                <td>{total}</td>
              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Analytics;
