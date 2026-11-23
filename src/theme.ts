export const THEME = {
  colors: {
    ink: "#1A1A1A",
    normalForce: "#2E7D32", // N (green)
    gravity: "#D32F2F", // mg (red)
    acceleration: "#1565C0", // a (blue)
    highlight: "#7B1FA2", // purple emphasis
    bgBase: "#FAF7F2",
    blobs: {
      blue: "#BBD7FF",
      lavender: "#D9C9FF",
      peach: "#FFD9C2",
      mint: "#C8F0DC",
    },
    city: {
      skyTop: "#CDEBFF",
      skyHorizon: "#FFF4E0",
      sun: "#FFFDF2",
      sunGlow: "rgba(255, 240, 190, 0.45)",
      clouds: "rgba(255, 255, 255, 0.88)",
      farSkyline: "#A2C0D7",
      farSkylineShadow: "#8EAFC8",
      midSkyline: "#708EAA",
      midSkylineShadow: "#54718C",
      windowLit: "#FFF9C4",
      windowDark: "#435D75",
      heroTower: "#1F2D3D",
      heroFacade: "rgba(235, 243, 250, 0.92)",
      mullion: "#34495E",
      steelBeam: "#1C2833",
      treesLight: "#5FB36B",
      treesMid: "#3E9A57",
      treesDark: "#2F7D4A",
      trunk: "#5D4037",
    },
    stickmanA2: {
      beanie: "#E53935", // bright red
      beanieCuff: "#C62828", // darker folded cuff
      shirt: "#FBC02D", // bright yellow
      shirtCel: "#F57F17", // warm cel shade
      pants: "#1A1A1A", // solid black full trousers
      pantsHighlight: "#2D2D2D",
      shoes: "#FFFFFF", // white sneakers
      shoeSole: "#1A1A1A",
      skin: "#FFFFFF", // round white head
      ink: "#1A1A1A",
      rimLight: "rgba(255, 248, 225, 0.9)", // warm sun rim light from upper left
    },
    glassTints: {
      neutral: {
        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.38))",
        border: "rgba(255, 255, 255, 0.90)",
        badgeBg: "rgba(255, 255, 255, 0.78)",
        accentColor: "#1A1A1A",
      },
      green: {
        background: "linear-gradient(135deg, rgba(232, 245, 233, 0.82), rgba(200, 230, 201, 0.45))",
        border: "rgba(200, 230, 201, 0.92)",
        badgeBg: "rgba(200, 230, 201, 0.80)",
        accentColor: "#2E7D32",
      },
      red: {
        background: "linear-gradient(135deg, rgba(255, 235, 238, 0.82), rgba(255, 205, 210, 0.45))",
        border: "rgba(255, 205, 210, 0.92)",
        badgeBg: "rgba(255, 205, 210, 0.80)",
        accentColor: "#D32F2F",
      },
      blue: {
        background: "linear-gradient(135deg, rgba(227, 242, 253, 0.82), rgba(187, 222, 251, 0.45))",
        border: "rgba(187, 222, 251, 0.92)",
        badgeBg: "rgba(187, 222, 251, 0.80)",
        accentColor: "#1565C0",
      },
      purple: {
        background: "linear-gradient(135deg, rgba(243, 229, 245, 0.85), rgba(225, 190, 231, 0.50))",
        border: "rgba(225, 190, 231, 0.92)",
        badgeBg: "rgba(225, 190, 231, 0.80)",
        accentColor: "#7B1FA2",
      },
    },
  },
  typography: {
    fontFamily: "ShohidShafkatSamir, 'Segoe UI', system-ui, -apple-system, sans-serif",
  },
  safeZones: {
    width: 1080,
    height: 1920,
    top: 220,
    bottom: 380,
    sideMargin: 60,
    contentWidth: 960,
  },
  parallax: {
    farSkyline: 0.12,
    midSkyline: 0.35,
    trees: 0.60,
    heroTower: 1.00,
  },
  glassRecipe: {
    backdropFilter: "blur(28px) saturate(180%)",
    WebkitBackdropFilter: "blur(28px) saturate(180%)",
    border: "1.5px solid rgba(255, 255, 255, 0.85)",
    boxShadow:
      "inset 0 1px 0 rgba(255, 255, 255, 0.95), inset 0 -1px 0 rgba(0, 0, 0, 0.04), 0 20px 50px rgba(30, 40, 80, 0.14), 0 4px 14px rgba(30, 40, 80, 0.09)",
  },
  springs: {
    snappy: { damping: 16, mass: 0.8, stiffness: 120 },
    gentle: { damping: 20, mass: 1, stiffness: 100 },
    pop: { damping: 13, mass: 0.65, stiffness: 150 },
    card: { damping: 18, mass: 0.9, stiffness: 110 },
  },
} as const;

export type GlassTint = keyof typeof THEME.colors.glassTints;
