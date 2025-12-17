function PinchToolButton({ isActive, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: '60px',
        height: '60px',
        backgroundColor: isActive ? '#4a90e2' : 'rgba(42, 42, 42, 0.9)',
        border: `2px solid ${isActive ? '#6ab0ff' : '#666'}`,
        borderRadius: '8px',
        color: 'white',
        fontSize: '24px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        boxShadow: isActive ? '0 0 12px rgba(74, 144, 226, 0.5)' : '0 4px 12px rgba(0,0,0,0.3)',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'rgba(60, 60, 60, 0.9)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'rgba(42, 42, 42, 0.9)'
        }
      }}
    >
      📍
    </button>
  )
}

export default PinchToolButton