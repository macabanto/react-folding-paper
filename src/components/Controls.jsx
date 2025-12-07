import { useRef, useEffect } from 'react'
import { extend, useThree, useFrame } from '@react-three/fiber'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'

// Extend React Three Fiber with TrackballControls
extend({ TrackballControls })

function Controls() {
  const controlsRef = useRef()
  const { camera, gl } = useThree()

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0)
    }
  }, [])

  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update()
    }
  })

  return (
    <trackballControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      rotateSpeed={2.0}
      noZoom={false}
      noPan={false}
    />
  )
}

export default Controls