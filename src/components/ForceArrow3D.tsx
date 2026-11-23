import React from "react";

export interface ForceArrow3DProps {
  start: [number, number, number];
  direction: "up" | "down";
  length: number;
  scale?: number;
  color: string;
  opacity?: number;
  visible?: boolean;
}

/**
 * High-visibility 3D Force Vector with crisp white outline border.
 * Built for precision Remotion rendering with zero runtime drift.
 */
export const ForceArrow3D: React.FC<ForceArrow3DProps> = ({
  start,
  direction,
  length,
  scale = 1,
  color,
  opacity = 1,
  visible = true,
}) => {
  if (!visible || scale <= 0.01 || opacity <= 0.01) {
    return null;
  }

  const effectiveLength = Math.max(0.01, length * scale);
  const coneHeight = Math.min(0.24, effectiveLength * 0.38);
  const coneRadius = 0.065;
  const shaftRadius = 0.024;
  const shaftHeight = Math.max(0.01, effectiveLength - coneHeight);

  const borderOffset = 0.007;

  // Sign multiplier for direction: up = +1, down = -1
  const sign = direction === "up" ? 1 : -1;

  const shaftCenterY = start[1] + sign * (shaftHeight / 2);
  const coneCenterY = start[1] + sign * (shaftHeight + coneHeight / 2);

  return (
    <group position={[start[0], 0, start[2]]}>
      {/* 1. White Outer Stroke / Border for Maximum Contrast */}
      {/* Shaft Border */}
      <mesh position={[0, shaftCenterY, 0]}>
        <cylinderGeometry
          args={[
            shaftRadius + borderOffset,
            shaftRadius + borderOffset,
            shaftHeight + borderOffset * 2,
            16,
          ]}
        />
        <meshBasicMaterial
          color="#FFFFFF"
          transparent
          opacity={opacity * 0.95}
          depthWrite={false}
        />
      </mesh>

      {/* Cone Border */}
      <mesh
        position={[0, coneCenterY, 0]}
        rotation={[direction === "down" ? Math.PI : 0, 0, 0]}
      >
        <coneGeometry
          args={[coneRadius + borderOffset * 1.5, coneHeight + borderOffset * 2, 20]}
        />
        <meshBasicMaterial
          color="#FFFFFF"
          transparent
          opacity={opacity * 0.95}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Solid Inner Colored Vector */}
      {/* Shaft */}
      <mesh position={[0, shaftCenterY, 0]}>
        <cylinderGeometry args={[shaftRadius, shaftRadius, shaftHeight, 16]} />
        <meshStandardMaterial
          color={color}
          roughness={0.25}
          metalness={0.2}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Cone Head */}
      <mesh
        position={[0, coneCenterY, 0]}
        rotation={[direction === "down" ? Math.PI : 0, 0, 0]}
      >
        <coneGeometry args={[coneRadius, coneHeight, 20]} />
        <meshStandardMaterial
          color={color}
          roughness={0.25}
          metalness={0.2}
          transparent
          opacity={opacity}
        />
      </mesh>
    </group>
  );
};
