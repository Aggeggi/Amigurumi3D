function TriangleMesh() {
    const meshRef = useRef<three.Mesh>(null);
    useFrame(() => {
     if (meshRef.current) {
       const newGeometry = new Float32Array([
         -1.0, -1.0, 1.0, // vertex 1
         1.0, -1.0, 1.0, // vertex 2
         1.0, 1.0, 1.0, // vertex 3
     ]);
    const newAttribute = new three.BufferAttribute(newGeometry, 3);
    meshRef.current.geometry.setAttribute(‘position’, newAttribute);
     }
     });
    return (
     <mesh ref={meshRef}>
       <bufferGeometry >
         <bufferAttribute args={[initialGeometry, 3]} />
       </bufferGeometry>
       <meshBasicMaterial color={‘red’} side={three.DoubleSide} />
     </mesh>
     );
  }