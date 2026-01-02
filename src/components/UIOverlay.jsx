import OrientationManager from "./OrientationManager";
import KeyEventManager from "./KeyEventManager";
import { EdgeSegmenterButton, CreaserButton } from "../affordances";

function UIOverlay({
	mainCameraRef,
	isShiftHeld,
	onShiftChange,
	edgeSegmenterActive,
	segmentDivisions,
	onToggleEdgeSegmenter,
	creaserActive,
	onToggleCreaser,
	onIncrementDivisions,
	onDecrementDivisions,
}) {
	return (
		<>
			<KeyEventManager onShiftChange={onShiftChange} />

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
				<CreaserButton 
					isActive={creaserActive} 
					onToggle={onToggleCreaser} 
				/>
				<EdgeSegmenterButton
					isActive={edgeSegmenterActive}
					divisions={segmentDivisions}
					onToggle={onToggleEdgeSegmenter}
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
