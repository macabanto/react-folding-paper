import { useEffect } from 'react'

function Hotkeys({ onShiftChange }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Shift') {
        onShiftChange(true)
      }
      // Future hotkeys go here
    }
    
    const handleKeyUp = (e) => {
      if (e.key === 'Shift') {
        onShiftChange(false)
      }
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

export default Hotkeys