"use client"
import React from "react"
import { Canvas } from "@react-three/fiber"
import Amigurumi from "@/component/Amigurumi"
import StoreProvider from "@/component/StoreProvider"
import { baseAmigurumiBall } from "../../examples/baseAmigurumi"

export default function Home() {
  return (
    <StoreProvider>
      <Canvas style={{ width: "100vw", height: "100vh" }} camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, -5] }}>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Amigurumi amigurumi={baseAmigurumiBall}></Amigurumi>
      </Canvas>
    </StoreProvider>
  )
}
