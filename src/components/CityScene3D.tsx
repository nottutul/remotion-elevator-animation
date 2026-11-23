import React, { useLayoutEffect, useMemo } from "react";
import { staticFile } from "remotion";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

export interface CityScene3DProps {
  liftY: number; // Vertical position of the lift in meters
  frame: number;
}

const BG_IMAGE_PATH = staticFile("Futuristic Cityscape in Sunlit Haze.png");

// Preload the background texture
useTexture.preload(BG_IMAGE_PATH);

export const CityScene3D: React.FC<CityScene3DProps> = ({ liftY }) => {
  // Load background texture
  const bgTexture = useTexture(BG_IMAGE_PATH);

  useLayoutEffect(() => {
    bgTexture.colorSpace = THREE.SRGBColorSpace;
    bgTexture.needsUpdate = true;
  }, [bgTexture]);

  // Background plane sizing:
  // Original image aspect ratio is 793 x 1983 = 0.399899
  const planeWidth = 22.0;
  const planeHeight = planeWidth / (793 / 1983); // ~55.05m

  // Parallax: The background is very far away, so it moves significantly slower than the lift.
  // Base Y at -7.6m places the glowing round sun disk and soft corona completely inside the upper-left sky above the cabin roof.
  // Soft-limit the shift so that extreme long travel in S4, S5, and S7 never exposes the image boundaries.
  // Safe margin analysis:
  // Frustum vertical visible height at Z = -26.0m is 23.68m (Y from -10.54m to +13.14m).
  // Plane height is 55.05m (Y from -35.125m to +19.925m).
  // Max safe shift upward is +5.0m; max safe shift downward is -15.0m.
    // Continuous smooth parallax that never freezes
  const rawShift = -liftY * 0.10;
  const softShift =
    rawShift >= 0
      ? Math.log(1 + rawShift) * 2.8
      : -Math.log(1 - rawShift) * 3.5;

  const bgY = 3 + softShift;

  // Infinite wrapping for repeating architectural floor slabs & brackets:
  // Slab period = 4.0m matching S1's exact spacing.
  // Wrapped offset ensures continuous motion without popping or floating point drift across S1 to S7.
  const buildingY = -liftY * 0.8;
  const slabPeriod = 4.0;
  const wrappedOffset = buildingY - Math.round(buildingY / slabPeriod) * slabPeriod;

  // Materials for the modern building on the right
  const buildingFacadeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#285F91", // Rich medium-dark architectural blue matching background skyscraper
        roughness: 0.38,
        metalness: 0.12,
      }),
    []
  );

  const panelJointMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#14304D", // Deep navy architectural floor panel groove
        roughness: 0.55,
        metalness: 0.2,
      }),
    []
  );

  const railSteelMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#64748B", // Brushed modern steel for elevator tracks
        roughness: 0.3,
        metalness: 0.8,
      }),
    []
  );

  const bracketMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1E2E40", // Deep slate mounting brackets
        roughness: 0.35,
        metalness: 0.85,
      }),
    []
  );

  return (
    <group>
      {/* ============================================================== */}
      {/* 1. DISTANT CITYSCAPE BACKGROUND (4:16 vertical ratio with parallax) */}
      {/* ============================================================== */}
      <mesh position={[1.3, bgY, -35.0]}>
        <planeGeometry args={[planeWidth, planeHeight]} />
        <meshBasicMaterial
          map={bgTexture}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* ============================================================== */}
      {/* 2. MODERN SKYSCRAPER BUILDING TOWER (Attached to lift on right) */}
      {/* ============================================================== */}
      <group position={[0, 0, 0]}>
        {/* Main Tower Body starting at X = 0.80m extending to X = 4.3m */}
        <mesh position={[2.55, 0, -0.6]} material={buildingFacadeMaterial}>
          <boxGeometry args={[3.5, 100, 3.5]} />
        </mesh>

        {/* Vertical Architectural Facade Seams */}
        <mesh position={[1.85, 0, 1.16]}>
          <boxGeometry args={[0.03, 100, 0.03]} />
          <meshStandardMaterial color="#3B72A2" roughness={0.5} />
        </mesh>
        <mesh position={[2.95, 0, 1.16]}>
          <boxGeometry args={[0.03, 100, 0.03]} />
          <meshStandardMaterial color="#3B72A2" roughness={0.5} />
        </mesh>

        {/* Horizontal Floor Slabs & Seams repeating every 4.0m with continuous wrapping */}
        {[-32, -28, -24, -20, -16, -12, -8, -4, 0, 4, 8, 12, 16, 20, 24, 28, 32].map((baseY) => {
          const slabY = baseY + wrappedOffset;
          return (
            <group key={`slab-${baseY}`} position={[0, slabY, 0]}>
              {/* Floor Slab Accent Line across building face */}
              <mesh position={[2.55, 0, -0.6]} material={panelJointMaterial}>
                <boxGeometry args={[3.52, 0.05, 3.52]} />
              </mesh>

              {/* Heavy Structural Mounting Brackets securing tracks to wall */}
              <mesh position={[0.82, 0, 0.35]} material={bracketMaterial}>
                <boxGeometry args={[0.08, 0.10, 0.20]} />
              </mesh>
              <mesh position={[0.82, 0, -0.35]} material={bracketMaterial}>
                <boxGeometry args={[0.08, 0.10, 0.20]} />
              </mesh>
            </group>
          );
        })}

        {/* Vertical Elevator Guide Rails (Two extruded steel tracks on building face) */}
        {/* Front Guide Rail */}
        <mesh position={[0.81, 0, 0.35]} material={railSteelMaterial}>
          <boxGeometry args={[0.05, 100, 0.07]} />
        </mesh>

        {/* Back Guide Rail */}
        <mesh position={[0.81, 0, -0.35]} material={railSteelMaterial}>
          <boxGeometry args={[0.05, 100, 0.07]} />
        </mesh>

        {/* Central Steel Channel Track connecting rails */}
        <mesh position={[0.83, 0, 0]} material={railSteelMaterial}>
          <boxGeometry args={[0.03, 100, 0.72]} />
        </mesh>

        {/* Continuous Hoist Cables running up through the top of the frame */}
        {[-0.12, 0.12].map((offsetZ, i) => (
          <mesh key={`hoist-cable-${i}`} position={[0.80, 0, offsetZ]}>
            <cylinderGeometry args={[0.012, 0.012, 100, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.25} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
