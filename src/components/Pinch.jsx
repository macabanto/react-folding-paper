// Pinch.jsx
import { useState, useEffect } from "react";
function Pinch() {
  const [isActive, setIsActive] = useState(false);
  const [showCursor, setShowCursor] = useState(true); // NEW: separate state for cursor visibility
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const handleToggle = (e) => {
    if (!isActive) {
      // Activating tool
      setCursorPos({ x: e.clientX, y: e.clientY });
      setShowCursor(true); // Show cursor when activating
      console.log("🎯 Pinch tool activated!");
      window.dispatchEvent(new CustomEvent("pinchActivated"));
    } else {
      // Deactivating tool
      setShowCursor(true); // Reset cursor visibility
      console.log("❌ Pinch tool deactivated");
      window.dispatchEvent(new CustomEvent("pinchDeactivated"));
    }
    setIsActive(!isActive);
  };

  useEffect(() => {
    if (isActive) {
      const handleMouseMove = (e) => {
        setCursorPos({ x: e.clientX, y: e.clientY });
        window.dispatchEvent(
          new CustomEvent("pinchMoving", {
            detail: { x: e.clientX, y: e.clientY },
          })
        );
      };

      // Listen for max reached - hide cursor but keep tool active
      const handleMaxReached = () => {
        setShowCursor(false); // Hide cursor SVG
        console.log("🛑 Cursor hidden: 2 pinches placed");
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("pinchMaxReached", handleMaxReached);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("pinchMaxReached", handleMaxReached);
      };
    }
  }, [isActive]);

  return (
    <>
      {/* Container - toggle button */}
      <div
        onClick={handleToggle}
        style={{
          width: "100px",
          height: "100px",
          border: "2px solid #666",
          borderRadius: "50px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          pointerEvents: "auto",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src="assets/pinch-L-fill.svg"
          alt="Pinch icon"
          draggable={false}
          style={{
            width: "60px",
            height: "60px",
            userSelect: "none",
            pointerEvents: "none",
            opacity: isActive ? 0 : 1, // Hidden when tool active
            transition: "opacity 0.2s ease",
          }}
        />
      </div>

      {/* Pinch cursor - only show if active AND showCursor is true */}
      {isActive && showCursor && (
        <img
          src="assets/pinch-L-fill.svg"
          alt="Pinch cursor"
          draggable={false}
          style={{
            position: "fixed",
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
            width: "240px",
            height: "240px",
            transform: "translate(-200px, -40px)",
            pointerEvents: "none",
            zIndex: 9999,
            opacity: 0.75,
          }}
        />
      )}
    </>
  );
}

export default Pinch;