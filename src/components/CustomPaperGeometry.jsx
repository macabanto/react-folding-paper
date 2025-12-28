import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

class PaperGeometry {
	constructor(width = 5, height = 5) {
		this.width = width;
		this.height = height;
		const halfWidth = width / 2;
		const halfHeight = height / 2;

		// Start with regular JavaScript arrays
		this.vertices = [
			-halfWidth,
			-halfHeight,
			0, // v0: bottom-left
			halfWidth,
			-halfHeight,
			0, // v1: bottom-right
			halfWidth,
			halfHeight,
			0, // v2: top-right
			-halfWidth,
			halfHeight,
			0, // v3: top-left
		];

		this.indices = [
			0,
			1,
			2, // Triangle 1
			0,
			2,
			3, // Triangle 2
		];

		// Create Three.js geometry
		this.geometry = new THREE.BufferGeometry();
		this._updateGeometry();
	}

	_updateGeometry() {
		// Convert to TypedArrays for Three.js
		const positions = new Float32Array(this.vertices);
		const indices = new Uint16Array(this.indices);

		this.geometry.setAttribute(
			"position",
			new THREE.BufferAttribute(positions, 3)
		);
		this.geometry.setIndex(new THREE.BufferAttribute(indices, 1));
		this.geometry.computeVertexNormals(); // For proper lighting
	}

	addVertex(x, y, z) {
		this.vertices.push(x, y, z);
		this._updateGeometry();
		return this.vertices.length / 3 - 1; // Return new vertex index
	}

	addTriangle(v0, v1, v2) {
		this.indices.push(v0, v1, v2);
		this._updateGeometry();
	}

	getVertexPosition(index) {
		const i = index * 3;
		return new THREE.Vector3(
			this.vertices[i],
			this.vertices[i + 1],
			this.vertices[i + 2]
		);
	}

	getEdgeVertices() {
		// Return indices of edge vertices
		// For now, just the 4 corners (will expand when subdividing)
		return [0, 1, 2, 3];
	}

	getGeometry() {
		return this.geometry;
	}

	dispose() {
		this.geometry.dispose();
	}
}

// React component wrapper
function CustomPaperGeometry({
	segmentMarks,
	width = 5,
	height = 5,
	color = "#ff4760",
	side = 0,
}) {
	const paperGeomRef = useRef();

	const paperGeom = useMemo(() => {
		const geom = new PaperGeometry(width, height);
		paperGeomRef.current = geom;
		return geom;
	}, [width, height]);

	// Update when segment marks change
	useEffect(() => {
		// TODO: Subdivide based on segment marks
		// For now, just log
		console.log("Segment marks updated:", segmentMarks);
	}, [segmentMarks]);

	// Cleanup
	useEffect(() => {
		return () => {
			if (paperGeomRef.current) {
				paperGeomRef.current.dispose();
			}
		};
	}, []);

	return (
		<mesh>
			<primitive object={paperGeom.getGeometry()} attach="geometry" />
			<meshStandardMaterial
				color={color}
				side={side}
				roughness={0.8}
				metalness={0.1}
			/>
		</mesh>
	);
}

export default CustomPaperGeometry;
export { PaperGeometry }; // Export class for use elsewhere if needed
