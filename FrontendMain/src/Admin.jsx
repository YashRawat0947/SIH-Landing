import AdminCard from './components/AdminCard'
import Navbar from './components/Navbar'
import Particle from './components/Particle'

const Admin = () => {
  return (
    <div className='bg-[#F5F7F7 h-screen'>
    <Particle></Particle>
    <nav className=" bg-opacity-30 text-white py-4 px-9 flex justify-between items-center fixed top-0 left-0 w-screen z-50 backdrop-blur-[12px] shadow-lg border border-white/20 rounded-lg">
              <a href="/" className="text-2xl font-bold hover:text-blue-300 transition-colors duration-300">
                Logo
              </a>
              <div className="flex space-x-8">
                <a href="/" className="hover:text-blue-300 transition-colors duration-300">Switch Panel</a>
                <a href="/ticket" className="hover:text-blue-300 transition-colors duration-300">Encryption/Decryption</a>
                <a href="/" className="hover:text-blue-300 transition-colors duration-300">Dashboard</a>
                <a href="/adminlogin" className="hover:text-blue-300 transition-colors duration-300">Login as Admin</a>
              </div>
            </nav>
    <AdminCard/>
    </div>
  )
}

export default Admin