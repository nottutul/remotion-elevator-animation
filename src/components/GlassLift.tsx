import React from "react";
import { THEME } from "../theme";

export interface GlassLiftProps {
  cabinBounceY?: number;
  direction?: "up" | "down" | "idle";
  currentFloor?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const GlassLift: React.FC<GlassLiftProps> = ({
  cabinBounceY = 0,
  direction = "idle",
  currentFloor = "32F",
  children,
  style,
}) => {
  const ink = THEME.colors.ink;
  const cabinWidth = 460;
  const cabinHeight = 580;

  return (
    <div
      style={{
        position: "relative",
        width: cabinWidth,
        height: cabinHeight,
        transform: `translate3d(0, ${cabinBounceY}px, 0)`,
        ...style,
      }}
    >
      <svg
        viewBox={`0 0 ${cabinWidth} ${cabinHeight}`}
        width={cabinWidth}
        height={cabinHeight}
        style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}
      >
        <defs>
          {/* Glass reflection gradient */}
          <linearGradient id="liftGlassStreak" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.45)" />
            <stop offset="20%" stopColor="rgba(255, 255, 255, 0.08)" />
            <stop offset="45%" stopColor="rgba(255, 255, 255, 0.28)" />
            <stop offset="70%" stopColor="rgba(255, 255, 255, 0.04)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.20)" />
          </linearGradient>

          {/* Roof carriage metallic gradient */}
          <linearGradient id="metalRoof" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3E5062" />
            <stop offset="50%" stopColor="#253545" />
            <stop offset="100%" stopColor="#1A2530" />
          </linearGradient>

          {/* Warm Sun Rim Highlight (from upper-left) */}
          <linearGradient id="sunRim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255, 248, 220, 0.95)" />
            <stop offset="40%" stopColor="rgba(255, 248, 220, 0.3)" />
            <stop offset="100%" stopColor="rgba(255, 248, 220, 0)" />
          </linearGradient>
        </defs>

        {/* 1. SUSPENSION HOIST ROPES & ROOF MOUNT (Continuous all the way to top of frame) */}
        {/* Steel cables running from y = -1600 down to roof carriage at y = 12 */}
        {[-8, 0, 8].map((offset, idx) => (
          <g key={`cable-${idx}`}>
            <line
              x1={cabinWidth / 2 + offset}
              y1="-1600"
              x2={cabinWidth / 2 + offset}
              y2="12"
              stroke="#1C2833"
              strokeWidth="3.5"
            />
            {/* Specular steel strand highlight */}
            <line
              x1={cabinWidth / 2 + offset - 0.8}
              y1="-1600"
              x2={cabinWidth / 2 + offset - 0.8}
              y2="12"
              stroke="rgba(255, 255, 255, 0.45)"
              strokeWidth="1"
            />
          </g>
        ))}

        {/* Cable Hitch Termination Plate & Anchor Clevis on Roof */}
        <rect
          x={cabinWidth / 2 - 28}
          y="10"
          width="56"
          height="12"
          rx="3"
          fill="#2C3E50"
          stroke={ink}
          strokeWidth="2.5"
        />
        <polygon
          points={`${cabinWidth / 2 - 20},10 ${cabinWidth / 2},0 ${cabinWidth / 2 + 20},10`}
          fill="#1C2833"
          stroke={ink}
          strokeWidth="2.5"
        />
        <circle cx={cabinWidth / 2} cy="6" r="3.5" fill="#94A3B8" stroke={ink} strokeWidth="1.5" />

        {/* Exterior Guide Shoe Rollers (Gripping Building Rails) */}
        {/* Left Rollers */}
        <rect x="-14" y="36" width="16" height="28" rx="4" fill="#2C3E50" stroke={ink} strokeWidth="2.5" />
        <rect x="-14" y={cabinHeight - 64} width="16" height="28" rx="4" fill="#2C3E50" stroke={ink} strokeWidth="2.5" />
        {/* Right Rollers */}
        <rect x={cabinWidth - 2} y="36" width="16" height="28" rx="4" fill="#2C3E50" stroke={ink} strokeWidth="2.5" />
        <rect x={cabinWidth - 2} y={cabinHeight - 64} width="16" height="28" rx="4" fill="#2C3E50" stroke={ink} strokeWidth="2.5" />

        {/* 2. SEE-THROUGH PANORAMIC GLASS PANELS */}
        {/* Main Glass Backing (Transparent so the city behind is visible!) */}
        <rect
          x="10"
          y="20"
          width={cabinWidth - 20}
          height={cabinHeight - 48}
          rx="22"
          fill="rgba(240, 248, 255, 0.22)"
          stroke="none"
        />

        {/* Subtle Glass Reflection Streaks across the cabin */}
        <path
          d={`M 25 22 L 180 22 L 60 ${cabinHeight - 32} L 15 ${cabinHeight - 32} Z`}
          fill="url(#liftGlassStreak)"
          opacity="0.65"
          pointerEvents="none"
        />
        <path
          d={`M 240 22 L 310 22 L 190 ${cabinHeight - 32} L 130 ${cabinHeight - 32} Z`}
          fill="url(#liftGlassStreak)"
          opacity="0.4"
          pointerEvents="none"
        />

        {/* 3. CABIN INTERIOR DETAILS */}
        {/* Ceiling Light Fixture (Soft warm strip light) */}
        <rect
          x={cabinWidth / 2 - 130}
          y="24"
          width="260"
          height="12"
          rx="6"
          fill="#FFFDF0"
          stroke="rgba(44, 62, 80, 0.4)"
          strokeWidth="1.5"
        />
        {/* Downward light glow cone */}
        <polygon
          points={`${cabinWidth / 2 - 120},36 ${cabinWidth / 2 + 120},36 ${cabinWidth - 30},${cabinHeight - 32} 30,${cabinHeight - 32}`}
          fill="rgba(255, 250, 220, 0.08)"
          pointerEvents="none"
        />

        {/* Horizontal Safety Handrail (Behind Stickman, at waist height) */}
        <line
          x1="22"
          y1={cabinHeight - 210}
          x2={cabinWidth - 22}
          y2={cabinHeight - 210}
          stroke="#475569"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <line
          x1="24"
          y1={cabinHeight - 212}
          x2={cabinWidth - 24}
          y2={cabinHeight - 212}
          stroke="#CBD5E1"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Handrail mounting brackets */}
        <rect x="50" y={cabinHeight - 214} width="10" height="14" rx="2" fill="#1E293B" />
        <rect x={cabinWidth - 60} y={cabinHeight - 214} width="10" height="14" rx="2" fill="#1E293B" />

        {/* 4. SOLID STRUCTURAL CABIN FRAME (Clean lines & warm rim light) */}
        {/* Outer Frame Path */}
        <rect
          x="10"
          y="20"
          width={cabinWidth - 20}
          height={cabinHeight - 48}
          rx="24"
          fill="none"
          stroke={ink}
          strokeWidth="5"
          strokeLinejoin="round"
        />

        {/* Warm Sun Rim Light (on top and left edges from upper-left sun) */}
        <path
          d={`M 12 ${cabinHeight - 80} L 12 40 Q 12 22 36 22 L ${cabinWidth - 40} 22`}
          fill="none"
          stroke="url(#sunRim)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Upper Header Beam */}
        <rect
          x="8"
          y="14"
          width={cabinWidth - 16}
          height="14"
          rx="5"
          fill="url(#metalRoof)"
          stroke={ink}
          strokeWidth="3.5"
        />

        {/* Heavy Floor Platform Base */}
        <rect
          x="6"
          y={cabinHeight - 34}
          width={cabinWidth - 12}
          height="30"
          rx="8"
          fill="url(#metalRoof)"
          stroke={ink}
          strokeWidth="4"
        />
        {/* Stainless Steel Floor Rim Accent */}
        <line
          x1="12"
          y1={cabinHeight - 31}
          x2={cabinWidth - 12}
          y2={cabinHeight - 31}
          stroke="#94A3B8"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Small Digital Display on Lift Header */}
        <rect
          x={cabinWidth / 2 - 46}
          y="42"
          width="92"
          height="28"
          rx="6"
          fill="#0F172A"
          stroke="#334155"
          strokeWidth="1.5"
        />
      </svg>

      {/* Digital Floor Indicator Text */}
      <div
        style={{
          position: "absolute",
          top: 42,
          left: cabinWidth / 2 - 46,
          width: 92,
          height: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          color:
            direction === "up"
              ? "#4ADE80"
              : direction === "down"
              ? "#60A5FA"
              : "#FACC15",
          fontFamily: "monospace",
          fontWeight: 800,
          fontSize: 15,
          letterSpacing: 1,
        }}
      >
        <span>{currentFloor}</span>
        <span style={{ fontSize: 13 }}>
          {direction === "up" ? "▲" : direction === "down" ? "▼" : "●"}
        </span>
      </div>

      {/* 5. INTERIOR CHARACTER (The Stickman stands firmly on the floor platform) */}
      <div
        style={{
          position: "absolute",
          bottom: 34, // Resting directly on top of the sturdy floor platform
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          zIndex: 10,
        }}
      >
        {children}
      </div>
    </div>
  );
};
