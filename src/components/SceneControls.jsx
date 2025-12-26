import { useRef, useEffect } from 'react'
import { extend, useThree, useFrame } from '@react-three/fiber'
import CustomTrackballControls from './CustomTrackballControls'

extend({ CustomTrackballControls })

function SceneControls({ isShiftHeld }) {
  const controlsRef = useRef()
  const { camera, gl } = useThree()

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.object = camera
      controlsRef.current.domElement = gl.domElement
    }
  }, [camera, gl])

  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update()
    }
  })

  return (
    <customTrackballControls 
      ref={controlsRef}
      args={[camera, gl.domElement]}
      isShiftHeld={isShiftHeld}
    />
  )
}

export default SceneControls