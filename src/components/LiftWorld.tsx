import React, { useLayoutEffect } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { CityScene3D } from "./CityScene3D";
import { LiftCabin3D } from "./LiftCabin3D";
import { Character3D } from "./Character3D";
import { ForceArrow3D } from "./ForceArrow3D";
import { getCameraZ, getLiftState } from "../lib/motion";

const CameraController: React.FC<{
  position: [number, number, number];
  target: [number, number, number];
}> = ({ position, target }) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    camera.position.set(position[0], position[1], position[2]);
    camera.lookAt(target[0], target[1], target[2]);
    camera.updateProjectionMatrix();
  }, [camera, position, target]);
  return null;
};

export interface LiftWorldProps {
  frame: number;
  fps?: number;
}

/**
 * Continuous 3D Shot for Lift Physics Video.
 * Contains CityScene3D, Panoramic Glass Lift Cabin, 3D Character, and 3D Force Vectors.
 */
export const LiftWorld: React.FC<LiftWorldProps> = ({ frame, fps = 30 }) => {
  const lift = getLiftState(frame, fps);

  // Camera setup: matches S1 push-in for frames 0-339, then holds at 5.85 for all frames >= 339
  const cameraZ = getCameraZ(frame);
  const cameraPos: [number, number, number] = [0, 1.30, cameraZ];
  const cameraTarget: [number, number, number] = [0, 1.30, 0];

  // Cabin Display Logic (floor number and indicator arrow)
  let direction: "up" | "down" | "idle" = "idle";
  let currentFloor = "32F";

  if (frame <= 339) {
    // Scene 1 exact floor logic
    if (frame >= 70 && frame <= 180) {
      direction = "up";
      currentFloor = frame > 125 ? "34F" : "33F";
    } else if (frame > 180 && frame < 186) {
      direction = "idle";
      currentFloor = "34F";
    } else if (frame >= 186 && frame <= 285) {
      direction = "down";
      currentFloor = frame > 235 ? "32F" : "33F";
    } else {
      direction = "idle";
      currentFloor = "32F";
    }
  } else if (frame > 339 && frame <= 948) {
    // S2 & S3: Cabin stationary at 34F
    direction = "idle";
    currentFloor = "34F";
  } else if (frame > 948 && frame <= 1470) {
    // S4: Upward acceleration
    direction = "up";
    const fRel = frame - 969;
    if (fRel < 120) currentFloor = "35F";
    else if (fRel < 240) currentFloor = "36F";
    else if (fRel < 360) currentFloor = "37F";
    else currentFloor = "38F";
  } else if (frame > 1470 && frame <= 1893) {
    // S5: Downward acceleration
    direction = "down";
    const fRel = frame - 1486;
    if (fRel < 100) currentFloor = "38F";
    else if (fRel < 200) currentFloor = "37F";
    else if (fRel < 300) currentFloor = "36F";
    else currentFloor = "35F";
  } else if (frame > 1893 && frame <= 2178) {
    // S6: Stationary
    direction = "idle";
    currentFloor = "35F";
  } else {
    // S7: Free fall
    direction = "down";
    const fRel = frame - 2188;
    const floorNum = Math.max(12, Math.round(35 - (fRel / 253) * 20));
    currentFloor = `${floorNum}F`;
  }

  // --------------------------------------------------------------------------
  // Force Vectors Scaling and Visibility
  // --------------------------------------------------------------------------
  // 1. mg (Gravity): red #D32F2F. Introduced in S2 (frame 339), remains until end.
  const mgVisible = frame >= 339;
  const mgScale = frame < 339 ? 0 : Math.min(1.0, (frame - 339) / 20);

  // 2. N (Normal Force): green #2E7D32. Introduced in S3 (frame 670).
  // S3: 1.0, S4: 1.5, S5: 0.5, S6: 1.0, S7: 0.0 (collapses in free fall)
  let nTargetScale = 0.0;
  if (frame >= 670 && frame <= 948) {
    nTargetScale = Math.min(1.0, (frame - 670) / 20);
  } else if (frame > 948 && frame <= 1470) {
    // S4: expands to 1.5
    const t = Math.min(1.0, Math.max(0, (frame - 969) / 25));
    nTargetScale = 1.0 + 0.5 * t;
  } else if (frame > 1470 && frame <= 1893) {
    // S5: drops to 0.5
    const t = Math.min(1.0, Math.max(0, (frame - 1486) / 25));
    nTargetScale = 1.0 - 0.5 * t;
  } else if (frame > 1893 && frame <= 2178) {
    // S6: returns to 1.0
    const t = Math.min(1.0, Math.max(0, (frame - 1900) / 25));
    nTargetScale = 0.5 + 0.5 * t;
  } else if (frame > 2178) {
    // S7: collapses to 0.0
    const t = Math.min(1.0, Math.max(0, (frame - 2188) / 20));
    nTargetScale = Math.max(0.0, 1.0 - 1.0 * t);
  }

  // 3. Acceleration vector 'a' or 'g': blue #1565C0. Shown outside the cabin on the left.
  let aVisible = false;
  let aDirection: "up" | "down" = "up";
  let aScale = 0.0;

  if (frame >= 969 && frame <= 1460) {
    // S4: pointing up
    aVisible = true;
    aDirection = "up";
    aScale = Math.min(1.0, (frame - 969) / 20);
  } else if (frame >= 1486 && frame <= 1880) {
    // S5: pointing down
    aVisible = true;
    aDirection = "down";
    aScale = Math.min(1.0, (frame - 1486) / 20);
  } else if (frame >= 2188) {
    // S7: pointing down (g)
    aVisible = true;
    aDirection = "down";
    aScale = Math.min(1.0, (frame - 2188) / 20);
  }

  return (
    <ThreeCanvas
      width={1080}
      height={1920}
      camera={{ position: cameraPos, fov: 42 }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 1080,
        height: 1920,
      }}
    >
      <CameraController position={cameraPos} target={cameraTarget} />

      {/* Ambient & Hemisphere Lighting */}
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#E0F2FE", "#FFF3E0", 0.70]} />

      {/* Warm Directional Sun from Upper Left matching the background image */}
      <directionalLight
        position={[-6, 12, 5]}
        intensity={1.8}
        color="#FFF8E7"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      {/* Key Fill Light from front-left camera side */}
      <directionalLight
        position={[-2.0, 2.0, 4.5]}
        intensity={1.3}
        color="#FFF6EC"
      />

      {/* Frontal Soft Light */}
      <directionalLight
        position={[1.5, 1.5, 4.5]}
        intensity={0.65}
        color="#E0F2FE"
      />

      {/* Warm Elevator Ceiling Downlight Diffuser */}
      <pointLight
        position={[-0.08, 2.58, 0]}
        intensity={1.3}
        color="#FFF8DC"
        distance={4.0}
        decay={1.8}
      />

      {/* Warm Golden Sun Rim Light from Upper Left */}
      <directionalLight
        position={[-4, 8, 1]}
        intensity={1.5}
        color="#FED7AA"
      />

      {/* Warm Soft Rim Light from Back Right */}
      <directionalLight
        position={[3.0, 3.0, -3.0]}
        intensity={0.65}
        color="#FFE8C2"
      />

      {/* 3D City Environment (Distant background with parallax + Right-side Skyscraper Tower) */}
      <CityScene3D liftY={lift.liftY} frame={frame} />

      {/* Panoramic Glass Lift Cabin */}
      <group position={[0, 0.38, 0]}>
        <LiftCabin3D currentFloor={currentFloor} direction={direction} />
      </group>

      {/* 3D Ready Player Me Character (Standing centered inside cabin at X = -0.08) */}
      <group position={[-0.08, 0.38, 0]}>
        <Character3D frame={frame} fps={fps} />
      </group>

      {/* -------------------------------------------------------------- */}
      {/* 3D Physics Force Vectors                                       */}
      {/* -------------------------------------------------------------- */}
      {/* 1. mg (Gravity: Red, pointing DOWN from character chest/center) */}
      <ForceArrow3D
        start={[-0.08, 1.60, 0.35]}
        direction="down"
        length={0.50}
        scale={mgScale}
        color="#D32F2F"
        visible={mgVisible}
      />

      {/* 2. N (Normal Force: Green, pointing UP from cabin floor under feet) */}
      <ForceArrow3D
        start={[-0.08, 0.38, 0.35]}
        direction="up"
        length={0.55}
        scale={nTargetScale}
        color="#2E7D32"
        visible={nTargetScale > 0.01}
      />

      {/* 3. a / g (Acceleration: Blue, shown outside cabin on left) */}
      <ForceArrow3D
        start={[-1.05, aDirection === "up" ? 1.05 : 1.55, 0.20]}
        direction={aDirection}
        length={0.50}
        scale={aScale}
        color="#1565C0"
        visible={aVisible}
      />
    </ThreeCanvas>
  );
};
