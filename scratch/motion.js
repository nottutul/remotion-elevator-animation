import * as THREE from "three";
/**
 * Quintic smooth step polynomial (C2 continuous: zero velocity and acceleration at ends)
 */
function quintic(t) {
    const c = Math.max(0, Math.min(1, t));
    return c * c * c * (c * (c * 6 - 15) + 10);
}
function dQuintic(t) {
    const c = Math.max(0, Math.min(1, t));
    return 30 * c * c * (c * (c - 2) + 1);
}
function d2Quintic(t) {
    const c = Math.max(0, Math.min(1, t));
    return 60 * c * (c * (2 * c - 3) + 1);
}
/**
 * Returns the exact continuous lift state at any given frame.
 */
export function getLiftMotion(frame, fps = 30) {
    const t = frame / fps;
    // Move 1: UP from t = 2.35s to 6.00s (distance: +6.0 meters)
    const upStart = 2.35;
    const upEnd = 6.00;
    const upDist = 6.0;
    const upDur = upEnd - upStart;
    // Move 2: DOWN from t = 6.20s to 9.50s (distance: -6.0 meters)
    const downStart = 6.20;
    const downEnd = 9.50;
    const downDist = -6.0;
    const downDur = downEnd - downStart;
    let y = 0;
    let v = 0;
    let a = 0;
    if (t < upStart) {
        y = 0;
        v = 0;
        a = 0;
    }
    else if (t <= upEnd) {
        const s = (t - upStart) / upDur;
        y = upDist * quintic(s);
        v = (upDist / upDur) * dQuintic(s);
        a = (upDist / (upDur * upDur)) * d2Quintic(s);
    }
    else if (t < downStart) {
        y = upDist;
        v = 0;
        a = 0;
    }
    else if (t <= downEnd) {
        const s = (t - downStart) / downDur;
        y = upDist + downDist * quintic(s);
        v = (downDist / downDur) * dQuintic(s);
        a = (downDist / (downDur * downDur)) * d2Quintic(s);
    }
    else {
        y = 0;
        v = 0;
        a = 0;
    }
    return { y, v, a };
}
// ============================================================================
// 2. DAMPED MASS-SPRING-DAMPER SIMULATION OF BODY PHYSICAL REACTION
// ============================================================================
// Precomputes the body's vertical inertial compression c(frame) in meters.
// When a(t) > 0 (upward push), body compresses down: c > 0 (heavy).
// When a(t) < 0 (downward drop), body extends up: c < 0 (light).
// Includes 4-6 frames anticipation micro-movement.
export function computeBodySpringArray(totalFrames = 340, fps = 30) {
    const compressions = new Float32Array(totalFrames);
    // Oscillator parameters
    const fn = 2.4; // Natural frequency in Hz (~2.4 Hz)
    const omega = 2 * Math.PI * fn; // ~15.08 rad/s
    const zeta = 0.42; // Damping ratio (underdamped, realistic organic flesh/muscle)
    const kDrive = 0.016; // Coupling constant (maps m/s^2 acceleration to ~0.04 - 0.05m compression)
    const exaggeration = 1.30; // 1.3x educational exaggeration
    let c = 0; // compression displacement (meters)
    let cVel = 0; // compression velocity (m/s)
    const subSteps = 8;
    const dt = (1 / fps) / subSteps;
    for (let f = 0; f < totalFrames; f++) {
        // Anticipation: look ahead 5 frames (~0.17s)
        const futureState = getLiftMotion(f + 5, fps);
        const currentState = getLiftMotion(f, fps);
        // If a big acceleration is coming in 5 frames, add tiny opposite micro-movement (-10%)
        const anticipation = (futureState.a - currentState.a) * -0.0015;
        for (let step = 0; step < subSteps; step++) {
            const state = getLiftMotion(f + step / subSteps, fps);
            // Driving force is proportional to acceleration: F = m * a
            const drive = state.a * kDrive * exaggeration;
            const accSpring = drive - 2 * zeta * omega * cVel - omega * omega * c;
            cVel += accSpring * dt;
            c += cVel * dt;
        }
        compressions[f] = c + anticipation;
    }
    return compressions;
}
// Global cached spring response for Scene 1
export const SCENE1_BODY_SPRING = computeBodySpringArray(345, 30);
export function solveLegIK(hipWorldPos, footTargetWorldPos, thighLength = 0.396, calfLength = 0.369) {
    // Vector from hip to target foot
    const dx = footTargetWorldPos.x - hipWorldPos.x;
    const dy = footTargetWorldPos.y - hipWorldPos.y;
    const dz = footTargetWorldPos.z - hipWorldPos.z;
    const targetDist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const maxReach = (thighLength + calfLength) * 0.999;
    const minReach = Math.abs(thighLength - calfLength) * 1.05;
    const d = Math.max(minReach, Math.min(maxReach, targetDist));
    // Law of cosines for knee angle (angle between thigh and calf)
    // c^2 = a^2 + b^2 - 2ab * cos(kneeInternal)
    const cosKnee = (thighLength * thighLength + calfLength * calfLength - d * d) / (2 * thighLength * calfLength);
    const clampedCosKnee = Math.max(-1, Math.min(1, cosKnee));
    const kneeFlex = Math.PI - Math.acos(clampedCosKnee);
    // Angle at hip relative to hip-to-foot vector
    const cosHip = (thighLength * thighLength + d * d - calfLength * calfLength) / (2 * thighLength * d);
    const clampedCosHip = Math.max(-1, Math.min(1, cosHip));
    const alphaHip = Math.acos(clampedCosHip);
    // Direction angle from hip to target in sagittal plane (pitch)
    const pitchToTarget = Math.atan2(dz, -dy);
    const hipPitch = pitchToTarget + alphaHip;
    // Yaw angle
    const hipYaw = Math.atan2(dx, -dy);
    // Ankle counter-pitch to keep foot sole flat
    const anklePitch = -(hipPitch - kneeFlex);
    return {
        hipPitch,
        hipYaw,
        kneeAngle: kneeFlex,
        anklePitch,
    };
}
// ============================================================================
// 4. DETERMINISTIC SEEDED NOISE & LIFE HELPERS
// ============================================================================
function seededSin(val, phase = 0) {
    return Math.sin(val + phase);
}
// ============================================================================
// 5. MASTER POSE EVALUATOR
// ============================================================================
/**
 * Computes all bone transform offsets for the character at any frame.
 * Pure function of frame, fully deterministic.
 */
export function getProceduralPose(frame, fps = 30) {
    const t = frame / fps;
    const compression = SCENE1_BODY_SPRING[Math.min(frame, SCENE1_BODY_SPRING.length - 1)] || 0;
    // --------------------------------------------------------------------------
    // A. Idle Life (Breathing, Sway, Saccades)
    // --------------------------------------------------------------------------
    // Breathing: 3.8s period (~0.26 Hz)
    const breathPhase = t * ((2 * Math.PI) / 3.8);
    const breath = (Math.sin(breathPhase) * 0.5 + 0.5); // 0 to 1
    const breathPitch = (breath * 1.0) * (Math.PI / 180); // ~1.0 degree chest expansion
    // Weight shift: 6.2s period side to side sway
    const swayPhase = t * ((2 * Math.PI) / 6.2);
    const swayX = Math.sin(swayPhase) * 0.012; // 1.2 cm sway
    const swayRoll = Math.sin(swayPhase) * (0.8 * (Math.PI / 180)); // 0.8 deg hip roll
    const spineCounterRoll = -swayRoll * 0.75; // Spine counter-rotation
    // Head drift & eye saccades (seeded sum of sines)
    const headYaw = (seededSin(t * 0.8, 0.4) * 0.6 + seededSin(t * 1.7, 1.2) * 0.3) * (Math.PI / 180);
    const headPitch = (seededSin(t * 0.6, 0.8) * 0.5 + seededSin(t * 1.3, 2.5) * 0.3) * (Math.PI / 180);
    const eyeYaw = (seededSin(t * 2.2, 0.1) * 1.8 + (Math.sin(t * 0.4) > 0.8 ? 2.5 : 0)) * (Math.PI / 180);
    const eyePitch = (seededSin(t * 1.8, 0.5) * 1.2) * (Math.PI / 180);
    // --------------------------------------------------------------------------
    // B. Physical Reaction to Lift Acceleration
    // --------------------------------------------------------------------------
    // compression > 0: heavier (drop hips, flex knees, lean spine forward, head stabilizes)
    // compression < 0: lighter (extend legs, heels lift, upright spine, arms float)
    // Hip vertical drop in meters: 0 to 0.05m
    const hipDrop = Math.max(-0.025, Math.min(0.06, compression));
    const hipZ = Math.max(0, compression) * 0.35; // Slight backward hip push under compression
    // Knee flex compensation
    const kneeFlexAdd = Math.max(0, compression) * 14.0 * (Math.PI / 180);
    // Spine pitch forward under compression (0 to 3.5 deg)
    const spinePitch = Math.max(0, compression) * 3.5 * (Math.PI / 180);
    // Vestibular reflex: head counter-rotates by 65% of spine movement to keep gaze level
    const headStabilizePitch = -spinePitch * 0.65;
    // Arms lag / follow-through: delayed spring response
    const armLagPhase = Math.sin(frame * 0.18) * Math.abs(compression) * 2.0 * (Math.PI / 180);
    const armSag = Math.max(0, compression) * 2.5 * (Math.PI / 180);
    const armFloat = Math.max(0, -compression) * 3.2 * (Math.PI / 180);
    // Heel lift during "light" moments
    const heelLift = Math.max(0, -compression) * 0.8; // 0 to 2 cm
    // --------------------------------------------------------------------------
    // C. Beat Poses & Blending
    // --------------------------------------------------------------------------
    // Beat 2 "Heavy" blend (frames 70 - 180, peak around frame 85 - 110)
    const heavyWeight = (() => {
        if (frame < 70)
            return 0;
        if (frame <= 95)
            return (frame - 70) / 25;
        if (frame <= 145)
            return 1.0;
        if (frame <= 180)
            return 1.0 - (frame - 145) / 35;
        return 0;
    })();
    // Beat 3 "Light" blend (frames 186 - 285, peak around frame 200 - 235)
    const lightWeight = (() => {
        if (frame < 186)
            return 0;
        if (frame <= 210)
            return (frame - 186) / 24;
        if (frame <= 250)
            return 1.0;
        if (frame <= 285)
            return 1.0 - (frame - 250) / 35;
        return 0;
    })();
    // Beat 4 "Think" pose blend (starts frame 293 / 9.75s, reaches 1.0 by frame 308, holds)
    const thinkWeight = (() => {
        if (frame < 293)
            return 0;
        const progress = Math.min(1, (frame - 293) / 16);
        // Smooth spring ease with slight overshoot
        return progress < 1 ? progress * progress * (3 - 2 * progress) : 1.0;
    })();
    // Pose additive rotations
    // Base Natural Stance:
    // LeftArm: +72 deg on X, +5 deg on Y
    // LeftForeArm: +16 deg on Z (elbow flex)
    // RightArm: +72 deg on X, -5 deg on Y
    // RightForeArm: -16 deg on Z (elbow flex)
    const baseArmPitch = (73 + armSag - armFloat) * (Math.PI / 180);
    const baseElbowFlex = (16 + armLagPhase) * (Math.PI / 180);
    // Heavy adjustments: chin down, eyes down
    const heavyHeadPitch = heavyWeight * 0.06; // chin down
    const heavyEyePitch = heavyWeight * -0.08; // glance down
    // Light adjustments: chin up, eyes up
    const lightHeadPitch = lightWeight * -0.05; // chin up
    const lightEyePitch = lightWeight * 0.07; // glance up
    // Think pose adjustments:
    // Right hand to chin: arm rotates up/inward, elbow bent -125 deg, head tilted
    const thinkHeadRoll = thinkWeight * (-0.11); // 6.3 deg tilt
    const thinkHeadYaw = thinkWeight * (0.05);
    return {
        hipOffset: new THREE.Vector3(swayX, -hipDrop, hipZ),
        hipRotation: new THREE.Euler(0, 0, swayRoll),
        spineRotation: new THREE.Euler(spinePitch, 0, spineCounterRoll),
        spine1Rotation: new THREE.Euler(breathPitch * 0.5, 0, 0),
        spine2Rotation: new THREE.Euler(breathPitch * 0.5, 0, 0),
        neckRotation: new THREE.Euler(headStabilizePitch * 0.4, 0, 0),
        headRotation: new THREE.Euler(headPitch + headStabilizePitch * 0.6 + heavyHeadPitch + lightHeadPitch, headYaw + thinkHeadYaw, thinkHeadRoll),
        leftEyeRotation: new THREE.Euler(eyePitch + heavyEyePitch + lightEyePitch, eyeYaw, 0),
        rightEyeRotation: new THREE.Euler(eyePitch + heavyEyePitch + lightEyePitch, eyeYaw, 0),
        // Left Arm (Natural stance or folded across waist in think pose)
        leftArmRotation: new THREE.Euler(THREE.MathUtils.lerp(baseArmPitch, 48 * (Math.PI / 180), thinkWeight), THREE.MathUtils.lerp(6 * (Math.PI / 180), 28 * (Math.PI / 180), thinkWeight), THREE.MathUtils.lerp(0, 15 * (Math.PI / 180), thinkWeight)),
        leftForeArmRotation: new THREE.Euler(0, 0, THREE.MathUtils.lerp(baseElbowFlex, 88 * (Math.PI / 180), thinkWeight)),
        leftHandRotation: new THREE.Euler(0, 0, 0),
        // Right Arm (Natural stance or raised to chin in think pose)
        rightArmRotation: new THREE.Euler(THREE.MathUtils.lerp(baseArmPitch, -40 * (Math.PI / 180), thinkWeight), THREE.MathUtils.lerp(-6 * (Math.PI / 180), 50 * (Math.PI / 180), thinkWeight), THREE.MathUtils.lerp(0, -60 * (Math.PI / 180), thinkWeight)),
        rightForeArmRotation: new THREE.Euler(0, 0, THREE.MathUtils.lerp(-baseElbowFlex, -125 * (Math.PI / 180), thinkWeight)),
        rightHandRotation: new THREE.Euler(THREE.MathUtils.lerp(0, 15 * (Math.PI / 180), thinkWeight), 0, THREE.MathUtils.lerp(0, -10 * (Math.PI / 180), thinkWeight)),
        leftKneeFlex: kneeFlexAdd,
        rightKneeFlex: kneeFlexAdd,
        heelLift,
        fingerCurlLeft: THREE.MathUtils.lerp(0.35, 0.65, thinkWeight),
        fingerCurlRight: THREE.MathUtils.lerp(0.35, 0.75, thinkWeight),
    };
}
