import React from "react";
import { AbsoluteFill } from "remotion";
import { THEME } from "../theme";

export interface CityBackgroundProps {
  scrollY: number; // main world scroll offset
  frame?: number;
  style?: React.CSSProperties;
}

export const CityBackground: React.FC<CityBackgroundProps> = ({
  scrollY,
  frame = 0,
  style,
}) => {
  const { parallax } = THEME;
  const city = THEME.colors.city;

  // Cloud horizontal drift
  const cloud1X = ((frame * 0.45) % 1300) - 200;
  const cloud2X = (((frame * 0.32) + 550) % 1300) - 200;
  const cloud3X = (((frame * 0.22) + 950) % 1300) - 200;

  // Parallax offsets (when lift moves up, world moves down: positive scrollY moves elements down)
  const farOffset = scrollY * parallax.farSkyline;
  const midOffset = scrollY * parallax.midSkyline;
  const heroOffset = scrollY * parallax.heroTower;

  // Rooftop terrace tree sway in mid skyline
  const sway1 = Math.sin(frame * 0.04) * 1.5;
  const sway2 = Math.cos(frame * 0.035 + 1) * 1.6;

  // Floor spacing for hero tower shaft markers
  const floorSpacing = 260;
  const heroSlabOffset = ((heroOffset % floorSpacing) + floorSpacing) % floorSpacing;

  // Window vertical positions extending all the way down the towers
  const windowRowsLeft = [
    180, 240, 300, 360, 420, 480, 540, 600, 660, 720, 780, 840, 900, 960, 1020,
    1080, 1140, 1200, 1260, 1320, 1380, 1440, 1500, 1560, 1620, 1680, 1740, 1800,
  ];

  const windowRowsRight = [
    100, 160, 220, 280, 340, 400, 460, 520, 580, 640, 700, 760, 820, 880, 940,
    1000, 1060, 1120, 1180, 1240, 1300, 1360, 1420, 1480, 1540, 1600, 1660, 1720, 1780, 1840,
  ];

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,
        overflow: "hidden",
        backgroundColor: city.skyHorizon,
        ...style,
      }}
    >
      <svg
        viewBox="0 0 1080 1920"
        width="1080"
        height="1920"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          {/* Sky Gradient */}
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={city.skyTop} />
            <stop offset="55%" stopColor="#EAF5FF" />
            <stop offset="100%" stopColor={city.skyHorizon} />
          </linearGradient>

          {/* Sun Glow */}
          <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.98)" />
            <stop offset="35%" stopColor="rgba(255, 245, 215, 0.65)" />
            <stop offset="70%" stopColor="rgba(255, 235, 185, 0.25)" />
            <stop offset="100%" stopColor="rgba(255, 235, 185, 0)" />
          </radialGradient>

          {/* Hero Facade Glass Gradient (Light & Clean behind Lift) */}
          <linearGradient id="heroGlass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#E6F0FA" />
            <stop offset="45%" stopColor="#F4F9FD" />
            <stop offset="100%" stopColor="#D9E9F6" />
          </linearGradient>

          {/* Lift Area Clean Backing - ensures high contrast for stickman */}
          <linearGradient id="liftBacking" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5FAFF" />
            <stop offset="100%" stopColor="#EBF4FD" />
          </linearGradient>
        </defs>

        {/* ============================================================== */}
        {/* LAYER 1: SKY, SUN & CLOUDS                                     */}
        {/* ============================================================== */}
        <g id="sky-layer">
          <rect x="0" y="0" width="1080" height="1920" fill="url(#skyGrad)" />

          {/* Warm Sun & Glow in Upper-Left */}
          <circle cx="220" cy="280" r="280" fill="url(#sunGlow)" />
          <circle cx="220" cy="280" r="48" fill="#FFFDF5" />

          {/* Drifting Clouds */}
          <g transform={`translate(${cloud1X}, 220)`} opacity="0.88">
            <path
              d="M 20 50 Q 20 20 50 20 Q 75 0 115 10 Q 150 -5 180 20 Q 215 20 215 50 Q 215 70 190 70 L 40 70 Q 20 70 20 50 Z"
              fill="#FFFFFF"
            />
          </g>

          <g transform={`translate(${cloud2X}, 380)`} opacity="0.82">
            <path
              d="M 20 40 Q 20 15 45 15 Q 65 0 100 8 Q 130 -4 155 15 Q 185 15 185 40 Q 185 58 165 58 L 35 58 Q 20 58 20 40 Z"
              fill="#FFFFFF"
            />
          </g>

          <g transform={`translate(${cloud3X}, 520)`} opacity="0.75">
            <path
              d="M 15 35 Q 15 15 38 15 Q 55 2 85 8 Q 110 -2 130 15 Q 155 15 155 35 Q 155 50 140 50 L 30 50 Q 15 50 15 35 Z"
              fill="#FFFFFF"
            />
          </g>
        </g>

        {/* ============================================================== */}
        {/* LAYER 2: FAR SKYLINE (Pale blue-gray towers, some very tall)    */}
        {/* ============================================================== */}
        <g id="far-skyline" transform={`translate(0, ${farOffset})`}>
          {/* Far Tower 1 (Left - soaring skyscraper with tall spire, taller than frame!) */}
          <g>
            <rect x="30" y="-140" width="130" height="2200" fill={city.farSkyline} />
            <rect x="30" y="-140" width="45" height="2200" fill={city.farSkylineShadow} opacity="0.5" />
            <polygon points="95,-240 92,-140 98,-140" fill={city.farSkyline} />
            <circle cx="95" cy="-242" r="3.5" fill="#E53935" />
          </g>

          {/* Far Tower 2 (Stepped Crown skyscraper) */}
          <g>
            <rect x="180" y="-80" width="160" height="2200" fill={city.farSkyline} />
            <rect x="200" y="-130" width="120" height="50" fill={city.farSkyline} />
            <rect x="230" y="-170" width="60" height="40" fill={city.farSkyline} />
            <polygon points="260,-220 258,-170 262,-170" fill={city.farSkyline} />
            <line x1="220" y1="-80" x2="220" y2="2000" stroke={city.farSkylineShadow} strokeWidth="3" opacity="0.4" />
            <line x1="260" y1="-80" x2="260" y2="2000" stroke={city.farSkylineShadow} strokeWidth="3" opacity="0.4" />
            <line x1="300" y1="-80" x2="300" y2="2000" stroke={city.farSkylineShadow} strokeWidth="3" opacity="0.4" />
          </g>

          {/* Far Tower 3 (Center-Left slant top) */}
          <g>
            <polygon points="360,2000 360,20 480,-40 480,2000" fill={city.farSkyline} />
            <polygon points="420,2000 420,-10 480,-40 480,2000" fill={city.farSkylineShadow} opacity="0.45" />
          </g>

          {/* Far Tower 4 (Center-Right mega tower, rises above frame top!) */}
          <g>
            <rect x="620" y="-200" width="180" height="2200" fill={city.farSkyline} />
            <rect x="710" y="-200" width="90" height="2200" fill={city.farSkylineShadow} opacity="0.45" />
            <polygon points="710,-280 706,-200 714,-200" fill={city.farSkyline} />
            <circle cx="710" cy="-282" r="3.5" fill="#E53935" />
          </g>

          {/* Far Tower 5 (Far Right mega tower, cohesive background block) */}
          <g>
            <rect x="850" y="-180" width="230" height="2300" fill={city.farSkyline} />
            <rect x="970" y="-180" width="110" height="2300" fill={city.farSkylineShadow} opacity="0.45" />
            <polygon points="960,-260 956,-180 964,-180" fill={city.farSkyline} />
            <circle cx="960" cy="-262" r="3.5" fill="#E53935" />
          </g>
        </g>

        {/* ============================================================== */}
        {/* LAYER 3: MID SKYLINE (With detailed window grids on BOTH sides) */}
        {/* ============================================================== */}
        <g id="mid-skyline" transform={`translate(0, ${midOffset})`}>
          {/* Mid Tower 1 (Left block with lit windows) */}
          <g id="left-tower-1">
            <rect x="0" y="140" width="140" height="2000" fill={city.midSkyline} />
            <rect x="90" y="140" width="50" height="2000" fill={city.midSkylineShadow} />
            {/* Antenna & Helipad */}
            <line x1="70" y1="140" x2="70" y2="70" stroke={city.midSkylineShadow} strokeWidth="4" />
            <circle cx="70" cy="68" r="3" fill="#E53935" />
            {/* Full height window rows */}
            {windowRowsLeft.map((wy, i) => (
              <g key={`w1-${i}`}>
                <rect
                  x="18"
                  y={wy}
                  width="16"
                  height="24"
                  rx="2"
                  fill={i % 4 === 1 || i % 7 === 2 ? city.windowLit : city.windowDark}
                  opacity={i % 4 === 1 || i % 7 === 2 ? 0.95 : 0.45}
                />
                <rect x="44" y={wy} width="16" height="24" rx="2" fill={city.windowDark} opacity="0.45" />
                <rect
                  x="70"
                  y={wy}
                  width="16"
                  height="24"
                  rx="2"
                  fill={i % 3 === 0 ? city.windowLit : city.windowDark}
                  opacity={i % 3 === 0 ? 0.95 : 0.45}
                />
              </g>
            ))}
          </g>

          {/* Mid Tower 2 (Terraced building with rooftop garden!) */}
          <g id="left-tower-2">
            <rect x="145" y="240" width="170" height="1900" fill={city.midSkyline} />
            <rect x="250" y="240" width="65" height="1900" fill={city.midSkylineShadow} />
            {/* Terrace on roof */}
            <rect x="155" y="228" width="150" height="12" rx="3" fill={city.midSkylineShadow} />
            {/* Terrace tree 1 */}
            <g transform={`translate(180, 215) rotate(${sway1})`}>
              <rect x="-3" y="0" width="6" height="14" fill={city.trunk} />
              <circle cx="0" cy="-6" r="14" fill={city.treesMid} />
              <circle cx="-5" cy="-8" r="10" fill={city.treesLight} />
            </g>
            {/* Terrace tree 2 */}
            <g transform={`translate(225, 215) rotate(${sway2})`}>
              <rect x="-3" y="0" width="6" height="14" fill={city.trunk} />
              <circle cx="0" cy="-6" r="13" fill={city.treesDark} />
              <circle cx="4" cy="-8" r="9" fill={city.treesMid} />
            </g>
            {/* Window rows */}
            {windowRowsLeft.slice(2).map((wy, i) => (
              <g key={`w2-${i}`}>
                <rect
                  x="165"
                  y={wy}
                  width="22"
                  height="30"
                  rx="3"
                  fill={i % 5 === 2 ? city.windowLit : city.windowDark}
                  opacity={i % 5 === 2 ? 0.95 : 0.5}
                />
                <rect x="198" y={wy} width="22" height="30" rx="3" fill={city.windowDark} opacity="0.5" />
                <rect
                  x="230"
                  y={wy}
                  width="22"
                  height="30"
                  rx="3"
                  fill={i % 3 === 1 ? city.windowLit : city.windowDark}
                  opacity={i % 3 === 1 ? 0.95 : 0.5}
                />
              </g>
            ))}
          </g>

          {/* ============================================================== */}
          {/* RIGHT SIDE SKYSCRAPER (UNIFIED ARCHITECTURAL MODERN TOWER)     */}
          {/* ============================================================== */}
          <g id="right-skyscraper">
            {/* Building Body: Sunlit face (left) & Shadow face (right) - Seamless, NO black lines */}
            <rect x="835" y="60" width="125" height="2100" fill={city.midSkyline} />
            <rect x="960" y="60" width="120" height="2100" fill={city.midSkylineShadow} />

            {/* Stepped Architectural Crown */}
            <polygon points="860,60 920,10 980,60" fill={city.midSkyline} />
            <polygon points="920,10 980,60 980,10" fill={city.midSkylineShadow} />

            {/* Architectural Communications Spire with Red Warning Beacon */}
            <line x1="940" y1="10" x2="940" y2="-50" stroke={city.midSkylineShadow} strokeWidth="4" />
            <circle cx="940" cy="-52" r="3.5" fill="#E53935" />

            {/* Horizontal Floor Mullions across both faces */}
            {windowRowsRight.map((wy, idx) => (
              <g key={`rf-band-${idx}`}>
                <line
                  x1="835"
                  y1={wy + 34}
                  x2="960"
                  y2={wy + 34}
                  stroke="rgba(255, 255, 255, 0.22)"
                  strokeWidth="2"
                />
                <line
                  x1="960"
                  y1={wy + 34}
                  x2="1080"
                  y2={wy + 34}
                  stroke="rgba(0, 0, 0, 0.16)"
                  strokeWidth="2"
                />
              </g>
            ))}

            {/* 6 Window Columns across the entire width of the right skyscraper */}
            {windowRowsRight.map((wy, i) => (
              <g key={`rw-${i}`}>
                {/* Sunlit Face Columns (x = 852, 886, 920) */}
                <rect
                  x="852"
                  y={wy}
                  width="20"
                  height="26"
                  rx="3"
                  fill={i % 3 === 1 || i % 7 === 2 ? city.windowLit : city.windowDark}
                  opacity={i % 3 === 1 || i % 7 === 2 ? 0.95 : 0.65}
                />
                <rect
                  x="886"
                  y={wy}
                  width="20"
                  height="26"
                  rx="3"
                  fill={i % 4 === 2 ? city.windowLit : city.windowDark}
                  opacity={i % 4 === 2 ? 0.95 : 0.65}
                />
                <rect
                  x="920"
                  y={wy}
                  width="20"
                  height="26"
                  rx="3"
                  fill={i % 5 === 0 ? city.windowLit : city.windowDark}
                  opacity={i % 5 === 0 ? 0.95 : 0.65}
                />

                {/* Shadow Face Columns (x = 974, 1008, 1042) */}
                <rect
                  x="974"
                  y={wy}
                  width="20"
                  height="26"
                  rx="3"
                  fill={i % 4 === 3 ? city.windowLit : city.windowDark}
                  opacity={i % 4 === 3 ? 0.88 : 0.72}
                />
                <rect
                  x="1008"
                  y={wy}
                  width="20"
                  height="26"
                  rx="3"
                  fill={i % 6 === 1 ? city.windowLit : city.windowDark}
                  opacity={i % 6 === 1 ? 0.88 : 0.72}
                />
                <rect
                  x="1042"
                  y={wy}
                  width="20"
                  height="26"
                  rx="3"
                  fill={i % 5 === 3 ? city.windowLit : city.windowDark}
                  opacity={i % 5 === 3 ? 0.88 : 0.72}
                />
              </g>
            ))}
          </g>
        </g>

        {/* ============================================================== */}
        {/* LAYER 4: HERO TOWER & EXTERIOR PANORAMIC SHAFT (1.0x Parallax)  */}
        {/* ============================================================== */}
        <g id="hero-tower" transform={`translate(0, 0)`}>
          {/* Main Hero Building Facade (Positioned in center-right x: 240 to 840) */}
          <rect
            x="240"
            y="-100"
            width="600"
            height="2200"
            fill="url(#heroGlass)"
            stroke={city.steelBeam}
            strokeWidth="3.5"
          />

          {/* Clean contrast backing directly behind the glass lift */}
          <rect
            x="290"
            y="480"
            width="500"
            height="720"
            rx="12"
            fill="url(#liftBacking)"
            opacity="0.95"
          />

          {/* Architectural Window Mullions (Vertical Grid) */}
          {[270, 330, 390, 450, 510, 570, 630, 690, 750, 810].map((mx) => (
            <line
              key={`mul-${mx}`}
              x1={mx}
              y1="-100"
              x2={mx}
              y2="2100"
              stroke="rgba(44, 62, 80, 0.18)"
              strokeWidth="2.5"
            />
          ))}

          {/* EXTERIOR PANORAMIC LIFT SHAFT (Full Height Structural Steel Rails) */}
          {/* Left Main Rail */}
          <rect x="290" y="-100" width="16" height="2200" fill={city.steelBeam} />
          <line x1="298" y1="-100" x2="298" y2="2100" stroke="#7F8C8D" strokeWidth="3" />

          {/* Right Main Rail (Aligned with lift guide rollers) */}
          <rect x="766" y="-100" width="16" height="2200" fill={city.steelBeam} />
          <line x1="774" y1="-100" x2="774" y2="2100" stroke="#7F8C8D" strokeWidth="3" />

          {/* Moving Floor Slabs & Floor Number Markers on the facade */}
          {[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8].map((fIdx) => {
            const slabY = fIdx * floorSpacing + heroSlabOffset;
            const floorNum = 34 - fIdx;
            return (
              <g key={`slab-${fIdx}`} transform={`translate(0, ${slabY})`}>
                {/* Horizontal Concrete Floor Slab across building */}
                <line
                  x1="240"
                  y1="0"
                  x2="840"
                  y2="0"
                  stroke={city.mullion}
                  strokeWidth="5"
                />
                {/* Steel Rail Brackets */}
                <rect x="284" y="-7" width="28" height="14" rx="3" fill={city.steelBeam} />
                <rect x="760" y="-7" width="28" height="14" rx="3" fill={city.steelBeam} />

                {/* Small Floor Number Marker */}
                <g transform="translate(325, 20)">
                  <rect
                    x="0"
                    y="0"
                    width="44"
                    height="24"
                    rx="6"
                    fill="rgba(255, 255, 255, 0.88)"
                    stroke="rgba(44, 62, 80, 0.3)"
                    strokeWidth="1.5"
                  />
                  <text
                    x="22"
                    y="17"
                    fontFamily="system-ui, monospace"
                    fontSize="13"
                    fontWeight="800"
                    fill="#34495E"
                    textAnchor="middle"
                  >
                    {floorNum}F
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
