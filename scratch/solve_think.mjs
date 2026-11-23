global.self = global;
import fs from 'fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const buf = fs.readFileSync('public/munem_3d_ready_player_me.glb');
const loader = new GLTFLoader();
loader.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), '', (gltf) => {
  let skinnedMesh = null;
  gltf.scene.traverse(obj => {
    if (obj.isSkinnedMesh) skinnedMesh = obj;
  });

  const bones = new Map();
  skinnedMesh.skeleton.bones.forEach(b => {
    bones.set(b.name.replace(/_\d+$/, ''), b);
  });

  const head = bones.get('Head');
  const rightArm = bones.get('RightArm');
  const rightForeArm = bones.get('RightForeArm');
  const rightHand = bones.get('RightHand');

  gltf.scene.updateMatrixWorld(true);
  const chinPos = new THREE.Vector3(4, 153, 10); // Target near chin (slightly to character's right, forward)

  const restRightArm = rightArm.quaternion.clone();
  const restRightForeArm = rightForeArm.quaternion.clone();

  // Test grid of rotations
  let bestDist = 999;
  let bestAngles = null;

  for (let ax = -40; ax <= 60; ax += 10) {
    for (let ay = -60; ay <= 60; ay += 10) {
      for (let az = -60; az <= 60; az += 10) {
        for (let elbow = -135; elbow <= -85; elbow += 10) {
          const qA = new THREE.Quaternion().setFromEuler(new THREE.Euler(
            THREE.MathUtils.degToRad(ax),
            THREE.MathUtils.degToRad(ay),
            THREE.MathUtils.degToRad(az)
          ));
          rightArm.quaternion.copy(restRightArm).multiply(qA);

          const qF = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), THREE.MathUtils.degToRad(elbow));
          rightForeArm.quaternion.copy(restRightForeArm).multiply(qF);

          gltf.scene.updateMatrixWorld(true);
          const handPos = new THREE.Vector3();
          rightHand.getWorldPosition(handPos);

          const d = handPos.distanceTo(chinPos);
          if (d < bestDist) {
            bestDist = d;
            bestAngles = { ax, ay, az, elbow, handPos: handPos.toArray().map(v=>v.toFixed(1)) };
          }
        }
      }
    }
  }

  console.log('Best match:', bestDist.toFixed(1), bestAngles);
});
