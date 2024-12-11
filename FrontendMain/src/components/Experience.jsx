import { Box, Float, Html, OrbitControls, Sparkles, Sphere, Text } from "@react-three/drei"
import { GlassyPlane } from "./NoisedGlassyPlane"
import Lights from "./Lights"
import * as THREE from 'three'
import { LayerMaterial, Gradient } from 'lamina'
import { motion } from "framer-motion-3d"
import { useRef } from "react"

export const Experience = () => {
    let textref = useRef()
    return (
        <>
            {/* <OrbitControls /> */}
            <Lights />
            <GlassyPlane />
            
            <Sparkles scale={10} />
            <Float floatIntensity={2} speed={3}>
                <motion.mesh initial={{scale:0}} animate={{scale: 5, transition: {duration:1, ease: "easeInOut"}}} whileHover={{scale:4,color:'#7209b7', transition:{duration: 0.3, ease: "easeIn"}}} scale={5} position={[0,0,-7.6]}>
                    <sphereGeometry />
                    <LayerMaterial lighting="" >
                        <Gradient colorA={"#20134D"} colorB={"#8eecf5"} axes="y" />
                    </LayerMaterial>
                </motion.mesh>
            </Float>
            
        </>
    )
}