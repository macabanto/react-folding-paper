import * as THREE from 'three'

function Creases({ creases, vertexPool }) {
  // Helper to get position from vertex in pool
  const getPointPosition = (point) => {
    // Point is a vertex from vertexPool - just use its position!
    if (point && point.position) {
      return new THREE.Vector3(...point.position)
    }
    
    return null
  }

  return (
    <group>
      {creases.map(crease => {
        const pos1 = getPointPosition(crease.point1)
        const pos2 = getPointPosition(crease.point2)
        
        if (!pos1 || !pos2) {
          console.warn('Could not get positions for crease:', crease)
          return null
        }

        return (
          <line key={crease.id}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([
                  ...pos1.toArray(),
                  ...pos2.toArray(),
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#ffffff" linewidth={2} />
          </line>
        )
      })}
    </group>
  )
}

export default Creases