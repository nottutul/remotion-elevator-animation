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
  const headPos = new THREE.Vector3();
  head.getWorldPosition(headPos);
  console.log('Head pos:', headPos.toArray().map(v=>v.toFixed(1)));

  // Try think pose on right arm
  const qArm = new THREE.Quaternion().setFromEuler(new THREE.Euler(THREE.MathUtils.degToRad(30), THREE.MathUtils.degToRad(-30), THREE.MathUtils.degToRad(40)));
  rightArm.quaternion.multiply(qArm);

  const qFore = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, THREE.MathUtils.degToRad(-115)));
  rightForeArm.quaternion.multiply(qFore);

  gltf.scene.updateMatrixWorld(true);
  const handPos = new THREE.Vector3();
  rightHand.getWorldPosition(handPos);
  console.log('Think RightHand pos:', handPos.toArray().map(v=>v.toFixed(1)));
  console.log('Distance from head/chin:', handPos.distanceTo(headPos).toFixed(1));
});
