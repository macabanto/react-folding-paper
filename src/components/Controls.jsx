import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import CustomTrackballControls from './CustomTrackballControls'

function Controls() {
  const controlsRef = useRef()
  const { camera, gl } = useThree()

  useEffect(() => {
    const controls = new CustomTrackballControls(camera, gl.domElement)
    controls.rotateSpeed = 2.0
    controls.target.set(0, 0, 0)
    controlsRef.current = controls

    return () => {
      controls.dispose()
    }
  }, [camera, gl])

  useFrame(() => {
    controlsRef.current?.update()
  })

  return null
}

export default Controls