// EdgeMarks.jsx
import * as THREE from "three";

// EdgeMarks.jsx - update to use vertexPool
function EdgeMarks({ vertexPool, paperWidth = 5, paperHeight = 5 }) {
	// Filter for active staged/committed marks
	const activeMarks = vertexPool.filter(
		(v) => v.type === "mark" && v.active && v.state !== "inactive"
	);

	return (
		<group>
			{activeMarks.map((mark) => {
				const position = new THREE.Vector3(...mark.position);

				// FIX: Find corner vertices by constructing their IDs
				const v1 = vertexPool.find((v) => v.id === `v${mark.edge[0]}`);
				const v2 = vertexPool.find((v) => v.id === `v${mark.edge[1]}`);

				if (!v1 || !v2) {
					console.warn("Could not find vertices for mark:", mark);
					return null;
				}

				// Calculate perpendicular direction
				const v1Pos = new THREE.Vector3(...v1.position);
				const v2Pos = new THREE.Vector3(...v2.position);
				const edgeDir = new THREE.Vector3()
					.subVectors(v2Pos, v1Pos)
					.normalize();
				const perpDir = new THREE.Vector3(-edgeDir.y, edgeDir.x, 0);

				const markLength = 0.2;
				const markStart = position
					.clone()
					.add(perpDir.clone().multiplyScalar(markLength));
				const markEnd = position
					.clone()
					.sub(perpDir.clone().multiplyScalar(markLength));

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
				);
			})}
		</group>
	);
}

export default EdgeMarks;
