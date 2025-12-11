import { useState, useRef, useEffect } from "react";

function Pinch() {
	const [isDragging, setIsDragging] = useState(false);
	const [isOutside, setIsOutside] = useState(false); // NEW: Track if outside container
	const [position, setPosition] = useState({ x: 0, y: 0 }); // Offset from center when inside
	const [absolutePos, setAbsolutePos] = useState({ x: 0, y: 0 }); // Screen position when outside
	const dragStartRef = useRef({ x: 0, y: 0 });

	const handlePinchDragStart = (e) => {
		e.preventDefault();
		setIsDragging(true);
		dragStartRef.current = {
			x: e.clientX - position.x,
			y: e.clientY - position.y,
		};
	};

	const handlePinchDrag = (e) => {
		if (!isDragging) return;

		const rect = e.currentTarget.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;

		let newX = e.clientX - centerX;
		let newY = e.clientY - centerY;

		const maxRadius = 24;
		const distance = Math.sqrt(newX * newX + newY * newY);

		// Check if beyond boundary
		if (distance > maxRadius) {
			// Escape to screen space!
			if (!isOutside) {
				setIsOutside(true);
				console.log('🚀 Pinch escaped container!');
			}
			setAbsolutePos({ x: e.clientX, y: e.clientY });
		} else {
			// Still inside container
			if (isOutside) {
				setIsOutside(false);
				console.log('↩️ Pinch back in container');
			}
			const angle = Math.atan2(newY, newX);
			newX = Math.min(distance, maxRadius) * Math.cos(angle);
			newY = Math.min(distance, maxRadius) * Math.sin(angle);
			setPosition({ x: newX, y: newY });
		}
	};

	const handlePinchDragEnd = () => {
		if (!isDragging) return;

		setIsDragging(false);

		if (isOutside) {
			// Place pinch at current position
			console.log('📍 Placing pinch at screen position:', absolutePos);
			window.dispatchEvent(new CustomEvent("pinchPlaced", {
				detail: absolutePos
			}));
		}

		// Reset
		setIsOutside(false);
		setPosition({ x: 0, y: 0 });
	};

	// Add global mouse listener when outside container
	useEffect(() => {
		if (isOutside && isDragging) {
			const handleGlobalMove = (e) => {
				setAbsolutePos({ x: e.clientX, y: e.clientY });
			};

			const handleGlobalUp = () => {
				handlePinchDragEnd();
			};

			window.addEventListener('mousemove', handleGlobalMove);
			window.addEventListener('mouseup', handleGlobalUp);

			return () => {
				window.removeEventListener('mousemove', handleGlobalMove);
				window.removeEventListener('mouseup', handleGlobalUp);
			};
		}
	}, [isOutside, isDragging]);

	return (
		<>
			{/* Container */}
			<div
				onMouseDown={handlePinchDragStart}
				onMouseMove={handlePinchDrag}
				onMouseUp={handlePinchDragEnd}
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
					cursor: isDragging ? "grabbing" : "grab",
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
						transform: `translate(${position.x - 4}px, ${position.y + 5}px)`,
						transition: isDragging ? "none" : "transform 0.2s ease-out",
						userSelect: "none",
						pointerEvents: "none",
						opacity: isOutside ? 0 : 1, // Hide when outside
					}}
				/>
			</div>

			{/* Escaped pinch - follows mouse across screen */}
			{isOutside && (
				<img
					src="assets/pinch-L-fill.svg"
					alt="Pinch dragging"
					draggable={false}
					style={{
						position: "fixed",
						left: `${absolutePos.x}px`,
						top: `${absolutePos.y}px`,
						width: "60px",
						height: "60px",
						transform: "translate(-30px, -30px)", // Center on cursor
						pointerEvents: "none",
						zIndex: 9999,
						opacity: 0.8
					}}
				/>
			)}
		</>
	);
}

export default Pinch;