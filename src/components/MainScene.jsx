import { useRef, useState, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import PinchSprite from "./PinchSprite";
import * as THREE from "three";

// Constants for pinch system
const GRID_SIZE = 5 / 12; // Size of each grid cell (5x5 paper divided into 12x12 grid)
const SNAP_DISTANCE = 30; // Pixels - distance for snapping to edge vertices
const PINCH_ANGLE_OFFSET = Math.PI / 10; // Rotation offset for pinch orientation

/**
 * EdgeVertexHighlights Component
 * Shows white circles at edge vertices when pinch tool is active
 * Highlights the currently selected vertex
 */
function EdgeVertexHighlights({ isActive, selectedVertex }) {
	const edgeVertices = [];

	// Generate all edge vertices
	for (let i = 0; i <= 12; i++) {
		const coord = -2.5 + i * GRID_SIZE;
		edgeVertices.push([coord, 2.5, 0.02]);
		edgeVertices.push([coord, -2.5, 0.02]);
		if (i > 0 && i < 12) {
			edgeVertices.push([-2.5, coord, 0.02]);
			edgeVertices.push([2.5, coord, 0.02]);
		}
	}

	if (!isActive) return null;

	return (
		<>
			{edgeVertices.map((pos, i) => {
				const isSelected =
					selectedVertex &&
					pos[0] === selectedVertex[0] &&
					pos[1] === selectedVertex[1];

				return (
					<Html key={i} position={pos} center>
						<svg width="20" height="20" style={{ overflow: "visible" }}>
							<circle
								cx="10"
								cy="10"
								r="4"
								fill={isSelected ? "rgba(255,255,255,0.3)" : "none"}
								stroke="white"
								strokeWidth={isSelected ? "2" : "1"}
								opacity={isSelected ? "1" : "0.6"}
							/>
						</svg>
					</Html>
				);
			})}
		</>
	);
}

/**
 * PinchInteraction Component
 * Handles the pinch tool's interaction with the 3D scene
 */
function PinchInteraction() {
	const [isToolActive, setIsToolActive] = useState(false);
	const [snappedVertex, setSnappedVertex] = useState(null);
	const [placedPinches, setPlacedPinches] = useState([]);

	const { camera, gl } = useThree();

	/**
	 * Calculate angles and mirror states for pinches
	 */
	const getPinchProperties = () => {
		if (placedPinches.length === 0) {
			return [];
		}

		if (placedPinches.length === 1) {
			const [pinch1] = placedPinches;
			const shouldMirror = pinch1[0] > 0; // Mirror if on right side of origin
			return [
				{
					angle: undefined, // Dynamic rotation toward screen center
					mirror: shouldMirror,
				},
			];
		}

		if (placedPinches.length === 2) {
			const [pinch1, pinch2] = placedPinches;

			// Both pinches face each other
			const angle1 =
				Math.atan2(pinch2[1] - pinch1[1], pinch2[0] - pinch1[0]) +
				PINCH_ANGLE_OFFSET;
			const angle2 =
				Math.atan2(pinch1[1] - pinch2[1], pinch1[0] - pinch2[0]) +
				PINCH_ANGLE_OFFSET;

			// Mirror based on which side they're on relative to each other
			const mirror1 = pinch1[0] > pinch2[0];
			const mirror2 = pinch2[0] > pinch1[0];

			return [
				{ angle: angle1, mirror: mirror1 },
				{ angle: angle2, mirror: mirror2 },
			];
		}

		return [];
	};

	const findNearestEdgeVertex = (screenX, screenY) => {
		const edgeVertices = [];

		for (let i = 0; i <= 12; i++) {
			const coord = -2.5 + i * GRID_SIZE;
			edgeVertices.push([coord, 2.5, 0.02]);
			edgeVertices.push([coord, -2.5, 0.02]);
			if (i > 0 && i < 12) {
				edgeVertices.push([-2.5, coord, 0.02]);
				edgeVertices.push([2.5, coord, 0.02]);
			}
		}

		const rect = gl.domElement.getBoundingClientRect();
		let nearestVertex = null;
		let minDistance = SNAP_DISTANCE;

		for (const vertex of edgeVertices) {
			const vec = new THREE.Vector3(...vertex);
			vec.project(camera);

			const screenVertexX = (vec.x * 0.5 + 0.5) * rect.width + rect.left;
			const screenVertexY = (-vec.y * 0.5 + 0.5) * rect.height + rect.top;

			const distance = Math.sqrt(
				Math.pow(screenX - screenVertexX, 2) +
					Math.pow(screenY - screenVertexY, 2)
			);

			if (distance < minDistance) {
				minDistance = distance;
				nearestVertex = vertex;
			}
		}

		return nearestVertex;
	};

	useEffect(() => {
		const handleActivated = () => {
			setIsToolActive(true);
			console.log("🎯 Pinch tool active - edge vertices highlighted");
		};

		const handleMoving = (e) => {
			if (!isToolActive) return;
			const vertex = findNearestEdgeVertex(e.detail.x, e.detail.y);
			setSnappedVertex(vertex);
		};

		const handleClick = () => {
			if (isToolActive && snappedVertex) {
				const exists = placedPinches.some(
					(p) => p[0] === snappedVertex[0] && p[1] === snappedVertex[1]
				);

				if (!exists && placedPinches.length < 2) {
					const newPinches = [...placedPinches, snappedVertex];
					setPlacedPinches(newPinches);
					
					const shouldMirror = snappedVertex[0] > 0;
					console.log(
						`📍 Placing pinch ${newPinches.length}/2 - ${
							shouldMirror ? "mirrored" : "not mirrored"
						}`
					);

					if (newPinches.length === 2) {
						window.dispatchEvent(new CustomEvent("pinchMaxReached"));
						console.log("✅ 2 pinches placed - facing each other");
					}
				} else if (placedPinches.length >= 2) {
					console.log("⚠️ Maximum 2 pinches already placed");
				}
			}
		};

		const handleDeactivated = () => {
			setIsToolActive(false);
			setSnappedVertex(null);
			setPlacedPinches([]);
			console.log("❌ Pinch tool deactivated - all pinches removed");
		};

		window.addEventListener("pinchActivated", handleActivated);
		window.addEventListener("pinchDeactivated", handleDeactivated);
		window.addEventListener("pinchMoving", handleMoving);
		window.addEventListener("click", handleClick);

		return () => {
			window.removeEventListener("pinchActivated", handleActivated);
			window.removeEventListener("pinchDeactivated", handleDeactivated);
			window.removeEventListener("pinchMoving", handleMoving);
			window.removeEventListener("click", handleClick);
		};
	}, [isToolActive, snappedVertex, placedPinches, camera, gl]);

	const pinchProperties = getPinchProperties();

	return (
		<>
			<EdgeVertexHighlights
				isActive={isToolActive}
				selectedVertex={snappedVertex}
			/>

			{/* Placed pinches */}
			{placedPinches.map((pos, i) => (
				<PinchSprite
					key={i}
					position={pos}
					faceAngle={pinchProperties[i]?.angle}
					shouldMirror={pinchProperties[i]?.mirror}
				/>
			))}
		</>
	);
}

/**
 * MainScene Component
 * Renders the 3D origami paper, lighting, and grid
 */
function MainScene() {
	return (
		<>
			<PinchInteraction />

			{/* Lighting */}
			<ambientLight intensity={0.6} />
			<directionalLight position={[10, 10, 10]} intensity={0.8} />

			{/* Paper - Red front */}
			<mesh position={[0, 0, 0]}>
				<planeGeometry args={[5, 5]} />
				<meshStandardMaterial
					color="#ff4760"
					side={0}
					roughness={0.8}
					metalness={0.1}
				/>
			</mesh>

			{/* Paper - Blue back */}
			<mesh position={[0, 0, 0]}>
				<planeGeometry args={[5, 5]} />
				<meshStandardMaterial
					color="#78aeff"
					side={1}
					roughness={0.8}
					metalness={0.1}
				/>
			</mesh>

			{/* Grid */}
			<gridHelper
				args={[5, 12, 0xcccccc, 0xcccccc]}
				rotation={[Math.PI / 2, 0, 0]}
			/>
		</>
	);
}

export default MainScene;