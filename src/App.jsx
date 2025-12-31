import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import MainScene from "./components/MainScene";
import CanvasControls from "./components/CanvasControls";
import UIOverlay from "./components/UIOverlay";
import "./App.css";

function App() {
	const mainCameraRef = useRef();
	const [isShiftHeld, setIsShiftHeld] = useState(false);
	const markIdCounter = useRef(0);  // ← MOVED INSIDE with useRef!

	// EdgeSegmenter state
	const [edgeSegmenterActive, setEdgeSegmenterActive] = useState(false);
	const [segmentDivisions, setSegmentDivisions] = useState(2);

	// Segment marks storage
	const [segmentMarks, setSegmentMarks] = useState([]);

	const handleToggleEdgeSegmenter = () => {
		setEdgeSegmenterActive(!edgeSegmenterActive);
	};

	const handleIncrementDivisions = () => {
		setSegmentDivisions((prev) => Math.min(prev + 1, 20));
	};

	const handleDecrementDivisions = () => {
		setSegmentDivisions((prev) => Math.max(prev - 1, 2));
	};

	const handleMarkPlaced = (v1, v2, divisions) => {
		console.log("=== MARK PLACEMENT ===");
		console.log("Edge vertices:", v1, v2);
		console.log("Divisions:", divisions);

		// Calculate new marks
		const newMarks = [];
		for (let i = 1; i < divisions; i++) {
			const t = i / divisions;
			newMarks.push({
				id: `mark-${markIdCounter.current++}`,  // ← Now works with .current!
				v1,
				v2,
				t,
				divisions,
				active: true,
			});
		}

		console.log("New marks to set:", newMarks);

		// Mark old marks as inactive instead of removing them
		setSegmentMarks((prev) => {
			const updated = prev.map((m) =>
				m.v1 === v1 && m.v2 === v2
					? { ...m, active: false }
					: m
			);
			return [...updated, ...newMarks];
		});
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