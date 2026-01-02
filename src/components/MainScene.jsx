import CustomPaperGeometry from "./CustomPaperGeometry";
import EdgeMarks from "./EdgeMarks";
import Creases from "./Creases";
import { EdgeSegmenterTool, CreaserTool } from "../affordances";

function MainScene({
	edgeSegmenterActive,
	segmentDivisions,
	vertexPool,
	markIdCounter,
	onMarkPlaced,
	onToggleEdgeSegmenter,
	creaserActive,
	onCreaseCreated,
	onToggleCreaser,
	creases,
}) {
	return (
		<>
			{/* Lighting */}
			<ambientLight intensity={0.6} />
			<directionalLight position={[10, 10, 10]} intensity={0.8} />

			{/* Paper */}
			<CustomPaperGeometry
				vertexPool={vertexPool}
				width={5}
				height={5}
				color="#ff4760"
				side={0}
			/>
			<CustomPaperGeometry
				vertexPool={vertexPool}
				width={5}
				height={5}
				color="#78aeff"
				side={1}
			/>

			{/* Visual marks */}
			<EdgeMarks vertexPool={vertexPool} paperWidth={5} paperHeight={5} />
			<Creases creases={creases} vertexPool={vertexPool} />

			{/* Edge Segmenter Tool */}
			{edgeSegmenterActive && (
				<EdgeSegmenterTool
					divisions={segmentDivisions}
					paperSize={5}
					markIdCounter={markIdCounter} // NEW!
					onMarkPlaced={onMarkPlaced}
					onCancel={onToggleEdgeSegmenter}
				/>
			)}

			{/* Creaser Segmenter Tool */}
			{creaserActive && (
				<CreaserTool
					vertexPool={vertexPool}
					paperSize={5}
					onCreaseCreated={onCreaseCreated}
					onCancel={onToggleCreaser}
				/>
			)}
		</>
	);
}

export default MainScene;
