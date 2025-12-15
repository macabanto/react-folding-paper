import { useMemo } from "react";
import * as THREE from "three";

function CustomGrid({
	divisionsX = 10,
	divisionsY = 10,
	size = 5,
	color = 0xcccccc,
}) {
	const gridGeometry = useMemo(() => {
		const geometry = new THREE.BufferGeometry();
		const vertices = [];

		const halfSize = size / 2;

		// Create vertical lines (along X axis)
		for (let i = 0; i <= divisionsX; i++) {
			const x = (i / divisionsX) * size - halfSize;
			vertices.push(x, -halfSize, 0);
			vertices.push(x, halfSize, 0);
		}

		// Create horizontal lines (along Y axis)
		for (let i = 0; i <= divisionsY; i++) {
			const y = (i / divisionsY) * size - halfSize;
			vertices.push(-halfSize, y, 0);
			vertices.push(halfSize, y, 0);
		}

		geometry.setAttribute(
			"position",
			new THREE.Float32BufferAttribute(vertices, 3)
		);
		return geometry;
	}, [divisionsX, divisionsY, size]);

	return (
		<lineSegments geometry={gridGeometry}>
			{" "}
			{/* Remove rotation prop */}
			<lineBasicMaterial color={color} />
		</lineSegments>
	);
}

export default CustomGrid;
