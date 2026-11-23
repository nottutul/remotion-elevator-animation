import React from "react";
import { GlassCard } from "./GlassCard";

export interface EquationCardProps {
  equation: string; // e.g. "W = mg", "W′ = N", "N − mg = ma", "N = m(g + a)"
  subtitle?: string; // Optional Bangla subtitle, e.g. "প্রকৃত ওজন", "নিউটনের দ্বিতীয় সূত্র"
  highlightTerm?: string; // e.g. "(g + a)", "N", "mg"
  enterAt?: number;
  exitAt?: number;
  tint?: "neutral" | "green" | "purple" | "blue" | "red";
  style?: React.CSSProperties;
}

/**
 * High-legibility Glass Physics Equation Card.
 * Placed in EQUATION_SLOT (240px, 240px, 600px, 160px).
 */
export const EquationCard: React.FC<EquationCardProps> = ({
  equation,
  subtitle,
  highlightTerm,
  enterAt = 0,
  exitAt,
  tint = "neutral",
  style,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        left: 240,
        top: 240,
        width: 600,
        height: 160,
        zIndex: 55,
        ...style,
      }}
    >
      <GlassCard
        width={600}
        height={160}
        radius={32}
        tint={tint}
        enterAt={enterAt}
        exitAt={exitAt}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px 32px",
          textAlign: "center",
        }}
      >
        {subtitle && (
          <div
            style={{
              fontFamily: "ShohidShafkatSamir, sans-serif",
              fontSize: 24,
              fontWeight: 700,
              color: "#475569",
              marginBottom: 6,
              letterSpacing: 0.3,
            }}
          >
            {subtitle}
          </div>
        )}

        <div
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: 44,
            fontWeight: 800,
            color: "#0F172A",
            letterSpacing: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          {highlightTerm && equation.includes(highlightTerm) ? (
            <>
              <span>{equation.split(highlightTerm)[0]}</span>
              <span
                style={{
                  backgroundColor: "rgba(123, 31, 162, 0.15)",
                  color: "#7B1FA2",
                  padding: "2px 14px",
                  borderRadius: 14,
                  border: "1.5px solid rgba(123, 31, 162, 0.4)",
                  boxShadow: "0 2px 10px rgba(123, 31, 162, 0.12)",
                }}
              >
                {highlightTerm}
              </span>
              <span>{equation.split(highlightTerm)[1]}</span>
            </>
          ) : (
            <span>{equation}</span>
          )}
        </div>
      </GlassCard>
    </div>
  );
};
