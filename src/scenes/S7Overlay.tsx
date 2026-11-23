import React from "react";
import { useCurrentFrame } from "remotion";
import { HelpCircle, MessageSquare } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { IconBadge } from "../components/IconBadge";
import { GaugeCard } from "../components/GaugeCard";

/**
 * Scene 7 Overlay (72.95s - 81.34s, frames 2188 - 2441)
 * Cues 25 to 27: "এবার ভাবুন তো... যদি লিফট g ত্বরণে পড়তে থাকে... কতটুকু ওজন অনুভব করব?"
 *
 * CRITICAL RULE: NO ANSWER IS REVEALED!
 * No "0", no "weightless", no "ভারহীন", no N = 0 equation.
 * Poses a cliffhanger question to drive comments and engagement.
 */
export const S7Overlay: React.FC = () => {
  const frame = useCurrentFrame();

  if (frame < 2188 || frame > 2441) {
    return null;
  }

  // Primary Question Card: enters at 2188, stays until end
  const showQuestionCard = frame >= 2188;
  // Comment CTA: enters at 2340 (when cue 27 starts), stays until end
  const showCommentCTA = frame >= 2340;

  // Erratic gauge needle wobble during free fall
  const wobbleOffset = Math.sin(frame * 0.45) * 0.15;
  const gaugeRatio = Math.max(0.0, 0.1 + wobbleOffset);

  return (
    <>
      {showQuestionCard && (
        <div
          style={{
            position: "absolute",
            left: 140,
            top: 236,
            width: 800,
            height: 220,
            zIndex: 50,
          }}
        >
          <GlassCard
            width={800}
            height={220}
            radius={36}
            tint="purple"
            enterAt={2188}
            style={{
              padding: "24px 32px",
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <IconBadge
              icon={<HelpCircle size={44} color="#7B1FA2" strokeWidth={2.2} />}
              tint="purple"
              size={80}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div
                style={{
                  fontFamily: "ShohidShafkatSamir, sans-serif",
                  fontSize: 38,
                  fontWeight: 800,
                  color: "#7B1FA2",
                  lineHeight: 1.1,
                }}
              >
                কতটুকু ওজন অনুভব করব?
              </div>
              <div
                style={{
                  fontFamily: "ShohidShafkatSamir, sans-serif",
                  fontSize: 26,
                  fontWeight: 500,
                  color: "#334155",
                  lineHeight: 1.35,
                }}
              >
                যদি লিফট মুক্তভাবে g ত্বরণে নিচের দিকে পড়তে থাকে?
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Gauge with wobbling needle and Question Mark overlay */}
      <GaugeCard
        ratio={gaugeRatio}
        enterAt={2188}
        showQuestion={true}
        isWobbling={true}
      />

      {/* CTA Button Slot (left: 290, top: 1410, width: 500, height: 70) */}
      {showCommentCTA && (
        <div
          style={{
            position: "absolute",
            left: 290,
            top: 1410,
            width: 500,
            height: 70,
            zIndex: 50,
          }}
        >
          <GlassCard
            width={500}
            height={150}
            radius={24}
            tint="purple"
            enterAt={2393}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              padding: "10px 24px",
            }}
          >
            <MessageSquare size={50} color="#7B1FA2" strokeWidth={2.4} />
            <span
              style={{
                fontFamily: "ShohidShafkatSamir, sans-serif",
                fontSize: 36,
                fontWeight: 700,
                color: "#7B1FA2",
                letterSpacing: 0.5,
              }}
            >
              কমেন্টে জানান আপনার উত্তর!
            </span>
          </GlassCard>
        </div>
      )}
    </>
  );
};
