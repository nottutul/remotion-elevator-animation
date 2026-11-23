import React, { useLayoutEffect } from "react";
import { AbsoluteFill } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { Character3D } from "../components/Character3D";
import { LiftCabin3D } from "../components/LiftCabin3D";

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

export const MotionStrip: React.FC = () => {
  // 12 key frames spread across Scene 1
  const keyframes = [
    { frame: 15, time: "0.5s", label: "Rest / Intro" },
    { frame: 45, time: "1.5s", label: "Idle Life" },
    { frame: 75, time: "2.5s", label: "Start UP" },
    { frame: 100, time: "3.3s", label: "Heavy Peak" },
    { frame: 146, time: "4.9s", label: "Heavy Badge" },
    { frame: 180, time: "6.0s", label: "Top Cruise" },
    { frame: 195, time: "6.5s", label: "Start DOWN" },
    { frame: 220, time: "7.3s", label: "Light Peak" },
    { frame: 250, time: "8.3s", label: "Light Badge" },
    { frame: 285, time: "9.5s", label: "Settle Rest" },
    { frame: 305, time: "10.2s", label: "Think Raise" },
    { frame: 330, time: "11.0s", label: "Think & Card" },
  ];

  // Grid layout: 4 columns x 3 rows
  // Spacing in 3D world coordinates
  const colSpacing = 2.4;
  const rowSpacing = 2.9;

  return (
    <AbsoluteFill style={{ backgroundColor: "#F8FAFC" }}>
      <ThreeCanvas
        width={1920}
        height={1440}
        camera={{ position: [0, 0.5, 12.0], fov: 40 }}
      >
        <CameraController position={[0, 0.5, 12.0]} target={[0, 0.5, 0]} />
        <ambientLight intensity={0.65} />
        <directionalLight position={[-8, 12, 10]} intensity={1.4} castShadow />
        <directionalLight position={[8, 8, 6]} intensity={0.7} />
        <hemisphereLight args={["#E0F2FE", "#CBD5E1", 0.6]} />

        {/* 12 Keyframe Cells in a 4x3 Grid */}
        {keyframes.map((kf, i) => {
          const col = i % 4; // 0, 1, 2, 3
          const row = Math.floor(i / 4); // 0, 1, 2
          const posX = (col - 1.5) * colSpacing;
          const posY = (1 - row) * rowSpacing - 0.7;

          const dir =
            kf.frame >= 70 && kf.frame <= 180
              ? "up"
              : kf.frame >= 186 && kf.frame <= 285
              ? "down"
              : "idle";
          const floor =
            kf.frame > 235 ? "32F" : kf.frame > 125 ? "34F" : "33F";

          return (
            <group key={`cell-${kf.frame}`} position={[posX, posY, 0]}>
              <LiftCabin3D currentFloor={floor} direction={dir} />
              <Character3D frame={kf.frame} />
            </group>
          );
        })}
      </ThreeCanvas>

      {/* 2D HTML Labels for the 12 Grid Cells */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1920,
          height: 1440,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
          pointerEvents: "none",
          padding: "20px 30px",
          boxSizing: "border-box",
        }}
      >
        {keyframes.map((kf) => (
          <div
            key={`lbl-${kf.frame}`}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "center",
              paddingBottom: 24,
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(15, 23, 42, 0.85)",
                color: "#FFFFFF",
                padding: "8px 16px",
                borderRadius: 14,
                fontFamily: "system-ui, sans-serif",
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 800, color: "#38BDF8" }}>
                {kf.time} (f{kf.frame})
              </div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{kf.label}</div>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
