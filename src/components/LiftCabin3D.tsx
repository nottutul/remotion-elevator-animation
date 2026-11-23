import React, { useMemo } from "react";
import * as THREE from "three";

export interface LiftCabin3DProps {
  currentFloor?: string;
  direction?: "up" | "down" | "idle";
}

export const LiftCabin3D: React.FC<LiftCabin3DProps> = ({
  direction = "idle",
}) => {
  // Dimensions in meters (matching reference image)
  // Cabin is centered at X = -0.08m, spanning X from -0.96m to +0.80m (attached to right building)
  const cabinCenterX = -0.08;
  const cabinW = 1.76;
  const cabinH = 2.22;
  const cabinD = 1.05;

  // Materials: Architectural Blue Steel & Glass matching the skyscraper building
  const silverFrameMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#224A73", // Elegant deep architectural blue steel frame
        roughness: 0.28,
        metalness: 0.45,
      }),
    []
  );

  const baseChassisMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#163454", // Deep navy blue chassis matching the building
        roughness: 0.32,
        metalness: 0.4,
      }),
    []
  );

  const polishedFloorMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#9EBEDD", // Reflective glass floor with cool blue tint
        roughness: 0.15,
        metalness: 0.35,
      }),
    []
  );

  const luminousCeilingMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#FFFDF0", // Soft glowing luminous ceiling diffuser
        emissive: "#FFF5D0",
        emissiveIntensity: 1.6,
        roughness: 0.2,
      }),
    []
  );

  const roofHousingMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#183B60", // Stepped mechanical roof unit in deep architectural blue
        roughness: 0.35,
        metalness: 0.35,
      }),
    []
  );

  const rightWallMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#285F91", // Exactly matches building facade
        roughness: 0.38,
        metalness: 0.12,
      }),
    []
  );

  // Transparent panoramic glass panels
  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#E0F2FE",
        transparent: true,
        opacity: 0.14,
        roughness: 0.05,
        metalness: 0.12,
        depthWrite: false,
      }),
    []
  );

  const polishedHandrailMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#FFFFFF", // Bright polished chrome handrail
        roughness: 0.1,
        metalness: 0.75,
      }),
    []
  );

  const copPanelMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1E3D5E", // Deep architectural blue operating panel
        roughness: 0.25,
        metalness: 0.4,
      }),
    []
  );

  // High-Resolution Digital Indicator Texture on Operating Panel
  const indicatorTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 384;
    const ctx = canvas.getContext("2d")!;

    // Dark sleek display screen
    ctx.fillStyle = "#0F172A";
    ctx.fillRect(0, 0, 256, 384);

    // Glowing UP Arrow (▲) - Illuminated vibrant green when going up or idle
    const isUp = direction === "up" || direction === "idle";
    ctx.fillStyle = isUp ? "#22C55E" : "#334155";
    ctx.beginPath();
    ctx.moveTo(128, 44);
    ctx.lineTo(214, 156);
    ctx.lineTo(42, 156);
    ctx.closePath();
    ctx.fill();

    // Vibrant green inner glow
    if (isUp) {
      ctx.fillStyle = "#86EFAC";
      ctx.beginPath();
      ctx.moveTo(128, 68);
      ctx.lineTo(194, 148);
      ctx.lineTo(62, 148);
      ctx.closePath();
      ctx.fill();
    }

    // DOWN Arrow (▼)
    const isDown = direction === "down";
    ctx.fillStyle = isDown ? "#F59E0B" : "#334155";
    ctx.beginPath();
    ctx.moveTo(128, 340);
    ctx.lineTo(214, 228);
    ctx.lineTo(42, 228);
    ctx.closePath();
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }, [direction]);

  // Soft Character Floor Contact Shadow (Cast by the luminous ceiling light diffuser)
  const contactShadowTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;

    ctx.clearRect(0, 0, 512, 512);

    // 1. Soft general ambient body shadow pool under the character (from ceiling diffuser light)
    const bodyGrad = ctx.createRadialGradient(256, 256, 10, 256, 256, 220);
    bodyGrad.addColorStop(0, "rgba(10, 18, 30, 0.42)");
    bodyGrad.addColorStop(0.5, "rgba(10, 18, 30, 0.20)");
    bodyGrad.addColorStop(1, "rgba(10, 18, 30, 0)");

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(256, 256, 210, 140, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Left boot contact shadow (darker, tighter)
    const leftFootGrad = ctx.createRadialGradient(195, 260, 5, 195, 260, 80);
    leftFootGrad.addColorStop(0, "rgba(5, 10, 20, 0.70)");
    leftFootGrad.addColorStop(0.4, "rgba(5, 10, 20, 0.35)");
    leftFootGrad.addColorStop(1, "rgba(5, 10, 20, 0)");

    ctx.fillStyle = leftFootGrad;
    ctx.beginPath();
    ctx.ellipse(195, 260, 42, 75, -0.05, 0, Math.PI * 2);
    ctx.fill();

    // 3. Right boot contact shadow (darker, tighter)
    const rightFootGrad = ctx.createRadialGradient(317, 260, 5, 317, 260, 80);
    rightFootGrad.addColorStop(0, "rgba(5, 10, 20, 0.70)");
    rightFootGrad.addColorStop(0.4, "rgba(5, 10, 20, 0.35)");
    rightFootGrad.addColorStop(1, "rgba(5, 10, 20, 0)");

    ctx.fillStyle = rightFootGrad;
    ctx.beginPath();
    ctx.ellipse(317, 260, 42, 75, 0.05, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* ============================================================== */}
      {/* 1. CABIN BASE & POLISHED REFLECTIVE FLOOR                      */}
      {/* ============================================================== */}
      {/* Heavy Brushed Aluminum Base Chassis Tray */}
      <mesh
        position={[cabinCenterX, -0.08, 0]}
        material={baseChassisMaterial}
      >
        <boxGeometry args={[cabinW + 0.05, 0.16, cabinD + 0.05]} />
      </mesh>

      {/* Top Polished Mirror-Finish Floor Plate */}
      <mesh
        position={[cabinCenterX, 0.005, 0]}
        receiveShadow
        material={polishedFloorMaterial}
      >
        <boxGeometry args={[cabinW - 0.02, 0.012, cabinD - 0.02]} />
      </mesh>

      {/* Soft Contact Shadow directly beneath character's feet on the floor */}
      <mesh
        position={[cabinCenterX, 0.012, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[0.78, 0.58]} />
        <meshBasicMaterial
          map={contactShadowTexture}
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </mesh>

      {/* Bottom Structural Bracket Under Chassis Connecting to Building Guide Rails */}
      <mesh position={[0.78, -0.08, 0]} material={silverFrameMaterial}>
        <boxGeometry args={[0.08, 0.16, 0.75]} />
      </mesh>

      {/* ============================================================== */}
      {/* 2. CABIN CEILING & LUMINOUS PANEL & STEPPED ROOF               */}
      {/* ============================================================== */}
      {/* Ceiling Header Structural Beam Frame */}
      <mesh position={[cabinCenterX, cabinH + 0.035, 0]} material={silverFrameMaterial}>
        <boxGeometry args={[cabinW + 0.05, 0.07, cabinD + 0.05]} />
      </mesh>

      {/* Recessed Glowing Ceiling Diffuser Light Fixture */}
      <mesh position={[cabinCenterX, cabinH - 0.005, 0]} material={luminousCeilingMaterial}>
        <boxGeometry args={[cabinW * 0.84, 0.015, cabinD * 0.82]} />
      </mesh>

      {/* Stepped Mechanical Roof Housing (Matching reference image) */}
      {/* Step 1: Lower Roof Unit Box */}
      <mesh position={[cabinCenterX, cabinH + 0.12, 0]} material={roofHousingMaterial}>
        <boxGeometry args={[cabinW * 0.70, 0.12, cabinD * 0.70]} />
      </mesh>

      {/* Step 2: Upper Roof Cap Box */}
      <mesh position={[cabinCenterX, cabinH + 0.20, 0]} material={silverFrameMaterial}>
        <boxGeometry args={[cabinW * 0.46, 0.06, cabinD * 0.46]} />
      </mesh>

      {/* Upper Guide Shoe Bracket connecting roof to building tracks */}
      <mesh position={[0.78, cabinH + 0.12, 0]} material={silverFrameMaterial}>
        <boxGeometry args={[0.08, 0.16, 0.75]} />
      </mesh>

      {/* ============================================================== */}
      {/* 3. STRUCTURAL SLENDER CORNER POSTS                             */}
      {/* ============================================================== */}
      {/* Front-Left Post */}
      <mesh
        position={[cabinCenterX - cabinW / 2 + 0.022, cabinH / 2, cabinD / 2 - 0.022]}
        material={silverFrameMaterial}
      >
        <boxGeometry args={[0.045, cabinH, 0.045]} />
      </mesh>

      {/* Back-Left Post */}
      <mesh
        position={[cabinCenterX - cabinW / 2 + 0.022, cabinH / 2, -cabinD / 2 + 0.022]}
        material={silverFrameMaterial}
      >
        <boxGeometry args={[0.045, cabinH, 0.045]} />
      </mesh>

      {/* Front-Right Trim Post against Building */}
      <mesh
        position={[0.78, cabinH / 2, cabinD / 2 - 0.022]}
        material={silverFrameMaterial}
      >
        <boxGeometry args={[0.04, cabinH, 0.04]} />
      </mesh>

      {/* Back-Right Trim Post against Building */}
      <mesh
        position={[0.78, cabinH / 2, -cabinD / 2 + 0.022]}
        material={silverFrameMaterial}
      >
        <boxGeometry args={[0.04, cabinH, 0.04]} />
      </mesh>

      {/* Right Wall Structural Column (Attaches to building tracks at X = +0.80m) */}
      <mesh position={[0.795, cabinH / 2, 0]} material={rightWallMaterial}>
        <boxGeometry args={[0.025, cabinH, cabinD + 0.02]} />
      </mesh>

      {/* ============================================================== */}
      {/* 4. TRANSPARENT PANORAMIC GLASS PANELS                          */}
      {/* ============================================================== */}
      {/* Front Panoramic Glass */}
      <mesh
        position={[cabinCenterX, cabinH / 2, cabinD / 2 - 0.01]}
        material={glassMaterial}
      >
        <boxGeometry args={[cabinW - 0.04, cabinH - 0.015, 0.012]} />
      </mesh>

      {/* Left Panoramic Glass (Looking over open sunlit city) */}
      <mesh
        position={[cabinCenterX - cabinW / 2 + 0.01, cabinH / 2, 0]}
        material={glassMaterial}
      >
        <boxGeometry args={[0.012, cabinH - 0.015, cabinD - 0.04]} />
      </mesh>

      {/* Back Panoramic Glass */}
      <mesh
        position={[cabinCenterX, cabinH / 2, -cabinD / 2 + 0.01]}
        material={glassMaterial}
      >
        <boxGeometry args={[cabinW - 0.04, cabinH - 0.015, 0.012]} />
      </mesh>

      {/* ============================================================== */}
      {/* 5. ELEVATOR OPERATING PANEL (COP) ON RIGHT WALL                */}
      {/* ============================================================== */}
      <group position={[0.77, 1.35, 0.10]}>
        {/* Brushed Metal Panel Backplate */}
        <mesh material={copPanelMaterial}>
          <boxGeometry args={[0.015, 0.74, 0.20]} />
        </mesh>

        {/* Digital Direction Indicator Screen (▲ / ▼) */}
        <mesh position={[-0.009, 0.22, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.13, 0.18]} />
          <meshBasicMaterial map={indicatorTexture} />
        </mesh>

        {/* Circular Floor Push Buttons (3 buttons matching reference image) */}
        {[0.05, -0.07, -0.19].map((buttonY, idx) => (
          <group key={`btn-${idx}`} position={[-0.009, buttonY, 0]} rotation={[0, 0, Math.PI / 2]}>
            {/* Outer Button Chrome Bezel */}
            <mesh>
              <cylinderGeometry args={[0.024, 0.024, 0.01, 20]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.6} roughness={0.15} />
            </mesh>
            {/* Backlit Center Indicator */}
            <mesh position={[0, 0.004, 0]}>
              <cylinderGeometry args={[0.016, 0.016, 0.006, 20]} />
              <meshBasicMaterial color={idx === 1 ? "#38BDF8" : "#F8FAFC"} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ============================================================== */}
      {/* 6. HORIZONTAL CHROME HANDRAIL (At waist height: 0.95m)         */}
      {/* ============================================================== */}
      {/* Back Wall Horizontal Handrail (Runs horizontally behind character, ends before COP) */}
      <mesh
        position={[(cabinCenterX - cabinW / 2 + 0.06 + 0.62) / 2, 0.95, -cabinD / 2 + 0.06]}
        rotation={[0, 0, Math.PI / 2]}
        material={polishedHandrailMaterial}
      >
        <cylinderGeometry args={[0.018, 0.018, 0.62 - (cabinCenterX - cabinW / 2 + 0.06), 16]} />
      </mesh>

      {/* Back Handrail Standoff Wall Brackets */}
      {[-0.55, 0.20].map((xOffset, idx) => (
        <mesh
          key={`back-brk-${idx}`}
          position={[cabinCenterX + xOffset, 0.95, -cabinD / 2 + 0.03]}
          material={silverFrameMaterial}
        >
          <boxGeometry args={[0.02, 0.02, 0.06]} />
        </mesh>
      ))}

      {/* Left Wall Horizontal Handrail */}
      <mesh
        position={[cabinCenterX - cabinW / 2 + 0.06, 0.95, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        material={polishedHandrailMaterial}
      >
        <cylinderGeometry args={[0.018, 0.018, cabinD - 0.14, 16]} />
      </mesh>

      {/* Left Handrail Standoff Wall Brackets */}
      {[-0.26, 0.26].map((zOffset, idx) => (
        <mesh
          key={`left-brk-${idx}`}
          position={[cabinCenterX - cabinW / 2 + 0.03, 0.95, zOffset]}
          material={silverFrameMaterial}
        >
          <boxGeometry args={[0.06, 0.02, 0.02]} />
        </mesh>
      ))}
    </group>
  );
};
