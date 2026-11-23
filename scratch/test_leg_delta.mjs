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

  const upLeg = bones.get('LeftUpLeg');
  const leg = bones.get('LeftLeg');
  const foot = bones.get('LeftFoot');

  const restUpLeg = upLeg.quaternion.clone();
  const restLeg = leg.quaternion.clone();
  const restFoot = foot.quaternion.clone();

  const testDelta = (thighAngleDeg, kneeAngleDeg) => {
    upLeg.quaternion.copy(restUpLeg).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(thighAngleDeg)));
    leg.quaternion.copy(restLeg).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(kneeAngleDeg)));

    // Let's also adjust foot angle
    foot.quaternion.copy(restFoot).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(-(thighAngleDeg + kneeAngleDeg))));

    gltf.scene.updateMatrixWorld(true);
    const footPos = new THREE.Vector3();
    foot.getWorldPosition(footPos);
    return footPos;
  };

  console.log('Rest foot:', testDelta(0, 0).toArray().map(v=>v.toFixed(2)));
  console.log('Thigh +10, Knee -20:', testDelta(10, -20).toArray().map(v=>v.toFixed(2)));
  console.log('Thigh -10, Knee +20:', testDelta(-10, 20).toArray().map(v=>v.toFixed(2)));
  console.log('Thigh +15, Knee -30:', testDelta(15, -30).toArray().map(v=>v.toFixed(2)));
  console.log('Thigh +20, Knee -40:', testDelta(20, -40).toArray().map(v=>v.toFixed(2)));
});
