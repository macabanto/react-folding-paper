import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import MainScene from "./components/MainScene";
import Controls from "./components/Controls";
import UIOverlay from "./components/UIOverlay";
import "./App.css";

function App() {
	const mainCameraRef = useRef();
	const [isShiftHeld, setIsShiftHeld] = useState(false);
	
	// Grid state
	const [gridVisible, setGridVisible] = useState(true);
	const [gridDivisions, setGridDivisions] = useState({ x: 10, y: 10 });

	// Pinch tool state
	const [pinchToolActive, setPinchToolActive] = useState(false);

	const handleTogglePinchTool = () => {
		setPinchToolActive(!pinchToolActive);
	};

	return (
		<>
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
				<MainScene 
					gridVisible={gridVisible}
					gridDivisions={gridDivisions}
					pinchToolActive={pinchToolActive}
					onTogglePinchTool={handleTogglePinchTool}  // Add this line

				/>
				<Controls isShiftHeld={isShiftHeld} />
			</Canvas>

			<UIOverlay 
				mainCameraRef={mainCameraRef} 
				isShiftHeld={isShiftHeld}
				onShiftChange={setIsShiftHeld}
				gridVisible={gridVisible}
				gridDivisions={gridDivisions}
				onToggleGrid={setGridVisible}
				onDivisionsChange={setGridDivisions}
				pinchToolActive={pinchToolActive}
				onTogglePinchTool={handleTogglePinchTool}
			/>
		</>
	);
}

export default App;