global.self = global;
import fs from 'fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { solveLegIK } from './motion.mjs';

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
    });
  });

  const hips = bones.get('Hips');
  const restHips = rest.get('Hips');
  const upLeg = bones.get('LeftUpLeg');
  const leg = bones.get('LeftLeg');
  const foot = bones.get('LeftFoot');
  const restUpLeg = rest.get('LeftUpLeg');
  const restLeg = rest.get('LeftLeg');
  const restFoot = rest.get('LeftFoot');

  // Test drops from 0 to 5 cm
  [0, 1, 2, 3, 4, 5].forEach(dropCm => {
    hips.position.y = restHips.position.y - dropCm;
    hips.position.z = restHips.position.z + dropCm * 0.35;

    // Hip world pos
    gltf.scene.updateMatrixWorld(true);
    const hipWorld = new THREE.Vector3();
    upLeg.getWorldPosition(hipWorld);

    const targetFootWorld = new THREE.Vector3(10.606, 13.490, -1.279);
    const ik = solveLegIK(hipWorld, targetFootWorld, 39.6, 36.9);

    upLeg.quaternion.copy(restUpLeg.quaternion).multiply(
      new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), ik.hipPitch)
    );
    leg.quaternion.copy(restLeg.quaternion).multiply(
      new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -ik.kneeAngle)
    );
    foot.quaternion.copy(restFoot.quaternion).multiply(
      new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), ik.anklePitch)
    );

    gltf.scene.updateMatrixWorld(true);
    const footPos = new THREE.Vector3();
    foot.getWorldPosition(footPos);

    const dist = footPos.distanceTo(targetFootWorld);
    console.log(`Drop ${dropCm}cm: Knee=${(ik.kneeAngle * 180 / Math.PI).toFixed(1)}deg, FootY=${footPos.y.toFixed(2)}, Drift=${dist.toFixed(3)}cm`);
  });
});
