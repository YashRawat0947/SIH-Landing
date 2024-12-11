import { MeshDistortMaterial, MeshTransmissionMaterial } from "@react-three/drei"

export const GlassyPlane = () => {
    return (
        <>
            <mesh position={[0,0,-2]} rotateX={Math.PI*0.5} >
                <planeGeometry args={[30,20]} />
                <MeshTransmissionMaterial samples={16} resolution={400} anisotropicBlur={50} thickness={1.2} roughness={0.4} toneMapped={true} />
            </mesh>
        </>
    )
}