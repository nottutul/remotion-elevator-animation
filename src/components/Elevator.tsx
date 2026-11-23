import React from "react";
import { THEME } from "../theme";

export interface ElevatorProps {
  shaftOffsetY: number;
  cabinBounceY?: number;
  direction?: "up" | "down" | "idle";
  currentFloor?: string;
  children?: React.ReactNode;
}

export const Elevator: React.FC<ElevatorProps> = ({
  shaftOffsetY,
  cabinBounceY = 0,
  direction = "idle",
  currentFloor = "3F",
  children,
}) => {
  const ink = THEME.colors.ink;

  // The elevator cabin dimensions
  const cabinWidth = 520;
  const cabinHeight = 660;

  // Parallax shaft pattern calculation
  // Each floor segment in the shaft is 300px high
  const floorSpacing = 320;
  const rawOffset = shaftOffsetY % floorSpacing;
  const shaftOffset = rawOffset < 0 ? rawOffset + floorSpacing : rawOffset;

  return (
    <div
      style={{
        position: "relative",
        width: 720,
        height: 900,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* 1. SHAFT BACKGROUND (Moving in opposite direction with parallax) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 40,
          right: 40,
          overflow: "hidden",
          borderRadius: 24,
          background: "rgba(235, 230, 222, 0.45)",
          borderLeft: `3px dashed rgba(26, 26, 26, 0.18)`,
          borderRight: `3px dashed rgba(26, 26, 26, 0.18)`,
        }}
      >
        {/* Guide cables running along the shaft */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 70,
            width: 4,
            background: "rgba(26, 26, 26, 0.15)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 70,
            width: 4,
            background: "rgba(26, 26, 26, 0.15)",
          }}
        />

        {/* Counterweight cable in center */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "50%",
            width: 3,
            background: "rgba(26, 26, 26, 0.10)",
            transform: "translateX(-50%)",
          }}
        />

        {/* Moving floor markers & steel girder beams */}
        {[-1, 0, 1, 2, 3].map((idx) => {
          const itemY = idx * floorSpacing + shaftOffset;
          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: itemY,
                height: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 20px",
                boxSizing: "border-box",
              }}
            >
              {/* Floor divider beam */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  height: 3,
                  background: "rgba(26, 26, 26, 0.16)",
                }}
              />
              {/* Floor bracket rivets */}
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "rgba(26, 26, 26, 0.25)",
                }}
              />
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "rgba(26, 26, 26, 0.28)",
                  letterSpacing: 2,
                  userSelect: "none",
                }}
              >
                ── LEVEL ──
              </span>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "rgba(26, 26, 26, 0.25)",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* 2. ELEVATOR SUSPENSION CABLE (Runs straight up through shaft) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 450 + cabinHeight / 2 - cabinBounceY,
          width: 8,
          background: ink,
          borderRadius: 4,
          zIndex: 4,
        }}
      />

      {/* 3. ELEVATOR CABIN CUTAWAY (With inertia bounce) */}
      <div
        style={{
          position: "relative",
          width: cabinWidth,
          height: cabinHeight,
          transform: `translate3d(0, ${cabinBounceY}px, 0)`,
          zIndex: 5,
        }}
      >
        <svg
          viewBox={`0 0 ${cabinWidth} ${cabinHeight}`}
          width={cabinWidth}
          height={cabinHeight}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          {/* Top Cable Mount Bracket */}
          <path
            d={`M ${cabinWidth / 2 - 28} 36 
               L ${cabinWidth / 2} 12 
               L ${cabinWidth / 2 + 28} 36 Z`}
            fill={ink}
            stroke={ink}
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Cabin Interior Wall Fill */}
          <rect
            x="24"
            y="36"
            width={cabinWidth - 48}
            height={cabinHeight - 72}
            rx="16"
            fill="rgba(255, 253, 248, 0.88)"
          />

          {/* Cabin Ceiling Light Fixture */}
          <rect
            x={cabinWidth / 2 - 110}
            y="42"
            width="220"
            height="14"
            rx="7"
            fill="#FFFDE7"
            stroke={ink}
            strokeWidth="3.5"
          />
          {/* Subtle downward glow cone from light */}
          <polygon
            points={`${cabinWidth / 2 - 100},56 ${cabinWidth / 2 + 100},56 ${cabinWidth - 50},${cabinHeight - 50} 50,${cabinHeight - 50}`}
            fill="rgba(255, 249, 196, 0.12)"
          />

          {/* Horizontal Handrail along back wall */}
          <line
            x1="40"
            y1={cabinHeight - 210}
            x2={cabinWidth - 40}
            y2={cabinHeight - 210}
            stroke={ink}
            strokeWidth="7"
            strokeLinecap="round"
          />
          {/* Handrail mounting brackets */}
          <rect
            x="80"
            y={cabinHeight - 213}
            width="12"
            height="18"
            fill={ink}
            rx="3"
          />
          <rect
            x={cabinWidth - 92}
            y={cabinHeight - 213}
            width="12"
            height="18"
            fill={ink}
            rx="3"
          />

          {/* Cabin Outer Frame Beams (Line weight 7px, rounded caps) */}
          <rect
            x="20"
            y="36"
            width={cabinWidth - 40}
            height={cabinHeight - 72}
            rx="18"
            fill="none"
            stroke={ink}
            strokeWidth="7"
            strokeLinejoin="round"
          />

          {/* Heavy Floor Platform Base */}
          <rect
            x="12"
            y={cabinHeight - 48}
            width={cabinWidth - 24}
            height="24"
            rx="6"
            fill={ink}
          />
          <line
            x1="16"
            y1={cabinHeight - 36}
            x2={cabinWidth - 16}
            y2={cabinHeight - 36}
            stroke="#555555"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Roof Heavy Beam */}
          <rect
            x="16"
            y="26"
            width={cabinWidth - 32}
            height="16"
            rx="5"
            fill={ink}
          />

          {/* Digital Display Panel (Floor Indicator) */}
          <rect
            x={cabinWidth / 2 - 50}
            y="70"
            width="100"
            height="36"
            rx="8"
            fill="#1A1A1A"
            stroke="#424242"
            strokeWidth="2"
          />
        </svg>

        {/* Digital Floor / Direction Indicator Text */}
        <div
          style={{
            position: "absolute",
            top: 70,
            left: cabinWidth / 2 - 50,
            width: 100,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            color:
              direction === "up"
                ? "#4CAF50"
                : direction === "down"
                ? "#2196F3"
                : "#FFCA28",
            fontFamily: "monospace",
            fontWeight: 800,
            fontSize: 18,
            letterSpacing: 1,
          }}
        >
          <span>{currentFloor}</span>
          <span style={{ fontSize: 16 }}>
            {direction === "up" ? "▲" : direction === "down" ? "▼" : "●"}
          </span>
        </div>

        {/* 4. CABIN INTERIOR CONTENT (The Stickman stands on the floor beam) */}
        <div
          style={{
            position: "absolute",
            bottom: 48, // Resting directly on top of the floor platform
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            pointerEvents: "none",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
