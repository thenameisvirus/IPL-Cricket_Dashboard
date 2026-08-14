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
  "#f97316",
  "#a855f7",
  "#3b82f6",
  "#06b6d4",
  "#10b981",
  "#ec4899",
  "#eab308",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
];

function CustomPieChart({ data = [] }) {
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      setApiData(normalizeData(data));
      return;
    }

    loadData();
  }, [data]);

  async function loadData() {
    try {
      setLoading(true);

      const response = await axios.get(
        `${BASE_URL}/team_wins_chart`
      );

      const raw =
        response?.data?.data ??
        response?.data?.teams ??
        response?.data ??
        [];

      setApiData(normalizeData(raw));
    } catch (error) {
      console.error(
        "Team Pie Chart Error:",
        error
      );

      setApiData([]);
    } finally {
      setLoading(false);
    }
  }

  function normalizeData(raw) {
    if (!raw) {
      return [];
    }

    if (
      typeof raw === "object" &&
      !Array.isArray(raw)
    ) {
      return Object.entries(raw)
        .map(([team, value]) => ({
          name: String(team),
          value: Number(value) || 0,
        }))
        .filter((item) => item.value > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
    }

    if (Array.isArray(raw)) {
      return raw
        .map((team) => ({
          name:
            team?.team ||
            team?.Team ||
            team?.team_name ||
            team?.TeamName ||
            team?.name ||
            "Unknown",
          value:
            Number(
              team?.wins ??
                team?.Wins ??
                team?.team_wins ??
                team?.TeamWins ??
                team?.total_wins ??
                team?.TotalWins ??
                team?.value ??
                0
            ) || 0,
        }))
        .filter((item) => item.value > 0)
        .slice(0, 10);
    }

    return [];
  }

  if (loading) {
    return (
      <div className="flex min-h-[350px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-purple-400" />

          <p className="mt-4 text-xs font-bold text-slate-500">
            Loading distribution...
          </p>
        </div>
      </div>
    );
  }

  if (!apiData.length) {
    return (
      <div className="flex min-h-[350px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-5xl">
            📊
          </div>

          <h3 className="text-xl font-black text-slate-300">
            No team performance data
          </h3>

          <p className="mt-2 text-sm text-slate-600">
            Backend did not return team performance statistics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[350px] w-full min-w-0">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <PieChart>
          <Pie
            data={apiData}
            cx="50%"
            cy="43%"
            outerRadius={105}
            innerRadius={55}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            stroke="rgba(5,8,22,0.9)"
            strokeWidth={2}
          >
            {apiData.map((entry, index) => (
              <Cell
                key={`${entry.name}-${index}`}
                fill={
                  COLORS[index % COLORS.length]
                }
              />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              background: "#0b1220",
              border:
                "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              color: "#fff",
            }}
            formatter={(value) => [
              `${Number(value).toLocaleString()} Wins`,
              "Wins",
            ]}
          />

          <Legend
            verticalAlign="bottom"
            height={55}
            iconType="circle"
            wrapperStyle={{
              fontSize: "10px",
              fontWeight: 700,
              color: "#64748b",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CustomPieChart;