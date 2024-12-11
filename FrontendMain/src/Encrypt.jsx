
import Navbar from './components/Navbar'
import Particle from './components/Particle'
import EncryptCard from './components/EncryptCard'


const Encrypt = () => {
  return (
    <div className='bg-[#F5F7F7] h-screen'>
    <Particle></Particle>
    <Navbar></Navbar>
    <EncryptCard/>
    </div>
  )
}

export default Encrypt