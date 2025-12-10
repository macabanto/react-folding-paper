import { useEffect, useState } from 'react'
import * as THREE from 'three'

function Z_Compass({ mainCameraRef }) {
  const [rollAngle, setRollAngle] = useState(0)
  const [isShiftHeld, setIsShiftHeld] = useState(false)

  // Listen for Shift key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Shift') setIsShiftHeld(true)
    }
    const handleKeyUp = (e) => {
      if (e.key === 'Shift') setIsShiftHeld(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Calculate roll angle from camera quaternion
  useEffect(() => {
    const updateRoll = () => {
      if (!mainCameraRef?.current) return

      const camera = mainCameraRef.current

      // Get camera's up and right vectors
      const up = new THREE.Vector3(0, 1, 0)
      const right = new THREE.Vector3(1, 0, 0)
      
      up.applyQuaternion(camera.quaternion)
      right.applyQuaternion(camera.quaternion)

      // Calculate roll angle (rotation around view direction)
      const angle = Math.atan2(right.y, up.y)
      setRollAngle(angle * (180 / Math.PI)) // Convert to degrees
    }

    // Update on animation frame
    const interval = setInterval(updateRoll, 16) // ~60fps
    return () => clearInterval(interval)
  }, [mainCameraRef])

  // Generate tick marks
  const ticks = []
  for (let i = 0; i < 360; i += 6) {
    const isLongTick = i % 30 === 0
    const tickLength = isLongTick ? 6 : 4
    const angle = (i * Math.PI) / 180
    
    const baseRadius = 75
    const innerRadius = isShiftHeld ? baseRadius + 2 : baseRadius - 4
    const outerRadius = innerRadius + tickLength

    const x1 = 85 + innerRadius * Math.cos(angle)
    const y1 = 85 + innerRadius * Math.sin(angle)
    const x2 = 85 + outerRadius * Math.cos(angle)
    const y2 = 85 + outerRadius * Math.sin(angle)

    ticks.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#ffffff"
        strokeWidth={isLongTick ? 1.5 : 1}
        opacity={isShiftHeld ? 0.6 : 0}
        style={{
          transition: 'opacity 0.3s ease'
        }}
      />
    )
  }

  return (
    <svg
      style={{
        position: 'absolute',
        bottom: '50px',
        right: '50px',
        width: '170px',
        height: '170px',
        pointerEvents: 'none',
        transform: `rotate(${rollAngle}deg)`,
        overflow: 'visible',
        opacity: isShiftHeld ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}
    >
      {ticks}
    </svg>
  )
}

export default Z_Compass