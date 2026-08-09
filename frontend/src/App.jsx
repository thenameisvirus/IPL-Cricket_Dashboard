import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Players from "./pages/Players";
import Teams from "./pages/Teams";

function App() {
  const token = localStorage.getItem("token");

  // Login protection
  if (!token) {
    return <Login onLogin={() => window.location.reload()} />;
  }

  return (
    <Routes>

      {/* =========================
          ROOT
      ========================= */}
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      {/* =========================
          DASHBOARD
      ========================= */}
      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      {/* =========================
          PLAYERS
      ========================= */}
      <Route
        path="/players"
        element={<Players />}
      />

      {/* =========================
          TEAMS
      ========================= */}
      <Route
        path="/teams"
        element={<Teams />}
      />

      {/* =========================
          ANALYTICS
      ========================= */}
      <Route
        path="/analytics"
        element={<Analytics />}
      />

      {/* =========================
          SEARCH
      ========================= */}
      <Route
        path="/search"
        element={<Navigate to="/players" replace />}
      />

      {/* =========================
          AI PREDICTION
      ========================= */}
      <Route
        path="/prediction"
        element={
          <div className="min-h-screen bg-[#060b16] flex items-center justify-center text-white">
            <div className="text-center">
              <h1 className="text-4xl font-black">
                AI Match Prediction
              </h1>

              <p className="mt-3 text-slate-500">
                Match prediction module
              </p>
            </div>
          </div>
        }
      />

      {/* =========================
          TEAM COMPARISON
      ========================= */}
      <Route
        path="/comparison"
        element={
          <div className="min-h-screen bg-[#060b16] flex items-center justify-center text-white">
            <div className="text-center">
              <h1 className="text-4xl font-black">
                Team Comparison
              </h1>

              <p className="mt-3 text-slate-500">
                Compare IPL teams and performances
              </p>
            </div>
          </div>
        }
      />

      {/* =========================
          SETTINGS
      ========================= */}
      <Route
        path="/settings"
        element={
          <div className="min-h-screen bg-[#060b16] flex items-center justify-center text-white">
            <div className="text-center">
              <h1 className="text-4xl font-black">
                Settings
              </h1>

              <p className="mt-3 text-slate-500">
                Dashboard settings
              </p>
            </div>
          </div>
        }
      />

      {/* =========================
          UNKNOWN ROUTE
      ========================= */}
      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />

    </Routes>
  );
}

export default App;