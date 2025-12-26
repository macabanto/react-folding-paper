import SceneControls from './SceneControls'
import KeyEventManager from './KeyEventManager'

function CanvasControls({ isShiftHeld }) {
  return (
    <>
      <SceneControls isShiftHeld={isShiftHeld} />
      {/* Future: KeyEventManager for hotkeys */}
    </>
  )
}

export default CanvasControls  // ADD THIS!