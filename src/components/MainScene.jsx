import CustomGrid from "./CustomGrid";
import PinchTool from "./PinchTool";

function MainScene({ gridVisible, gridDivisions, pinchToolActive, onTogglePinchTool }) {
	return (
		<>
			{/* Lighting */}
			<ambientLight intensity={0.6} />
			<directionalLight position={[10, 10, 10]} intensity={0.8} />

			{/* Paper - Red front, Blue back */}
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

			{/* Grid */}
			{gridVisible && (
				<CustomGrid
					divisionsX={gridDivisions.x}
					divisionsY={gridDivisions.y}
					size={5}
					color={0xcccccc}
				/>
			)}

			{/* Pinch Tool */}
			{pinchToolActive && (
				<PinchTool
					gridDivisions={gridDivisions}
					paperSize={5}
					onCancel={onTogglePinchTool} // Pass the toggle function
				/>
			)}
		</>
	);
}

export default MainScene;
