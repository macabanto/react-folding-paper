import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import MainScene from "./components/MainScene";
import UnityCube from "./components/UnityCube";
import Z_Compass from "./components/Z_Compass";
import Pinch from "./components/Pinch"; // Import the new component
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

			{/* UI Panel - Unity Cube + Z Compass grouped together */}
			<div
				style={{
					position: "absolute",
					bottom: "60px",
					right: "60px",
					display: "flex",
					flexDirection: "column",
					gap: "20px",
					alignItems: "flex-end",
				}}
			>
				{/* Unity Cube Canvas */}
				<Canvas
					camera={{ position: [0, 0, 4], fov: 50 }}
					style={{
						width: "150px",
						height: "150px",
						pointerEvents: "auto",
						border: "2px solid #666",
						borderRadius: "75px",
						boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
					}}
				>
					<UnityCube mainCameraRef={mainCameraRef} />
				</Canvas>

				{/* Z Compass */}
				<Z_Compass mainCameraRef={mainCameraRef} />
			</div>

			{/* UI Pinch Panel */}
			<div
				style={{
					position: "absolute",
					bottom: "60px",
					left: "60px", // Adjusted to be left of other UI panel
					display: "flex",
					flexDirection: "column",
					gap: "20px",
					alignItems: "flex-end",
				}}
			>
			<Pinch/>
			</div>
		</>
	);
}

export default App;