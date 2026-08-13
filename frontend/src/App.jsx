import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Players from "./pages/Players";
import Teams from "./pages/Teams";
import MatchPrediction from "./components/MatchPrediction";
import TeamComparison from "./components/TeamComparison";

function App() {
  const [isAuthenticated, setIsAuthenticated] =
    useState(() => {
      return (
        localStorage.getItem("iplLoggedIn") ===
          "true" ||
        !!localStorage.getItem("token")
      );
    });

  useEffect(() => {
    const syncAuth = () => {
      const loggedIn =
        localStorage.getItem("iplLoggedIn") ===
          "true" ||
        !!localStorage.getItem("token");

      setIsAuthenticated(loggedIn);
    };

    window.addEventListener(
      "storage",
      syncAuth
    );

    return () => {
      window.removeEventListener(
        "storage",
        syncAuth
      );
    };
  }, []);

  function handleLoginSuccess() {
    setIsAuthenticated(true);
  }

  function handleLogoutSuccess() {
    localStorage.removeItem("token");
    localStorage.removeItem(
      "access_token"
    );
    localStorage.removeItem(
      "iplLoggedIn"
    );
    localStorage.removeItem(
      "iplUsername"
    );

    setIsAuthenticated(false);
  }

  if (!isAuthenticated) {
    return (
      <Login
        onLogin={handleLoginSuccess}
      />
    );
  }

  return (
    <Routes>
      {/* ROOT */}
      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      {/* PLAYERS */}
      <Route
        path="/players"
        element={<Players />}
      />

      {/* TEAMS */}
      <Route
        path="/teams"
        element={<Teams />}
      />

      {/* ANALYTICS */}
      <Route
        path="/analytics"
        element={<Analytics />}
      />

      {/* AI MATCH PREDICTION */}
      <Route
        path="/prediction"
        element={
          <div className="min-h-screen bg-[#050816] text-white">
            <div className="mx-auto max-w-[1750px] px-4 py-6 sm:px-6 lg:px-8">

              <div className="mb-6">

                <button
                  type="button"
                  onClick={() =>
                    window.history.back()
                  }
                  className="mb-5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                >
                  ← Back
                </button>

                <div className="mb-2 text-[10px] font-black uppercase tracking-[2.5px] text-orange-400">
                  Machine Learning
                </div>

                <h1 className="text-3xl font-black sm:text-4xl">
                  AI Match Prediction
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Predict IPL match outcomes using
                  the trained machine learning model.
                </p>

              </div>

              <div className="overflow-hidden rounded-[26px] border border-white/[0.08] bg-white/[0.035] p-4 backdrop-blur-xl sm:p-6">
                <MatchPrediction />
              </div>

            </div>
          </div>
        }
      />

      {/* TEAM COMPARISON */}
      <Route
        path="/comparison"
        element={
          <div className="min-h-screen bg-[#050816] text-white">
            <div className="mx-auto max-w-[1750px] px-4 py-6 sm:px-6 lg:px-8">

              <div className="mb-6">

                <button
                  type="button"
                  onClick={() =>
                    window.history.back()
                  }
                  className="mb-5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                >
                  ← Back
                </button>

                <div className="mb-2 text-[10px] font-black uppercase tracking-[2.5px] text-blue-400">
                  Team Analytics
                </div>

                <h1 className="text-3xl font-black sm:text-4xl">
                  Team Comparison
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Compare IPL teams using historical
                  performance data.
                </p>

              </div>

              <div className="overflow-hidden rounded-[26px] border border-white/[0.08] bg-white/[0.035] p-4 backdrop-blur-xl sm:p-6">
                <TeamComparison />
              </div>

            </div>
          </div>
        }
      />

      {/* SEARCH */}
      <Route
        path="/search"
        element={
          <Navigate
            to="/players"
            replace
          />
        }
      />

      {/* SETTINGS */}
      <Route
        path="/settings"
        element={
          <div className="flex min-h-screen items-center justify-center bg-[#050816] px-6 text-white">
            <div className="text-center">

              <h1 className="text-4xl font-black">
                Settings
              </h1>

              <p className="mt-3 text-slate-500">
                Dashboard settings
              </p>

              <button
                type="button"
                onClick={() =>
                  window.history.back()
                }
                className="mt-6 rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-black transition hover:bg-orange-400"
              >
                Go Back
              </button>

            </div>
          </div>
        }
      />

      {/* UNKNOWN ROUTE */}
      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;