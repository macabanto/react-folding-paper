import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import MainScene from "./components/MainScene";
import UnityCube from "./components/UnityCube";
import Z_Compass from "./components/Z_Compass";
import Controls from "./components/Controls";
import "./App.css";

function App() {
	// Shared reference to main camera for bidirectional syncing
	const mainCameraRef = useRef();

	return (
		<>
			{/* Main Scene - Full viewport */}
			{/* Instructions overlay */}
			<div
				style={{
					position: "absolute",
					bottom: "20px",
					right: "20px",
					color: "white",
					backgroundColor: "rgba(0, 0, 0, 0.6)",
					padding: "10px 15px",
					borderRadius: "5px",
					fontSize: "14px",
					fontFamily: "sans-serif",
					pointerEvents: "none",
					zIndex: 1,
				}}
			>
				Hold <strong>Shift</strong> + drag to roll camera
			</div>
			<Canvas
				camera={{ position: [5, 5, 5], fov: 75 }}
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
				}}
				onCreated={({ camera }) => {
					mainCameraRef.current = camera;
				}}
			>
				<MainScene />
				<Controls />
			</Canvas>

			{/* Unity Cube - bottom-right corner */}
			<Canvas
				camera={{ position: [0, 0, 4], fov: 50 }}
				style={{
					position: "absolute",
					bottom: "60px",
					right: "60px",
					width: "150px",
					height: "150px",
					pointerEvents: "auto",
					border: "2px solid #666", // Add border
					borderRadius: "75px", // Round corners
					boxShadow: "0 4px 12px rgba(0,0,0,0.3)", // Optional: drop shadow
				}}
			>
				<UnityCube mainCameraRef={mainCameraRef} />
			</Canvas>

			<Z_Compass mainCameraRef={mainCameraRef} />
		</>
	);
}

export default App;
