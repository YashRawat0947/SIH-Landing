import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react';
import { Experience } from './components/Experience';
import { CameraControls, Float, Html, Loader, Scroll, ScrollControls, Text } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import EthereumModel from './components/EthModel';
import AirnT from './Fonts/Airnt.otf'
import { motion } from "framer-motion-3d"



function Landing() {
  return (
    <div className='w-full h-screen'>
      <Loader />
      <Canvas shadows>
        <Experience />
        <color attach='background' args={[0,0,0]} />
        <ScrollControls pages={3} maxSpeed={0.1} damping={0.4}>
          <Scroll html>
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
            
          </Scroll>
          <Scroll>
            <Float floatIntensity={3} rotationIntensity={2} speed={2}>
              <EthereumModel />
            </Float>            
          </Scroll>
          <Scroll>
            <motion.group initial={{opacity: 0, y: -1}} animate={{opacity: 1, y:0, transition: {duration: 1}}}>
              <Text position={[-2.7,0,2]} fontSize={0.38} textAlign="left" anchorX="center" anchorY="middle" maxWidth={3.6} letterSpacing={0.1} font={AirnT}>
                  Universal Switch Set
                  <meshStandardMaterial metalness={0.8} roughness={0.2} />
              </Text>
            </motion.group>
          </Scroll>
        </ScrollControls>
        <Suspense>
          {/* <BlockPart /> */}
          
        </Suspense>
        {/* <EffectComposer>
          <Bloom mipmapBlur={false} intensity={2} />
        </EffectComposer> */}
      </Canvas>
    </div>
  )
}

export default Landing;