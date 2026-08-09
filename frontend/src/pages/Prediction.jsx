import { useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BASE_URL from "../services/api";

function Prediction() {
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [venue, setVenue] = useState("");
  const [tossWinner, setTossWinner] = useState("");
  const [tossDecision, setTossDecision] = useState("bat");

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const teams = [
    "Chennai Super Kings",
    "Mumbai Indians",
    "Royal Challengers Bangalore",
    "Kolkata Knight Riders",
    "Rajasthan Royals",
    "Sunrisers Hyderabad",
    "Delhi Capitals",
    "Punjab Kings",
    "Gujarat Titans",
    "Lucknow Super Giants",
  ];

  const predictMatch = async (e) => {
    e.preventDefault();

    setError("");
    setPrediction(null);

    if (!team1 || !team2 || !venue || !tossWinner) {
      setError("Please fill all match details.");
      return;
    }

    if (team1 === team2) {
      setError("Please select two different teams.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${BASE_URL}/predict`,
        {
          team1,
          team2,
          venue,
          toss_winner: tossWinner,
          toss_decision: tossDecision,
        }
      );

      setPrediction(response.data);
    } catch (err) {
      console.error("Prediction API Error:", err);

      setError(
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Prediction service is currently unavailable."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetPrediction = () => {
    setPrediction(null);
    setError("");
    setTeam1("");
    setTeam2("");
    setVenue("");
    setTossWinner("");
    setTossDecision("bat");
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white">

      <div className="flex min-h-screen">

        {/* SIDEBAR */}

        <div className="hidden w-72 shrink-0 lg:block">
          <Sidebar />
        </div>

        {/* MAIN */}

        <div className="min-w-0 flex-1">

          <Navbar />

          <main className="p-5 md:p-8 lg:p-10">

            {/* HERO */}

            <section className="relative overflow-hidden rounded-[32px] border border-white/[0.06] bg-gradient-to-br from-[#111827] via-[#0c1424] to-[#090d16] p-7 shadow-2xl md:p-10">

              <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />

              <div className="absolute -bottom-32 left-20 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />

              <div className="relative max-w-4xl">

                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-400">
                  🤖 Machine Learning
                </div>

                <h1 className="text-4xl font-black tracking-tight md:text-5xl lg:text-6xl">
                  AI Match Prediction
                </h1>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
                  Enter the match details and let the machine learning
                  engine predict the likely IPL match winner.
                </p>

              </div>

            </section>

            {/* MAIN GRID */}

            <section className="mt-8 grid gap-8 xl:grid-cols-3">

              {/* FORM */}

              <div className="xl:col-span-2 rounded-[30px] border border-white/[0.06] bg-[#0d1422] p-7 shadow-2xl md:p-9">

                <div className="mb-8">

                  <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-2xl">
                      🏏
                    </div>

                    <div>

                      <h2 className="text-2xl font-black">
                        Match Configuration
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Configure the match before running prediction.
                      </p>

                    </div>

                  </div>

                </div>

                <form onSubmit={predictMatch} className="space-y-6">

                  {/* TEAMS */}

                  <div className="grid gap-5 md:grid-cols-2">

                    <div>

                      <label className="mb-2 block text-sm font-bold text-slate-300">
                        Team 1
                      </label>

                      <select
                        value={team1}
                        onChange={(e) => setTeam1(e.target.value)}
                        className="w-full rounded-2xl border border-white/[0.08] bg-[#111827] px-4 py-4 text-sm font-semibold text-white outline-none transition focus:border-amber-500"
                      >

                        <option value="">
                          Select Team 1
                        </option>

                        {teams.map((team) => (
                          <option key={team} value={team}>
                            {team}
                          </option>
                        ))}

                      </select>

                    </div>

                    <div>

                      <label className="mb-2 block text-sm font-bold text-slate-300">
                        Team 2
                      </label>

                      <select
                        value={team2}
                        onChange={(e) => setTeam2(e.target.value)}
                        className="w-full rounded-2xl border border-white/[0.08] bg-[#111827] px-4 py-4 text-sm font-semibold text-white outline-none transition focus:border-amber-500"
                      >

                        <option value="">
                          Select Team 2
                        </option>

                        {teams.map((team) => (
                          <option key={team} value={team}>
                            {team}
                          </option>
                        ))}

                      </select>

                    </div>

                  </div>

                  {/* VENUE */}

                  <div>

                    <label className="mb-2 block text-sm font-bold text-slate-300">
                      Venue
                    </label>

                    <input
                      type="text"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      placeholder="Example: Wankhede Stadium"
                      className="w-full rounded-2xl border border-white/[0.08] bg-[#111827] px-4 py-4 text-sm font-semibold text-white placeholder:text-slate-600 outline-none transition focus:border-amber-500"
                    />

                  </div>

                  {/* TOSS */}

                  <div className="grid gap-5 md:grid-cols-2">

                    <div>

                      <label className="mb-2 block text-sm font-bold text-slate-300">
                        Toss Winner
                      </label>

                      <select
                        value={tossWinner}
                        onChange={(e) => setTossWinner(e.target.value)}
                        className="w-full rounded-2xl border border-white/[0.08] bg-[#111827] px-4 py-4 text-sm font-semibold text-white outline-none transition focus:border-amber-500"
                      >

                        <option value="">
                          Select Toss Winner
                        </option>

                        {teams.map((team) => (
                          <option key={team} value={team}>
                            {team}
                          </option>
                        ))}

                      </select>

                    </div>

                    <div>

                      <label className="mb-2 block text-sm font-bold text-slate-300">
                        Toss Decision
                      </label>

                      <select
                        value={tossDecision}
                        onChange={(e) =>
                          setTossDecision(e.target.value)
                        }
                        className="w-full rounded-2xl border border-white/[0.08] bg-[#111827] px-4 py-4 text-sm font-semibold text-white outline-none transition focus:border-amber-500"
                      >

                        <option value="bat">
                          Bat First
                        </option>

                        <option value="field">
                          Field First
                        </option>

                      </select>

                    </div>

                  </div>

                  {/* ERROR */}

                  {error && (

                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm font-semibold text-red-400">
                      ⚠️ {error}
                    </div>

                  )}

                  {/* BUTTON */}

                  <div className="flex flex-col gap-3 pt-3 sm:flex-row">

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex flex-1 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4 font-black text-black shadow-lg shadow-orange-950/30 transition hover:-translate-y-0.5 hover:from-amber-400 hover:to-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                      {loading ? (
                        <>
                          <span className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                          Analyzing Match...
                        </>
                      ) : (
                        <>
                          🤖 Predict Winner
                        </>
                      )}

                    </button>

                    <button
                      type="button"
                      onClick={resetPrediction}
                      className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-6 py-4 font-bold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                    >
                      Reset
                    </button>

                  </div>

                </form>

              </div>

              {/* INFO PANEL */}

              <div className="rounded-[30px] border border-white/[0.06] bg-gradient-to-br from-[#111827] to-[#0d1422] p-7 shadow-2xl">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-2xl">
                  🧠
                </div>

                <h2 className="mt-6 text-2xl font-black">
                  Prediction Engine
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  The prediction system analyzes historical match
                  information and selected match conditions.
                </p>

                <div className="mt-8 space-y-4">

                  <div className="flex items-center gap-4 rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4">

                    <span className="text-xl">
                      📊
                    </span>

                    <div>
                      <p className="text-sm font-bold">
                        Historical Data
                      </p>

                      <p className="text-xs text-slate-600">
                        IPL match records
                      </p>
                    </div>

                  </div>

                  <div className="flex items-center gap-4 rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4">

                    <span className="text-xl">
                      🎯
                    </span>

                    <div>
                      <p className="text-sm font-bold">
                        Match Factors
                      </p>

                      <p className="text-xs text-slate-600">
                        Teams, venue and toss
                      </p>
                    </div>

                  </div>

                  <div className="flex items-center gap-4 rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4">

                    <span className="text-xl">
                      ⚡
                    </span>

                    <div>
                      <p className="text-sm font-bold">
                        Fast Prediction
                      </p>

                      <p className="text-xs text-slate-600">
                        Instant model response
                      </p>
                    </div>

                  </div>

                </div>

                <div className="mt-8 flex items-center gap-2 rounded-2xl border border-emerald-400/10 bg-emerald-400/5 px-4 py-3">

                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />

                  <span className="text-xs font-bold text-emerald-400">
                    AI ENGINE READY
                  </span>

                </div>

              </div>

            </section>

            {/* RESULT */}

            {prediction && (

              <section className="relative mt-8 overflow-hidden rounded-[32px] border border-amber-400/20 bg-gradient-to-br from-[#17130a] via-[#101722] to-[#0d1422] p-8 shadow-2xl md:p-10">

                <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

                <div className="relative text-center">

                  <span className="inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-amber-400">
                    Prediction Result
                  </span>

                  <h2 className="mt-6 text-3xl font-black md:text-4xl">
                    AI believes the winner is
                  </h2>

                  <div className="mx-auto mt-7 max-w-2xl rounded-[28px] border border-amber-400/20 bg-black/20 p-8">

                    <div className="text-6xl">
                      🏆
                    </div>

                    <h3 className="mt-5 break-words text-3xl font-black text-amber-400 md:text-5xl">
                      {prediction.predicted_winner ||
                        prediction.winner ||
                        prediction.prediction ||
                        "Prediction Generated"}
                    </h3>

                    {(prediction.probability ||
                      prediction.confidence) && (

                      <p className="mt-4 text-lg font-bold text-slate-400">
                        Confidence:{" "}
                        {prediction.probability ||
                          prediction.confidence}
                      </p>

                    )}

                  </div>

                </div>

              </section>

            )}

            {/* FOOTER */}

            <section className="mt-8 rounded-[30px] border border-white/[0.06] bg-[#0d1422] p-7 shadow-xl">

              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-400">
                    IPL AI
                  </p>

                  <h2 className="mt-2 text-xl font-black">
                    Machine Learning Match Intelligence
                  </h2>

                </div>

                <div className="rounded-full border border-white/[0.06] bg-white/[0.03] px-5 py-2 text-xs font-bold text-slate-500">
                  FastAPI + ML
                </div>

              </div>

            </section>

          </main>

        </div>

      </div>

    </div>
  );
}

export default Prediction;
