import { Model } from "@/model";
import { useFrame } from "@react-three/fiber"
import React from "react"
import { useRef, useState } from "react"
import { Mesh, BufferGeometry, NormalBufferAttributes, Vector3, DoubleSide } from "three"


export default function Amigurumi() {

    let module = new Model(1);
    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef<any>(null)
    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame((state, delta) => {
        if(ref && ref.current){
            ref.current.rotation.x += delta;
        }
    });

    // console.log(module.vertices)
    // Return the view, these are regular Threejs elements expressed in JSX
    return (
      <mesh
        ref={ref}
        scale={clicked ? 5 : 1}
        onClick={(event) => click(!clicked)}
        onPointerOver={(event) => hover(true)}
        onPointerOut={(event) => hover(false)}>
        <bufferGeometry>
            <bufferAttribute
             
                array={new Uint16Array(module.indices)}
                attach="index"
                count={module.indices.length}
                itemSize={1}
            />
            <bufferAttribute attach="attributes-position" args={ [ module.vertices, 2]} />
        </bufferGeometry>
        <meshPhongMaterial color={hovered ? 'blue' : 'green'} 
            side={DoubleSide} />
      </mesh>
    )
  }