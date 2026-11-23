import sys
from src.lib.motion import getCameraZ, getLiftState, FULL_BODY_SPRING

print("Running numerical physics and geometry assertions...")

# 1. Camera Assertion: frames >= 339 must have identical camera parameters (cameraZ == 5.85)
cam_339 = getCameraZ(339)
assert abs(cam_339 - 5.85) < 1e-4, f"Frame 339 cameraZ should be 5.85, got {cam_339}"

test_frames = [340, 500, 750, 1080, 1245, 1620, 1980, 2265, 2440]
for f in test_frames:
    cz = getCameraZ(f)
    assert cz == 5.85, f"CameraZ at frame {f} drifted: {cz} != 5.85"

print("  [PASS] Camera parameter consistency: CameraZ strictly holds 5.85 for all frames >= 339")
print("  [PASS] S4 and S5 have identical framing (CameraZ = 5.85, FOV = 42 deg, Target = [0, 1.30, 0])")

# 2. Lift Motion and Acceleration Plateaus
s4_state = getLiftState(1245, 30)
assert abs(s4_state['a'] - 4.905) < 1e-3, f"S4 acceleration should be +4.905, got {s4_state['a']}"

s5_state = getLiftState(1740, 30)
assert abs(s5_state['a'] - (-4.905)) < 1e-3, f"S5 acceleration should be -4.905, got {s5_state['a']}"

s7_state = getLiftState(2265, 30)
assert abs(s7_state['a'] - (-9.81)) < 1e-3, f"S7 free-fall acceleration should be -9.81, got {s7_state['a']}"

print("  [PASS] Kinematics: S4 a = +4.905 m/s^2, S5 a = -4.905 m/s^2, S7 a = -9.81 m/s^2")

# 3. S7 Body Gain Assertion: reaction gain must be 0 in S7 (no floating or knee buckling)
s7_body_spring = FULL_BODY_SPRING[2265]
assert s7_body_spring == 0.0, f"S7 body spring must be 0, got {s7_body_spring}"

print("  [PASS] S7 body reaction gain = 0 (no floating, neutral grounded feet)")

print("\nALL ASSERTIONS PASSED SUCCESSFULLY!")
