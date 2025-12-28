import { EdgeSegmenterTool } from "../affordances";
import CustomPaperGeometry from "./CustomPaperGeometry";  // FIX: relative path
import * as THREE from "three";

function MainScene({
	edgeSegmenterActive,     // FIX: prop name
	segmentDivisions,        // FIX: prop name
	segmentMarks,            // FIX: add this
	onMarkPlaced,
	onToggleEdgeSegmenter,   // FIX: prop name
}) {
	return (
		<>
			{/* Lighting */}
			<ambientLight intensity={0.6} />
			<directionalLight position={[10, 10, 10]} intensity={0.8} />

			{/* Paper - Front (red) */}
			<CustomPaperGeometry
				segmentMarks={segmentMarks}
				width={5}
				height={5}
				color="#ff4760"
				side={0}
			/>

			{/* Paper - Back (blue) */}
			<CustomPaperGeometry
				segmentMarks={segmentMarks}
				width={5}
				height={5}
				color="#78aeff"
				side={1}
			/>

			{/* Edge Segmenter Tool */}
			{edgeSegmenterActive && (
				<EdgeSegmenterTool
					divisions={segmentDivisions}
					paperSize={5}
					onMarkPlaced={onMarkPlaced}
					onCancel={onToggleEdgeSegmenter}
				/>
			)}
		</>
	);
}

export default MainScene;