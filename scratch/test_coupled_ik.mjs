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

  const hips = bones.get('Hips');
  const restHips = hips.position.clone();
  const upLeg = bones.get('LeftUpLeg');
  const leg = bones.get('LeftLeg');
  const foot = bones.get('LeftFoot');

  const restUpLeg = upLeg.quaternion.clone();
  const restLeg = leg.quaternion.clone();
  const restFoot = foot.quaternion.clone();

  console.log('Drop (cm) | Foot X (cm) | Foot Y (cm) | Foot Z (cm) | Y Error (mm) | XZ Drift (mm)');
  console.log('-------------------------------------------------------------------------------');

  [0, 1, 2, 3, 4, 5, 6].forEach(dropCm => {
    // Drop hips
    hips.position.y = restHips.y - dropCm;
    hips.position.z = restHips.z + dropCm * 0.15; // slight backward hip shift

    // Closed-form analytic leg angle
    // L1 = 39.6cm, L2 = 36.9cm, total leg = 76.5cm
    // drop = L1*(1 - cos(theta)) + L2*(1 - cos(2*theta - theta))
    const thetaDeg = dropCm * 3.75;
    const kneeDeg = thetaDeg * 2.0;

    upLeg.quaternion.copy(restUpLeg).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(thetaDeg)));
    leg.quaternion.copy(restLeg).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(-kneeDeg)));
    foot.quaternion.copy(restFoot).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(thetaDeg)));

    gltf.scene.updateMatrixWorld(true);
    const footPos = new THREE.Vector3();
    foot.getWorldPosition(footPos);

    const yErrMm = (footPos.y - 13.49) * 10;
    const xzDriftMm = Math.sqrt(Math.pow(footPos.x - 10.61, 2) + Math.pow(footPos.z - (-1.28), 2)) * 10;

    console.log(
      `${dropCm.toFixed(1).padStart(9)} | ` +
      `${footPos.x.toFixed(2).padStart(11)} | ` +
      `${footPos.y.toFixed(2).padStart(11)} | ` +
      `${footPos.z.toFixed(2).padStart(11)} | ` +
      `${yErrMm.toFixed(2).padStart(12)} | ` +
      `${xzDriftMm.toFixed(2).padStart(13)}`
    );
  });
});
