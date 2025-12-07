import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import MainScene from './components/MainScene'
import UnityCube from './components/UnityCube'
import Controls from './components/Controls'
import './App.css'

function App() {
  // Shared reference to main camera for bidirectional syncing
  const mainCameraRef = useRef()

  return (
    <>
      {/* Main Scene - Full viewport */}
      <Canvas
        camera={{ position: [5, 5, 5], fov: 75 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        onCreated={({ camera }) => {
          mainCameraRef.current = camera
        }}
      >
        <MainScene />
        <Controls />
      </Canvas>

      {/* Unity Cube - Top-right corner */}
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '150px',
          height: '150px',
          pointerEvents: 'auto'
        }}
      >
        <UnityCube mainCameraRef={mainCameraRef} />
      </Canvas>
    </>
  )
}

export default App