import { useFrame } from "@react-three/fiber"
import React from "react"
import { useRef, useState } from "react"
import { Mesh, BufferGeometry, NormalBufferAttributes, Vector3 } from "three"

interface BoxProp{
    position: Vector3
}

export default function Box(props: BoxProp) {
    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef<Mesh>(null!)
    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame((state, delta) => {
        if(ref && ref.current){
            ref.current.rotation.x += delta;
            ref.current.rotation.y += delta;
            ref.current.rotation.z += delta;
        }
    });
    // Return the view, these are regular Threejs elements expressed in JSX
    return (
      <mesh
        {...props}
        ref={ref}
        scale={clicked ? 5 : 1}
        onClick={(event) => click(!clicked)}
        onPointerOver={(event) => hover(true)}
        onPointerOut={(event) => hover(false)}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
      </mesh>
    )
  }