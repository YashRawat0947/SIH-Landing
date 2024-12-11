import { Environment } from '@react-three/drei'
import React from 'react'

function Lights() {
  return (
    <>
        <ambientLight intensity={0.6} />
        <Environment preset='city' blur={10} />
    </>
  )
}

export default Lights
