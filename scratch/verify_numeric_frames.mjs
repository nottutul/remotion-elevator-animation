global.self = global;
import fs from 'fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { getProceduralPose } from './motion.mjs';

const buf = fs.readFileSync('public/munem_3d_ready_player_me.glb');
const loader = new GLTFLoader();
loader.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), '', (gltf) => {
  let skinnedMesh = null;
  gltf.scene.traverse(obj => {
    if (obj.isSkinnedMesh) skinnedMesh = obj;
  });

  const bones = new Map();
  const rest = new Map();
  skinnedMesh.skeleton.bones.forEach(b => {
    const cleanName = b.name.replace(/_\d+$/, '');
    bones.set(cleanName, b);
    rest.set(cleanName, {
      position: b.position.clone(),
      quaternion: b.quaternion.clone(),
      scale: b.scale.clone(),
    });
  });

  const sampleFrames = [
    0, 15, 30, 60, 75, 90, 105, 120, 150, 180, 195, 210, 225, 240, 260, 280, 295, 310, 325, 338
  ];

  console.log('Frame | Hip Drop (cm) | Left Foot Y (m) | Right Foot Y (m) | Max Knee (deg) | Foot XZ Drift (mm)');
  console.log('-------------------------------------------------------------------------------------------------');

  let maxKneeAngleDeg = 0;
  let maxHipDropCm = 0;
  let minFootY = 999;
  let maxFootY = -999;
  let maxFootDrift = 0;

  const baselineLeftFootPos = new THREE.Vector3(10.606, 13.490, -1.279);

  sampleFrames.forEach(f => {
    const pose = getProceduralPose(f, 30);

    // Reset bones
    bones.forEach((b, name) => {
      const r = rest.get(name);
      b.position.copy(r.position);
      b.quaternion.copy(r.quaternion);
      b.scale.copy(r.scale);
    });

    // Pose Hips in meters
    const hips = bones.get('Hips');
    const restHips = rest.get('Hips');
    hips.position.x = restHips.position.x + pose.hipOffset.x;
    hips.position.y = restHips.position.y + pose.hipOffset.y;
    hips.position.z = restHips.position.z + pose.hipOffset.z;
    hips.quaternion.copy(restHips.quaternion).multiply(new THREE.Quaternion().setFromEuler(pose.hipRotation));

    // Apply leg IK
    const applyIK = (side) => {
      const upLeg = bones.get(`${side}UpLeg`);
      const leg = bones.get(`${side}Leg`);
      const foot = bones.get(`${side}Foot`);
      const restUpLeg = rest.get(`${side}UpLeg`);
      const restLeg = rest.get(`${side}Leg`);
      const restFoot = rest.get(`${side}Foot`);

      const dropM = Math.max(0, -pose.hipOffset.y);
      const cosTheta = Math.max(0.65, Math.min(1.0, 1 - dropM / 0.765));
      const theta = Math.acos(cosTheta);
      const kneeFlex = theta * 2.0;

      const heelLiftPitch = pose.heelLift > 0.005 ? pose.heelLift * 1.5 : 0;

      const qThigh = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(theta, 0, side === 'Left' ? -0.05 : 0.05)
      );
      upLeg.quaternion.copy(restUpLeg.quaternion).multiply(qThigh);

      const qKnee = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(1, 0, 0),
        -kneeFlex
      );
      leg.quaternion.copy(restLeg.quaternion).multiply(qKnee);

      const qAnkle = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(theta + heelLiftPitch, side === 'Left' ? -0.07 : 0.07, 0)
      );
      foot.quaternion.copy(restFoot.quaternion).multiply(qAnkle);

      return kneeFlex * (180 / Math.PI);
    };

    const kneeL = applyIK('Left');
    const kneeR = applyIK('Right');
    const frameMaxKnee = Math.max(kneeL, kneeR);
    if (frameMaxKnee > maxKneeAngleDeg) maxKneeAngleDeg = frameMaxKnee;

    gltf.scene.updateMatrixWorld(true);

    const leftFoot = bones.get('LeftFoot');
    const rightFoot = bones.get('RightFoot');
    const lPos = new THREE.Vector3();
    const rPos = new THREE.Vector3();
    leftFoot.getWorldPosition(lPos);
    rightFoot.getWorldPosition(rPos);

    // Floor is at y = 13.49 in armature coordinates (y = 0 in world)
    const lYm = (lPos.y - 13.490) / 100;
    const rYm = (rPos.y - 13.490) / 100;

    const hipDropCm = -(pose.hipOffset.y * 100);
    if (hipDropCm > maxHipDropCm) maxHipDropCm = hipDropCm;

    if (lYm < minFootY) minFootY = lYm;
    if (lYm > maxFootY) maxFootY = lYm;

    const driftMm = Math.sqrt(Math.pow(lPos.x - baselineLeftFootPos.x, 2) + Math.pow(lPos.z - baselineLeftFootPos.z, 2)) * 10;
    if (driftMm > maxFootDrift) maxFootDrift = driftMm;

    console.log(
      `${String(f).padStart(5)} | ` +
      `${hipDropCm.toFixed(2).padStart(13)} | ` +
      `${lYm.toFixed(4).padStart(15)} | ` +
      `${rYm.toFixed(4).padStart(16)} | ` +
      `${frameMaxKnee.toFixed(1).padStart(14)} | ` +
      `${driftMm.toFixed(2).padStart(18)}`
    );
  });

  console.log('-------------------------------------------------------------------------------------------------');
  console.log(`Summary:`);
  console.log(`  Max Hip Drop: ${maxHipDropCm.toFixed(2)} cm`);
  console.log(`  Lowest Foot Y: ${minFootY.toFixed(4)} m (floor is at 0.0000 m)`);
  console.log(`  Max Foot Y (heel lift during light beat): ${maxFootY.toFixed(4)} m`);
  console.log(`  Max Knee Flex Angle: ${maxKneeAngleDeg.toFixed(1)} deg`);
  console.log(`  Max Foot Grounded Drift: ${(maxFootDrift / 10).toFixed(2)} cm (${maxFootDrift.toFixed(1)} mm)`);
});
