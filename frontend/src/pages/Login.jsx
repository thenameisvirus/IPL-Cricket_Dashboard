import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    role: "BATSMAN",
    image: "https://documents.iplt20.com/ipl/IPLHeadshot2025/2.png",
  },
  {
    name: "MS Dhoni",
    role: "LEGEND",
    image: "https://documents.iplt20.com/ipl/IPLHeadshot2025/57.png",
  },
  {
    name: "Rohit Sharma",
    role: "CAPTAIN",
    image: "https://documents.iplt20.com/ipl/IPLHeadshot2025/6.png",
  },
  {
    name: "Hardik Pandya",
    role: "ALL ROUNDER",
    image: "https://documents.iplt20.com/ipl/IPLHeadshot2025/54.png",
  },
  {
    name: "Jasprit Bumrah",
    role: "BOWLER",
    image: "https://documents.iplt20.com/ipl/IPLHeadshot2025/9.png",
  },
  {
    name: "Ravindra Jadeja",
    role: "ALL ROUNDER",
    image: "https://documents.iplt20.com/ipl/IPLHeadshot2025/46.png",
  },
  {
    name: "Rishabh Pant",
    role: "WICKET KEEPER",
    image: "https://documents.iplt20.com/ipl/IPLHeadshot2025/18.png",
  },
  {
    name: "KL Rahul",
    role: "BATSMAN",
    image: "https://documents.iplt20.com/ipl/IPLHeadshot2025/19.png",
  },
  {
    name: "Suryakumar Yadav",
    role: "BATSMAN",
    image: "https://documents.iplt20.com/ipl/IPLHeadshot2025/174.png",
  },
  {
    name: "Shubman Gill",
    role: "BATSMAN",
    image: "https://documents.iplt20.com/ipl/IPLHeadshot2025/62.png",
  },
  {
    name: "Mohammed Siraj",
    role: "BOWLER",
    image: "https://documents.iplt20.com/ipl/IPLHeadshot2025/3840.png",
  },
  {
    name: "Sanju Samson",
    role: "WICKET KEEPER",
    image: "https://documents.iplt20.com/ipl/IPLHeadshot2025/190.png",
  },
];

const scrollPlayers = [...players, ...players, ...players];

function Login() {
  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(false);
  const [intro, setIntro] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [activePlayer, setActivePlayer] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntro(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActivePlayer((prev) => (prev + 1) % players.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const active = players[activePlayer];

  const handleImageError = (e) => {
    e.currentTarget.style.display = "none";
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (
        username.trim().toLowerCase() === "admin" &&
        password === "admin123"
      ) {
        localStorage.setItem("iplLoggedIn", "true");
        localStorage.setItem("iplUsername", username.trim());

        if (rememberMe) {
          localStorage.setItem("iplRememberMe", "true");
        } else {
          localStorage.removeItem("iplRememberMe");
        }

        navigate("/dashboard", {
          replace: true,
        });
      } else {
        setError("Invalid username or password.");
        setLoading(false);
      }
    }, 900);
  };

  const fillDemoLogin = () => {
    setUsername("admin");
    setPassword("admin123");
    setError("");
  };

  const goToLogin = () => {
    setShowLogin(true);

    setTimeout(() => {
      document.getElementById("login-panel")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const exploreDashboard = () => {
    setShowLogin(true);

    setTimeout(() => {
      document.getElementById("explore-section")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative font-sans">

      {/* =====================================================
          INTRO
      ====================================================== */}

      <div
        className={`fixed inset-0 z-[100] bg-black flex items-center justify-center transition-all duration-1000 ${
          intro
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`text-center transition-all duration-1000 ${
            intro
              ? "scale-100 opacity-100"
              : "scale-125 opacity-0"
          }`}
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-[28px] bg-gradient-to-br from-yellow-200 via-yellow-500 to-yellow-700 flex items-center justify-center shadow-[0_0_100px_rgba(234,179,8,0.35)]">
            <Trophy
              size={42}
              className="text-black"
              strokeWidth={2.5}
            />
          </div>

          <h1 className="mt-7 text-2xl sm:text-4xl font-black tracking-[5px]">
            IPL CRICKET
          </h1>

          <p className="mt-2 text-[9px] sm:text-xs text-yellow-400 tracking-[6px] font-black">
            ANALYTICS
          </p>

          <div className="mt-8 w-44 h-[2px] bg-white/10 mx-auto overflow-hidden">
            <div className="h-full bg-yellow-400 animate-[introLoading_1.5s_ease-in-out_forwards]" />
          </div>
        </div>
      </div>

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="fixed inset-0 z-0 bg-black overflow-hidden">

        <div className="absolute inset-[-8%]">

          <div className="absolute top-[-8%] left-[-5%] flex gap-4 sm:gap-6 animate-[scrollLeftOne_55s_linear_infinite]">

            {scrollPlayers.map((player, index) => (
              <div
                key={`row-one-${player.name}-${index}`}
                className="relative shrink-0 w-[150px] sm:w-[205px] lg:w-[250px] h-[330px] sm:h-[430px] lg:h-[550px] overflow-hidden rounded-[18px]"
              >
                <img
                  src={player.image}
                  alt=""
                  onError={handleImageError}
                  className="w-full h-full object-cover object-top"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20" />
              </div>
            ))}

          </div>

          <div className="absolute top-[32%] left-[-40%] flex gap-4 sm:gap-6 animate-[scrollRightOne_62s_linear_infinite]">

            {[...scrollPlayers]
              .reverse()
              .map((player, index) => (
                <div
                  key={`row-two-${player.name}-${index}`}
                  className="relative shrink-0 w-[145px] sm:w-[195px] lg:w-[240px] h-[300px] sm:h-[390px] lg:h-[500px] overflow-hidden rounded-[18px]"
                >
                  <img
                    src={player.image}
                    alt=""
                    onError={handleImageError}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-black/20" />
                </div>
              ))}

          </div>

          <div className="absolute top-[72%] left-[-5%] flex gap-4 sm:gap-6 animate-[scrollLeftTwo_72s_linear_infinite]">

            {scrollPlayers.map((player, index) => (
              <div
                key={`row-three-${player.name}-${index}`}
                className="relative shrink-0 w-[150px] sm:w-[200px] lg:w-[250px] h-[300px] sm:h-[390px] lg:h-[480px] overflow-hidden rounded-[18px]"
              >
                <img
                  src={player.image}
                  alt=""
                  onError={handleImageError}
                  className="w-full h-full object-cover object-top"
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

        <div className="absolute top-[15%] left-[35%] w-[500px] h-[500px] rounded-full bg-yellow-500/[0.035] blur-[160px]" />

      </div>

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header className="relative z-50 w-full px-5 sm:px-8 lg:px-14 xl:px-20 py-5 sm:py-6">

        <div className="max-w-[1500px] mx-auto flex items-center justify-between">

          <div className="flex items-center gap-3.5">

            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[14px] bg-gradient-to-br from-yellow-200 via-yellow-500 to-yellow-700 flex items-center justify-center shadow-[0_0_40px_rgba(234,179,8,0.3)]">

              <Trophy
                size={23}
                className="text-black"
              />

            </div>

            <div>

              <h1 className="text-[13px] sm:text-xl font-black tracking-[1.5px] leading-none">
                IPL CRICKET
              </h1>

              <p className="text-[7px] sm:text-[9px] text-yellow-400 tracking-[3.5px] font-black mt-1.5">
                ANALYTICS
              </p>

            </div>

          </div>

          <button
            onClick={goToLogin}
            className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black text-[11px] sm:text-sm font-black tracking-wide transition-all duration-300 shadow-[0_0_30px_rgba(234,179,8,0.15)]"
          >
            SIGN IN
          </button>

        </div>

      </header>

      {/* =====================================================
          HERO
      ====================================================== */}

      <main className="relative z-20">

        <section className="min-h-[calc(100vh-88px)] flex items-center px-5 sm:px-8 lg:px-14 xl:px-20">

          <div className="w-full max-w-[1500px] mx-auto">

            <div className="max-w-[820px] pb-20 lg:pb-10">

              <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full border border-yellow-500/25 bg-black/45 backdrop-blur-xl">

                <Sparkles
                  size={13}
                  className="text-yellow-400"
                />

                <span className="text-[8px] sm:text-[9px] tracking-[2.7px] text-yellow-400 font-black">
                  THE ULTIMATE IPL ANALYTICS EXPERIENCE
                </span>

              </div>

              <h2 className="mt-7 sm:mt-8 text-[48px] sm:text-7xl lg:text-[96px] xl:text-[108px] font-black leading-[0.88] tracking-[-5px]">

                Welcome to
                <br />

                <span className="text-yellow-400">
                  IPL Analytics.
                </span>

              </h2>

              <p className="mt-7 sm:mt-8 max-w-[670px] text-[14px] sm:text-[17px] text-gray-300/80 leading-[1.8] tracking-[0.1px]">

                Explore every match, every player and every
                performance statistic in one powerful cricket
                dashboard built for IPL fans and analysts.

              </p>

              <div className="flex flex-col sm:flex-row gap-3.5 mt-8 sm:mt-9">

                <button
                  onClick={exploreDashboard}
                  className="group h-14 px-8 rounded-xl bg-white text-black font-black text-[13px] tracking-wide flex items-center justify-center gap-3 hover:bg-gray-200 hover:-translate-y-0.5 transition-all duration-300"
                >

                  <Play
                    size={18}
                    fill="currentColor"
                  />

                  Explore

                  <ChevronRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />

                </button>

                <button
                  onClick={goToLogin}
                  className="h-14 px-9 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-black text-[13px] tracking-wide flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_45px_rgba(234,179,8,0.2)] hover:-translate-y-0.5"
                >

                  <Lock size={18} />

                  Login

                </button>

              </div>

              <div className="flex flex-wrap gap-8 sm:gap-12 mt-11 pt-7 border-t border-white/10 max-w-[700px]">

                <div>
                  <p className="text-2xl sm:text-3xl font-black tracking-tight">
                    100+
                  </p>

                  <p className="text-[8px] sm:text-[9px] text-gray-500 tracking-[2px] font-bold mt-1.5">
                    PLAYERS
                  </p>
                </div>

                <div>
                  <p className="text-2xl sm:text-3xl font-black tracking-tight">
                    1000+
                  </p>

                  <p className="text-[8px] sm:text-[9px] text-gray-500 tracking-[2px] font-bold mt-1.5">
                    MATCHES
                  </p>
                </div>

                <div>
                  <p className="text-2xl sm:text-3xl font-black tracking-tight">
                    10+
                  </p>

                  <p className="text-[8px] sm:text-[9px] text-gray-500 tracking-[2px] font-bold mt-1.5">
                    TEAMS
                  </p>
                </div>

                <div>
                  <p className="text-2xl sm:text-3xl font-black tracking-tight">
                    LIVE
                  </p>

                  <p className="text-[8px] sm:text-[9px] text-gray-500 tracking-[2px] font-bold mt-1.5">
                    ANALYTICS
                  </p>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            EXPLORE
        ==================================================== */}

        <section
          id="explore-section"
          className="relative min-h-screen px-5 sm:px-8 lg:px-14 xl:px-20 py-24 sm:py-28 bg-gradient-to-b from-transparent via-black/90 to-black"
        >

          <div className="max-w-[1250px] mx-auto">

            <div className="text-center max-w-[700px] mx-auto">

              <p className="text-yellow-400 text-[9px] sm:text-[10px] tracking-[4px] font-black">
                EXPLORE THE PLATFORM
              </p>

              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-[-2px] mt-4 leading-[0.95]">

                Everything IPL.
                <br />

                <span className="text-yellow-400">
                  In One Place.
                </span>

              </h2>

              <p className="text-[14px] sm:text-[15px] text-gray-500 mt-6 leading-7">
                Explore the tools available inside your IPL
                Cricket Analytics command center.
              </p>

            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-14">

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
                    className="group p-6 sm:p-7 rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-xl hover:border-yellow-500/30 hover:bg-yellow-500/[0.04] hover:-translate-y-1 transition-all duration-500"
                  >

                    <div className="w-12 h-12 rounded-xl bg-yellow-500/[0.08] border border-yellow-500/15 flex items-center justify-center">

                      <Icon
                        size={22}
                        className="text-yellow-400"
                      />

                    </div>

                    <h3 className="text-[17px] font-black mt-6 tracking-tight">
                      {item.title}
                    </h3>

                    <p className="text-[13px] text-gray-500 leading-6 mt-3">
                      {item.text}
                    </p>

                    <div className="mt-6 flex items-center gap-1 text-yellow-500 text-[9px] tracking-[2px] font-black">
                      EXPLORE
                      <ChevronRight size={13} />
                    </div>

                  </div>
                );
              })}

            </div>

            <div className="mt-14 text-center">

              <button
                onClick={goToLogin}
                className="inline-flex items-center gap-3 px-8 h-14 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-black text-[13px] tracking-wide transition-all duration-300 hover:-translate-y-0.5"
              >

                <Lock size={18} />

                Login to Continue

                <ArrowRight size={18} />

              </button>

            </div>

          </div>

        </section>

        {/* ===================================================
            LOGIN
        ==================================================== */}

        {showLogin && (
          <section
            id="login-panel"
            className="relative min-h-screen px-4 sm:px-8 lg:px-14 xl:px-20 py-20 sm:py-28 flex items-center bg-black"
          >

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.06),transparent_55%)]" />

            <div className="relative z-10 w-full max-w-[1200px] mx-auto">

              <div className="grid lg:grid-cols-[1fr_0.8fr] rounded-[30px] overflow-hidden border border-white/10 bg-black/80 shadow-[0_40px_120px_rgba(0,0,0,0.8)]">

                {/* PLAYER SIDE */}

                <div className="relative min-h-[620px] overflow-hidden">

                  {players.map((player, index) => (
                    <div
                      key={player.name}
                      className={`absolute inset-0 transition-all duration-[1500ms] ${
                        index === activePlayer
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-110"
                      }`}
                    >

                      <img
                        src={player.image}
                        alt={player.name}
                        onError={handleImageError}
                        className="w-full h-full object-cover object-top"
                        referrerPolicy="no-referrer"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/10" />

                    </div>
                  ))}

                  <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 bg-gradient-to-t from-black via-black/80 to-transparent">

                    <p className="text-yellow-400 text-[9px] tracking-[3px] font-black">
                      {active.role}
                    </p>

                    <h3 className="text-4xl sm:text-6xl font-black mt-2 tracking-tight">
                      {active.name}
                    </h3>

                    <div className="flex gap-1.5 mt-5">

                      {players.map((player, index) => (
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
                      ))}

                    </div>

                  </div>

                </div>

                {/* LOGIN SIDE */}

                <div className="p-7 sm:p-12 lg:p-14 flex items-center bg-black">

                  <div className="w-full max-w-[430px] mx-auto">

                    <div className="w-14 h-14 rounded-2xl bg-yellow-500/[0.08] border border-yellow-500/20 flex items-center justify-center">

                      <Lock
                        size={23}
                        className="text-yellow-400"
                      />

                    </div>

                    <p className="mt-6 text-yellow-400 text-[9px] tracking-[3px] font-black">
                      SECURE ACCESS
                    </p>

                    <h2 className="text-4xl sm:text-5xl font-black mt-2 tracking-tight">
                      Sign In
                    </h2>

                    <p className="text-[13px] text-gray-500 mt-3 leading-6">
                      Login to access your IPL analytics dashboard.
                    </p>

                    {error && (
                      <div className="mt-5 p-3.5 rounded-xl border border-red-500/30 bg-red-500/[0.08] text-red-400 text-xs font-semibold">
                        {error}
                      </div>
                    )}

                    <form
                      onSubmit={handleLogin}
                      className="mt-7 space-y-5"
                    >

                      {/* USERNAME */}

                      <div>

                        <label className="block text-[9px] font-black tracking-[1.7px] text-gray-400 mb-2.5">
                          USERNAME
                        </label>

                        <div className="relative">

                          <User
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500 pointer-events-none z-10"
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
                            className="w-full h-14 rounded-xl border border-white/10 bg-white/[0.045] text-white text-[13px] outline-none placeholder:text-gray-600 focus:border-yellow-500/60 focus:bg-yellow-500/[0.06] transition-all"
                            style={{
                              paddingLeft: "50px",
                              paddingRight: "16px",
                            }}
                          />

                        </div>

                      </div>

                      {/* PASSWORD */}

                      <div>

                        <label className="block text-[9px] font-black tracking-[1.7px] text-gray-400 mb-2.5">
                          PASSWORD
                        </label>

                        <div className="relative">

                          <Lock
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500 pointer-events-none z-10"
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
                            className="w-full h-14 rounded-xl border border-white/10 bg-white/[0.045] text-white text-[13px] outline-none placeholder:text-gray-600 focus:border-yellow-500/60 focus:bg-yellow-500/[0.06] transition-all"
                            style={{
                              paddingLeft: "50px",
                              paddingRight: "52px",
                            }}
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword(!showPassword)
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-yellow-400 z-10 transition"
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

                        <label className="flex items-center gap-2 text-[11px] text-gray-500 cursor-pointer">

                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) =>
                              setRememberMe(
                                e.target.checked
                              )
                            }
                            className="w-4 h-4 accent-yellow-500"
                          />

                          Remember me

                        </label>

                        <button
                          type="button"
                          onClick={() =>
                            setError(
                              "Password recovery is not available in demo mode."
                            )
                          }
                          className="text-[11px] text-yellow-500 hover:text-yellow-300 transition"
                        >
                          Forgot password?
                        </button>

                      </div>

                      {/* LOGIN BUTTON */}

                      <button
                        type="submit"
                        disabled={loading}
                        className="group relative overflow-hidden w-full h-14 rounded-xl bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 text-black font-black text-[13px] tracking-wide flex items-center justify-center gap-3 hover:shadow-[0_0_50px_rgba(234,179,8,0.25)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                      >

                        {loading ? (
                          <>
                            <span className="w-5 h-5 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                            SIGNING IN...
                          </>
                        ) : (
                          <>
                            SIGN IN

                            <ArrowRight
                              size={19}
                              className="group-hover:translate-x-1 transition-transform"
                            />
                          </>
                        )}

                      </button>

                    </form>

                    {/* DEMO ACCESS */}

                    <button
                      type="button"
                      onClick={fillDemoLogin}
                      className="w-full mt-6 text-left p-4 rounded-xl border border-yellow-500/15 bg-yellow-500/[0.025] hover:bg-yellow-500/[0.06] hover:border-yellow-500/25 transition-all duration-300"
                    >

                      <div className="flex gap-3">

                        <ShieldCheck
                          size={20}
                          className="text-yellow-500 shrink-0"
                        />

                        <div>

                          <p className="text-xs font-black text-gray-300">
                            DEMO ACCESS
                          </p>

                          <p className="text-[11px] text-gray-500 mt-1.5">
                            Click here to fill demo credentials.
                          </p>

                          <p className="text-[11px] mt-2 text-gray-500">
                            admin /{" "}
                            <span className="text-yellow-400 font-bold">
                              admin123
                            </span>
                          </p>

                        </div>

                      </div>

                    </button>

                    <div className="flex items-center justify-center gap-2 mt-6 text-[8px] text-gray-700 tracking-[1.5px]">
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

      <footer className="relative z-30 px-6 py-8 bg-black border-t border-white/10">

        <div className="max-w-[1250px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">

          <span className="text-[9px] text-gray-600">
            © 2026 IPL Cricket Analytics
          </span>

          <span className="text-[9px] text-yellow-600/70 tracking-[2px]">
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

export default Login;
