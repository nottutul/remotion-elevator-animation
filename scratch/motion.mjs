import * as THREE from "three";

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

export function getLiftMotion(frame, fps = 30) {
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

export function computeBodySpringArray(totalFrames = 340, fps = 30) {
  const compressions = new Float32Array(totalFrames);

  const fn = 2.4;
  const omega = 2 * Math.PI * fn;
  const zeta = 0.42;
  const kDrive = 3.6;
  const exaggeration = 1.30;

  let c = 0;
  let cVel = 0;

  const subSteps = 8;
  const dt = (1 / fps) / subSteps;

  for (let f = 0; f < totalFrames; f++) {
    const futureState = getLiftMotion(f + 5, fps);
    const currentState = getLiftMotion(f, fps);
    const anticipation = (futureState.a - currentState.a) * -0.0015;

    for (let step = 0; step < subSteps; step++) {
      const state = getLiftMotion(f + step / subSteps, fps);
      const drive = state.a * kDrive * exaggeration;
      const accSpring = drive - 2 * zeta * omega * cVel - omega * omega * c;
      cVel += accSpring * dt;
      c += cVel * dt;
    }

    compressions[f] = c + anticipation;
  }

  return compressions;
}

export const SCENE1_BODY_SPRING = computeBodySpringArray(345, 30);

export function solveLegIK(hipWorldPos, footTargetWorldPos, thighLength = 0.396, calfLength = 0.369) {
  const dx = footTargetWorldPos.x - hipWorldPos.x;
  const dy = footTargetWorldPos.y - hipWorldPos.y;
  const dz = footTargetWorldPos.z - hipWorldPos.z;

  const targetDist = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const maxReach = (thighLength + calfLength) * 0.999;
  const minReach = Math.abs(thighLength - calfLength) * 1.05;
  const d = Math.max(minReach, Math.min(maxReach, targetDist));

  const cosKnee = (thighLength * thighLength + calfLength * calfLength - d * d) / (2 * thighLength * calfLength);
  const clampedCosKnee = Math.max(-1, Math.min(1, cosKnee));
  const kneeFlex = Math.PI - Math.acos(clampedCosKnee);

  const cosHip = (thighLength * thighLength + d * d - calfLength * calfLength) / (2 * thighLength * d);
  const clampedCosHip = Math.max(-1, Math.min(1, cosHip));
  const alphaHip = Math.acos(clampedCosHip);

  const pitchToTarget = Math.atan2(dz, -dy);
  const hipPitch = pitchToTarget + alphaHip;
  const hipYaw = Math.atan2(dx, -dy);
  const anklePitch = -(hipPitch - kneeFlex);

  return { hipPitch, hipYaw, kneeAngle: kneeFlex, anklePitch };
}

function seededSin(val, phase = 0) {
  return Math.sin(val + phase);
}

export function getProceduralPose(frame, fps = 30) {
  const t = frame / fps;
  const compression = SCENE1_BODY_SPRING[Math.min(frame, SCENE1_BODY_SPRING.length - 1)] || 0;

  const breathPhase = t * ((2 * Math.PI) / 3.8);
  const breath = (Math.sin(breathPhase) * 0.5 + 0.5);
  const breathPitch = (breath * 1.0) * (Math.PI / 180);

  const swayPhase = t * ((2 * Math.PI) / 6.2);
  const swayX = Math.sin(swayPhase) * 0.012;
  const swayRoll = Math.sin(swayPhase) * (0.8 * (Math.PI / 180));
  const spineCounterRoll = -swayRoll * 0.75;

  const headYaw = (seededSin(t * 0.8, 0.4) * 0.6 + seededSin(t * 1.7, 1.2) * 0.3) * (Math.PI / 180);
  const headPitch = (seededSin(t * 0.6, 0.8) * 0.5 + seededSin(t * 1.3, 2.5) * 0.3) * (Math.PI / 180);
  const eyeYaw = (seededSin(t * 2.2, 0.1) * 1.8 + (Math.sin(t * 0.4) > 0.8 ? 2.5 : 0)) * (Math.PI / 180);
  const eyePitch = (seededSin(t * 1.8, 0.5) * 1.2) * (Math.PI / 180);

  const hipDrop = Math.max(-0.025, Math.min(0.06, compression));
  const hipZ = Math.max(0, compression) * 0.35;
  const kneeFlexAdd = Math.max(0, compression) * 14.0 * (Math.PI / 180);
  const spinePitch = Math.max(0, compression) * 3.5 * (Math.PI / 180);
  const headStabilizePitch = -spinePitch * 0.65;

  const armLagPhase = Math.sin(frame * 0.18) * Math.abs(compression) * 2.0 * (Math.PI / 180);
  const armSag = Math.max(0, compression) * 2.5 * (Math.PI / 180);
  const armFloat = Math.max(0, -compression) * 3.2 * (Math.PI / 180);
  const heelLift = Math.max(0, -compression) * 0.8;

  const heavyWeight = (() => {
    if (frame < 70) return 0;
    if (frame <= 95) return (frame - 70) / 25;
    if (frame <= 145) return 1.0;
    if (frame <= 180) return 1.0 - (frame - 145) / 35;
    return 0;
  })();

  const lightWeight = (() => {
    if (frame < 186) return 0;
    if (frame <= 210) return (frame - 186) / 24;
    if (frame <= 250) return 1.0;
    if (frame <= 285) return 1.0 - (frame - 250) / 35;
    return 0;
  })();

  const thinkWeight = (() => {
    if (frame < 293) return 0;
    const progress = Math.min(1, (frame - 293) / 16);
    return progress < 1 ? progress * progress * (3 - 2 * progress) : 1.0;
  })();

  const baseArmPitch = (73 + armSag - armFloat) * (Math.PI / 180);
  const baseElbowFlex = (16 + armLagPhase) * (Math.PI / 180);

  const heavyHeadPitch = heavyWeight * 0.06;
  const heavyEyePitch = heavyWeight * -0.08;

  const lightHeadPitch = lightWeight * -0.05;
  const lightEyePitch = lightWeight * 0.07;

  const thinkHeadRoll = thinkWeight * (-0.11);
  const thinkHeadYaw = thinkWeight * (0.05);

  return {
    hipOffset: new THREE.Vector3(swayX, -hipDrop, hipZ),
    hipRotation: new THREE.Euler(0, 0, swayRoll),
    spineRotation: new THREE.Euler(spinePitch, 0, spineCounterRoll),
    spine1Rotation: new THREE.Euler(breathPitch * 0.5, 0, 0),
    spine2Rotation: new THREE.Euler(breathPitch * 0.5, 0, 0),
    neckRotation: new THREE.Euler(headStabilizePitch * 0.4, 0, 0),
    headRotation: new THREE.Euler(
      headPitch + headStabilizePitch * 0.6 + heavyHeadPitch + lightHeadPitch,
      headYaw + thinkHeadYaw,
      thinkHeadRoll
    ),
    leftEyeRotation: new THREE.Euler(eyePitch + heavyEyePitch + lightEyePitch, eyeYaw, 0),
    rightEyeRotation: new THREE.Euler(eyePitch + heavyEyePitch + lightEyePitch, eyeYaw, 0),
    leftArmRotation: new THREE.Euler(
      THREE.MathUtils.lerp(baseArmPitch, 48 * (Math.PI / 180), thinkWeight),
      THREE.MathUtils.lerp(6 * (Math.PI / 180), 28 * (Math.PI / 180), thinkWeight),
      THREE.MathUtils.lerp(0, 15 * (Math.PI / 180), thinkWeight)
    ),
    leftForeArmRotation: new THREE.Euler(
      0,
      0,
      THREE.MathUtils.lerp(baseElbowFlex, 88 * (Math.PI / 180), thinkWeight)
    ),
    leftHandRotation: new THREE.Euler(0, 0, 0),
    rightArmRotation: new THREE.Euler(
      THREE.MathUtils.lerp(baseArmPitch, -40 * (Math.PI / 180), thinkWeight),
      THREE.MathUtils.lerp(-6 * (Math.PI / 180), 50 * (Math.PI / 180), thinkWeight),
      THREE.MathUtils.lerp(0, -60 * (Math.PI / 180), thinkWeight)
    ),
    rightForeArmRotation: new THREE.Euler(
      0,
      0,
      THREE.MathUtils.lerp(-baseElbowFlex, -125 * (Math.PI / 180), thinkWeight)
    ),
    rightHandRotation: new THREE.Euler(
      THREE.MathUtils.lerp(0, 15 * (Math.PI / 180), thinkWeight),
      0,
      THREE.MathUtils.lerp(0, -10 * (Math.PI / 180), thinkWeight)
    ),
    leftKneeFlex: kneeFlexAdd,
    rightKneeFlex: kneeFlexAdd,
    heelLift,
    fingerCurlLeft: THREE.MathUtils.lerp(0.35, 0.65, thinkWeight),
    fingerCurlRight: THREE.MathUtils.lerp(0.35, 0.75, thinkWeight),
  };
}
