import React from "react";
import { useCurrentFrame } from "remotion";
import { ArrowDown, ArrowUp, CircleHelp } from "lucide-react";
import { THEME } from "../theme";
import { GlassCard } from "../components/GlassCard";
import { IconBadge } from "../components/IconBadge";

/**
 * Scene 1 2D UI Overlays (frames 0 to 339).
 * Contains "ভারী" badge, "হালকা" badge, and "কিন্তু কেন?" question card.
 */
export const S1Overlay: React.FC = () => {
  const frame = useCurrentFrame();

  if (frame > 339) {
    return null;
  }

  // Floating Glass Badges Timing:
  const heavyEnterAt = 146;
  const heavyExitAt = 180;
  const lightEnterAt = 248;
  const lightExitAt = 284;
  const questionEnterAt = 293;
  const questionExitAt = 339;

  return (
    <>
      {/* FLOATING GLASS BADGE 1: "ভারী" (Upward Acceleration Beat) */}
      {frame >= heavyEnterAt && frame <= heavyExitAt && (
        <div
          style={{
            position: "absolute",
            top: 640,
            left: 710,
            zIndex: 30,
          }}
        >
          <GlassCard
            width={240}
            height={78}
            radius={24}
            tint="purple"
            enterAt={heavyEnterAt}
            exitAt={heavyExitAt}
            style={{
              padding: "8px 18px",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 12,
            }}
          >
            <IconBadge
              icon={<ArrowUp size={22} color={THEME.colors.glassTints.purple.accentColor} />}
              size={38}
              tint="purple"
              style={{ flexShrink: 0 }}
            />
            <span
              style={{
                fontFamily: THEME.typography.fontFamily,
                fontSize: 34,
                fontWeight: 900,
                color: THEME.colors.ink,
                letterSpacing: 0.5,
                lineHeight: 1,
              }}
            >
              ভারী
            </span>
          </GlassCard>
        </div>
      )}

      {/* FLOATING GLASS BADGE 2: "হালকা" (Downward Acceleration Beat) */}
      {frame >= lightEnterAt && frame <= lightExitAt && (
        <div
          style={{
            position: "absolute",
            top: 640,
            left: 710,
            zIndex: 30,
          }}
        >
          <GlassCard
            width={240}
            height={78}
            radius={24}
            tint="blue"
            enterAt={lightEnterAt}
            exitAt={lightExitAt}
            style={{
              padding: "8px 18px",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 12,
            }}
          >
            <IconBadge
              icon={<ArrowDown size={22} color={THEME.colors.glassTints.blue.accentColor} />}
              size={38}
              tint="blue"
              style={{ flexShrink: 0 }}
            />
            <span
              style={{
                fontFamily: THEME.typography.fontFamily,
                fontSize: 34,
                fontWeight: 900,
                color: THEME.colors.ink,
                letterSpacing: 0.5,
                lineHeight: 1,
              }}
            >
              হালকা
            </span>
          </GlassCard>
        </div>
      )}

      {/* QUESTION CARD: "কিন্তু কেন?" (Cue 4 Hook Finale) */}
      {frame >= questionEnterAt && (
        <div
          style={{
            position: "absolute",
            top: 236,
            left: 140,
            zIndex: 40,
          }}
        >
          <GlassCard
            width={800}
            height={220}
            radius={36}
            tint="neutral"
            enterAt={questionEnterAt}
            exitAt={questionExitAt}
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px 28px",
              gap: 12,
            }}
          >
            <IconBadge
              icon={<CircleHelp size={28} color={THEME.colors.glassTints.purple.accentColor} />}
              size={48}
              tint="purple"
            />
            <span
              style={{
                fontFamily: THEME.typography.fontFamily,
                fontSize: 64,
                fontWeight: 900,
                color: THEME.colors.ink,
                letterSpacing: 1.0,
                lineHeight: 1.1,
                textAlign: "center",
              }}
            >
              কিন্তু কেন?
            </span>
          </GlassCard>
        </div>
      )}
    </>
  );
};
