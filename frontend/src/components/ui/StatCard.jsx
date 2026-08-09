import {
  TrendingUp,
  Users,
  Trophy,
  BarChart3,
} from "lucide-react";

import GlassCard from "./GlassCard";

const icons = {
  matches: <BarChart3 size={34} />,
  teams: <Trophy size={34} />,
  players: <Users size={34} />,
  default: <TrendingUp size={34} />,
};

function StatCard({
  title,
  value,
  icon = "default",
  color = "from-blue-600 to-indigo-600",
}) {
  return (
    <GlassCard className="p-6 overflow-hidden relative">

      {/* Background Glow */}

      <div
        className={`absolute -right-8 -top-8 w-28 h-28 rounded-full bg-gradient-to-br ${color} opacity-20 blur-2xl`}
      />

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-500 font-medium">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-2 text-slate-800">
            {value}
          </h2>

        </div>

        <div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}
        >
          {icons[icon] || icons.default}
        </div>

      </div>

    </GlassCard>
  );
}

export default StatCard;