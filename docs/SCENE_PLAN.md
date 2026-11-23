# Scenes S1 to S7 Architecture & Reference Plan

## 3D Scene & Character Architecture
- **3D World**: Three.js (@remotion/three + @react-three/fiber).
  - Daytime stylized city with fog, sun glow, drifting cloud billboards, 3 depth rings of skyscrapers with procedural window grids, low-poly rounded trees on street rows and rooftop terraces.
  - Panoramic glass lift cabin riding in exterior facade shaft.
  - Camera: Perspective camera (FOV 34°), looking slightly down at character chest height.
  - Lighting: Directional warm sun from upper-left with soft PCF shadow map (character casts shadow on cabin floor), hemisphere fill, warm rim light behind character, ACES tone mapping, sRGB output.
- **3D Character**: Ready Player Me male avatar (`public/munem_3d_ready_player_me.glb`).
  - Realistic male avatar, dark navy button shirt with rolled sleeves, black pants, brown boots, black-rimmed glasses, black hair.
  - Original MeshStandardMaterial preserved (no toon outlines, no recoloring).
  - 68 bones with stripped names helper (`/_\d+$/`).
  - Motion system: Pure deterministic functions of Remotion's frame clock (`src/lib/motion.ts`).
    - Damped mass-spring-damper physical reaction driven by lift vertical acceleration $a(t)$.
    - Two-bone analytic IK on legs so feet remain planted without sliding or popping.
    - Idle life: breathing, hip weight shift sway, head and eye saccades.
- **UI Overlay**: 2D HTML glass layer over 3D canvas (Bangla captions in `ShohidShafkatSamir`, word highlights, floating glass badges, question cards).

---

## Scene by Scene Roadmap
- **S1 HOOK (0.0 to 11.3s)**: [COMPLETED]
  - Lift at rest, moves UP (heavy compression beat + "↑ ভারী" badge), cruises, moves DOWN (light extension beat + "↓ হালকা" badge), settles into think pose with "কিন্তু কেন?" glass card.
- **S2 TRUE WEIGHT (11.3 to 19.8s)**:
  - Same 3D lift & character. Camera framing adjusts slightly.
  - Downward gravity vector arrow $W = mg$ (red #D32F2F).
  - Glass card titled "প্রকৃত ওজন", equation card "W = mg".
- **S3 APPARENT WEIGHT (20.3 to 31.6s)**:
  - Floor pushes up with normal force vector arrow $N$ (green #2E7D32).
  - 3D weighing scale platform under character's feet.
  - Glass card "আপাত ওজন", equation card "W' = N".
- **S4 ACCELERATING UP (32.3 to 49.0s)**:
  - Lift accelerates up: body compresses under positive acceleration ($a > 0$).
  - Upward acceleration vector arrow $a$ (blue #1565C0).
  - Free-body diagram: $N > mg$.
  - Equation builds: $N - mg = ma \implies N = m(g + a)$. Scale reading rises.
  - Glass chip with TrendingUp: "N বাড়ে → বেশি ভারী".
- **S5 ACCELERATING DOWN (49.55 to 63.1s)**:
  - Lift accelerates down: body extends under negative acceleration ($a < 0$, heels lift slightly).
  - Downward acceleration vector arrow $a$.
  - Free-body diagram: $N < mg$.
  - Equation builds: $mg - N = ma \implies N = m(g - a)$. Scale reading drops.
  - Glass chip with TrendingDown: "N কমে → হালকা".
- **S6 TAKEAWAY (63.35 to 72.6s)**:
  - Side-by-side or dual comparison: gravity $mg$ stays constant (Lock icon), normal force $N$ changes.
  - Key glass card with Lightbulb: "প্রকৃত ওজন বদলায় না", purple highlight on "N = আপাত ওজন".
- **S7 CLIFFHANGER (72.95 to end)**:
  - Lift in free fall ($a = g$, downward).
  - Character floating weightlessly, eyes wide. Scale reading drops to 0 / "?".
  - Big question card from narration.
  - **CRITICAL**: DO NOT reveal the answer anywhere: no "0", no "weightless", no hint text, no equation showing $N = 0$. Viewers are asked to answer in the comments.
  - Glass pill with MessageCircle + "কমেন্টে উত্তর লিখুন" and gently bobbing ChevronDown.
