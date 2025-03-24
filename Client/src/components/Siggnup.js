import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Signup = () => {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = credentials;

    const response = await fetch("api/auth/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const json = await response.json();
    console.log(json);

    if (json.success) {
      localStorage.setItem("token", json.authtoken);
      navigate("/Loggin");
    } else {
      alert("User with this email already exists");
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
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-gray-300 block mb-2 text-lg">Name</label>
            <input
              type="text"
              name="name"
              onChange={onChange}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label className="text-gray-300 block mb-2 text-lg">Email</label>
            <input
              type="email"
              name="email"
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
              onChange={onChange}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label className="text-gray-300 block mb-2 text-lg">
              Confirm Password
            </label>
            <input
              type="password"
              name="cpassword"
              onChange={onChange}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg text-lg font-semibold transition duration-300 transform hover:scale-105"
          >
            Sign Up
          </button>
        </form>
        <p className="text-gray-400 text-center mt-4">
          Already have an account?{" "}
          <span className="text-red-500 cursor-pointer hover:underline" onClick={() => navigate("/Loggin")}>
            Log in
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
