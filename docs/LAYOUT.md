# Video Layout Specifications: LiftPhysics (Scenes S1 to S7)

## 1. Frame & Safe Zones
- **Resolution**: 1080 × 1920 (Vertical 9:16)
- **Top Safe Zone**: 220px (Content starts at `y >= 220px`)
- **Bottom Safe Zone**: 380px (Action safe line at `y <= 1540px`)
- **Side Margins**: 60px (`x` range: `60px` to `1020px`)

---

## 2. 3D Elements Projected 2D Bounding Coordinates
Based on camera (`position: [0, 1.30, cameraZ]`, `fov: 42°`, hold `cameraZ = 4.85` for frames >= 339):

- **Elevator Cabin Bounds**:
  - `x`: 45px to 953px (Width: 908px)
  - `y`: 290px (Ceiling Frame) to 1517px (Floor Chassis)
- **Character Avatar Bounds**:
  - `x`: 380px to 620px (Centered at `x = 499px`)
  - `y`: 480px (Crown of head) to 1434px (Feet on floor plate)
  - Hip / Waist height: `y = 929px`
- **Force Arrows (3D World Space)**:
  - **`mg` (Earth Gravity, Red)**:
    - Offset: `x = -0.46m` (Screen `x ≈ 303px`, left of character)
    - Origin: Hip height `y = 1.36m` (Screen `y = 929px`)
    - Direction: Points DOWN
    - Tip at length L0: Screen `y = 1161px`
  - **`N` (Normal Force, Green)**:
    - Offset: `x = +0.30m` (Screen `x ≈ 695px`, right of character)
    - Origin: Floor plate `y = 0.38m` (Screen `y = 1434px`)
    - Direction: Points UP
    - Tip (S3, N=mg): Screen `y = 1202px`
    - Tip (S4, N=1.5mg): Screen `y = 1086px`
    - Tip (S5, N=0.5mg): Screen `y = 1318px`
  - **`a` / `g` (Acceleration, Blue)**:
    - Offset: `x = -1.05m` (Screen `x ≈ 45px`, just outside cabin left edge)
    - Origin: Centered vertically on cabin at `y = 1.49m` (Screen `y = 862px`)

---

## 3. Fixed 2D Overlay Layout Slots

| Slot Name | Position (`left`, `top`) | Dimensions (`width`, `height`) | Purpose / Scenes Used |
|---|---|---|---|
| **`PRIMARY_CARD`** | `left: 140px`, `top: 236px` | `800px × 180-220px` | Major hook / concept titles: S1 ("কিন্তু কেন?"), S2 ("প্রকৃত ওজন"), S6 ("প্রকৃত ওজন বদলায় না"), S7 ("কতটুকু ওজন অনুভব করব?") |
| **`EQUATION_SLOT`** | `left: 240px`, `top: 240px` | `600px × 140-160px` | Compact Latin math derivations: S2 ("W = mg"), S3 ("W′ = N"), S4 ("N − mg = ma" → "N = m(g + a)"), S5 ("mg − N = ma" → "N = m(g − a)") |
| **`GAUGE_SLOT`** | `left: 720px`, `top: 520px` | `270px × 240px` | Circular scale / weight meter with mg tick and N needle: S3 (N=mg), S4 (N>mg), S5 (N<mg), S6 (fluctuating N), S7 (wobble + "?" overlay) |
| **`CHIP_SLOT`** | `left: 720px`, `top: 790px` | `270px × 76px` | Trend & comparison pill badges below gauge: S4 ("N বাড়ে → বেশি ভারী"), S5 ("N কমে → হালকা"), S6 ("N = আপাত ওজন") |
| **`CHIP_CONTRAST_SLOT`** | `left: 200px`, `top: 420px` | `680px × 64px` | Side-by-side comparison chips: S3 ("প্রকৃত ওজন" vs "আপাত ওজন") |
| **`CTA_SLOT`** | `left: 290px`, `top: 1410px` | `500px × 70px` | Call to action pill: S7 ("কমেন্টে উত্তর লিখুন" with bouncing ChevronDown) |
| **`CAPTIONS_SLOT`** | `left: 60px`, `top: 1540px` | `960px × auto` | Running Bangla subtitle voiceover sync (all cues 1 to 27) |

---

## 4. Visual Clearance Rules
1. **No Overlap with Character**: Character occupies `x: 380px – 620px`, `y: 480px – 1434px`. All cards are strictly placed at the top (`y < 460px`), side (`x > 710px`), or bottom (`y > 1400px`).
2. **No Overlap with Force Arrows**:
   - Red `mg` arrow on screen-left (`x ≈ 303px`) is unobstructed.
   - Green `N` arrow on screen-right (`x ≈ 695px`) connects visually to the `GAUGE_SLOT` (`x = 720px`).
   - Blue `a` arrow on far-left (`x ≈ 45px`) has its label chip anchored beside it.
3. **Safe Zone Compliance**:
   - Primary and Equation slots sit at `top: 236px – 240px`, safely below the 220px TikTok header.
   - Captions sit at `top: 1540px`, ending at `y ≈ 1680px`, leaving full safety margins for platform UI.
