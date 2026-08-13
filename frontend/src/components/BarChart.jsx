import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function CustomBarChart({ data = [] }) {
  // =========================================================
  // NORMALIZE DATA
  // =========================================================

  let formattedData = [];

  // ---------------------------------------------------------
  // ARRAY DATA
  // ---------------------------------------------------------

  if (Array.isArray(data)) {
    formattedData = data
      .slice(0, 10)
      .map((player, index) => {
        if (!player || typeof player !== "object") {
          return null;
        }

        const name =
          player?.Player ||
          player?.player ||
          player?.Batter ||
          player?.batter ||
          player?.Bowler ||
          player?.bowler ||
          player?.Name ||
          player?.name ||
          player?.longName ||
          `Player ${index + 1}`;

        const value =
          player?.Runs ??
          player?.runs ??
          player?.Wickets ??
          player?.wickets ??
          player?.RunsScored ??
          player?.total_runs ??
          player?.TotalRuns ??
          player?.total_wickets ??
          player?.TotalWickets ??
          player?.value ??
          0;

        const numericValue = Number(value);

        return {
          name: String(name),
          value: Number.isFinite(numericValue)
            ? numericValue
            : 0,
        };
      })
      .filter(Boolean);
  }

  // ---------------------------------------------------------
  // OBJECT DATA
  //
  // Example:
  // {
  //   "V Kohli": 9346,
  //   "RG Sharma": 7331
  // }
  // ---------------------------------------------------------

  else if (
    data &&
    typeof data === "object"
  ) {
    formattedData = Object.entries(data)
      .slice(0, 10)
      .map(([name, value]) => {
        const numericValue = Number(value);

        return {
          name: String(name),
          value: Number.isFinite(numericValue)
            ? numericValue
            : 0,
        };
      });
  }

  // =========================================================
  // EMPTY
  // =========================================================

  if (!formattedData.length) {
    return (
      <div className="flex h-[350px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-5xl">
            📊
          </div>

          <h3 className="text-xl font-black text-slate-300">
            No data available
          </h3>

          <p className="mt-2 text-sm text-slate-600">
            Backend did not return statistics.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // CHART
  // =========================================================

  return (
    <div className="h-[350px] w-full min-w-0">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart
          data={formattedData}
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
            dataKey="name"
            angle={-35}
            textAnchor="end"
            interval={0}
            height={90}
            tick={{
              fontSize: 10,
              fill: "#94a3b8",
              fontWeight: 700,
            }}
            axisLine={{
              stroke: "rgba(255,255,255,0.08)",
            }}
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
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              color: "#fff",
            }}
            labelStyle={{
              color: "#f8fafc",
              fontWeight: 800,
              marginBottom: "4px",
            }}
            formatter={(value) => [
              Number(value).toLocaleString(),
              "Performance",
            ]}
          />

          <Bar
            dataKey="value"
            name="Performance"
            fill="#f97316"
            radius={[8, 8, 0, 0]}
            maxBarSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CustomBarChart;