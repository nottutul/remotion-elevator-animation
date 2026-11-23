import React, { useLayoutEffect } from "react";
import { AbsoluteFill } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { Character3D } from "../components/Character3D";

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

export const CharTest: React.FC = () => {
  // 5 poses side by side at x = -1.8, -0.9, 0.0, 0.9, 1.8
  const poses: Array<{
    name: string;
    override: "t-pose" | "natural-standing" | "heavy" | "light" | "think";
    x: number;
  }> = [
    { name: "T-Pose", override: "t-pose", x: -1.8 },
    { name: "Natural Standing", override: "natural-standing", x: -0.9 },
    { name: "Heavy (Compression)", override: "heavy", x: 0.0 },
    { name: "Light (Extension)", override: "light", x: 0.9 },
    { name: "Think (Hand to Chin)", override: "think", x: 1.8 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#F1F5F9" }}>
      <ThreeCanvas
        width={1920}
        height={1080}
        camera={{ position: [0, 0.95, 4.6], fov: 32 }}
      >
        <CameraController position={[0, 0.95, 4.6]} target={[0, 0.95, 0]} />

        {/* Neutral Studio Lighting */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[-4, 8, 5]} intensity={1.5} castShadow />
        <directionalLight position={[4, 5, 3]} intensity={0.8} />
        <hemisphereLight args={["#FFFFFF", "#CBD5E1", 0.5]} />

        {/* Floor Plane */}
        <mesh position={[0, -0.01, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[16, 10]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.8} />
        </mesh>

        {/* The 5 Characters */}
        {poses.map((p) => (
          <group key={p.name} position={[p.x, 0, 0]}>
            <Character3D frame={0} overridePose={p.override} />
          </group>
        ))}
      </ThreeCanvas>

      {/* 2D HTML Labels for the 5 poses */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-around",
          padding: "0 60px",
          fontFamily: "system-ui, sans-serif",
          fontWeight: 700,
          fontSize: 22,
          color: "#1E293B",
          textAlign: "center",
        }}
      >
        {poses.map((p) => (
          <div
            key={p.name}
            style={{
              width: 320,
              padding: "10px 16px",
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              borderRadius: 16,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            {p.name}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
