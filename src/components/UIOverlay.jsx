import OrientationManager from './OrientationManager'
import GridManager from './GridManager'
import Hotkeys from './Hotkeys'

function UIOverlay({ 
  mainCameraRef, 
  isShiftHeld, 
  onShiftChange,
  gridVisible,
  gridDivisions,
  onToggleGrid,
  onDivisionsChange
}) {
  return (
    <>
      <Hotkeys onShiftChange={onShiftChange} />
      
      {/* Bottom-right: Orientation tools */}
      <div style={{
        position: 'absolute',
        bottom: '50px',
        right: '50px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        alignItems: 'flex-end'
      }}>
        <GridManager
          gridVisible={gridVisible}
          gridDivisions={gridDivisions}
          onToggleGrid={onToggleGrid}
          onDivisionsChange={onDivisionsChange}
        />
        
        <OrientationManager 
          mainCameraRef={mainCameraRef} 
          isShiftHeld={isShiftHeld} 
        />
      </div>
    </>
  )
}

export default UIOverlay