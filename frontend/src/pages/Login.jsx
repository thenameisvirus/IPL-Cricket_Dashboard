import { useEffect, useState } from "react";
import {
  Trophy,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Users,
  Target,
  Play,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const players = [
  {
    name: "Virat Kohli",
    role: "BATSMAN • RCB",
    image:
      "https://documents.iplt20.com/ipl/IPLHeadshot2026/2.png",
  },
  {
    name: "Rohit Sharma",
    role: "BATSMAN • MI",
    image:
      "https://documents.iplt20.com/ipl/IPLHeadshot2026/6.png",
  },
  {
    name: "MS Dhoni",
    role: "LEGEND • CSK",
    image:
      "https://documents.iplt20.com/ipl/IPLHeadshot2026/57.png",
  },
  {
    name: "Jasprit Bumrah",
    role: "BOWLER • MI",
    image:
      "https://documents.iplt20.com/ipl/IPLHeadshot2026/9.png",
  },
  {
    name: "Hardik Pandya",
    role: "ALL ROUNDER • MI",
    image:
      "https://documents.iplt20.com/ipl/IPLHeadshot2026/54.png",
  },
  {
    name: "Ravindra Jadeja",
    role: "ALL ROUNDER • RR",
    image:
      "https://documents.iplt20.com/ipl/IPLHeadshot2026/46.png",
  },
  {
    name: "Rishabh Pant",
    role: "WICKET KEEPER • LSG",
    image:
      "https://documents.iplt20.com/ipl/IPLHeadshot2026/18.png",
  },
  {
    name: "KL Rahul",
    role: "BATSMAN • DC",
    image:
      "https://documents.iplt20.com/ipl/IPLHeadshot2026/19.png",
  },
  {
    name: "Suryakumar Yadav",
    role: "BATSMAN • MI",
    image:
      "https://documents.iplt20.com/ipl/IPLHeadshot2026/174.png",
  },
  {
    name: "Shubman Gill",
    role: "BATSMAN • GT",
    image:
      "https://documents.iplt20.com/ipl/IPLHeadshot2026/62.png",
  },
  {
    name: "Bhuvneshwar Kumar",
    role: "BOWLER • RCB",
    image:
      "https://documents.iplt20.com/ipl/IPLHeadshot2026/15.png",
  },
  {
    name: "Sanju Samson",
    role: "WICKET KEEPER • CSK",
    image:
      "https://documents.iplt20.com/ipl/IPLHeadshot2026/190.png",
  },
  {
    name: "Arshdeep Singh",
    role: "BOWLER • PBKS",
    image:
      "https://documents.iplt20.com/ipl/IPLHeadshot2026/125.png",
  },
  {
    name: "Ishan Kishan",
    role: "WICKET KEEPER • SRH",
    image:
        "https://documents.iplt20.com/ipl/IPLHeadshot2025/164.png",
  },
  {
    name: "Vaibhav Sooryavanshi",
    role: "BATSMAN • RR",
    image:
      "https://documents.iplt20.com/ipl/IPLHeadshot2026/3498.png",
  },
];
const scrollPlayers = [...players, ...players, ...players];

function Login({ onLogin }) {
  const [showLogin, setShowLogin] = useState(false);
  const [intro, setIntro] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [activePlayer, setActivePlayer] = useState(0);

  /* =========================================================
     INTRO
  ========================================================== */

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntro(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  /* =========================================================
     PLAYER SLIDER
  ========================================================== */

  useEffect(() => {
    const timer = setInterval(() => {
      setActivePlayer((prev) => (prev + 1) % players.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const active = players[activePlayer];

  /* =========================================================
     IMAGE ERROR
  ========================================================== */

  const handleImageError = (e) => {
    if (e?.currentTarget) {
      e.currentTarget.style.display = "none";
    }
  };

  /* =========================================================
     LOGIN
  ========================================================== */

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    const cleanUsername = username.trim().toLowerCase();

    if (!cleanUsername || !password.trim()) {
      setError("Please enter username and password.");
      setLoading(false);
      return;
    }

    if (
      cleanUsername !== "admin" ||
      password !== "admin123"
    ) {
      setError("Invalid username or password.");
      setLoading(false);
      return;
    }

    setLoading(true);

    /* SAVE AUTH STATE */

    localStorage.setItem("iplLoggedIn", "true");
    localStorage.setItem(
      "iplUsername",
      username.trim()
    );

    if (rememberMe) {
      localStorage.setItem("iplRememberMe", "true");
    } else {
      localStorage.removeItem("iplRememberMe");
    }

    /*
      IMPORTANT:
      App.jsx receives this callback and updates
      its React authentication state immediately.
    */

    if (typeof onLogin === "function") {
      onLogin();
      return;
    }

    /*
      Fallback only if Login is rendered without onLogin.
    */

    window.location.href = "/dashboard";
  };

  /* =========================================================
     DEMO LOGIN
  ========================================================== */

  const fillDemoLogin = () => {
    setUsername("admin");
    setPassword("admin123");
    setError("");
    setShowLogin(true);

    setTimeout(() => {
      document
        .getElementById("login-panel")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }, 100);
  };

  /* =========================================================
     GO TO LOGIN
  ========================================================== */

  const goToLogin = () => {
    setShowLogin(true);

    setTimeout(() => {
      document
        .getElementById("login-panel")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }, 100);
  };

  /* =========================================================
     EXPLORE
  ========================================================== */

  const exploreDashboard = () => {
    setShowLogin(true);

    setTimeout(() => {
      document
        .getElementById("explore-section")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }, 100);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black font-sans text-white">

      {/* =====================================================
          INTRO
      ====================================================== */}

      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-black transition-all duration-1000 ${
          intro
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className={`text-center transition-all duration-1000 ${
            intro
              ? "scale-100 opacity-100"
              : "scale-125 opacity-0"
          }`}
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-yellow-200 via-yellow-500 to-yellow-700 shadow-[0_0_100px_rgba(234,179,8,0.35)] sm:h-24 sm:w-24">
            <Trophy
              size={42}
              className="text-black"
              strokeWidth={2.5}
            />
          </div>

          <h1 className="mt-7 text-2xl font-black tracking-[5px] sm:text-4xl">
            IPL CRICKET
          </h1>

          <p className="mt-2 text-[9px] font-black tracking-[6px] text-yellow-400 sm:text-xs">
            ANALYTICS
          </p>

          <div className="mx-auto mt-8 h-[2px] w-44 overflow-hidden bg-white/10">
            <div className="h-full animate-[introLoading_1.5s_ease-in-out_forwards] bg-yellow-400" />
          </div>
        </div>
      </div>

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="fixed inset-0 z-0 overflow-hidden bg-black">
        <div className="absolute inset-[-8%]">

          {/* ROW 1 */}

          <div className="absolute left-[-5%] top-[-8%] flex gap-4 animate-[scrollLeftOne_55s_linear_infinite] sm:gap-6">
            {scrollPlayers.map((player, index) => (
              <div
                key={`row-one-${player.name}-${index}`}
                className="relative h-[330px] w-[150px] shrink-0 overflow-hidden rounded-[18px] sm:h-[430px] sm:w-[205px] lg:h-[550px] lg:w-[250px]"
              >
                <img
                  src={player.image}
                  alt=""
                  onError={handleImageError}
                  className="h-full w-full object-cover object-top"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20" />
              </div>
            ))}
          </div>

          {/* ROW 2 */}

          <div className="absolute left-[-40%] top-[32%] flex gap-4 animate-[scrollRightOne_62s_linear_infinite] sm:gap-6">
            {[...scrollPlayers]
              .reverse()
              .map((player, index) => (
                <div
                  key={`row-two-${player.name}-${index}`}
                  className="relative h-[300px] w-[145px] shrink-0 overflow-hidden rounded-[18px] sm:h-[390px] sm:w-[195px] lg:h-[500px] lg:w-[240px]"
                >
                  <img
                    src={player.image}
                    alt=""
                    onError={handleImageError}
                    className="h-full w-full object-cover object-top"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-black/20" />
                </div>
              ))}
          </div>

          {/* ROW 3 */}

          <div className="absolute left-[-5%] top-[72%] flex gap-4 animate-[scrollLeftTwo_72s_linear_infinite] sm:gap-6">
            {scrollPlayers.map((player, index) => (
              <div
                key={`row-three-${player.name}-${index}`}
                className="relative h-[300px] w-[150px] shrink-0 overflow-hidden rounded-[18px] sm:h-[390px] sm:w-[200px] lg:h-[480px] lg:w-[250px]"
              >
                <img
                  src={player.image}
                  alt=""
                  onError={handleImageError}
                  className="h-full w-full object-cover object-top"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-black/20" />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-0 bg-black/60" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/35 to-black/95" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.45)_45%,rgba(0,0,0,0.95)_100%)]" />

        <div className="absolute inset-0 shadow-[inset_0_0_180px_80px_rgba(0,0,0,0.95)]" />

        <div className="absolute left-[35%] top-[15%] h-[500px] w-[500px] rounded-full bg-yellow-500/[0.035] blur-[160px]" />
      </div>

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header className="relative z-50 w-full px-5 py-5 sm:px-8 sm:py-6 lg:px-14 xl:px-20">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between">

          <div className="flex items-center gap-3.5">

            <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-yellow-200 via-yellow-500 to-yellow-700 shadow-[0_0_40px_rgba(234,179,8,0.3)] sm:h-12 sm:w-12">
              <Trophy
                size={23}
                className="text-black"
              />
            </div>

            <div>
              <h1 className="text-[13px] font-black leading-none tracking-[1.5px] sm:text-xl">
                IPL CRICKET
              </h1>

              <p className="mt-1.5 text-[7px] font-black tracking-[3.5px] text-yellow-400 sm:text-[9px]">
                ANALYTICS
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={goToLogin}
            className="rounded-lg bg-yellow-500 px-5 py-2.5 text-[11px] font-black tracking-wide text-black shadow-[0_0_30px_rgba(234,179,8,0.15)] transition-all duration-300 hover:bg-yellow-400 sm:px-7 sm:py-3 sm:text-sm"
          >
            SIGN IN
          </button>

        </div>
      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="relative z-20">

        {/* ===================================================
            HERO
        ==================================================== */}

        <section className="flex min-h-[calc(100vh-88px)] items-center px-5 sm:px-8 lg:px-14 xl:px-20">
          <div className="mx-auto w-full max-w-[1500px]">
            <div className="max-w-[820px] pb-20 lg:pb-10">

              <div className="inline-flex items-center gap-2.5 rounded-full border border-yellow-500/25 bg-black/45 px-3.5 py-2 backdrop-blur-xl">
                <Sparkles
                  size={13}
                  className="text-yellow-400"
                />

                <span className="text-[8px] font-black tracking-[2.7px] text-yellow-400 sm:text-[9px]">
                  THE ULTIMATE IPL ANALYTICS EXPERIENCE
                </span>
              </div>

              <h2 className="mt-7 text-[48px] font-black leading-[0.88] tracking-[-5px] sm:mt-8 sm:text-7xl lg:text-[96px] xl:text-[108px]">
                Welcome to
                <br />

                <span className="text-yellow-400">
                  IPL Analytics.
                </span>
              </h2>

              <p className="mt-7 max-w-[670px] text-[14px] leading-[1.8] text-gray-300/80 sm:mt-8 sm:text-[17px]">
                Explore every match, every player and every
                performance statistic in one powerful cricket
                dashboard built for IPL fans and analysts.
              </p>

              <div className="mt-8 flex flex-col gap-3.5 sm:mt-9 sm:flex-row">

                <button
                  type="button"
                  onClick={exploreDashboard}
                  className="group flex h-14 items-center justify-center gap-3 rounded-xl bg-white px-8 text-[13px] font-black tracking-wide text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-200"
                >
                  <Play
                    size={18}
                    fill="currentColor"
                  />

                  Explore

                  <ChevronRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>

                <button
                  type="button"
                  onClick={goToLogin}
                  className="flex h-14 items-center justify-center gap-3 rounded-xl bg-yellow-500 px-9 text-[13px] font-black tracking-wide text-black shadow-[0_0_45px_rgba(234,179,8,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-yellow-400"
                >
                  <Lock size={18} />
                  Login
                </button>

              </div>

              <div className="mt-11 flex max-w-[700px] flex-wrap gap-8 border-t border-white/10 pt-7 sm:gap-12">

                <StatItem
                  value="100+"
                  label="PLAYERS"
                />

                <StatItem
                  value="1000+"
                  label="MATCHES"
                />

                <StatItem
                  value="10+"
                  label="TEAMS"
                />

                <StatItem
                  value="LIVE"
                  label="ANALYTICS"
                />

              </div>

            </div>
          </div>
        </section>

        {/* ===================================================
            EXPLORE
        ==================================================== */}

        <section
          id="explore-section"
          className="relative min-h-screen bg-gradient-to-b from-transparent via-black/90 to-black px-5 py-24 sm:px-8 sm:py-28 lg:px-14 xl:px-20"
        >
          <div className="mx-auto max-w-[1250px]">

            <div className="mx-auto max-w-[700px] text-center">

              <p className="text-[9px] font-black tracking-[4px] text-yellow-400 sm:text-[10px]">
                EXPLORE THE PLATFORM
              </p>

              <h2 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-2px] sm:text-6xl lg:text-7xl">
                Everything IPL.
                <br />

                <span className="text-yellow-400">
                  In One Place.
                </span>
              </h2>

              <p className="mt-6 text-[14px] leading-7 text-gray-500 sm:text-[15px]">
                Explore the tools available inside your IPL
                Cricket Analytics command center.
              </p>

            </div>

            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {[
                {
                  icon: BarChart3,
                  title: "Match Analytics",
                  text: "Detailed match statistics and performance insights.",
                },
                {
                  icon: Users,
                  title: "Player Profiles",
                  text: "Explore batting, bowling and player performance.",
                },
                {
                  icon: Target,
                  title: "Predictions",
                  text: "Use intelligent data-driven match predictions.",
                },
                {
                  icon: Trophy,
                  title: "Team Insights",
                  text: "Compare teams, wins, venues and performances.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="group rounded-2xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-yellow-500/30 hover:bg-yellow-500/[0.04] sm:p-7"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-yellow-500/15 bg-yellow-500/[0.08]">
                      <Icon
                        size={22}
                        className="text-yellow-400"
                      />
                    </div>

                    <h3 className="mt-6 text-[17px] font-black tracking-tight">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-[13px] leading-6 text-gray-500">
                      {item.text}
                    </p>

                    <div className="mt-6 flex items-center gap-1 text-[9px] font-black tracking-[2px] text-yellow-500">
                      EXPLORE
                      <ChevronRight size={13} />
                    </div>
                  </div>
                );
              })}

            </div>

            <div className="mt-14 text-center">
              <button
                type="button"
                onClick={goToLogin}
                className="inline-flex h-14 items-center gap-3 rounded-xl bg-yellow-500 px-8 text-[13px] font-black tracking-wide text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-yellow-400"
              >
                <Lock size={18} />
                Login to Continue
                <ArrowRight size={18} />
              </button>
            </div>

          </div>
        </section>

        {/* ===================================================
            LOGIN SECTION
        ==================================================== */}

        {showLogin && (
          <section
            id="login-panel"
            className="relative flex min-h-screen items-center bg-black px-4 py-20 sm:px-8 sm:py-28 lg:px-14 xl:px-20"
          >

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.06),transparent_55%)]" />

            <div className="relative z-10 mx-auto w-full max-w-[1200px]">

              <div className="grid overflow-hidden rounded-[30px] border border-white/10 bg-black/80 shadow-[0_40px_120px_rgba(0,0,0,0.8)] lg:grid-cols-[1fr_0.8fr]">

                {/* PLAYER SIDE */}

                <div className="relative min-h-[500px] overflow-hidden sm:min-h-[620px]">

                  {players.map(
                    (player, index) => (
                      <div
                        key={player.name}
                        className={`absolute inset-0 transition-all duration-[1500ms] ${
                          index === activePlayer
                            ? "scale-100 opacity-100"
                            : "scale-110 opacity-0"
                        }`}
                      >
                        <img
                          src={player.image}
                          alt={player.name}
                          onError={handleImageError}
                          className="h-full w-full object-cover object-top"
                          referrerPolicy="no-referrer"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/10" />
                      </div>
                    )
                  )}

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-8 sm:p-12">

                    <p className="text-[9px] font-black tracking-[3px] text-yellow-400">
                      {active.role}
                    </p>

                    <h3 className="mt-2 text-4xl font-black tracking-tight sm:text-6xl">
                      {active.name}
                    </h3>

                    <div className="mt-5 flex gap-1.5">

                      {players.map(
                        (player, index) => (
                          <button
                            key={player.name}
                            type="button"
                            onClick={() =>
                              setActivePlayer(index)
                            }
                            className={`h-1 rounded-full transition-all ${
                              index === activePlayer
                                ? "w-10 bg-yellow-400"
                                : "w-2 bg-white/30"
                            }`}
                          />
                        )
                      )}

                    </div>

                  </div>
                </div>

                {/* LOGIN SIDE */}

                <div className="flex items-center bg-black p-7 sm:p-12 lg:p-14">

                  <div className="mx-auto w-full max-w-[430px]">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-yellow-500/20 bg-yellow-500/[0.08]">
                      <Lock
                        size={23}
                        className="text-yellow-400"
                      />
                    </div>

                    <p className="mt-6 text-[9px] font-black tracking-[3px] text-yellow-400">
                      SECURE ACCESS
                    </p>

                    <h2 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
                      Sign In
                    </h2>

                    <p className="mt-3 text-[13px] leading-6 text-gray-500">
                      Login to access your IPL analytics dashboard.
                    </p>

                    {error && (
                      <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/[0.08] p-3.5 text-xs font-semibold text-red-400">
                        {error}
                      </div>
                    )}

                    <form
                      onSubmit={handleLogin}
                      className="mt-7 space-y-5"
                    >

                      {/* USERNAME */}

                      <div>
                        <label className="mb-2.5 block text-[9px] font-black tracking-[1.7px] text-gray-400">
                          USERNAME
                        </label>

                        <div className="relative">

                          <User
                            size={18}
                            className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-yellow-500"
                          />

                          <input
                            type="text"
                            value={username}
                            onChange={(e) => {
                              setUsername(e.target.value);
                              setError("");
                            }}
                            placeholder="Enter username"
                            autoComplete="username"
                            disabled={loading}
                            className="h-14 w-full rounded-xl border border-white/10 bg-white/[0.045] text-[13px] text-white outline-none transition-all placeholder:text-gray-600 focus:border-yellow-500/60 focus:bg-yellow-500/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
                            style={{
                              paddingLeft: "50px",
                              paddingRight: "16px",
                            }}
                          />

                        </div>
                      </div>

                      {/* PASSWORD */}

                      <div>
                        <label className="mb-2.5 block text-[9px] font-black tracking-[1.7px] text-gray-400">
                          PASSWORD
                        </label>

                        <div className="relative">

                          <Lock
                            size={18}
                            className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-yellow-500"
                          />

                          <input
                            type={
                              showPassword
                                ? "text"
                                : "password"
                            }
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              setError("");
                            }}
                            placeholder="Enter password"
                            autoComplete="current-password"
                            disabled={loading}
                            className="h-14 w-full rounded-xl border border-white/10 bg-white/[0.045] text-[13px] text-white outline-none transition-all placeholder:text-gray-600 focus:border-yellow-500/60 focus:bg-yellow-500/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
                            style={{
                              paddingLeft: "50px",
                              paddingRight: "52px",
                            }}
                          />

                          <button
                            type="button"
                            disabled={loading}
                            onClick={() =>
                              setShowPassword(
                                (prev) => !prev
                              )
                            }
                            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-gray-500 transition hover:text-yellow-400 disabled:opacity-40"
                          >
                            {showPassword ? (
                              <EyeOff size={19} />
                            ) : (
                              <Eye size={19} />
                            )}
                          </button>

                        </div>
                      </div>

                      {/* OPTIONS */}

                      <div className="flex items-center justify-between gap-3">

                        <label className="flex cursor-pointer items-center gap-2 text-[11px] text-gray-500">

                          <input
                            type="checkbox"
                            checked={rememberMe}
                            disabled={loading}
                            onChange={(e) =>
                              setRememberMe(
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 accent-yellow-500"
                          />

                          Remember me
                        </label>

                        <button
                          type="button"
                          disabled={loading}
                          onClick={() =>
                            setError(
                              "Password recovery is not available in demo mode."
                            )
                          }
                          className="text-[11px] text-yellow-500 transition hover:text-yellow-300 disabled:opacity-40"
                        >
                          Forgot password?
                        </button>

                      </div>

                      {/* LOGIN BUTTON */}

                      <button
                        type="submit"
                        disabled={loading}
                        className="group relative flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 text-[13px] font-black tracking-wide text-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_50px_rgba(234,179,8,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
                      >

                        {loading ? (
                          <>
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                            SIGNING IN...
                          </>
                        ) : (
                          <>
                            SIGN IN

                            <ArrowRight
                              size={19}
                              className="transition-transform group-hover:translate-x-1"
                            />
                          </>
                        )}

                      </button>

                    </form>

                    {/* DEMO ACCESS */}

                    <button
                      type="button"
                      disabled={loading}
                      onClick={fillDemoLogin}
                      className="mt-6 w-full rounded-xl border border-yellow-500/15 bg-yellow-500/[0.025] p-4 text-left transition-all duration-300 hover:border-yellow-500/25 hover:bg-yellow-500/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
                    >

                      <div className="flex gap-3">

                        <ShieldCheck
                          size={20}
                          className="shrink-0 text-yellow-500"
                        />

                        <div>

                          <p className="text-xs font-black text-gray-300">
                            DEMO ACCESS
                          </p>

                          <p className="mt-1.5 text-[11px] text-gray-500">
                            Click here to fill demo credentials.
                          </p>

                          <p className="mt-2 text-[11px] text-gray-500">
                            admin /{" "}
                            <span className="font-bold text-yellow-400">
                              admin123
                            </span>
                          </p>

                        </div>

                      </div>

                    </button>

                    <div className="mt-6 flex items-center justify-center gap-2 text-[8px] tracking-[1.5px] text-gray-700">
                      <ShieldCheck size={12} />
                      SECURE IPL ANALYTICS ACCESS
                    </div>

                  </div>
                </div>

              </div>
            </div>

          </section>
        )}

      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="relative z-30 border-t border-white/10 bg-black px-6 py-8">
        <div className="mx-auto flex max-w-[1250px] flex-col items-center justify-between gap-3 sm:flex-row">

          <span className="text-[9px] text-gray-600">
            © 2026 IPL Cricket Analytics
          </span>

          <span className="text-[9px] tracking-[2px] text-yellow-600/70">
            ANALYZE • PREDICT • WIN
          </span>

        </div>
      </footer>

      {/* =====================================================
          ANIMATIONS
      ====================================================== */}

      <style>{`
        @keyframes scrollLeftOne {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(-33.333333%);
          }
        }

        @keyframes scrollRightOne {
          0% {
            transform: translateX(-33.333333%);
          }

          100% {
            transform: translateX(0);
          }
        }

        @keyframes scrollLeftTwo {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(-33.333333%);
          }
        }

        @keyframes introLoading {
          0% {
            width: 0%;
          }

          100% {
            width: 100%;
          }
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #000;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        button,
        input {
          font-family: inherit;
        }

        ::-webkit-scrollbar {
          width: 7px;
        }

        ::-webkit-scrollbar-track {
          background: #000;
        }

        ::-webkit-scrollbar-thumb {
          background: #4a3a00;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #eab308;
        }

        @media (max-width: 768px) {
          @keyframes scrollLeftOne {
            0% {
              transform: translateX(0);
            }

            100% {
              transform: translateX(-50%);
            }
          }

          @keyframes scrollRightOne {
            0% {
              transform: translateX(-50%);
            }

            100% {
              transform: translateX(0);
            }
          }

          @keyframes scrollLeftTwo {
            0% {
              transform: translateX(0);
            }

            100% {
              transform: translateX(-50%);
            }
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </div>
  );
}

/* =========================================================
   STAT ITEM
========================================================= */

function StatItem({ value, label }) {
  return (
    <div>
      <p className="text-2xl font-black tracking-tight sm:text-3xl">
        {value}
      </p>

      <p className="mt-1.5 text-[8px] font-bold tracking-[2px] text-gray-500 sm:text-[9px]">
        {label}
      </p>
    </div>
  );
}

export default Login;