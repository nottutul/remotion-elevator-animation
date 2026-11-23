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

  const rightArm = bones.get('RightArm');
  const rightForeArm = bones.get('RightForeArm');
  const rightHand = bones.get('RightHand');

  // Store rest quats
  const restLeftArm = leftArm.quaternion.clone();
  const restRightArm = rightArm.quaternion.clone();

  // Test rotating around Z axis to bring arm down
  // Let's test rotations around local X, Y, Z
  const testRot = (bone, restQuat, axis, angleDeg) => {
    const q = new THREE.Quaternion().setFromAxisAngle(axis, THREE.MathUtils.degToRad(angleDeg));
    bone.quaternion.copy(restQuat).multiply(q);
    gltf.scene.updateMatrixWorld(true);
    const handPos = new THREE.Vector3();
    (bone === leftArm ? leftHand : rightHand).getWorldPosition(handPos);
    return handPos;
  };

  console.log('Rest LeftHand:', testRot(leftArm, restLeftArm, new THREE.Vector3(1,0,0), 0).toArray().map(v=>v.toFixed(1)));
  console.log('Rot Z +75:', testRot(leftArm, restLeftArm, new THREE.Vector3(0,0,1), 75).toArray().map(v=>v.toFixed(1)));
  console.log('Rot Z -75:', testRot(leftArm, restLeftArm, new THREE.Vector3(0,0,1), -75).toArray().map(v=>v.toFixed(1)));
  console.log('Rot X +75:', testRot(leftArm, restLeftArm, new THREE.Vector3(1,0,0), 75).toArray().map(v=>v.toFixed(1)));
  console.log('Rot X -75:', testRot(leftArm, restLeftArm, new THREE.Vector3(1,0,0), -75).toArray().map(v=>v.toFixed(1)));
  console.log('Rot Y +75:', testRot(leftArm, restLeftArm, new THREE.Vector3(0,1,0), 75).toArray().map(v=>v.toFixed(1)));
  console.log('Rot Y -75:', testRot(leftArm, restLeftArm, new THREE.Vector3(0,1,0), -75).toArray().map(v=>v.toFixed(1)));
});
