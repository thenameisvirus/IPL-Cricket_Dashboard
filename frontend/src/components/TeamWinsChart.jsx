import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function TeamWinsChart({ data = [] }) {
  const chartData = Array.isArray(data)
    ? data
        .map((item) => ({
          team:
            item?.team ||
            item?.Team ||
            item?.team_name ||
            item?.TeamName ||
            item?.name ||
            "Unknown",

          wins:
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
        .filter((item) => item.team)
        .sort((a, b) => b.wins - a.wins)
        .slice(0, 10)
    : [];

  if (!chartData.length) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-5xl">🏆</div>

          <h3 className="text-xl font-black text-slate-300">
            No team wins data available
          </h3>

          <p className="mt-2 text-sm text-slate-600">
            No team win records were returned.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[350px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 15,
            right: 20,
            left: 0,
            bottom: 80,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(255,255,255,0.08)"
          />

          <XAxis
            dataKey="team"
            interval={0}
            angle={-35}
            textAnchor="end"
            height={90}
            tick={{
              fontSize: 10,
              fill: "#64748b",
              fontWeight: 700,
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            allowDecimals={false}
            tick={{
              fontSize: 10,
              fill: "#64748b",
            }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            cursor={{
              fill: "rgba(255,255,255,0.03)",
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