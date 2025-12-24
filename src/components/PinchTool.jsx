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
	const [firstPinchIsRight, setFirstPinchIsRight] = useState(null);
	const [handsSwapped, setHandsSwapped] = useState(false); // ADD THIS!

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
		// Check if hands should swap (when both are placed)
		if (placedPinches.length === 2) {
			// Project both pinches to screen space
			const screenPos1 = placedPinches[0].clone().project(camera);
			const screenPos2 = placedPinches[1].clone().project(camera);

			// If first pinch is now on the right in screen space, we should swap
			const shouldSwap = screenPos1.x > screenPos2.x;
			setHandsSwapped(shouldSwap); // New state!
		}
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

			// Determine which hand based on X position (first pinch only)
			if (placedPinches.length === 0) {
				setFirstPinchIsRight(nearestVertex.x > 0); // Right side = right hand
			}

			setPlacedPinches([...placedPinches, nearestVertex.clone()]);
			setNearestVertex(null);
		};

		window.addEventListener("click", handleClick);
		return () => window.removeEventListener("click", handleClick);
	}, [nearestVertex, placedPinches]);

	return (
		<group>
			{/* Show all available edge vertices when tool is active AND not all pinches placed */}
			{placedPinches.length < 2 &&
				edgeVertices.map((vertex, i) => {
					// Check if this vertex already has a pinch
					const isOccupied = placedPinches.some(
						(p) => p.distanceTo(vertex) < 0.01
					);

					return !isOccupied ? (
						<mesh key={i} position={vertex}>
							<circleGeometry args={[0.08, 16]} />
							<meshBasicMaterial color="#ffffff" opacity={0.3} transparent />
						</mesh>
					) : null;
				})}

			{/* Cursor-following pinch */}
			{placedPinches.length < 2 && cursorPosition && (
				<sprite
					position={nearestVertex || cursorPosition}
					scale={[2, 2, 1]}
					center={
						placedPinches.length === 0
							? nearestVertex && nearestVertex.x > 0
								? RIGHT_PINCH_CENTER
								: LEFT_PINCH_CENTER // Show preview
							: firstPinchIsRight
							? LEFT_PINCH_CENTER
							: RIGHT_PINCH_CENTER // Opposite hand
					}
				>
					<spriteMaterial
						map={
							placedPinches.length === 0
								? nearestVertex && nearestVertex.x > 0
									? rightTexture
									: leftTexture
								: firstPinchIsRight
								? leftTexture
								: rightTexture
						}
					/>
				</sprite>
			)}

			{/* Highlight nearest vertex */}
			{placedPinches.length < 2 && nearestVertex && (
				<mesh position={nearestVertex}>
					<circleGeometry args={[0.15, 16]} />
					<meshBasicMaterial color="#00ff00" opacity={0.5} transparent />
				</mesh>
			)}

			{/* Placed pinches */}
			{placedPinches.map((pos, i) => {
				// Determine texture based on position and swap state
				let useRightTexture;
				if (i === 0) {
					// First pinch: use right if originally right, unless swapped
					useRightTexture = handsSwapped
						? !firstPinchIsRight
						: firstPinchIsRight;
				} else {
					// Second pinch: opposite of first, unless swapped
					useRightTexture = handsSwapped
						? firstPinchIsRight
						: !firstPinchIsRight;
				}

				return (
					<sprite
						key={i}
						position={pos}
						scale={[2, 2, 1]}
						center={useRightTexture ? RIGHT_PINCH_CENTER : LEFT_PINCH_CENTER}
					>
						<spriteMaterial
							map={useRightTexture ? rightTexture : leftTexture}
							transparent
						/>
					</sprite>
				);
			})}

			{/* Dashed line */}
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
