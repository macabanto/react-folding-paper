function GridManager({ gridVisible, gridDivisions, onToggleGrid, onDivisionsChange }) {
  const handleIncrement = (axis) => {
    onDivisionsChange({
      ...gridDivisions,
      [axis]: Math.min(gridDivisions[axis] + 1, 50) // Max 50
    })
  }

  const handleDecrement = (axis) => {
    onDivisionsChange({
      ...gridDivisions,
      [axis]: Math.max(gridDivisions[axis] - 1, 2) // Min 2
    })
  }

  return (
    <div style={{
      width: '150px',
      padding: '15px',
      backgroundColor: 'rgba(42, 42, 42, 0.9)',
      border: '2px solid #666',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      color: 'white',
      fontFamily: 'sans-serif',
      fontSize: '14px'
    }}>
      {/* Toggle */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={gridVisible}
            onChange={(e) => onToggleGrid(e.target.checked)}
            style={{ marginRight: '8px', cursor: 'pointer' }}
          />
          Show Grid
        </label>
      </div>

      {/* X Divisions */}
      <div style={{ marginBottom: '10px' }}>
        <div style={{ fontSize: '12px', marginBottom: '4px', color: '#aaa' }}>X Divisions</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => handleDecrement('x')}
            style={{
              width: '30px',
              height: '30px',
              border: '1px solid #666',
              background: '#333',
              color: 'white',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            −
          </button>
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{gridDivisions.x}</span>
          <button
            onClick={() => handleIncrement('x')}
            style={{
              width: '30px',
              height: '30px',
              border: '1px solid #666',
              background: '#333',
              color: 'white',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            +
          </button>
        </div>
      </div>

      {/* Y Divisions */}
      <div>
        <div style={{ fontSize: '12px', marginBottom: '4px', color: '#aaa' }}>Y Divisions</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => handleDecrement('y')}
            style={{
              width: '30px',
              height: '30px',
              border: '1px solid #666',
              background: '#333',
              color: 'white',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            −
          </button>
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{gridDivisions.y}</span>
          <button
            onClick={() => handleIncrement('y')}
            style={{
              width: '30px',
              height: '30px',
              border: '1px solid #666',
              background: '#333',
              color: 'white',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}

export default GridManager