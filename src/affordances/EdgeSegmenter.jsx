import { useState, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ==================== BUTTON (UI) ====================
export function EdgeSegmenterButton({ isActive, divisions, onToggle, onIncrementDivisions, onDecrementDivisions }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      backgroundColor: 'rgba(42, 42, 42, 0.9)',
      border: `2px solid ${isActive ? '#6ab0ff' : '#666'}`,
      borderRadius: '8px',
      padding: '10px',
      boxShadow: isActive ? '0 0 12px rgba(74, 144, 226, 0.5)' : '0 4px 12px rgba(0,0,0,0.3)',
    }}>
      {/* Ruler Icon Button */}
      <button
        onClick={onToggle}
        style={{
          width: '50px',
          height: '50px',
          backgroundColor: isActive ? '#4a90e2' : 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          transition: 'background-color 0.2s ease',
        }}
      >
        📏
      </button>

      {/* Division Controls */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
      }}>
        <button
          onClick={onIncrementDivisions}
          style={{
            width: '24px',
            height: '20px',
            backgroundColor: '#333',
            border: '1px solid #666',
            color: 'white',
            cursor: 'pointer',
            borderRadius: '3px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ▲
        </button>

        <span style={{
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold',
          minWidth: '24px',
          textAlign: 'center',
        }}>
          {divisions}
        </span>

        <button
          onClick={onDecrementDivisions}
          style={{
            width: '24px',
            height: '20px',
            backgroundColor: '#333',
            border: '1px solid #666',
            color: 'white',
            cursor: 'pointer',
            borderRadius: '3px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ▼
        </button>
      </div>
    </div>
  )
}

// ==================== TOOL (3D Scene) ====================
export function EdgeSegmenterTool({ divisions, paperSize = 5, onMarkPlaced, onCancel }) {
  const { camera, raycaster, pointer } = useThree()
  const [hoveredEdge, setHoveredEdge] = useState(null)

  const halfSize = paperSize / 2
  const edges = {
    top: { 
      start: new THREE.Vector3(-halfSize, halfSize, 0), 
      end: new THREE.Vector3(halfSize, halfSize, 0),
      name: 'top'
    },
    bottom: { 
      start: new THREE.Vector3(-halfSize, -halfSize, 0), 
      end: new THREE.Vector3(halfSize, -halfSize, 0),
      name: 'bottom'
    },
    left: { 
      start: new THREE.Vector3(-halfSize, -halfSize, 0), 
      end: new THREE.Vector3(-halfSize, halfSize, 0),
      name: 'left'
    },
    right: { 
      start: new THREE.Vector3(halfSize, -halfSize, 0), 
      end: new THREE.Vector3(halfSize, halfSize, 0),
      name: 'right'
    },
  }

  // Detect which edge cursor is near
  useFrame(() => {
    raycaster.setFromCamera(pointer, camera)
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    const intersection = new THREE.Vector3()
    raycaster.ray.intersectPlane(plane, intersection)

    if (intersection) {
      let nearestEdge = null
      let minDist = Infinity
      const threshold = 0.3

      for (const edge of Object.values(edges)) {
        const line = new THREE.Line3(edge.start, edge.end)
        const closestPoint = new THREE.Vector3()
        line.closestPointToPoint(intersection, true, closestPoint)
        const dist = intersection.distanceTo(closestPoint)

        if (dist < minDist && dist < threshold) {
          minDist = dist
          nearestEdge = edge.name
        }
      }

      setHoveredEdge(nearestEdge)
    } else {
      setHoveredEdge(null)
    }
  })

  // Handle click to place marks
  useEffect(() => {
    const handleClick = () => {
      if (hoveredEdge) {
        onMarkPlaced(hoveredEdge, divisions)
        if (onCancel) onCancel()
      }
    }

    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [hoveredEdge, divisions, onMarkPlaced, onCancel])

  // Handle ESC to cancel
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && onCancel) {
        onCancel()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onCancel])

  // Calculate mark positions for preview
  const getMarkPositions = (edgeName) => {
    if (!edgeName) return []
    
    const edge = edges[edgeName]
    const marks = []
    
    for (let i = 1; i < divisions; i++) {
      const t = i / divisions
      const pos = new THREE.Vector3().lerpVectors(edge.start, edge.end, t)
      marks.push({ position: pos, t })
    }
    
    return marks
  }

  const previewMarks = hoveredEdge ? getMarkPositions(hoveredEdge) : []

  const getMarkLine = (edgeName, position) => {
    const edge = edges[edgeName]
    const edgeDir = new THREE.Vector3().subVectors(edge.end, edge.start).normalize()
    const perpDir = new THREE.Vector3(-edgeDir.y, edgeDir.x, 0)
    
    const markLength = 0.2
    const markStart = position.clone().add(perpDir.clone().multiplyScalar(markLength))
    const markEnd = position.clone().sub(perpDir.clone().multiplyScalar(markLength))
    
    return { start: markStart, end: markEnd }
  }

  return (
    <group>
      {/* Highlight hovered edge */}
      {hoveredEdge && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                ...edges[hoveredEdge].start.toArray(),
                ...edges[hoveredEdge].end.toArray(),
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00ff00" linewidth={3} />
        </line>
      )}

      {/* Preview marks */}
      {previewMarks.map((mark, i) => {
        const { start, end } = getMarkLine(hoveredEdge, mark.position)

        return (
          <line key={i}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([
                  ...start.toArray(),
                  ...end.toArray(),
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#ffff00" linewidth={2} />
          </line>
        )
      })}
    </group>
  )
}