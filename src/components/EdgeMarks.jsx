// EdgeMarks.jsx
import * as THREE from 'three'

function EdgeMarks({ segmentMarks, paperWidth = 5, paperHeight = 5 }) {
	const halfWidth = paperWidth / 2
	const halfHeight = paperHeight / 2

	// Vertex positions (matches PaperGeometry initial state)
	const vertexPositions = [
		new THREE.Vector3(-halfWidth, -halfHeight, 0),  // v0
		new THREE.Vector3(halfWidth, -halfHeight, 0),   // v1
		new THREE.Vector3(halfWidth, halfHeight, 0),    // v2
		new THREE.Vector3(-halfWidth, halfHeight, 0),   // v3
	]

	return (
		<group>
			{segmentMarks.filter(mark => mark.active).map(mark => {
				// Get edge start/end from vertex indices
				const start = vertexPositions[mark.v1]
				const end = vertexPositions[mark.v2]
				
				// Calculate mark position
				const position = new THREE.Vector3().lerpVectors(start, end, mark.t)
				
				// Calculate perpendicular direction
				const edgeDir = new THREE.Vector3().subVectors(end, start).normalize()
				const perpDir = new THREE.Vector3(-edgeDir.y, edgeDir.x, 0)
				
				const markLength = 0.2
				const markStart = position.clone().add(perpDir.clone().multiplyScalar(markLength))
				const markEnd = position.clone().sub(perpDir.clone().multiplyScalar(markLength))

				return (
					<line key={mark.id}>
						<bufferGeometry>
							<bufferAttribute
								attach="attributes-position"
								count={2}
								array={
									new Float32Array([
										...markStart.toArray(),
										...markEnd.toArray(),
									])
								}
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

export default EdgeMarks