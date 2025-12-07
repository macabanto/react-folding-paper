import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function FaceLabel({ text, position, rotation }) {
  // Create text texture with full words
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    
    // Background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.fillRect(0, 0, 256, 256)
    
    // Text
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 32px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, 128, 128)
    
    return new THREE.CanvasTexture(canvas)
  }, [text])

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[1.4, 1.4]} />
      <meshBasicMaterial map={texture} transparent opacity={0.9} />
    </mesh>
  )
}

function Arrow({ direction, position, onClick }) {
  // Determine rotation based on direction
  const getRotation = () => {
    switch(direction) {
      case 'x':
        return [0, 0, -Math.PI/2]
      case '-x':
        return [0, 0, Math.PI/2]
      case 'y':
        return [0, 0, 0]
      case '-y':
        return [Math.PI, 0, 0]
      case 'z':
        return [Math.PI/2, 0, 0]
      case '-z':
        return [-Math.PI/2, 0, 0]
      default:
        return [0, 0, 0]
    }
  }
  
  return (
    <group position={position} rotation={getRotation()} onClick={onClick}>
      {/* Arrow shaft (cylinder) */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Arrow head (cone) */}
      <mesh position={[0, 0.5, 0]}>
        <coneGeometry args={[0.08, 0.15, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}

function UnityCube({ mainCameraRef }) {
  const cubeRef = useRef()

  // Sync cube rotation with main camera (mirrors orientation)
  useFrame(() => {
    if (cubeRef.current && mainCameraRef?.current) {
      cubeRef.current.quaternion.copy(mainCameraRef.current.quaternion).invert()
    }
  })

  // Handle clicking cube FACES
  const handleClick = (event) => {
    // Get clicked face normal
    const normal = event.face.normal.clone()
    
    // Determine view name from face normal
    const absX = Math.abs(normal.x)
    const absY = Math.abs(normal.y)
    const absZ = Math.abs(normal.z)
    
    let viewName
    if (absX > absY && absX > absZ) {
      viewName = normal.x > 0 ? 'right' : 'left'
    } else if (absY > absX && absY > absZ) {
      viewName = normal.y > 0 ? 'top' : 'bottom'
    } else {
      viewName = normal.z > 0 ? 'front' : 'back'
    }
    
    console.log('Clicked face:', viewName)
    
    // Snap main camera to view (bidirectional sync: Unity → Main)
    const viewPositions = {
      front: [0, 0, 10],
      back: [0, 0, -10],
      right: [10, 0, 0],
      left: [-10, 0, 0],
      top: [0, 10, 0],
      bottom: [0, -10, 0]
    }
    
    const targetPos = viewPositions[viewName]
    if (targetPos && mainCameraRef?.current) {
      mainCameraRef.current.position.set(...targetPos)
      mainCameraRef.current.lookAt(0, 0, 0)
    }
  }

  // Handle clicking ARROWS
  const handleAxisAlign = (axis) => {
    console.log('Aligning scene so axis points up:', axis)
    
    if (!mainCameraRef?.current) return
    
    // Configure camera position and up vector for each axis
    const alignmentConfigs = {
      'x': {
        position: [0, 0, 10],
        up: [1, 0, 0]
      },
      '-x': {
        position: [0, 0, 10],
        up: [-1, 0, 0]
      },
      'y': {
        position: [0, 0, 10],
        up: [0, 1, 0]
      },
      '-y': {
        position: [0, 0, 10],
        up: [0, -1, 0]
      },
      'z': {
        position: [10, 0, 0],
        up: [0, 0, 1]
      },
      '-z': {
        position: [10, 0, 0],
        up: [0, 0, -1]
      }
    }
    
    const config = alignmentConfigs[axis]
    if (config) {
      mainCameraRef.current.position.set(...config.position)
      mainCameraRef.current.up.set(...config.up)
      mainCameraRef.current.lookAt(0, 0, 0)
    }
  }

  return (
    <group ref={cubeRef}>
      {/* Background */}
      <color attach="background" args={['#2a2a2a']} />
      
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 2, 2]} intensity={0.5} />

      {/* Cube - Wireframe */}
      <mesh onClick={handleClick}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial 
          color="#808080" 
          metalness={0.3} 
          roughness={0.6}
          wireframe={true}
        />
      </mesh>

      {/* Face Labels with full words */}
      <FaceLabel text="FRONT" position={[0, 0, 0.76]} rotation={[0, 0, 0]} />
      <FaceLabel text="BACK" position={[0, 0, -0.76]} rotation={[0, Math.PI, 0]} />
      <FaceLabel text="RIGHT" position={[0.76, 0, 0]} rotation={[0, Math.PI/2, 0]} />
      <FaceLabel text="LEFT" position={[-0.76, 0, 0]} rotation={[0, -Math.PI/2, 0]} />
      <FaceLabel text="TOP" position={[0, 0.76, 0]} rotation={[-Math.PI/2, 0, 0]} />
      <FaceLabel text="BOTTOM" position={[0, -0.76, 0]} rotation={[Math.PI/2, 0, 0]} />
    
      {/* Axis Arrows */}
      <Arrow direction="z" position={[0, 0, 1.2]} onClick={() => handleAxisAlign('z')} />
      <Arrow direction="-z" position={[0, 0, -1.2]} onClick={() => handleAxisAlign('-z')} />
      <Arrow direction="x" position={[1.2, 0, 0]} onClick={() => handleAxisAlign('x')} />
      <Arrow direction="-x" position={[-1.2, 0, 0]} onClick={() => handleAxisAlign('-x')} />
      <Arrow direction="y" position={[0, 1.2, 0]} onClick={() => handleAxisAlign('y')} />
      <Arrow direction="-y" position={[0, -1.2, 0]} onClick={() => handleAxisAlign('-y')} />
    
    </group>
  )
}

export default UnityCube