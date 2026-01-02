import { useState, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ==================== BUTTON (UI) ====================
export function CreaserButton({ isActive, onToggle }) {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				backgroundColor: "rgba(42, 42, 42, 0.9)",
				border: `2px solid ${isActive ? "#6ab0ff" : "#666"}`,
				borderRadius: "8px",
				padding: "10px",
				boxShadow: isActive
					? "0 0 12px rgba(74, 144, 226, 0.5)"
					: "0 4px 12px rgba(0,0,0,0.3)",
			}}
		>
			<button
				onClick={onToggle}
				style={{
					width: "50px",
					height: "50px",
					backgroundColor: isActive ? "#4a90e2" : "transparent",
					border: "none",
					color: "white",
					fontSize: "24px",
					cursor: "pointer",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					borderRadius: "4px",
					transition: "background-color 0.2s ease",
				}}
			>
				✂️
			</button>
		</div>
	);
}

// ==================== TOOL (3D Scene) ====================
export function CreaserTool({
	vertexPool,
	paperSize = 5,
	onCreaseCreated,
	onCancel,
}) {
	const { camera, raycaster, pointer } = useThree();
	const [selectedPoints, setSelectedPoints] = useState([]);
	const [hoveredPoint, setHoveredPoint] = useState(null);

	// Get all clickable points (corners + active staged marks)
	const getClickablePoints = () => {
		return vertexPool.filter(
			(v) =>
				v.type === "corner" ||
				(v.type === "mark" && v.active && v.state === "staged")
		);
	};

	const clickablePoints = getClickablePoints();

	// Detect hovered point
	useFrame(() => {
		if (selectedPoints.length >= 2) return;

		raycaster.setFromCamera(pointer, camera);

		let nearestPoint = null;
		let minDist = Infinity;
		const threshold = 0.3;

		for (const point of clickablePoints) {
			const pointVec = new THREE.Vector3(...point.position); // FIX: Convert array to Vector3
			const dist = raycaster.ray.distanceToPoint(pointVec);

			if (dist < minDist && dist < threshold) {
				minDist = dist;
				nearestPoint = point;
			}
		}

		setHoveredPoint(nearestPoint);
	});

	// Handle click to select points
	useEffect(() => {
		const handleClick = () => {
			if (!hoveredPoint) return;
			if (selectedPoints.length >= 2) return;

			// Check if point already selected by id
			const alreadySelected = selectedPoints.some(
				(p) => p.id === hoveredPoint.id // FIX: Use id instead of index/markId
			);

			if (alreadySelected) return;

			const newSelected = [...selectedPoints, hoveredPoint];
			setSelectedPoints(newSelected);

			// If 2 points selected, create crease
			if (newSelected.length === 2) {
				onCreaseCreated(newSelected[0], newSelected[1]);
				setSelectedPoints([]);
				if (onCancel) onCancel();
			}
		};

		window.addEventListener("click", handleClick);
		return () => window.removeEventListener("click", handleClick);
	}, [hoveredPoint, selectedPoints, onCreaseCreated, onCancel]);

	// Handle ESC to cancel
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === "Escape") {
				setSelectedPoints([]);
				if (onCancel) onCancel();
			}
		};

		window.addEventListener("keydown", handleEscape);
		return () => window.removeEventListener("keydown", handleEscape);
	}, [onCancel]);

	return (
		<group>
			{/* Render all clickable points */}
			{clickablePoints.map((point) => {
				const isSelected = selectedPoints.some((p) => p.id === point.id); // FIX: Use id
				const isHovered = hoveredPoint && hoveredPoint.id === point.id; // FIX: Use id

				return (
					<mesh key={point.id} position={point.position}>
						{" "}
						{/* FIX: Use id as key, position as array */}
						<circleGeometry args={[0.15, 16]} />
						<meshBasicMaterial
							color={isSelected ? "#0000ff" : isHovered ? "#00ff00" : "#ffffff"}
							opacity={isSelected ? 0.8 : 0.3}
							transparent
						/>
					</mesh>
				);
			})}

			{/* Preview line between selected points */}
			{selectedPoints.length === 1 && hoveredPoint && (
				<line>
					<bufferGeometry>
						<bufferAttribute
							attach="attributes-position"
							count={2}
							array={
								new Float32Array([
									...selectedPoints[0].position, // FIX: Already array
									...hoveredPoint.position, // FIX: Already array
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