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

function TeamWinsChart({ data = [] }) {
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
        "Team Wins Chart Error:",
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
          team: String(team),
          wins: Number(value) || 0,
        }))
        .filter(
          (item) =>
            item.team &&
            item.team !== "undefined"
        )
        .sort((a, b) => b.wins - a.wins)
        .slice(0, 10);
    }

    if (Array.isArray(raw)) {
      return raw
        .map((item, index) => {
          if (
            !item ||
            typeof item !== "object"
          ) {
            return null;
          }

          const team =
            item.team ||
            item.Team ||
            item.team_name ||
            item.TeamName ||
            item.name ||
            item.Name ||
            `Team ${index + 1}`;

          const wins =
            item.wins ??
            item.Wins ??
            item.team_wins ??
            item.TeamWins ??
            item.total_wins ??
            item.TotalWins ??
            item.value ??
            0;

          return {
            team: String(team),
            wins: Number(wins) || 0,
          };
        })
        .filter(Boolean)
        .sort((a, b) => b.wins - a.wins)
        .slice(0, 10);
    }

    return [];
  }

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-blue-400" />

          <p className="mt-4 text-xs font-bold text-slate-500">
            Loading team performance...
          </p>
        </div>
      </div>
    );
  }

  if (!apiData.length) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-5xl">
            🏆
          </div>

          <h3 className="text-xl font-black text-slate-300">
            No team wins data available
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
        <BarChart
          data={apiData}
          margin={{
            top: 15,
            right: 20,
            left: 0,
            bottom: 75,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(255,255,255,0.08)"
          />

          <XAxis
            dataKey="team"
            angle={-35}
            textAnchor="end"
            interval={0}
            height={90}
            tick={{
              fontSize: 10,
              fill: "#94a3b8",
              fontWeight: 700,
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            allowDecimals={false}
            tick={{
              fontSize: 11,
              fill: "#64748b",
              fontWeight: 700,
            }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            cursor={{
              fill: "rgba(255,255,255,0.04)",
            }}
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

          <Bar
            dataKey="wins"
            name="Wins"
            fill="#a855f7"
            radius={[8, 8, 0, 0]}
            maxBarSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TeamWinsChart;