import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import BASE_URL from "../services/api";

function TeamWinsChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/team_wins_chart`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-5 mt-8">
      <h2 className="text-2xl font-bold mb-5">
        🏆 Team Wins Chart
      </h2>

      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="team" angle={-45} textAnchor="end" interval={0} />

          <YAxis />

          <Tooltip />

          <Bar dataKey="wins" fill="#16a34a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TeamWinsChart;
