import { Canvas } from '@react-three/fiber'
import UnityCube from './UnityCube'
import ZCompass from './ZCompass'

function OrientationManager({ mainCameraRef, isShiftHeld }) {
  return (
    <div style={{ position: 'relative' }}>  {/* Wrapper for relative positioning */}
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        style={{
          width: "150px",
          height: "150px",
          pointerEvents: "auto",
          border: "2px solid #666",
          borderRadius: "75px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        <UnityCube mainCameraRef={mainCameraRef} />
      </Canvas>

      <ZCompass mainCameraRef={mainCameraRef} isShiftHeld={isShiftHeld} />
    </div>
  )
}

export default OrientationManager