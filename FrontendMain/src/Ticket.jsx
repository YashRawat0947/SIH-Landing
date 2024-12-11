import React from 'react'
import Navbar from './components/Navbar'
import Particle from './components/Particle'
import DecryptCard from './components/DecryptCard'
import EncryptCard from "./components/EncryptCard"
import { Link } from 'react-router-dom';

const Ticket = () => {
    return (
        <div className='bg-[#F5F7F7] h-full'>
        <Particle></Particle>
        <nav className=" bg-opacity-30 text-white py-4 px-9 flex justify-between items-center fixed top-0 left-0 w-screen z-50 backdrop-blur-[12px] shadow-lg border border-white/20 rounded-lg">
              <Link to="/" className="text-2xl font-bold hover:text-blue-300 transition-colors duration-300">
                Logo
              </Link>
              <div className="flex space-x-8">
                <Link to="#home" className="hover:text-blue-300 transition-colors duration-300">Switch Panel</Link>
                <Link to="/ticket" className="hover:text-blue-300 transition-colors duration-300">Encryption/Decryption</Link>
                <Link to="#services" className="hover:text-blue-300 transition-colors duration-300">Dashboard</Link>
                <Link to="/adminlogin" className="hover:text-blue-300 transition-colors duration-300">Login as Admin</Link>
                Link
              </div>
            </nav>
        <div className='w-full h-full '>
        <EncryptCard/>
        <DecryptCard/>
        </div>
        </div>
      )
}

export default Ticket