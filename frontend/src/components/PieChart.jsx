import { useEffect, useState } from "react";
import axios from "axios";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import BASE_URL from "../services/api";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#f59e0b",
  "#7c3aed",
  "#0ea5e9",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#8b5cf6",
];

function CustomPieChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const res = await axios.get(`${BASE_URL}/venue_statistics`);

      const chartData = Object.entries(res.data).map(([name, value]) => ({
        name,
        value,
      }));

      setData(chartData);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-5 mt-8">
      <h2 className="text-2xl font-bold mb-5 text-center">
        🏙️ IPL Home Cities Distribution
      </h2>

      <ResponsiveContainer width="100%" height={450}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={150}
            dataKey="value"
            nameKey="name"
            label={({ name }) => name}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend verticalAlign="bottom" height={40} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CustomPieChart;
