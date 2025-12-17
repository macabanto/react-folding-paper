import { useRef, useState, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function PinchTool({ gridDivisions, paperSize = 5, onCancel }) {
	const { camera, raycaster, pointer, scene } = useThree();
	const [cursorPosition, setCursorPosition] = useState(null);
	const [placedPinches, setPlacedPinches] = useState([]); // Max 2
	const [nearestVertex, setNearestVertex] = useState(null);

	// Handle ESC key or external cancel
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === "Escape") {
				setPlacedPinches([]);
				setNearestVertex(null);
				setCursorPosition(null);
				if (onCancel) onCancel(); // Deactivate the tool
			}
		};

		window.addEventListener("keydown", handleEscape);
		return () => window.removeEventListener("keydown", handleEscape);
	}, [onCancel]);

	// Reset when tool is activated (cleanup from previous use)
	useEffect(() => {
		setPlacedPinches([]);
		setNearestVertex(null);
		setCursorPosition(null);
	}, []); // Runs once on mount

	// Calculate all grid vertices on paper edges
	const getEdgeVertices = () => {
		const vertices = [];
		const halfSize = paperSize / 2;
		const stepX = paperSize / gridDivisions.x;
		const stepY = paperSize / gridDivisions.y;

		// Top edge
		for (let i = 0; i <= gridDivisions.x; i++) {
			vertices.push(new THREE.Vector3(i * stepX - halfSize, halfSize, 0));
		}
		// Bottom edge
		for (let i = 0; i <= gridDivisions.x; i++) {
			vertices.push(new THREE.Vector3(i * stepX - halfSize, -halfSize, 0));
		}
		// Left edge (excluding corners)
		for (let i = 1; i < gridDivisions.y; i++) {
			vertices.push(new THREE.Vector3(-halfSize, i * stepY - halfSize, 0));
		}
		// Right edge (excluding corners)
		for (let i = 1; i < gridDivisions.y; i++) {
			vertices.push(new THREE.Vector3(halfSize, i * stepY - halfSize, 0));
		}

		return vertices;
	};

	const edgeVertices = getEdgeVertices();

	// Track cursor in 3D space
	useFrame(() => {
		if (placedPinches.length >= 2) return; // Both pinches placed

		// Raycast to paper plane
		raycaster.setFromCamera(pointer, camera);
		const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
		const intersection = new THREE.Vector3();
		raycaster.ray.intersectPlane(plane, intersection);

		if (intersection) {
			setCursorPosition(intersection);

			// Find nearest vertex
			let nearest = null;
			let minDist = Infinity;
			const snapDistance = 0.3; // How close cursor needs to be

			for (const vertex of edgeVertices) {
				// Skip if this vertex already has a pinch
				const alreadyUsed = placedPinches.some(
					(p) => p.distanceTo(vertex) < 0.01
				);
				if (alreadyUsed) continue;

				const dist = intersection.distanceTo(vertex);
				if (dist < minDist && dist < snapDistance) {
					minDist = dist;
					nearest = vertex;
				}
			}

			setNearestVertex(nearest);
		}
	});

	// Handle click to place pinch
	useEffect(() => {
		const handleClick = () => {
			if (placedPinches.length >= 2) return;
			if (!nearestVertex) return;

			setPlacedPinches([...placedPinches, nearestVertex.clone()]);
			setNearestVertex(null);
		};

		window.addEventListener("click", handleClick);
		return () => window.removeEventListener("click", handleClick);
	}, [nearestVertex, placedPinches]);

	return (
		<group>
			{/* Cursor-following pinch (before placing) */}
			{placedPinches.length < 2 && cursorPosition && (
				<sprite
					position={nearestVertex || cursorPosition}
					scale={[0.3, 0.3, 1]}
				>
					<spriteMaterial
						color={nearestVertex ? "#00ff00" : "#ffffff"}
						opacity={0.8}
					/>
				</sprite>
			)}

			{/* Highlight nearest vertex */}
			{nearestVertex && (
				<mesh position={nearestVertex}>
					<circleGeometry args={[0.15, 16]} />
					<meshBasicMaterial color="#00ff00" opacity={0.5} transparent />
				</mesh>
			)}

			{/* Placed pinches */}
			{placedPinches.map((pos, i) => (
				<sprite key={i} position={pos} scale={[0.3, 0.3, 1]}>
					<spriteMaterial color="#ff0000" />
				</sprite>
			))}

			{/* Dashed line between two pinches */}
			{placedPinches.length === 2 && (
				<line>
					<bufferGeometry>
						<bufferAttribute
							attach="attributes-position"
							count={2}
							array={
								new Float32Array([
									...placedPinches[0].toArray(),
									...placedPinches[1].toArray(),
								])
							}
							itemSize={3}
						/>
					</bufferGeometry>
					<lineDashedMaterial color="#ffff00" dashSize={0.1} gapSize={0.1} />
				</line>
			)}
		</group>
	);
}

export default PinchTool;
