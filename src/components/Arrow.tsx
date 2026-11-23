import React from "react";
import { THEME } from "../theme";

export interface ArrowProps {
  direction?: "up" | "down" | "left" | "right";
  length?: number;
  color?: string;
  label?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

export const Arrow: React.FC<ArrowProps> = ({
  direction = "up",
  length = 120,
  color = THEME.colors.normalForce,
  label,
  strokeWidth = 7,
  style,
}) => {
  const isVertical = direction === "up" || direction === "down";
  const width = isVertical ? 60 : length;
  const height = isVertical ? length : 60;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <marker
            id={`arrow-head-${direction}`}
            markerWidth="10"
            markerHeight="10"
            refX="6"
            refY="5"
            orient="auto"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill={color} />
          </marker>
        </defs>
        {direction === "up" && (
          <line
            x1={width / 2}
            y1={height - 6}
            x2={width / 2}
            y2={12}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            markerEnd={`url(#arrow-head-${direction})`}
          />
        )}
        {direction === "down" && (
          <line
            x1={width / 2}
            y1={6}
            x2={width / 2}
            y2={height - 12}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            markerEnd={`url(#arrow-head-${direction})`}
          />
        )}
      </svg>
      {label && (
        <span
          style={{
            position: "absolute",
            fontFamily: THEME.typography.fontFamily,
            fontWeight: 800,
            fontSize: 24,
            color,
            right: -40,
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
};
