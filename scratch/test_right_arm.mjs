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

  const rightArm = bones.get('RightArm');
  const rightHand = bones.get('RightHand');
  const restRightArm = rightArm.quaternion.clone();

  const testRot = (axis, angleDeg) => {
    const q = new THREE.Quaternion().setFromAxisAngle(axis, THREE.MathUtils.degToRad(angleDeg));
    rightArm.quaternion.copy(restRightArm).multiply(q);
    gltf.scene.updateMatrixWorld(true);
    const handPos = new THREE.Vector3();
    rightHand.getWorldPosition(handPos);
    return handPos;
  };

  console.log('Rest RightHand:', testRot(new THREE.Vector3(1,0,0), 0).toArray().map(v=>v.toFixed(1)));
  console.log('Rot X +75:', testRot(new THREE.Vector3(1,0,0), 75).toArray().map(v=>v.toFixed(1)));
  console.log('Rot X -75:', testRot(new THREE.Vector3(1,0,0), -75).toArray().map(v=>v.toFixed(1)));
});
