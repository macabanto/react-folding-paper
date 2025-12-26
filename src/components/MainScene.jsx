import { EdgeSegmenterTool } from '../affordances'  // NEW!
import * as THREE from 'three'

// EdgeMarks component stays the same
function EdgeMarks({ edgeName, marks, paperSize = 5 }) {
  // ... existing code ...
}

function MainScene({ rulerToolActive, rulerDivisions, rulerMarks, onMarkPlaced, onToggleRuler }) {
	return (
		<>
			{/* Lighting */}
			<ambientLight intensity={0.6} />
			<directionalLight position={[10, 10, 10]} intensity={0.8} />

			{/* Paper */}
			<mesh position={[0, 0, 0]}>
				<planeGeometry args={[5, 5]} />
				<meshStandardMaterial
					color="#ff4760"
					side={0}
					roughness={0.8}
					metalness={0.1}
				/>
			</mesh>

			<mesh position={[0, 0, 0]}>
				<planeGeometry args={[5, 5]} />
				<meshStandardMaterial
					color="#78aeff"
					side={1}
					roughness={0.8}
					metalness={0.1}
				/>
			</mesh>

			{/* Edge Segmenter Tool */}
			{rulerToolActive && (
				<EdgeSegmenterTool
					divisions={rulerDivisions}
					paperSize={5}
					onMarkPlaced={onMarkPlaced}
					onCancel={onToggleRuler}
				/>
			)}
		</>
	);
}

export default MainScene;