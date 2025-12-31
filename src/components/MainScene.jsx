import { EdgeSegmenterTool } from "../affordances"
import CustomPaperGeometry from "./CustomPaperGeometry"
import EdgeMarks from "./EdgeMarks"

function MainScene({
	edgeSegmenterActive,
	segmentDivisions,
	segmentMarks,
	onMarkPlaced,
	onToggleEdgeSegmenter,
}) {
	return (
		<>
			{/* Lighting */}
			<ambientLight intensity={0.6} />
			<directionalLight position={[10, 10, 10]} intensity={0.8} />

			{/* Paper */}
			<CustomPaperGeometry
				segmentMarks={segmentMarks}
				width={5}
				height={5}
				color="#ff4760"
				side={0}
			/>
			<CustomPaperGeometry
				segmentMarks={segmentMarks}
				width={5}
				height={5}
				color="#78aeff"
				side={1}
			/>

			{/* Visual marks */}
			<EdgeMarks segmentMarks={segmentMarks} paperWidth={5} paperHeight={5} />

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
	)
}

export default MainScene