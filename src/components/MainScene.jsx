import { useRef } from 'react'

function MainScene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 10]} intensity={0.8} />

      {/* Paper - Red front, Blue back */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial 
          color="#ff4760" 
          side={0} // FrontSide
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial 
          color="#78aeff" 
          side={1} // BackSide
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Grid */}
      <gridHelper 
        args={[10, 20, 0xcccccc, 0xcccccc]} 
        rotation={[Math.PI / 2, 0, 0]} 
      />
    </>
  )
}

export default MainScene