import React from "react";
import { useCurrentFrame } from "remotion";
import { Globe2 } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { IconBadge } from "../components/IconBadge";
import { EquationCard } from "../components/EquationCard";

/**
 * Scene 2 Overlay (11.30s - 19.80s, frames 339 - 594)
 * Cues 5 to 6: "প্রকৃত ওজন হলো পৃথিবী যে বল দিয়ে আকর্ষণ করে... W = mg"
 */
export const S2Overlay: React.FC = () => {
  const frame = useCurrentFrame();

  // If outside S2 frame window, do not render
  if (frame < 339 || frame > 594) {
    return null;
  }

  // Primary Card: Cue 5 (339 - 525)
  const showPrimaryCard = frame >= 339 && frame <= 525;
  // Equation Card: Cue 6 (528 - 590)
  const showEquationCard = frame >= 528 && frame <= 590;

  return (
    <>
      {showPrimaryCard && (
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
            tint="red"
            enterAt={339}
            exitAt={525}
            style={{
              padding: "24px 32px",
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <IconBadge
              icon={<Globe2 size={44} color="#D32F2F" strokeWidth={2.2} />}
              tint="red"
              size={80}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div
                style={{
                  fontFamily: "ShohidShafkatSamir, sans-serif",
                  fontSize: 38,
                  fontWeight: 800,
                  color: "#D32F2F",
                  lineHeight: 1.1,
                }}
              >
                প্রকৃত ওজন (True Weight)
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
                পৃথিবী আমাদের যে মহাকর্ষীয় বল দিয়ে নিচের দিকে আকর্ষণ করে
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {showEquationCard && (
        <EquationCard
          equation="W = mg"
          subtitle="প্রকৃত ওজন"
          highlightTerm="mg"
          enterAt={528}
          exitAt={590}
          tint="red"
        />
      )}
    </>
  );
};
