import { TrendingUp } from "lucide-react";

function DashboardCard({ title, value }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-blue-50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 p-6">

      {/* Background Circle */}

      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-blue-100 opacity-40 group-hover:scale-150 transition duration-700"></div>

      {/* Icon */}

      <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">

        <TrendingUp className="text-white" size={28} />

      </div>

      {/* Title */}

      <p className="mt-6 text-gray-500 font-semibold">
        {title}
      </p>

      {/* Value */}

      <h2 className="mt-3 text-4xl font-extrabold text-slate-800 break-words">

        {value}

      </h2>

      {/* Bottom */}

      <div className="mt-5 flex items-center justify-between">

        <span className="text-green-600 text-sm font-bold">
          ▲ Live Data
        </span>

        <span className="text-blue-600 font-semibold">
          View →
        </span>

      </div>

    </div>
  );
}

export default DashboardCard;
