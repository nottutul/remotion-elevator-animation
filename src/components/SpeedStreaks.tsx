import React from "react";
import { useCurrentFrame } from "remotion";

export interface SpeedStreaksProps {
  velocity: number; // in m/s. Positive = lift moving UP (streaks move down), Negative = lift moving DOWN (streaks move up)
  visible?: boolean;
}

// 16 deterministic streak line positions (static module constant)
const STREAKS = [
  { x: 120, speedMult: 1.2, length: 180, phase: 12 },
  { x: 210, speedMult: 0.9, length: 140, phase: 45 },
  { x: 290, speedMult: 1.4, length: 220, phase: 89 },
  { x: 380, speedMult: 1.1, length: 160, phase: 23 },
  { x: 470, speedMult: 0.8, length: 120, phase: 67 },
  { x: 560, speedMult: 1.3, length: 200, phase: 110 },
  { x: 650, speedMult: 1.0, length: 150, phase: 34 },
  { x: 730, speedMult: 1.5, length: 230, phase: 78 },
  { x: 820, speedMult: 0.85, length: 130, phase: 95 },
  { x: 910, speedMult: 1.25, length: 190, phase: 15 },
  { x: 980, speedMult: 1.1, length: 170, phase: 53 },
  { x: 160, speedMult: 1.35, length: 210, phase: 130 },
  { x: 340, speedMult: 0.95, length: 140, phase: 145 },
  { x: 520, speedMult: 1.15, length: 175, phase: 160 },
  { x: 780, speedMult: 1.4, length: 215, phase: 175 },
  { x: 860, speedMult: 1.05, length: 160, phase: 190 },
];

/**
 * Faint 2D speed streak lines to reinforce lift vertical motion and acceleration.
 * High velocity = longer streaks & higher opacity; zero velocity = completely invisible.
 */
export const SpeedStreaks: React.FC<SpeedStreaksProps> = ({
  velocity,
  visible = true,
}) => {
  const frame = useCurrentFrame();

  const speed = Math.abs(velocity);
  if (!visible || speed < 0.2) {
    return null;
  }

  // Opacity scales smoothly with speed, maxes out at ~0.35
  const opacity = Math.min(0.35, (speed / 6.0) * 0.35);

  // Direction: if velocity > 0 (lift goes UP), streaks stream DOWNWARDS (+Y)
  // If velocity < 0 (lift falls DOWN), streaks stream UPWARDS (-Y)
  const dir = velocity > 0 ? 1 : -1;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 1080,
        height: 1920,
        pointerEvents: "none",
        zIndex: 40,
        overflow: "hidden",
      }}
    >
      {STREAKS.map((s, i) => {
        const travelSpeed = speed * s.speedMult * 35;
        const rawY = (frame * travelSpeed * dir + s.phase * 50) % 2200;
        const y = rawY < 0 ? rawY + 2200 : rawY - 200;

        return (
          <div
            key={`streak-${i}`}
            style={{
              position: "absolute",
              left: s.x,
              top: y,
              width: 2.5,
              height: s.length * (speed / 3.0),
              background:
                dir > 0
                  ? "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.85), rgba(255,255,255,0))"
                  : "linear-gradient(to top, rgba(255,255,255,0), rgba(255,255,255,0.85), rgba(255,255,255,0))",
              opacity,
              borderRadius: 2,
            }}
          />
        );
      })}
    </div>
  );
};
