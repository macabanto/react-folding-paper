import CustomGrid from "./CustomGrid";

function MainScene({ gridVisible, gridDivisions }) {
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

			{/* Custom Grid with separate X/Y divisions */}
			{gridVisible && (
				<CustomGrid
					divisionsX={gridDivisions.x}
					divisionsY={gridDivisions.y}
					size={5} // Match paper size (was 10)
					color={0xcccccc}
				/>
			)}
		</>
	);
}

export default MainScene;
