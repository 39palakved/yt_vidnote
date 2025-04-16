import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/Loggin/:feed";
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("https://yt-vidnote.onrender.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: credentials.email, password: credentials.password }),
    });

    const json = await response.json();
    console.log(json);

    if (json.success) {
      localStorage.setItem("token", json.authtoken);
     
      localStorage.setItem("user", JSON.stringify(json.user));
      navigate(from, { replace: true });
    } else {
      alert("Invalid credentials");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-gray-900 bg-opacity-90 p-12 rounded-2xl shadow-2xl w-full max-w-lg border border-red-600"
      >
        <h2 className="text-3xl font-bold text-red-500 text-center mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-gray-300 block mb-2 text-lg">Email Address</label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={onChange}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label className="text-gray-300 block mb-2 text-lg">Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={onChange}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg text-lg font-semibold transition duration-300 transform hover:scale-105"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-400 mt-4">
          Don't have an account?{" "}
          <a className="text-red-500 hover:underline" onClick={() => navigate("/")}>
            Sign Up
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
