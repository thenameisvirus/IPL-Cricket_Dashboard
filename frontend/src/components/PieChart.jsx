import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

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
  const formattedData = Array.isArray(data)
    ? data
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
                team?.value ??
                0
            ) || 0,
        }))
        .filter((item) => item.value > 0)
    : [];

  if (!formattedData.length) {
    return (
      <div className="flex min-h-[350px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-5xl">📊</div>

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
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={formattedData}
            cx="50%"
            cy="45%"
            outerRadius={105}
            innerRadius={55}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            stroke="rgba(5,8,22,0.9)"
            strokeWidth={2}
          >
            {formattedData.map((entry, index) => (
              <Cell
                key={`${entry.name}-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              background: "#0b1220",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              color: "#fff",
            }}
            labelStyle={{
              color: "#cbd5e1",
              fontWeight: 800,
            }}
            formatter={(value) => [`${value} Wins`, "Wins"]}
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