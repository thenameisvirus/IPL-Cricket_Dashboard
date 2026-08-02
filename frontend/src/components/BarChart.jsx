import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function CustomBarChart({ data }) {
  const chartData = data.map((item) => ({
    player: item[0],
    runs: item[1],
  }));

  return (
    <div className="bg-white rounded-xl shadow p-5 mt-8">
      <h2 className="text-2xl font-bold mb-5">
        📊 Top 10 Batsmen Chart
      </h2>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="player" />

          <YAxis />

          <Tooltip />

          <Bar dataKey="runs" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CustomBarChart;
