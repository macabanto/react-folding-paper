import { useEffect } from 'react'

function KeyEventManager({ onShiftChange }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Shift') {
        onShiftChange(true)
      }
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

  return null  // This component doesn't render anything
}

export default KeyEventManager