import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import MainScene from "./components/MainScene";
import CanvasControls from "./components/CanvasControls";  // NEW!
import UIOverlay from "./components/UIOverlay";
import "./App.css";

function App() {
	const mainCameraRef = useRef();
	const [isShiftHeld, setIsShiftHeld] = useState(false);

	// EdgeSegmenter state
	const [edgeSegmenterActive, setEdgeSegmenterActive] = useState(false);
	const [segmentDivisions, setSegmentDivisions] = useState(2);
	
	// Segment marks storage
	const [segmentMarks, setSegmentMarks] = useState({
		top: [],
		bottom: [],
		left: [],
		right: []
	});

	const handleToggleEdgeSegmenter = () => {
		setEdgeSegmenterActive(!edgeSegmenterActive);
	};

	const handleIncrementDivisions = () => {
		setSegmentDivisions((prev) => Math.min(prev + 1, 20));
	};

	const handleDecrementDivisions = () => {
		setSegmentDivisions((prev) => Math.max(prev - 1, 2));
	};

	const handleMarkPlaced = (edgeName, divisions) => {
		const marks = [];
		for (let i = 1; i < divisions; i++) {
			const t = i / divisions;
			marks.push({ t, divisions });
		}
		
		setSegmentMarks(prev => ({
			...prev,
			[edgeName]: marks
		}));
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
					edgeSegmenterActive={edgeSegmenterActive}
					segmentDivisions={segmentDivisions}
					segmentMarks={segmentMarks}
					onMarkPlaced={handleMarkPlaced}
					onToggleEdgeSegmenter={handleToggleEdgeSegmenter}
				/>
				<CanvasControls isShiftHeld={isShiftHeld} />
			</Canvas>

			<UIOverlay 
				mainCameraRef={mainCameraRef} 
				isShiftHeld={isShiftHeld}
				onShiftChange={setIsShiftHeld}
				edgeSegmenterActive={edgeSegmenterActive}
				segmentDivisions={segmentDivisions}
				onToggleEdgeSegmenter={handleToggleEdgeSegmenter}
				onIncrementDivisions={handleIncrementDivisions}
				onDecrementDivisions={handleDecrementDivisions}
			/>
		</>
	);
}

export default App;