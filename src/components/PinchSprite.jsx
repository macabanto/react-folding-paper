// PinchSprite.jsx
import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

// Constants
const PINCH_SPRITE_SCALE = 1.5;

/**
 * PinchSprite Component
 * Renders a pinch marker as a Three.js Sprite in 3D space
 * Flips texture when crossing screen center
 */
function PinchSprite({ position }) {
  const spriteRef = useRef();
  
  const { camera, size } = useThree();
  
  // Calculate screen position to determine which texture to use
  const getScreenX = () => {
    const vec = new THREE.Vector3(...position);
    vec.project(camera);
    return (vec.x * 0.5 + 0.5) * size.width;
  };
  
  const screenX = getScreenX();
  const centerX = size.width / 2;
  
  // Use right texture if on right side of screen
  const shouldMirror = screenX > centerX;
  const texturePath = shouldMirror ? "assets/pinch-R-fill.png" : "assets/pinch-L-fill.png";
  const texture = useTexture(texturePath);

  useEffect(() => {
    if (spriteRef.current) {
      spriteRef.current.scale.set(PINCH_SPRITE_SCALE, PINCH_SPRITE_SCALE, 1);
      
      // Adjust center point based on mirror state
      if (shouldMirror) {
        spriteRef.current.center.set(1 - 0.89, 0.76);
      } else {
        spriteRef.current.center.set(0.89, 0.76);
      }
    }
  }, [shouldMirror]);

  return (
    <sprite ref={spriteRef} position={position}>
      <spriteMaterial
        map={texture}
        transparent={true}
        depthTest={true}
        depthWrite={false}
        sizeAttenuation={true}
      />
    </sprite>
  );
}

export default PinchSprite;