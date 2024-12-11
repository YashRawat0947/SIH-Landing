import { useEffect } from "react";
import { MeshTransmissionMaterial, useGLTF } from "@react-three/drei";
import { Mesh } from "three";
import ethModel from "../models/ethereum_logo_3d.glb"


const EthereumModel = () => {
    const eth = useGLTF(ethModel)

    useEffect(() => {
        eth.scene.position.set(2,0,1)
        eth.scene.rotation.set(0,0,0)
        eth.scene.scale.set(1.2,1.2,1.2)
        eth.scene.traverse((object) => {
            if (object instanceof Mesh) {
                object.castShadow = true
                object.receiveShadow = true
                object.material.envMapIntensity = 10
            }
        })
    })
    return (
        <group>
            <primitive object={eth.scene} />
            <mesh>
                <MeshTransmissionMaterial 
                        thickness={0.2}
                        roughness={0.1}
                        transmission={1}
                        ior={1.5}
                        chromaticAberration={0.3}
                        anisotropy={0.1}
                        distortion={0.2}
                        />
            </mesh>
        </group>
    )
}

export default EthereumModel