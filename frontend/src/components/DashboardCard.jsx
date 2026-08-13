import {
  TrendingUp,
  ArrowUpRight,
  Activity,
} from "lucide-react";

function DashboardCard({
  title,
  value,
  icon: Icon = TrendingUp,
  accent = "orange",
  subtitle = "Live Data",
}) {
  const accents = {
    orange: {
      glow: "bg-orange-500/[0.08]",
      icon: "border-orange-400/15 bg-orange-500/10 text-orange-400",
      text: "text-orange-400",
      line: "from-orange-500/0 via-orange-400/40 to-orange-500/0",
    },
    blue: {
      glow: "bg-blue-500/[0.08]",
      icon: "border-blue-400/15 bg-blue-500/10 text-blue-400",
      text: "text-blue-400",
      line: "from-blue-500/0 via-blue-400/40 to-blue-500/0",
    },
    purple: {
      glow: "bg-purple-500/[0.08]",
      icon: "border-purple-400/15 bg-purple-500/10 text-purple-400",
      text: "text-purple-400",
      line: "from-purple-500/0 via-purple-400/40 to-purple-500/0",
    },
    emerald: {
      glow: "bg-emerald-500/[0.08]",
      icon: "border-emerald-400/15 bg-emerald-500/10 text-emerald-400",
      text: "text-emerald-400",
      line: "from-emerald-500/0 via-emerald-400/40 to-emerald-500/0",
    },
    cyan: {
      glow: "bg-cyan-500/[0.08]",
      icon: "border-cyan-400/15 bg-cyan-500/10 text-cyan-400",
      text: "text-cyan-400",
      line: "from-cyan-500/0 via-cyan-400/40 to-cyan-500/0",
    },
  };

  const style = accents[accent] || accents.orange;

  return (
    <div className="group relative overflow-hidden rounded-[26px] border border-white/[0.07] bg-gradient-to-br from-[#111a2b] via-[#0d1524] to-[#090e18] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.12] hover:shadow-[0_25px_70px_rgba(0,0,0,0.35)] sm:p-6">

      {/* Background Glow */}
      <div
        className={`absolute -right-16 -top-16 h-40 w-40 rounded-full ${style.glow} blur-[65px] transition-all duration-500 group-hover:scale-125`}
      />

      {/* Decorative Circle */}
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full border border-white/[0.025] transition-transform duration-700 group-hover:scale-150" />

      {/* Header */}
      <div className="relative flex items-start justify-between gap-4">

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${style.icon} shadow-lg transition-transform duration-300 group-hover:scale-105`}
        >
          <Icon size={22} />
        </div>

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.05] bg-white/[0.025] ${style.text} opacity-70 transition-all duration-300 group-hover:opacity-100`}
        >
          <ArrowUpRight size={15} />
        </div>
      </div>

      {/* Label */}
      <div className="relative mt-6">
        <p className="text-[9px] font-black uppercase tracking-[2px] text-slate-600">
          {title}
        </p>

        {/* Value */}
        <h2 className="mt-2 break-words text-3xl font-black tracking-tight text-white sm:text-4xl">
          {value ?? 0}
        </h2>
      </div>

      {/* Bottom */}
      <div className="relative mt-5 flex items-center justify-between border-t border-white/[0.05] pt-4">

        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full ${style.glow}`}
            />

            <span
              className={`relative h-2 w-2 rounded-full ${style.text.replace(
                "text-",
                "bg-"
              )}`}
            />
          </span>

          <span className="text-[8px] font-black uppercase tracking-[1.5px] text-slate-600">
            {subtitle}
          </span>
        </div>

        <Activity
          size={13}
          className="text-slate-700 transition-colors duration-300 group-hover:text-slate-500"
        />
      </div>

      {/* Bottom Accent */}
      <div
        className={`absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r ${style.line} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />
    </div>
  );
}

export default DashboardCard;