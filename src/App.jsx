import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import MainScene from "./components/MainScene";
import CanvasControls from "./components/CanvasControls";
import UIOverlay from "./components/UIOverlay";
import "./App.css";

function App() {
	const mainCameraRef = useRef();
	const [isShiftHeld, setIsShiftHeld] = useState(false);
	const markIdCounter = useRef(0); // ← MOVED INSIDE with useRef!

	// EdgeSegmenter state
	const [edgeSegmenterActive, setEdgeSegmenterActive] = useState(false);
	const [segmentDivisions, setSegmentDivisions] = useState(2);

	// Creaser state
	const [creaserActive, setCreaserActive] = useState(false);
	const [creases, setCreases] = useState([]);
	const creaseIdCounter = useRef(0); // For unique crease IDs

	// Vertex lifecycle storage
	const [vertexPool, setVertexPool] = useState([
		// Initial corners
		{
			id: "v0",
			position: [-2.5, -2.5, 0],
			state: "committed",
			type: "corner",
			createdBy: "initial",
		},
		{
			id: "v1",
			position: [2.5, -2.5, 0],
			state: "committed",
			type: "corner",
			createdBy: "initial",
		},
		{
			id: "v2",
			position: [2.5, 2.5, 0],
			state: "committed",
			type: "corner",
			createdBy: "initial",
		},
		{
			id: "v3",
			position: [-2.5, 2.5, 0],
			state: "committed",
			type: "corner",
			createdBy: "initial",
		},
	]);
	const handleToggleEdgeSegmenter = () => {
		setEdgeSegmenterActive(!edgeSegmenterActive);
	};

	const handleToggleCreaser = () => {
		setCreaserActive(!creaserActive);
	};

	const handleIncrementDivisions = () => {
		setSegmentDivisions((prev) => Math.min(prev + 1, 20));
	};

	const handleDecrementDivisions = () => {
		setSegmentDivisions((prev) => Math.max(prev - 1, 2));
	};

	const handleMarkPlaced = (newMarks) => {
		console.log("=== MARK PLACEMENT ===");
		console.log("New marks:", newMarks);

		setVertexPool((prev) => {
			if (newMarks.length === 0) return prev;

			const { v1, v2 } = newMarks[0]; // Get edge from first mark

			// Deactivate old marks on same edge
			const updated = prev.map((vertex) =>
				vertex.type === "mark" &&
				vertex.edge &&
				vertex.edge[0] === v1 &&
				vertex.edge[1] === v2
					? { ...vertex, active: false }
					: vertex
			);

			// Convert marks to staged vertices
			const stagedVertices = newMarks.map((mark) => ({
				...mark,
				position: calculateMarkPosition(v1, v2, mark.t),
				state: "staged",
				type: "mark",
				edge: [v1, v2],
			}));

			return [...updated, ...stagedVertices];
		});
	};

	// Helper function
	const calculateMarkPosition = (v1, v2, t) => {
		const cornerPositions = [
			[-2.5, -2.5, 0],
			[2.5, -2.5, 0],
			[2.5, 2.5, 0],
			[-2.5, 2.5, 0],
		];

		const pos1 = cornerPositions[v1];
		const pos2 = cornerPositions[v2];

		return [
			pos1[0] + (pos2[0] - pos1[0]) * t,
			pos1[1] + (pos2[1] - pos1[1]) * t,
			pos1[2] + (pos2[2] - pos1[2]) * t,
		];
	};

	const handleCreaseCreated = (point1, point2) => {
		console.log("=== CREASE CREATED ===");
		console.log("Point 1:", point1);
		console.log("Point 2:", point2);

		const newCrease = {
			id: `crease-${creaseIdCounter.current++}`,
			point1,
			point2,
			type: "neutral", // Default type
		};

		setCreases((prev) => [...prev, newCrease]);
		console.log("Crease stored:", newCrease);
	};

	return (
		<>
			<Canvas
				camera={{ position: [0,0,8], fov: 45 }}
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
					vertexPool={vertexPool}
					markIdCounter={markIdCounter}
					onMarkPlaced={handleMarkPlaced}
					onToggleEdgeSegmenter={handleToggleEdgeSegmenter}
					creaserActive={creaserActive}
					onCreaseCreated={handleCreaseCreated}
					onToggleCreaser={handleToggleCreaser}
					creases={creases}
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
				onToggleCreaser={handleToggleCreaser}
				creaserActive={creaserActive}
			/>
		</>
	);
}

export default App;
