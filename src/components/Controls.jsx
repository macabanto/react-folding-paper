import { useRef, useEffect, useState } from "react";
import { extend, useThree, useFrame } from "@react-three/fiber";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import * as THREE from "three";

extend({ TrackballControls });

function Controls() {
	const controlsRef = useRef();
	const { camera, gl } = useThree();
	const [isShiftHeld, setIsShiftHeld] = useState(false);
	const [isRolling, setIsRolling] = useState(false);
	const lastMouseX = useRef(null);

	// Listen for Shift key
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Shift") {
				setIsShiftHeld(true);
			}
		};
		const handleKeyUp = (e) => {
			if (e.key === "Shift") {
				setIsShiftHeld(false);
				// Force TrackballControls to accept current camera state
				if (controlsRef.current) {
					controlsRef.current.update();
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [controlsRef]);

	// Handle roll when Shift is held
	// update quarnion pls
	useEffect(() => {
		if (!isShiftHeld) return;

		const handleMouseDown = () => {
			setIsRolling(true);
		};

		const handleMouseMove = (e) => {
			if (!isRolling) return;

			// Get mouse position relative to screen center
			const centerX = window.innerWidth / 2;
			const centerY = window.innerHeight / 2;

			const mouseX = e.clientX - centerX;
			const mouseY = e.clientY - centerY;

			// Calculate angle from center (like a steering wheel)
			const angle = Math.atan2(mouseY, mouseX);

			// Store previous angle and calculate delta
			if (lastMouseX.current !== null) {
				let deltaAngle = angle - lastMouseX.current;

				// Handle wraparound at ±PI
				if (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;
				if (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;

				// Get camera's forward direction (view direction)
				const forward = new THREE.Vector3(0, 0, -1);
				forward.applyQuaternion(camera.quaternion);

				// Create rotation around the forward axis (roll)
				const rollQuaternion = new THREE.Quaternion();
				rollQuaternion.setFromAxisAngle(forward, -deltaAngle);

				// Apply roll to camera
				camera.quaternion.multiplyQuaternions(
					rollQuaternion,
					camera.quaternion
				);
				camera.updateMatrixWorld();
			}

			lastMouseX.current = angle;
		};

		const handleMouseUp = () => {
			setIsRolling(false);
			lastMouseX.current = null;
		};

		gl.domElement.addEventListener("mousedown", handleMouseDown);
		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);

		return () => {
			gl.domElement.removeEventListener("mousedown", handleMouseDown);
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isShiftHeld, isRolling, camera, gl, controlsRef]);

	useEffect(() => {
		if (controlsRef.current) {
			controlsRef.current.target.set(0, 0, 0);
		}
	}, []);

	useFrame(() => {
		if (controlsRef.current && !isRolling && !isShiftHeld) {
			controlsRef.current.update();
		}
	});

	return (
		<trackballControls
			ref={controlsRef}
			args={[camera, gl.domElement]}
			rotateSpeed={2.0}
			noZoom={false}
			noPan={false}
			enabled={!isShiftHeld}
		/>
	);
}

export default Controls;
