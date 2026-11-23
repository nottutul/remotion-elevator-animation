import os
import shutil
import subprocess
import sys

FRAMES = [
    15, 120, 210, 310, 450, 555,
    675, 735, 850, 915, 1080, 1160,
    1245, 1380, 1425, 1530, 1620, 1740,
    1860, 1980, 2080, 2145, 2265, 2440
]

NAMED_STILLS = {
    450: "still-15.0s-s2-primary-card.png",
    555: "still-18.5s-s2-equation-w-mg.png",
    735: "still-24.5s-s3-n-arrow-gauge.png",
    915: "still-30.5s-s3-equation-w-n.png",
    1080: "still-36.0s-s4-accel-up-arrow.png",
    1245: "still-41.5s-s4-equation-n-m-g-a.png",
    1425: "still-47.5s-s4-chip-weight-increase.png",
    1620: "still-54.0s-s5-accel-down-arrow.png",
    1740: "still-58.0s-s5-equation-n-m-g-minus-a.png",
    1860: "still-62.0s-s5-chip-weight-decrease.png",
    1980: "still-66.0s-s6-constant-speed.png",
    2145: "still-71.5s-s6-true-weight-constant.png",
    2265: "still-75.5s-s7-free-fall-shrug.png",
    2440: "still-81.3s-s7-final-question-cta.png",
}

os.makedirs("out/stills", exist_ok=True)
os.makedirs("public/stills", exist_ok=True)

print(f"Starting batch rendering of {len(FRAMES)} still frames...")

for idx, frame in enumerate(FRAMES, 1):
    out_file = f"out/stills/frame-{frame}.png"
    pub_file = f"public/stills/frame-{frame}.png"
    
    print(f"[{idx}/{len(FRAMES)}] Rendering LiftPhysics frame {frame} -> {out_file}...")
    cmd = ["npx.cmd" if os.name == "nt" else "npx", "remotion", "still", "LiftPhysics", out_file, f"--frame={frame}"]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Error rendering frame {frame}:", res.stderr)
        sys.exit(1)
        
    shutil.copy2(out_file, pub_file)
    
    if frame in NAMED_STILLS:
        named_path = os.path.join("out/stills", NAMED_STILLS[frame])
        shutil.copy2(out_file, named_path)
        print(f"    Saved named still: {named_path}")

print("\nAll 24 stills rendered successfully! Now rendering 24-frame contact sheet...")

contact_out = "out/stills/motion-strip-full.png"
cmd = ["npx.cmd" if os.name == "nt" else "npx", "remotion", "still", "MotionStripFull", contact_out, "--frame=0"]
res = subprocess.run(cmd, capture_output=True, text=True)
if res.returncode != 0:
    print("Error rendering contact sheet:", res.stderr)
    sys.exit(1)

print(f"SUCCESS: Contact sheet generated at {contact_out}!")
