import { useState } from "react";
import axios from "axios";
import BASE_URL from "../services/api";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    try {
      const res = await axios.post(`${BASE_URL}/login`, {
        username,
        password,
      });

      localStorage.setItem("token", res.data.access_token);

      alert("Login Successful ✅");

      onLogin();
    } catch (err) {
      alert("Invalid Username or Password");
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-700 to-indigo-800">

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-96">

        <h1 className="text-4xl font-bold text-center mb-8">
          🏏 IPL Analytics
        </h1>

        <input
          type="text"
          placeholder="Username"
          className="w-full border p-3 rounded-lg mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white p-3 rounded-lg font-bold"
        >
          Login
        </button>

        <p className="text-center mt-6 text-gray-500 text-sm">
          Demo Login
          <br />
          Username: <b>admin</b>
          <br />
          Password: <b>admin123</b>
        </p>

      </div>

    </div>
  );
}

export default Login;