import { useRef, useState, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

import leftPinchIcon from "../assets/pinch_L_trans.png";
import rightPinchIcon from "../assets/pinch_R_trans.png";

function PinchTool({ gridDivisions, paperSize = 5, onCancel }) {
	const { camera, raycaster, pointer, scene } = useThree();
	const [cursorPosition, setCursorPosition] = useState(null);
	const [placedPinches, setPlacedPinches] = useState([]);
	const [nearestVertex, setNearestVertex] = useState(null);

	const leftTexture = useTexture(leftPinchIcon);
	const rightTexture = useTexture(rightPinchIcon);

	// Sprite anchor points
	const LEFT_PINCH_CENTER = [0.9, 0.78];
	const RIGHT_PINCH_CENTER = [0.1, 0.78];

	// Handle ESC key or external cancel
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === "Escape") {
				setPlacedPinches([]);
				setNearestVertex(null);
				setCursorPosition(null);
				if (onCancel) onCancel();
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
	}, []);

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
		if (placedPinches.length >= 2) return;

		raycaster.setFromCamera(pointer, camera);
		const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
		const intersection = new THREE.Vector3();
		raycaster.ray.intersectPlane(plane, intersection);

		if (intersection) {
			setCursorPosition(intersection);

			let nearest = null;
			let minDist = Infinity;
			const snapDistance = 0.3;

			for (const vertex of edgeVertices) {
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
			{placedPinches.length < 2 && cursorPosition && (
				<sprite
					position={nearestVertex || cursorPosition}
					scale={[2, 2, 1]}
					center={
						placedPinches.length === 0 ? LEFT_PINCH_CENTER : RIGHT_PINCH_CENTER
					}
				>
					<spriteMaterial
						map={placedPinches.length === 0 ? leftTexture : rightTexture}
					/>
				</sprite>
			)}

			{/* Highlight nearest vertex */}
			{nearestVertex && (
				<mesh position={nearestVertex}>
					<circleGeometry args={[0.05, 16]} />
					<meshBasicMaterial color="#00ff00" opacity={0.5} transparent />
				</mesh>
			)}

			{/* Placed pinches */}
			{placedPinches.map((pos, i) => (
				<sprite
					key={i}
					position={pos}
					scale={[2, 2, 1]}
					center={i === 0 ? LEFT_PINCH_CENTER : RIGHT_PINCH_CENTER}
				>
					<spriteMaterial
						map={i === 0 ? leftTexture : rightTexture}
						transparent
					/>
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
