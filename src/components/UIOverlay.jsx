import OrientationManager from "./OrientationManager";
import { EdgeSegmenterButton } from "../affordances";  // NEW!

function UIOverlay({
	mainCameraRef,
	isShiftHeld,
	onShiftChange,
	rulerToolActive,
	rulerDivisions,
	onToggleRuler,
	onIncrementDivisions,
	onDecrementDivisions,
}) {
	return (
		<>
			<div
				style={{
					position: "absolute",
					bottom: "50px",
					right: "50px",
					display: "flex",
					flexDirection: "column",
					gap: "20px",
					alignItems: "flex-end",
				}}
			>
				<EdgeSegmenterButton
					isActive={rulerToolActive}
					divisions={rulerDivisions}
					onToggle={onToggleRuler}
					onIncrementDivisions={onIncrementDivisions}
					onDecrementDivisions={onDecrementDivisions}
				/>

				<OrientationManager
					mainCameraRef={mainCameraRef}
					isShiftHeld={isShiftHeld}
				/>
			</div>
		</>
	);
}

export default UIOverlay;