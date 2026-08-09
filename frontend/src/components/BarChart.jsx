import { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import BASE_URL from "../services/api";

function CustomBarChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/top_batsman`);

      const apiData = Array.isArray(response.data)
        ? response.data
        : [];

      const formattedData = apiData
        .slice(0, 10)
        .map((player) => ({
          name:
            player.Batter ||
            player.batter ||
            player.Name ||
            player.name ||
            "Unknown",

          runs:
            Number(
              player.Runs ??
                player.runs ??
                player.RunsScored ??
                0
            ) || 0,
        }));

      setData(formattedData);
    } catch (error) {
      console.error("Bar Chart API Error:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[350px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500 dark:text-gray-400 font-semibold">
            Loading batting analytics...
          </p>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="h-[350px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">📊</div>

          <h3 className="text-xl font-black text-gray-700 dark:text-white">
            No batting data available
          </h3>

          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Backend did not return batting statistics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: 0,
            bottom: 60,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            opacity={0.2}
          />

          <XAxis
            dataKey="name"
            angle={-35}
            textAnchor="end"
            interval={0}
            height={80}
            tick={{
              fontSize: 11,
            }}
          />

          <YAxis
            allowDecimals={false}
            tick={{
              fontSize: 12,
            }}
          />

          <Tooltip
            cursor={{ opacity: 0.15 }}
            formatter={(value) => [`${value} Runs`, "Runs"]}
          />

          <Bar
            dataKey="runs"
            name="Runs"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CustomBarChart;