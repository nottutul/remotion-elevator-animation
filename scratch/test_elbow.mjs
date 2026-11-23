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

  const leftArm = bones.get('LeftArm');
  const leftForeArm = bones.get('LeftForeArm');
  const leftHand = bones.get('LeftHand');

  // Rotate arm down first
  const qArm = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), THREE.MathUtils.degToRad(75));
  leftArm.quaternion.multiply(qArm);

  const restForeArm = leftForeArm.quaternion.clone();

  const testFore = (axis, angleDeg) => {
    const q = new THREE.Quaternion().setFromAxisAngle(axis, THREE.MathUtils.degToRad(angleDeg));
    leftForeArm.quaternion.copy(restForeArm).multiply(q);
    gltf.scene.updateMatrixWorld(true);
    const handPos = new THREE.Vector3();
    leftHand.getWorldPosition(handPos);
    return handPos;
  };

  console.log('Rest elbow:', testFore(new THREE.Vector3(1,0,0), 0).toArray().map(v=>v.toFixed(1)));
  console.log('Elbow X +20:', testFore(new THREE.Vector3(1,0,0), 20).toArray().map(v=>v.toFixed(1)));
  console.log('Elbow X -20:', testFore(new THREE.Vector3(1,0,0), -20).toArray().map(v=>v.toFixed(1)));
  console.log('Elbow Y +20:', testFore(new THREE.Vector3(0,1,0), 20).toArray().map(v=>v.toFixed(1)));
  console.log('Elbow Y -20:', testFore(new THREE.Vector3(0,1,0), -20).toArray().map(v=>v.toFixed(1)));
  console.log('Elbow Z +20:', testFore(new THREE.Vector3(0,0,1), 20).toArray().map(v=>v.toFixed(1)));
  console.log('Elbow Z -20:', testFore(new THREE.Vector3(0,0,1), -20).toArray().map(v=>v.toFixed(1)));
});
