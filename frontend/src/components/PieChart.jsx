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
  const chartData = Array.isArray(data)
    ? data
        .map((item) => ({
          name:
            item?.team ||
            item?.Team ||
            item?.team_name ||
            item?.TeamName ||
            item?.name ||
            "Unknown",

          value:
            Number(
              item?.wins ??
                item?.Wins ??
                item?.team_wins ??
                item?.TeamWins ??
                item?.total_wins ??
                item?.TotalWins ??
                item?.value ??
                0
            ) || 0,
        }))
        .filter((item) => item.value > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, 10)
    : [];

  if (!chartData.length) {
    return (
      <div className="flex min-h-[350px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-5xl">📊</div>

          <h3 className="text-xl font-black text-slate-300">
            No team performance data
          </h3>

          <p className="mt-2 text-sm text-slate-600">
            No team performance records were returned.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[350px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
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
            {chartData.map((entry, index) => (
              <Cell
                key={`${entry.name}-${index}`}
                fill={COLORS[index % COLORS.length]}
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