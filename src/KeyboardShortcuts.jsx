// components/KeyboardShortcuts.jsx
function KeyboardShortcuts({ onShiftChange }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Shift') onShiftChange(true)
      // Future: R for reset, G for grid, etc.
    }
    
    const handleKeyUp = (e) => {
      if (e.key === 'Shift') onShiftChange(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [onShiftChange])

  return null
}

export default KeyboardShortcuts