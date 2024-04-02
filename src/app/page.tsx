'use client';

import Image from "next/image";
import { createRoot } from 'react-dom/client'
import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import Box from "@/component/box";
import { Vector3 } from "three";
import Amigurumi from "@/component/amigurumi";

export default function Home() {
  return (
    <Canvas 
      style={{width: '100vw', height: '100vh'}}
      camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, -5] }}>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Box position={new Vector3(-1.2, 0, 0)} />
      <Box position={new Vector3(1.2, 0, 0)} />
      <Amigurumi></Amigurumi>
    </Canvas>
  );
}
