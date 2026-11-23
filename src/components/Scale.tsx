import React from "react";
import { THEME } from "../theme";

export interface ScaleProps {
  reading?: number | string;
  width?: number;
  height?: number;
  needleAngle?: number;
  style?: React.CSSProperties;
}

export const Scale: React.FC<ScaleProps> = ({
  reading = 60,
  width = 160,
  height = 50,
  needleAngle = 0,
  style,
}) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 16,
        background: "rgba(255, 255, 255, 0.85)",
        border: `2px solid ${THEME.colors.ink}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 14px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
        fontFamily: THEME.typography.fontFamily,
        fontWeight: 700,
        fontSize: 20,
        color: THEME.colors.ink,
        boxSizing: "border-box",
        ...style,
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          border: `1.5px solid ${THEME.colors.ink}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            width: 1.5,
            height: 9,
            background: THEME.colors.gravity,
            transformOrigin: "bottom center",
            transform: `rotate(${needleAngle}deg)`,
          }}
        />
      </div>
      <span>{reading} kg</span>
    </div>
  );
};
