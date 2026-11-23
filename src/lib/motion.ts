import * as THREE from "three";

// ============================================================================
// 1. LIFT VERTICAL MOTION PROFILE (Continuous Full Timeline: S1 to S7)
// ============================================================================
// Scene Boundaries (at 30 fps):
// S1: 0.00 - 11.30s (frames 0 - 339)   -> moves UP then DOWN, returns to rest
// S2: 11.30 - 19.80s (frames 339 - 594) -> at rest (a = 0, v = 0)
// S3: 20.30 - 31.60s (frames 609 - 948) -> at rest (a = 0, v = 0)
// S4: 32.30 - 49.00s (frames 969 - 1470) -> accelerates UP (constant a = +0.5g plateau)
// Gap: 49.00 - 49.55s (frames 1470 - 1486.5) -> brakes to rest
// S5: 49.55 - 63.10s (frames 1486.5 - 1893) -> accelerates DOWN (constant a = -0.5g plateau)
// Gap: 63.10 - 63.35s (frames 1893 - 1900) -> brakes to rest
// S6: 63.35 - 72.60s (frames 1900 - 2178) -> at rest (a = 0, v = 0)
// S7: 72.95 - 81.34s (frames 2188 - 2441) -> free fall (a = -g)

export interface LiftState {
  liftY: number; // Vertical position in meters
  v: number;     // Velocity in m/s
  a: number;     // Acceleration in m/s^2 (positive = upward acceleration, negative = downward)
}

/**
 * Camera Z getter: fixed S1 push-in for frames 0-339, then perfectly held at 5.85 for all frames >= 339.
 */
export function getCameraZ(globalFrame: number): number {
  if (globalFrame <= 339) {
    return 6.05 - (globalFrame / 339) * 0.20;
  }
  return 5.85;
}

/**
 * Quintic smooth step polynomial (C2 continuous: zero velocity and acceleration at ends)
 */
function quintic(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * c * (c * (c * 6 - 15) + 10);
}

function dQuintic(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return 30 * c * c * (c * (c - 2) + 1);
}

function d2Quintic(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return 60 * c * (c * (2 * c - 3) + 1);
}

/**
 * S1 Lift Motion: EXACT original formula for first 339 frames.
 */
export function getLiftMotion(frame: number, fps = 30): { y: number; v: number; a: number } {
  const t = frame / fps;

  const upStart = 2.35;
  const upEnd = 6.00;
  const upDist = 6.0;
  const upDur = upEnd - upStart;

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
  } else if (t <= upEnd) {
    const s = (t - upStart) / upDur;
    y = upDist * quintic(s);
    v = (upDist / upDur) * dQuintic(s);
    a = (upDist / (upDur * upDur)) * d2Quintic(s);
  } else if (t < downStart) {
    y = upDist;
    v = 0;
    a = 0;
  } else if (t <= downEnd) {
    const s = (t - downStart) / downDur;
    y = upDist + downDist * quintic(s);
    v = (downDist / downDur) * dQuintic(s);
    a = (downDist / (downDur * downDur)) * d2Quintic(s);
  } else {
    y = 0;
    v = 0;
    a = 0;
  }

  return { y, v, a };
}

/**
 * Master Lift State for the entire video (S1 to S7).
 * Identical to S1 for frames 0-339.
 */
export function getLiftState(globalFrame: number, fps = 30): LiftState {
  if (globalFrame <= 339) {
    const s1 = getLiftMotion(globalFrame, fps);
    return { liftY: s1.y, v: s1.v, a: s1.a };
  }

  const t = globalFrame / fps;

  // S2 & S3: at rest
  if (t < 32.30) {
    return { liftY: 0, v: 0, a: 0 };
  }

  // S4: Accelerating UP (32.30s - 49.00s)
  // Constant acceleration plateau at a = +0.5g = +4.905 m/s^2 with smooth 0.5s ramp on
  const s4Start = 32.30;
  const s4End = 49.00;
  const aPlateau = 4.905;

  if (t <= s4End) {
    const dt = t - s4Start;
    const ramp = Math.min(1, dt / 0.5);
    const a = aPlateau * (ramp * ramp * (3 - 2 * ramp));
    // Diminishing velocity growth so it always reads as accelerating
    const v = 3.2 * (Math.sqrt(1 + 1.2 * dt) - 1);
    // Integrated displacement
    const liftY = 1.778 * (Math.pow(1 + 1.2 * dt, 1.5) - 1) - 3.2 * dt;
    return { liftY, v, a };
  }

  // S4 Brake Gap (49.00s - 49.55s): smooth stop
  const s4BrakeDur = 0.55;
  const s4FinalY = 1.778 * (Math.pow(1 + 1.2 * (s4End - s4Start), 1.5) - 1) - 3.2 * (s4End - s4Start);
  const s4FinalV = 3.2 * (Math.sqrt(1 + 1.2 * (s4End - s4Start)) - 1);

  if (t < 49.55) {
    const s = (t - s4End) / s4BrakeDur;
    const smooth = 1 - (s * s * (3 - 2 * s));
    const v = s4FinalV * smooth;
    const a = -s4FinalV / s4BrakeDur * 6 * s * (1 - s);
    const liftY = s4FinalY + s4FinalV * s4BrakeDur * (s * s * (1 - (2 / 3) * s));
    return { liftY, v, a };
  }

  // S5: Accelerating DOWN (49.55s - 63.10s)
  // Mirrored plateau at a = -0.5g = -4.905 m/s^2
  const s5Start = 49.55;
  const s5End = 63.10;
  const s4PeakY = s4FinalY + s4FinalV * s4BrakeDur * (1 / 3);

  if (t <= s5End) {
    const dt = t - s5Start;
    const ramp = Math.min(1, dt / 0.5);
    const a = -aPlateau * (ramp * ramp * (3 - 2 * ramp));
    const v = -3.2 * (Math.sqrt(1 + 1.2 * dt) - 1);
    const deltaY = -(1.778 * (Math.pow(1 + 1.2 * dt, 1.5) - 1) - 3.2 * dt);
    const liftY = s4PeakY + deltaY;
    return { liftY, v, a };
  }

  // S5 Brake Gap (63.10s - 63.35s): smooth stop
  const s5BrakeDur = 0.25;
  const s5FinalY = s4PeakY - (1.778 * (Math.pow(1 + 1.2 * (s5End - s5Start), 1.5) - 1) - 3.2 * (s5End - s5Start));
  const s5FinalV = -3.2 * (Math.sqrt(1 + 1.2 * (s5End - s5Start)) - 1);

  if (t < 63.35) {
    const s = (t - s5End) / s5BrakeDur;
    const smooth = 1 - (s * s * (3 - 2 * s));
    const v = s5FinalV * smooth;
    const a = -s5FinalV / s5BrakeDur * 6 * s * (1 - s);
    const liftY = s5FinalY + s5FinalV * s5BrakeDur * (s * s * (1 - (2 / 3) * s));
    return { liftY, v, a };
  }

  // S6: at rest (63.35s - 72.95s)
  const s6RestY = s5FinalY + s5FinalV * s5BrakeDur * (1 / 3);
  if (t < 72.95) {
    return { liftY: s6RestY, v: 0, a: 0 };
  }

  // S7: Free Fall (72.95s to end)
  // Strong downward acceleration a = -g = -9.81 m/s^2
  const s7Start = 72.95;
  const dt = t - s7Start;
  const ramp = Math.min(1, dt / 0.35);
  const a = -9.81 * (ramp * ramp * (3 - 2 * ramp));
  const v = -4.5 * Math.pow(dt, 1.25);
  const liftY = s6RestY - (4.5 / 2.25) * Math.pow(dt, 2.25);

  return { liftY, v, a };
}

// ============================================================================
// 2. DAMPED MASS-SPRING-DAMPER SIMULATION OF BODY PHYSICAL REACTION
// ============================================================================
// Precomputes the body's vertical inertial compression c(frame) in meters.
// When a(t) > 0 (upward push), body compresses down: c > 0 (heavy).
// When a(t) < 0 (downward drop), body extends up: c < 0 (light).
// Includes 4-6 frames anticipation micro-movement.

export function computeBodySpringArray(totalFrames = 2500, fps = 30): Float32Array {
  const compressions = new Float32Array(totalFrames);

  // Oscillator parameters
  const fn = 2.4; // Natural frequency in Hz (~2.4 Hz)
  const omega = 2 * Math.PI * fn; // ~15.08 rad/s
  const zeta = 0.42; // Damping ratio (underdamped, realistic organic flesh/muscle)
  const kDrive = 3.6; // Coupling constant (maps m/s^2 acceleration to ~0.04 - 0.05m compression)
  const exaggeration = 1.30; // 1.3x educational exaggeration

  let c = 0; // compression displacement (meters)
  let cVel = 0; // compression velocity (m/s)

  const subSteps = 8;
  const dt = (1 / fps) / subSteps;

  for (let f = 0; f < totalFrames; f++) {
    const t = f / fps;
    // Body reaction gain:
    // In S7 (free fall t >= 72.95), gain = 0 (character stays neutral and unsure).
    // In brake gaps, gain = 0.3 so it doesn't pop opposite reactions.
    let gain = 1.0;
    if (t >= 72.95) {
      gain = 0.0;
    } else if (t >= 49.0 && t < 49.55) {
      gain = 0.3;
    } else if (t >= 63.1 && t < 63.35) {
      gain = 0.3;
    }

    // Anticipation: look ahead 5 frames (~0.17s)
    const futureState = getLiftState(f + 5, fps);
    const currentState = getLiftState(f, fps);
    const anticipation = gain * (futureState.a - currentState.a) * -0.0015;

    for (let step = 0; step < subSteps; step++) {
      const state = getLiftState(f + step / subSteps, fps);
      // Driving force is proportional to acceleration: F = m * a
      const drive = gain * state.a * kDrive * exaggeration;
      const accSpring = drive - 2 * zeta * omega * cVel - omega * omega * c;
      cVel += accSpring * dt;
      c += cVel * dt;
    }

    compressions[f] = c + anticipation;
  }

  return compressions;
}

// Global cached spring response for Full Video & Scene 1
export const FULL_BODY_SPRING = computeBodySpringArray(2500, 30);
export const SCENE1_BODY_SPRING = FULL_BODY_SPRING;

// ============================================================================
// 3. TWO-BONE ANALYTIC IK SOLVER FOR LEGS
// ============================================================================
// Solves thigh and calf rotation so the foot remains planted at world (fx, fy, fz).
// Knee flexion is strictly planar with knee pole pointing forward.

export interface TwoBoneIKSolution {
  hipPitch: number; // Pitch rotation for UpLeg (radians)
  hipYaw: number;   // Yaw rotation for UpLeg (radians)
  kneeAngle: number;// Knee flexion angle (radians, positive flex)
  anklePitch: number;// Ankle pitch to keep sole flat (radians)
}

export function solveLegIK(
  hipWorldPos: THREE.Vector3,
  footTargetWorldPos: THREE.Vector3,
  thighLength = 0.396,
  calfLength = 0.369
): TwoBoneIKSolution {
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
function seededSin(val: number, phase = 0): number {
  return Math.sin(val + phase);
}

export interface CharacterPoseData {
  hipOffset: THREE.Vector3;
  hipRotation: THREE.Euler;
  spineRotation: THREE.Euler;
  spine1Rotation: THREE.Euler;
  spine2Rotation: THREE.Euler;
  neckRotation: THREE.Euler;
  headRotation: THREE.Euler;
  leftEyeRotation: THREE.Euler;
  rightEyeRotation: THREE.Euler;
  leftArmRotation: THREE.Euler;
  leftForeArmRotation: THREE.Euler;
  leftHandRotation: THREE.Euler;
  rightArmRotation: THREE.Euler;
  rightForeArmRotation: THREE.Euler;
  rightHandRotation: THREE.Euler;
  leftKneeFlex: number;
  rightKneeFlex: number;
  heelLift: number; // Heel elevation in meters
  // Finger curl values
  fingerCurlLeft: number;
  fingerCurlRight: number;
}

// ============================================================================
// 5. MASTER POSE EVALUATOR
// ============================================================================
/**
 * Computes all bone transform offsets for the character at any frame.
 * Pure function of frame, fully deterministic.
 */
export function getProceduralPose(frame: number, fps = 30): CharacterPoseData {
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
  // C. Beat Poses & Multi-Scene Blending (S1 to S7)
  // --------------------------------------------------------------------------
  // S1: Heavy peak (frames 70 - 180)
  const heavyWeight = (() => {
    if (frame < 70) return 0;
    if (frame <= 95) return (frame - 70) / 25;
    if (frame <= 145) return 1.0;
    if (frame <= 180) return 1.0 - (frame - 145) / 35;
    return 0;
  })();

  // S1: Light peak (frames 186 - 285)
  const lightWeight = (() => {
    if (frame < 186) return 0;
    if (frame <= 210) return (frame - 186) / 24;
    if (frame <= 250) return 1.0;
    if (frame <= 285) return 1.0 - (frame - 250) / 35;
    return 0;
  })();

  const heavyHeadPitch = heavyWeight * 0.03;
  const lightHeadPitch = lightWeight * -0.02;
  const heavyEyePitch = heavyWeight * 0.05;
  const lightEyePitch = lightWeight * -0.04;

  // S1: Think pose (starts frame 293, holds through 339, blends out into S2 by frame 355)
  const thinkWeight = (() => {
    if (frame < 293) return 0;
    if (frame <= 339) {
      const p = Math.min(1, (frame - 293) / 16);
      return p < 1 ? p * p * (3 - 2 * p) : 1.0;
    }
    if (frame <= 355) {
      return 1.0 - (frame - 339) / 16;
    }
    return 0;
  })();

  const thinkProgress = frame < 293 ? 0 : Math.min(1, (frame - 293) / 16);
  const thinkArc = (frame <= 339 && thinkProgress < 1) ? Math.pow(Math.sin(thinkProgress * Math.PI), 1.5) : 0;

  // S2: Explaining Gesture (frames 339 - 594)
  const explainWeight = (() => {
    if (frame < 339 || frame > 600) return 0;
    if (frame <= 355) return (frame - 339) / 16;
    if (frame <= 585) return 1.0;
    return 1.0 - (frame - 585) / 15;
  })();

  // S3: Pointing Down at Floor (frames 660 - 890, cue 8 "লিফটের মেঝে")
  const pointDownWeight = (() => {
    if (frame < 660 || frame > 890) return 0;
    if (frame <= 680) return (frame - 660) / 20;
    if (frame <= 865) return 1.0;
    return 1.0 - (frame - 865) / 25;
  })();

  // S6: Idea Finger / Confident Key Rule (frames 1900 - 2178)
  const ideaWeight = (() => {
    if (frame < 1900 || frame > 2185) return 0;
    if (frame <= 1920) return (frame - 1900) / 20;
    if (frame <= 2165) return 1.0;
    return 1.0 - (frame - 2165) / 20;
  })();

  // S7: Unsure Shrug / Free Fall Question (frames 2195 to end)
  const unsureWeight = (() => {
    if (frame < 2195) return 0;
    if (frame <= 2220) return (frame - 2195) / 25;
    return 1.0;
  })();

  // Base Natural Stance:
  // Arms hang relaxed along torso with slight elbow bend and natural hand relaxation
  const baseArmPitch = (78 + armSag - armFloat) * (Math.PI / 180);
  const baseElbowFlex = (12 + armLagPhase) * (Math.PI / 180);

  // Cadence speech micro-movements for S2 explaining gesture
  const speechBeat = Math.sin(t * 3.8) * 0.04 * explainWeight;

  // Head Pitch & Yaw adjustments across scenes
  const headPitchNet =
    headPitch +
    headStabilizePitch * 0.6 +
    heavyHeadPitch +
    lightHeadPitch +
    thinkWeight * 0.04 +
    pointDownWeight * 0.28 +
    unsureWeight * -0.05;

  const headYawNet =
    headYaw +
    thinkWeight * 0.06 +
    ideaWeight * -0.05 +
    unsureWeight * 0.06;

  const headRollNet =
    thinkWeight * -0.09 +
    ideaWeight * 0.04 +
    unsureWeight * -0.08;

  // Eye gaze across scenes
  const eyePitchNet =
    eyePitch +
    heavyEyePitch +
    lightEyePitch +
    pointDownWeight * 0.32 +
    unsureWeight * -0.15; // Glancing up at ceiling/cables in S7

  // Left Arm blending
  let leftArmRot = new THREE.Euler(
    THREE.MathUtils.lerp(baseArmPitch, 74 * (Math.PI / 180), thinkWeight),
    THREE.MathUtils.lerp(4 * (Math.PI / 180), 8 * (Math.PI / 180), thinkWeight),
    THREE.MathUtils.lerp(-10 * (Math.PI / 180), -12 * (Math.PI / 180), thinkWeight)
  );
  let leftForeArmRot = new THREE.Euler(
    0,
    0,
    THREE.MathUtils.lerp(baseElbowFlex, 18 * (Math.PI / 180), thinkWeight)
  );

  // Left arm on hip for S6 idea pose
  if (ideaWeight > 0.001) {
    leftArmRot = new THREE.Euler(
      THREE.MathUtils.lerp(leftArmRot.x, 32 * (Math.PI / 180), ideaWeight),
      THREE.MathUtils.lerp(leftArmRot.y, 24 * (Math.PI / 180), ideaWeight),
      THREE.MathUtils.lerp(leftArmRot.z, 28 * (Math.PI / 180), ideaWeight)
    );
    leftForeArmRot = new THREE.Euler(
      0,
      0,
      THREE.MathUtils.lerp(leftForeArmRot.z, 75 * (Math.PI / 180), ideaWeight)
    );
  }

  // Right Arm blending across S1-S7
  let rightArmRot = new THREE.Euler(
    THREE.MathUtils.lerp(baseArmPitch, -10 * (Math.PI / 180), thinkWeight) + thinkArc * (-12 * (Math.PI / 180)),
    THREE.MathUtils.lerp(-4 * (Math.PI / 180), 30 * (Math.PI / 180), thinkWeight) + thinkArc * (38.5 * (Math.PI / 180)),
    THREE.MathUtils.lerp(10 * (Math.PI / 180), -70 * (Math.PI / 180), thinkWeight) + thinkArc * (-20 * (Math.PI / 180))
  );

  let rightForeArmRot = new THREE.Euler(
    THREE.MathUtils.lerp(0, 20 * (Math.PI / 180), thinkWeight),
    THREE.MathUtils.lerp(0, 40 * (Math.PI / 180), thinkWeight),
    THREE.MathUtils.lerp(-baseElbowFlex, -140 * (Math.PI / 180), thinkWeight) + thinkArc * (43 * (Math.PI / 180))
  );

  let rightHandRot = new THREE.Euler(
    THREE.MathUtils.lerp(0, 10 * (Math.PI / 180), thinkWeight) + thinkArc * (-15 * (Math.PI / 180)),
    THREE.MathUtils.lerp(0, -20 * (Math.PI / 180), thinkWeight),
    THREE.MathUtils.lerp(0, -10 * (Math.PI / 180), thinkWeight)
  );

  // S2 Explain gesture blending
  if (explainWeight > 0.001) {
    rightArmRot = new THREE.Euler(
      THREE.MathUtils.lerp(rightArmRot.x, (42 + speechBeat * 40) * (Math.PI / 180), explainWeight),
      THREE.MathUtils.lerp(rightArmRot.y, -18 * (Math.PI / 180), explainWeight),
      THREE.MathUtils.lerp(rightArmRot.z, 22 * (Math.PI / 180), explainWeight)
    );
    rightForeArmRot = new THREE.Euler(
      THREE.MathUtils.lerp(rightForeArmRot.x, -15 * (Math.PI / 180), explainWeight),
      THREE.MathUtils.lerp(rightForeArmRot.y, 25 * (Math.PI / 180), explainWeight),
      THREE.MathUtils.lerp(rightForeArmRot.z, (-75 + speechBeat * 60) * (Math.PI / 180), explainWeight)
    );
    rightHandRot = new THREE.Euler(
      THREE.MathUtils.lerp(rightHandRot.x, 20 * (Math.PI / 180), explainWeight),
      THREE.MathUtils.lerp(rightHandRot.y, -15 * (Math.PI / 180), explainWeight),
      THREE.MathUtils.lerp(rightHandRot.z, 10 * (Math.PI / 180), explainWeight)
    );
  }

  // S3 Point Down gesture blending
  if (pointDownWeight > 0.001) {
    rightArmRot = new THREE.Euler(
      THREE.MathUtils.lerp(rightArmRot.x, 62 * (Math.PI / 180), pointDownWeight),
      THREE.MathUtils.lerp(rightArmRot.y, -12 * (Math.PI / 180), pointDownWeight),
      THREE.MathUtils.lerp(rightArmRot.z, 8 * (Math.PI / 180), pointDownWeight)
    );
    rightForeArmRot = new THREE.Euler(
      0,
      0,
      THREE.MathUtils.lerp(rightForeArmRot.z, -32 * (Math.PI / 180), pointDownWeight)
    );
    rightHandRot = new THREE.Euler(
      THREE.MathUtils.lerp(rightHandRot.x, 15 * (Math.PI / 180), pointDownWeight),
      0,
      0
    );
  }

  // S6 Idea Finger gesture blending (pointing up)
  if (ideaWeight > 0.001) {
    rightArmRot = new THREE.Euler(
      THREE.MathUtils.lerp(rightArmRot.x, 12 * (Math.PI / 180), ideaWeight),
      THREE.MathUtils.lerp(rightArmRot.y, -22 * (Math.PI / 180), ideaWeight),
      THREE.MathUtils.lerp(rightArmRot.z, -35 * (Math.PI / 180), ideaWeight)
    );
    rightForeArmRot = new THREE.Euler(
      THREE.MathUtils.lerp(rightForeArmRot.x, 25 * (Math.PI / 180), ideaWeight),
      THREE.MathUtils.lerp(rightForeArmRot.y, -10 * (Math.PI / 180), ideaWeight),
      THREE.MathUtils.lerp(rightForeArmRot.z, -115 * (Math.PI / 180), ideaWeight)
    );
    rightHandRot = new THREE.Euler(
      THREE.MathUtils.lerp(rightHandRot.x, -12 * (Math.PI / 180), ideaWeight),
      0,
      THREE.MathUtils.lerp(rightHandRot.z, 15 * (Math.PI / 180), ideaWeight)
    );
  }

  // S7 Unsure / Shrug gesture blending (hand to head + shoulder shrug)
  if (unsureWeight > 0.001) {
    rightArmRot = new THREE.Euler(
      THREE.MathUtils.lerp(rightArmRot.x, -10 * (Math.PI / 180), unsureWeight),
      THREE.MathUtils.lerp(rightArmRot.y, 30 * (Math.PI / 180), unsureWeight),
      THREE.MathUtils.lerp(rightArmRot.z, -70 * (Math.PI / 180), unsureWeight)
    );
    rightForeArmRot = new THREE.Euler(
      THREE.MathUtils.lerp(rightForeArmRot.x, 20 * (Math.PI / 180), unsureWeight),
      THREE.MathUtils.lerp(rightForeArmRot.y, 40 * (Math.PI / 180), unsureWeight),
      THREE.MathUtils.lerp(rightForeArmRot.z, -140 * (Math.PI / 180), unsureWeight)
    );
    rightHandRot = new THREE.Euler(
      THREE.MathUtils.lerp(rightHandRot.x, 10 * (Math.PI / 180), unsureWeight),
      THREE.MathUtils.lerp(rightHandRot.y, -20 * (Math.PI / 180), unsureWeight),
      THREE.MathUtils.lerp(rightHandRot.z, -10 * (Math.PI / 180), unsureWeight)
    );
  }

  return {
    hipOffset: new THREE.Vector3(swayX, -hipDrop, hipZ),
    hipRotation: new THREE.Euler(0, 0, swayRoll),
    spineRotation: new THREE.Euler(spinePitch, 0, spineCounterRoll),
    spine1Rotation: new THREE.Euler(breathPitch * 0.5, 0, 0),
    spine2Rotation: new THREE.Euler(breathPitch * 0.5, 0, 0),
    neckRotation: new THREE.Euler(headStabilizePitch * 0.4, 0, 0),
    headRotation: new THREE.Euler(headPitchNet, headYawNet, headRollNet),
    leftEyeRotation: new THREE.Euler(eyePitchNet, eyeYaw, 0),
    rightEyeRotation: new THREE.Euler(eyePitchNet, eyeYaw, 0),
    leftArmRotation: leftArmRot,
    leftForeArmRotation: leftForeArmRot,
    leftHandRotation: new THREE.Euler(0, 0, 0),
    rightArmRotation: rightArmRot,
    rightForeArmRotation: rightForeArmRot,
    rightHandRotation: rightHandRot,
    leftKneeFlex: kneeFlexAdd,
    rightKneeFlex: kneeFlexAdd,
    heelLift,
    fingerCurlLeft: THREE.MathUtils.lerp(0.35, ideaWeight > 0 ? 0.65 : 0.40, Math.max(thinkWeight, ideaWeight)),
    fingerCurlRight: THREE.MathUtils.lerp(
      0.35,
      ideaWeight > 0 ? 0.25 : (unsureWeight > 0 ? 0.50 : 0.45),
      Math.max(thinkWeight, explainWeight, ideaWeight, unsureWeight)
    ),
  };
}
