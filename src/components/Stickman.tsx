import React from "react";
import { useCurrentFrame } from "remotion";
import { THEME } from "../theme";

export type StickmanPose =
  | "neutral"
  | "neutral-curious"
  | "strained"
  | "light"
  | "curious";

export interface StickmanProps {
  pose?: StickmanPose;
  squashFactor?: number; // -0.3 (stretch) to +0.3 (squash)
  idleBob?: boolean;
  scale?: number;
  style?: React.CSSProperties;
}

export const Stickman: React.FC<StickmanProps> = ({
  pose = "neutral-curious",
  squashFactor = 0,
  idleBob = true,
  scale = 1,
  style,
}) => {
  const frame = useCurrentFrame();

  // Subtle breathing bob
  const breathing = idleBob ? Math.sin(frame * 0.12) * 2.2 : 0;

  // Normalized pose key
  const effectivePose: "neutral" | "strained" | "light" | "curious" =
    pose === "neutral-curious" || pose === "neutral"
      ? "neutral"
      : pose;

  // Baseline geometric reference:
  // Floor is at y = 380
  let footY = 380;
  let ankleLeft = { x: 88, y: 365 };
  let ankleRight = { x: 136, y: 365 };
  let kneeLeft = { x: 88, y: 295 };
  let kneeRight = { x: 136, y: 295 };
  let hipY = 224 + breathing;

  const shoulderY = 142 + breathing;
  const shoulderLeft = { x: 84, y: shoulderY };
  const shoulderRight = { x: 140, y: shoulderY };

  // Arms:
  // Left arm rests lightly on the cabin handrail at the side!
  let elbowLeft = { x: 60, y: 178 + breathing };
  let handLeft = { x: 42, y: 200 + breathing }; // on handrail

  let elbowRight = { x: 160, y: 182 + breathing };
  let handRight = { x: 162, y: 226 + breathing };

  const headCenter = { x: 112, y: 96 + breathing };
  let headTilt = 0;

  // Pose overrides
  if (effectivePose === "strained") {
    // Heavy / strained: squat, hips sink, knees bend outward
    const squatDepth = 24 + squashFactor * 26;
    hipY += squatDepth;
    headCenter.y += squatDepth * 0.8;

    kneeLeft = { x: 70, y: 305 + squatDepth * 0.4 };
    kneeRight = { x: 154, y: 305 + squatDepth * 0.4 };
    ankleLeft = { x: 80, y: 365 };
    ankleRight = { x: 144, y: 365 };

    // Bracing on handrail / bearing weight downward
    elbowLeft = { x: 46, y: shoulderY + 32 };
    handLeft = { x: 40, y: 200 }; // gripped on rail
    elbowRight = { x: 172, y: shoulderY + 34 };
    handRight = { x: 164, y: shoulderY + 70 };
  } else if (effectivePose === "light") {
    // Light / floaty: stretch up, legs straight, tiptoes / float
    const lift = 20 - squashFactor * 24;
    footY = 380 - lift * 0.45; // slight float above floor
    ankleLeft = { x: 92, y: 365 - lift * 0.45 };
    ankleRight = { x: 132, y: 365 - lift * 0.45 };
    kneeLeft = { x: 92, y: 285 - lift * 0.5 };
    kneeRight = { x: 132, y: 285 - lift * 0.5 };

    hipY -= lift * 0.7;
    headCenter.y -= lift;

    // Floating arms upward
    elbowLeft = { x: 46, y: shoulderY - 8 };
    handLeft = { x: 34, y: shoulderY - 32 };
    elbowRight = { x: 178, y: shoulderY - 8 };
    handRight = { x: 190, y: shoulderY - 32 };
  } else if (effectivePose === "curious") {
    // Curious: head tilts inquisitively, right hand raised to chin
    headTilt = 13;
    headCenter.x += 4;

    // Right hand touches chin
    elbowRight = { x: 154, y: 164 + breathing };
    handRight = { x: 126, y: 118 + breathing };

    // Left hand remains on handrail
    elbowLeft = { x: 62, y: 178 + breathing };
    handLeft = { x: 42, y: 200 + breathing };
  }

  const {
    beanie,
    beanieCuff,
    shirt,
    shirtCel,
    pants,
    shoes,
    shoeSole,
    skin,
    ink,
    rimLight,
  } = THEME.colors.stickmanA2;

  return (
    <div
      style={{
        width: 224 * scale,
        height: 400 * scale,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <svg
        viewBox="0 0 224 400"
        width={224 * scale}
        height={400 * scale}
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Subtle cel shade for shirt */}
          <linearGradient id="shirtCelGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={shirt} />
            <stop offset="60%" stopColor={shirt} />
            <stop offset="100%" stopColor={shirtCel} />
          </linearGradient>

          {/* Warm Sun Rim Gradient */}
          <linearGradient id="rimGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={rimLight} />
            <stop offset="100%" stopColor="rgba(255, 248, 225, 0)" />
          </linearGradient>
        </defs>

        <g id="stickman-rig">
          {/* ============================================================== */}
          {/* 1. LEFT LEG & RIGHT LEG (FULL-LENGTH BLACK PANTS #1A1A1A)       */}
          {/* ============================================================== */}
          <g id="legs">
            {/* Left Leg (Thigh + Shin + Full Trouser) */}
            <g id="leftLeg">
              <g id="leftThigh">
                <path
                  d={`M 92 ${hipY} 
                     L ${kneeLeft.x - 12} ${kneeLeft.y} 
                     L ${kneeLeft.x + 10} ${kneeLeft.y} 
                     L 106 ${hipY} Z`}
                  fill={pants}
                  stroke={pants}
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </g>
              <g id="leftShin">
                <path
                  d={`M ${kneeLeft.x - 12} ${kneeLeft.y} 
                     L ${ankleLeft.x - 10} ${ankleLeft.y + 4} 
                     L ${ankleLeft.x + 10} ${ankleLeft.y + 4} 
                     L ${kneeLeft.x + 10} ${kneeLeft.y} Z`}
                  fill={pants}
                  stroke={pants}
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </g>
              {/* Left Shoe (White sneaker with dark sole) */}
              <g id="leftShoe">
                <path
                  d={`M ${ankleLeft.x - 12} ${footY - 4} 
                     C ${ankleLeft.x - 15} ${footY - 14}, ${ankleLeft.x + 6} ${footY - 15}, ${ankleLeft.x + 16} ${footY - 9}
                     L ${ankleLeft.x + 22} ${footY - 4}
                     C ${ankleLeft.x + 24} ${footY - 1}, ${ankleLeft.x - 10} ${footY - 1}, ${ankleLeft.x - 12} ${footY - 4} Z`}
                  fill={shoes}
                  stroke={ink}
                  strokeWidth="3.2"
                  strokeLinejoin="round"
                />
                {/* Dark Sole */}
                <path
                  d={`M ${ankleLeft.x - 14} ${footY - 2} L ${ankleLeft.x + 23} ${footY - 2}`}
                  stroke={shoeSole}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Sneaker Accent Stripe */}
                <line
                  x1={ankleLeft.x - 2}
                  y1={footY - 10}
                  x2={ankleLeft.x + 10}
                  y2={footY - 6}
                  stroke={beanie}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            </g>

            {/* Right Leg (Thigh + Shin + Full Trouser) */}
            <g id="rightLeg">
              <g id="rightThigh">
                <path
                  d={`M 118 ${hipY} 
                     L ${kneeRight.x - 10} ${kneeRight.y} 
                     L ${kneeRight.x + 12} ${kneeRight.y} 
                     L 132 ${hipY} Z`}
                  fill={pants}
                  stroke={pants}
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </g>
              <g id="rightShin">
                <path
                  d={`M ${kneeRight.x - 10} ${kneeRight.y} 
                     L ${ankleRight.x - 10} ${ankleRight.y + 4} 
                     L ${ankleRight.x + 10} ${ankleRight.y + 4} 
                     L ${kneeRight.x + 12} ${kneeRight.y} Z`}
                  fill={pants}
                  stroke={pants}
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </g>
              {/* Right Shoe */}
              <g id="rightShoe">
                <path
                  d={`M ${ankleRight.x - 12} ${footY - 4} 
                     C ${ankleRight.x - 15} ${footY - 14}, ${ankleRight.x + 6} ${footY - 15}, ${ankleRight.x + 16} ${footY - 9}
                     L ${ankleRight.x + 22} ${footY - 4}
                     C ${ankleRight.x + 24} ${footY - 1}, ${ankleRight.x - 10} ${footY - 1}, ${ankleRight.x - 12} ${footY - 4} Z`}
                  fill={shoes}
                  stroke={ink}
                  strokeWidth="3.2"
                  strokeLinejoin="round"
                />
                {/* Dark Sole */}
                <path
                  d={`M ${ankleRight.x - 14} ${footY - 2} L ${ankleRight.x + 23} ${footY - 2}`}
                  stroke={shoeSole}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Sneaker Accent Stripe */}
                <line
                  x1={ankleRight.x - 2}
                  y1={footY - 10}
                  x2={ankleRight.x + 10}
                  y2={footY - 6}
                  stroke={beanie}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            </g>

            {/* Pelvis connecting block */}
            <path
              d={`M 90 ${hipY - 8} L 134 ${hipY - 8} L 126 ${hipY + 8} L 98 ${hipY + 8} Z`}
              fill={pants}
            />
          </g>

          {/* ============================================================== */}
          {/* 2. TORSO: YELLOW T-SHIRT (#FBC02D) WITH CEL SHADE               */}
          {/* ============================================================== */}
          <g id="torso">
            {/* T-Shirt Body */}
            <path
              d={`M ${shoulderLeft.x + 4} ${shoulderLeft.y + 6}
                 C ${shoulderLeft.x} ${shoulderLeft.y + 26}, 88 ${hipY - 14}, 90 ${hipY}
                 L 134 ${hipY}
                 C 136 ${hipY - 14}, ${shoulderRight.x + 4} ${shoulderLeft.y + 26}, ${shoulderRight.x - 4} ${shoulderRight.y + 6}
                 L 124 ${shoulderY}
                 C 112 ${shoulderY + 6}, 112 ${shoulderY + 6}, 100 ${shoulderY} Z`}
              fill="url(#shirtCelGrad)"
              stroke={ink}
              strokeWidth="5"
              strokeLinejoin="round"
            />

            {/* Sun Rim Light on Left Shoulder */}
            <path
              d={`M 96 ${shoulderY + 2} L ${shoulderLeft.x + 4} ${shoulderLeft.y + 6} L 88 ${shoulderLeft.y + 36}`}
              stroke={rimLight}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />

            {/* Left T-shirt Sleeve */}
            <path
              d={`M ${shoulderLeft.x + 4} ${shoulderLeft.y + 6}
                 L ${elbowLeft.x + 6} ${elbowLeft.y - 12}
                 L ${elbowLeft.x - 1} ${elbowLeft.y}
                 L ${shoulderLeft.x - 2} ${shoulderLeft.y + 26} Z`}
              fill={shirt}
              stroke={ink}
              strokeWidth="4.5"
              strokeLinejoin="round"
            />

            {/* Right T-shirt Sleeve */}
            <path
              d={`M ${shoulderRight.x - 4} ${shoulderRight.y + 6}
                 L ${elbowRight.x - 6} ${elbowRight.y - 12}
                 L ${elbowRight.x + 1} ${elbowRight.y}
                 L ${shoulderRight.x + 2} ${shoulderRight.y + 26} Z`}
              fill={shirt}
              stroke={ink}
              strokeWidth="4.5"
              strokeLinejoin="round"
            />

            {/* T-shirt Collar Notch */}
            <path
              d={`M 104 ${shoulderY + 2} L 112 ${shoulderY + 12} L 120 ${shoulderY + 2}`}
              stroke={ink}
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* ============================================================== */}
          {/* 3. ARMS: SMOOTH CONFIDENT LIMBS (Round caps, 7px stroke)        */}
          {/* ============================================================== */}
          {/* Left Arm (On Handrail) */}
          <g id="leftArm">
            <g id="leftUpperArm">
              <line
                x1={elbowLeft.x}
                y1={elbowLeft.y - 6}
                x2={elbowLeft.x - 4}
                y2={elbowLeft.y + 6}
                stroke={ink}
                strokeWidth="7"
                strokeLinecap="round"
              />
            </g>
            <g id="leftForearm">
              <path
                d={`M ${elbowLeft.x - 2} ${elbowLeft.y - 4}
                   Q ${elbowLeft.x - 8} ${elbowLeft.y + 14}, ${handLeft.x} ${handLeft.y}`}
                fill="none"
                stroke={ink}
                strokeWidth="7"
                strokeLinecap="round"
              />
              <circle cx={handLeft.x} cy={handLeft.y} r="7.5" fill={ink} />
            </g>
          </g>

          {/* Right Arm */}
          <g id="rightArm">
            <g id="rightUpperArm">
              <line
                x1={elbowRight.x}
                y1={elbowRight.y - 6}
                x2={elbowRight.x + 4}
                y2={elbowRight.y + 6}
                stroke={ink}
                strokeWidth="7"
                strokeLinecap="round"
              />
            </g>
            <g id="rightForearm">
              <path
                d={`M ${elbowRight.x + 2} ${elbowRight.y - 4}
                   Q ${elbowRight.x + 8} ${elbowRight.y + 14}, ${handRight.x} ${handRight.y}`}
                fill="none"
                stroke={ink}
                strokeWidth="7"
                strokeLinecap="round"
              />
              <circle cx={handRight.x} cy={handRight.y} r="7.5" fill={ink} />
            </g>
          </g>

          {/* ============================================================== */}
          {/* 4. HEAD & A2 RED BEANIE (#E53935 WITH CUFF #C62828)            */}
          {/* ============================================================== */}
          <g
            id="head"
            transform={`rotate(${headTilt}, ${headCenter.x}, ${headCenter.y + 36})`}
          >
            {/* Neck */}
            <line
              x1={headCenter.x}
              y1={headCenter.y + 28}
              x2={headCenter.x}
              y2={shoulderY + 4}
              stroke={ink}
              strokeWidth="7"
              strokeLinecap="round"
            />

            {/* Round White Head (Per A2 spec) */}
            <circle
              cx={headCenter.x}
              cy={headCenter.y}
              r="31"
              fill={skin}
              stroke={ink}
              strokeWidth="5"
            />

            {/* Sun Rim Light on Head (Upper Left) */}
            <path
              d={`M ${headCenter.x - 22} ${headCenter.y + 16} 
                 A 31 31 0 0 1 ${headCenter.x} ${headCenter.y - 30}`}
              fill="none"
              stroke={rimLight}
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* 5. A2 EXPRESSIONS (Minimalist dot eyes, expressive brows & mouth) */}
            {effectivePose === "neutral" && (
              <g id="face-neutral">
                {/* Eyebrows */}
                <path
                  d={`M ${headCenter.x - 16} ${headCenter.y - 7} Q ${headCenter.x - 10} ${headCenter.y - 11}, ${headCenter.x - 4} ${headCenter.y - 7}`}
                  stroke={ink}
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d={`M ${headCenter.x + 4} ${headCenter.y - 7} Q ${headCenter.x + 10} ${headCenter.y - 11}, ${headCenter.x + 16} ${headCenter.y - 7}`}
                  stroke={ink}
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Clean dot eyes */}
                <circle cx={headCenter.x - 10} cy={headCenter.y + 2} r="4.2" fill={ink} />
                <circle cx={headCenter.x + 10} cy={headCenter.y + 2} r="4.2" fill={ink} />
                {/* Pleasant smile */}
                <path
                  d={`M ${headCenter.x - 9} ${headCenter.y + 16} Q ${headCenter.x} ${headCenter.y + 22}, ${headCenter.x + 9} ${headCenter.y + 16}`}
                  stroke={ink}
                  strokeWidth="3.2"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
            )}

            {effectivePose === "strained" && (
              <g id="face-strained">
                {/* Tight downward angled eyebrows */}
                <line
                  x1={headCenter.x - 16}
                  y1={headCenter.y - 6}
                  x2={headCenter.x - 4}
                  y2={headCenter.y - 10}
                  stroke={ink}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <line
                  x1={headCenter.x + 16}
                  y1={headCenter.y - 6}
                  x2={headCenter.x + 4}
                  y2={headCenter.y - 10}
                  stroke={ink}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Strained effort eyes (> < slits) */}
                <path
                  d={`M ${headCenter.x - 15} ${headCenter.y + 1} L ${headCenter.x - 6} ${headCenter.y + 5} L ${headCenter.x - 15} ${headCenter.y + 9}`}
                  stroke={ink}
                  strokeWidth="3.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={`M ${headCenter.x + 15} ${headCenter.y + 1} L ${headCenter.x + 6} ${headCenter.y + 5} L ${headCenter.x + 15} ${headCenter.y + 9}`}
                  stroke={ink}
                  strokeWidth="3.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Strained grimace mouth */}
                <path
                  d={`M ${headCenter.x - 10} ${headCenter.y + 18} Q ${headCenter.x - 5} ${headCenter.y + 15}, ${headCenter.x} ${headCenter.y + 18} Q ${headCenter.x + 5} ${headCenter.y + 21}, ${headCenter.x + 10} ${headCenter.y + 18}`}
                  stroke={ink}
                  strokeWidth="3.5"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Cel sweat drop on brow */}
                <path
                  d={`M ${headCenter.x + 20} ${headCenter.y - 8} 
                     C ${headCenter.x + 23} ${headCenter.y - 4}, ${headCenter.x + 26} ${headCenter.y - 2}, ${headCenter.x + 22} ${headCenter.y + 2}
                     C ${headCenter.x + 18} ${headCenter.y + 2}, ${headCenter.x + 17} ${headCenter.y - 2}, ${headCenter.x + 20} ${headCenter.y - 8} Z`}
                  fill="#38BDF8"
                  stroke={ink}
                  strokeWidth="1.5"
                />
              </g>
            )}

            {effectivePose === "light" && (
              <g id="face-light">
                {/* High relaxed eyebrows */}
                <path
                  d={`M ${headCenter.x - 17} ${headCenter.y - 10} Q ${headCenter.x - 9} ${headCenter.y - 15}, ${headCenter.x - 2} ${headCenter.y - 10}`}
                  stroke={ink}
                  strokeWidth="3.2"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d={`M ${headCenter.x + 2} ${headCenter.y - 10} Q ${headCenter.x + 9} ${headCenter.y - 15}, ${headCenter.x + 17} ${headCenter.y - 10}`}
                  stroke={ink}
                  strokeWidth="3.2"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Wide wonder eyes (so floaty!) */}
                <circle cx={headCenter.x - 10} cy={headCenter.y + 2} r="5.5" fill="#FFFFFF" stroke={ink} strokeWidth="2.8" />
                <circle cx={headCenter.x - 10} cy={headCenter.y + 2} r="2.8" fill={ink} />

                <circle cx={headCenter.x + 10} cy={headCenter.y + 2} r="5.5" fill="#FFFFFF" stroke={ink} strokeWidth="2.8" />
                <circle cx={headCenter.x + 10} cy={headCenter.y + 2} r="2.8" fill={ink} />

                {/* Relaxed open happy mouth */}
                <path
                  d={`M ${headCenter.x - 8} ${headCenter.y + 15} Q ${headCenter.x} ${headCenter.y + 23}, ${headCenter.x + 8} ${headCenter.y + 15} Z`}
                  fill={ink}
                />
              </g>
            )}

            {effectivePose === "curious" && (
              <g id="face-curious">
                {/* One raised eyebrow, one lowered */}
                <line
                  x1={headCenter.x - 16}
                  y1={headCenter.y - 6}
                  x2={headCenter.x - 4}
                  y2={headCenter.y - 8}
                  stroke={ink}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d={`M ${headCenter.x + 4} ${headCenter.y - 14} Q ${headCenter.x + 11} ${headCenter.y - 18}, ${headCenter.x + 17} ${headCenter.y - 12}`}
                  stroke={ink}
                  strokeWidth="3.5"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Inquisitive eyes */}
                <circle cx={headCenter.x - 10} cy={headCenter.y + 2} r="4" fill={ink} />
                <circle cx={headCenter.x + 10} cy={headCenter.y} r="4.6" fill={ink} />

                {/* Thoughtful pursed mouth */}
                <path
                  d={`M ${headCenter.x - 5} ${headCenter.y + 16} Q ${headCenter.x + 2} ${headCenter.y + 14}, ${headCenter.x + 9} ${headCenter.y + 18}`}
                  stroke={ink}
                  strokeWidth="3.2"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* 6. A2 RED BEANIE (#E53935) WITH VISIBLE FOLDED CUFF (#C62828) */}
            {/* Smooth rounded knit, NO pom-pom per A2 specification */}
            <g id="beanie">
              {/* Beanie Crown Dome */}
              <path
                d={`M ${headCenter.x - 29} ${headCenter.y - 16}
                   C ${headCenter.x - 30} ${headCenter.y - 44}, ${headCenter.x + 30} ${headCenter.y - 44}, ${headCenter.x + 29} ${headCenter.y - 16}
                   Z`}
                fill={beanie}
                stroke={ink}
                strokeWidth="4.5"
                strokeLinejoin="round"
              />

              {/* Sun Rim Light on Beanie Dome */}
              <path
                d={`M ${headCenter.x - 26} ${headCenter.y - 20} 
                   C ${headCenter.x - 26} ${headCenter.y - 38}, ${headCenter.x - 4} ${headCenter.y - 42}, ${headCenter.x + 2} ${headCenter.y - 42}`}
                stroke={rimLight}
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />

              {/* Folded Cuff Band (Slightly darker red #C62828) */}
              <rect
                x={headCenter.x - 31}
                y={headCenter.y - 22}
                width="62"
                height="15"
                rx="5"
                fill={beanieCuff}
                stroke={ink}
                strokeWidth="4"
              />

              {/* Subtle knit ribbing lines on cuff */}
              <line
                x1={headCenter.x - 16}
                y1={headCenter.y - 20}
                x2={headCenter.x - 16}
                y2={headCenter.y - 9}
                stroke="rgba(0,0,0,0.25)"
                strokeWidth="2"
              />
              <line
                x1={headCenter.x}
                y1={headCenter.y - 20}
                x2={headCenter.x}
                y2={headCenter.y - 9}
                stroke="rgba(0,0,0,0.25)"
                strokeWidth="2"
              />
              <line
                x1={headCenter.x + 16}
                y1={headCenter.y - 20}
                x2={headCenter.x + 16}
                y2={headCenter.y - 9}
                stroke="rgba(0,0,0,0.25)"
                strokeWidth="2"
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};
