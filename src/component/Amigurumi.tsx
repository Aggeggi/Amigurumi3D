import type { AmigurumiModel } from "@/lib/hooks/useAmigurumi"
import { useAmigurumi } from "@/lib/hooks/useAmigurumi"
import { useFrame } from "@react-three/fiber"
import React, { useMemo } from "react"
import { useRef } from "react"
import type { Mesh } from "three"
import { DoubleSide } from "three"
interface AmigurumiProps {
  amigurumi: AmigurumiModel
}
export default function Amigurumi({ amigurumi }: AmigurumiProps) {
  const { amigurumiModel } = useAmigurumi(amigurumi)
  // This reference gives us direct access to the THREE.Mesh object
  const meshRef = useRef<Mesh>(null!)

  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((_state, delta) => {
    meshRef.current.rotation.y += delta

    // meshRef.current.rotation.x = -Math.PI/12
    //_state.camera.position.y = 3;
    // _state.camera.rotation.x = 0.00002;
  })

  const Amigurumi = useMemo(() => {
    if (amigurumiModel.vertArray.length < 1 || amigurumiModel.indices.length < 1) {
      return <></>
    }
    return (
      <>
        <bufferGeometry attach="geometry">
          <bufferAttribute array={new Uint32Array(amigurumiModel.indices)} attach="index" count={amigurumiModel.indices.length} itemSize={1} />
          <bufferAttribute attach="attributes-position" args={[new Float32Array(amigurumiModel.vertArray), 3]} />
        </bufferGeometry>
        <meshPhongMaterial color={"green"} flatShading={true} side={DoubleSide} />
      </>
    )
  }, [amigurumiModel])
  return (
    <mesh ref={meshRef} scale={1}>
      {Amigurumi}
    </mesh>
  )
}
