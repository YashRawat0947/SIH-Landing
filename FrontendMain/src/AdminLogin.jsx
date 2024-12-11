import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "./components/Input";
import Particle from "./components/Particle";
import Navbar from "./components/Navbar";
import axios from "axios";


const LoginPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(name, password);
    
    const response = await axios.post(`http://localhost:5000/api/auth/login`,{
      name,
      password
    });

    console.log(response);
    if (response.status === 200) {
      navigate('/admin');
    } else{
      setError("Invalid username or password");
    }

  };

  return (
    <div className="h-screen">
      <nav className=" bg-opacity-30 text-white py-4 px-9 flex justify-between items-center fixed top-0 left-0 w-screen z-50 backdrop-blur-[12px] shadow-lg border border-white/20 rounded-lg">
              <a href="#home" className="text-2xl font-bold hover:text-blue-300 transition-colors duration-300">
                Logo
              </a>
              <div className="flex space-x-8">
                <a href="#home" className="hover:text-blue-300 transition-colors duration-300">Switch Panel</a>
                <a href="/ticket" className="hover:text-blue-300 transition-colors duration-300">Encryption/Decryption</a>
                <a href="#services" className="hover:text-blue-300 transition-colors duration-300">Dashboard</a>
                <a href="/adminlogin" className="hover:text-blue-300 transition-colors duration-300">Login as Admin</a>
              </div>
            </nav>
      <Particle></Particle>
<div className="w-full h-screen flex justify-center items-center">
<motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-[#A855F7] text-transparent bg-clip-text">
          Admin Login
        </h2>

        <form onSubmit={handleLogin}>
          <Input
            icon={User}
            type="text"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          
          {error && <p className="text-red-500 text-semibold mt-2">{error}</p>}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-[#A855F7]  text-white font-bold rounded-lg shadow-lg  focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin  mx-auto" />
            ) : (
              "Login"
            )}
          </motion.button>
        </form>
      </div>
      
    </motion.div>
    </div>

    </div>
    
    
  );
};
export default LoginPage;
