import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function FaceLabel({ text, position, rotation }) {
	// Create text texture with full words
	const texture = useMemo(() => {
		const canvas = document.createElement("canvas");
		canvas.width = 256;
		canvas.height = 256;
		const ctx = canvas.getContext("2d");

		// Background
		ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
		ctx.fillRect(0, 0, 256, 256);

		// Text
		ctx.fillStyle = "#ffffff";
		ctx.font = "bold 46px Arial";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(text, 128, 128);

		return new THREE.CanvasTexture(canvas);
	}, [text]);

	return (
		<mesh position={position} rotation={rotation}>
			<planeGeometry args={[1.9, 1.9]} />
			<meshBasicMaterial map={texture} transparent opacity={0.9} />
		</mesh>
	);
}

function UnityCube({ mainCameraRef }) {
	const cubeRef = useRef();

	// Sync cube rotation with main camera (mirrors orientation)
	useFrame(() => {
		if (cubeRef.current && mainCameraRef?.current) {
			cubeRef.current.quaternion
				.copy(mainCameraRef.current.quaternion)
				.invert();
		}
	});

	// Handle clicking cube FACES
	const handleClick = (event) => {
		// Get clicked face normal
		const normal = event.face.normal.clone();

		// Determine view name from face normal
		const absX = Math.abs(normal.x);
		const absY = Math.abs(normal.y);
		const absZ = Math.abs(normal.z);

		let viewName;
		if (absX > absY && absX > absZ) {
			viewName = normal.x > 0 ? "right" : "left";
		} else if (absY > absX && absY > absZ) {
			viewName = normal.y > 0 ? "top" : "bottom";
		} else {
			viewName = normal.z > 0 ? "front" : "back";
		}

		console.log("Clicked face:", viewName);

		// Snap main camera to view (bidirectional sync: Unity → Main)
		const viewPositions = {
			front: [0, 0, 10],
			back: [0, 0, -10],
			right: [10, 0, 0],
			left: [-10, 0, 0],
			top: [0, 10, 0],
			bottom: [0, -10, 0],
		};

		const targetPos = viewPositions[viewName];
		if (targetPos && mainCameraRef?.current) {
			mainCameraRef.current.position.set(...targetPos);
			mainCameraRef.current.lookAt(0, 0, 0);
		}
	};

	return (
		<group ref={cubeRef}>
			{/* Background */}
			<color attach="background" args={["#2a2a2a"]} />

			{/* Lighting */}
			<ambientLight intensity={0.6} />
			<directionalLight position={[2, 2, 2]} intensity={0.5} />

			{/* Cube - Wireframe */}
			<mesh onClick={handleClick}>
				<boxGeometry args={[1.8, 1.8, 1.8]} />
				<meshStandardMaterial
					color="#808080" // Change color
					metalness={0.3} // 0-1, how metallic
					roughness={0.6} // 0-1, how rough/shiny
					wireframe={true} // true/false
					opacity={0.8} // 0-1 if transparent
					transparent={true} // Enable transparency
				/>
			</mesh>

			{/* Face Labels with full words */}
			<FaceLabel text="FRONT" position={[0, 0, 0.9]} rotation={[0, 0, 0]} />
			<FaceLabel
				text="BACK"
				position={[0, 0, -0.9]}
				rotation={[0, Math.PI, 0]}
			/>
			<FaceLabel
				text="RIGHT"
				position={[0.9, 0, 0]}
				rotation={[0, Math.PI / 2, 0]}
			/>
			<FaceLabel
				text="LEFT"
				position={[-0.9, 0, 0]}
				rotation={[0, -Math.PI / 2, 0]}
			/>
			<FaceLabel
				text="TOP"
				position={[0, 0.9, 0]}
				rotation={[-Math.PI / 2, 0, 0]}
			/>
			<FaceLabel
				text="BOTTOM"
				position={[0, -0.9, 0]}
				rotation={[Math.PI / 2, 0, 0]}
			/>
		</group>
	);
}
export default UnityCube;