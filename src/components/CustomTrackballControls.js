import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import * as THREE from "three";

class CustomTrackballControls extends TrackballControls {
	constructor(object, domElement) {

		super(object, domElement);
		this.isShiftHeld = false;
		this.isRolling = false;
		this.lastRollAngle = null;
		// Store the original bound handlers
		this._originalOnMouseDown = this._onMouseDown;
		this._originalOnMouseMove = this._onMouseMove;
		this._originalOnMouseUp = this._onMouseUp;

		// Replace with our custom handlers
		this._onMouseDown = this.customMouseDown.bind(this);
		this._onMouseMove = this.customMouseMove.bind(this);
		this._onMouseUp = this.customMouseUp.bind(this);

		// Add shift listeners
		window.addEventListener("keydown", (e) => {
			if (e.key === "Shift") {
				this.isShiftHeld = true;
			}
		});
		window.addEventListener("keyup", (e) => {
			if (e.key === "Shift") {
				this.isShiftHeld = false;
				this.isRolling = false;
				this.lastRollAngle = null;
				this.noRotate = false;
			}
		});
	}

	customMouseDown(event) {
		if (this.isShiftHeld) {
			this.noRotate = true;
			this.isRolling = true;
			this.lastRollAngle = Math.atan2(
				event.pageY - window.innerHeight / 2,
				event.pageX - window.innerWidth / 2
			);
		} else {
			this._originalOnMouseDown(event);
		}
	}

	customMouseMove(event) {
		if (this.isRolling) {
			this.handleRoll(event.pageX, event.pageY);
		} else {
			this._originalOnMouseMove(event);
		}
	}

	customMouseUp(event) {
		if (this.isRolling) {
			this.isRolling = false;
			this.lastRollAngle = null;
			this.noRotate = false;
		} else {
			this._originalOnMouseUp(event);
		}
	}
	handleRoll(pageX, pageY) {
		const centerX = window.innerWidth / 2;
		const centerY = window.innerHeight / 2;
		const angle = Math.atan2(pageY - centerY, pageX - centerX);

		if (this.lastRollAngle !== null) {
			let delta = angle - this.lastRollAngle;
			if (delta > Math.PI) delta -= 2 * Math.PI;
			if (delta < -Math.PI) delta += 2 * Math.PI;

			// Get the forward direction (camera's view direction)
			const forward = new THREE.Vector3(0, 0, -1);
			forward.applyQuaternion(this.object.quaternion);

			// Create rotation quaternion around forward axis
			const q = new THREE.Quaternion();
			q.setFromAxisAngle(forward, -delta);

			// Apply rotation to camera's up vector (this is what TrackballControls uses)
			this.object.up.applyQuaternion(q);
		}

		this.lastRollAngle = angle;
	}

	dispose() {
		super.dispose();
	}
}

export default CustomTrackballControls;
