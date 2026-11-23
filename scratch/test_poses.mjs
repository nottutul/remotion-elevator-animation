global.self = global;
import fs from 'fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const buf = fs.readFileSync('public/munem_3d_ready_player_me.glb');
const arrayBuf = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

const loader = new GLTFLoader();
loader.parse(arrayBuf, '', (gltf) => {
  let skinnedMesh = null;
  gltf.scene.traverse(obj => {
    if (obj.isSkinnedMesh) skinnedMesh = obj;
  });

  const bonesByName = new Map();
  skinnedMesh.skeleton.bones.forEach(b => {
    const cleanName = b.name.replace(/_\d+$/, '');
    bonesByName.set(cleanName, b);
  });

  console.log('Clean bones count:', bonesByName.size);
  console.log('Has Hips:', bonesByName.has('Hips'));
  console.log('Has LeftArm:', bonesByName.has('LeftArm'));
  console.log('Has RightArm:', bonesByName.has('RightArm'));
  console.log('Has LeftUpLeg:', bonesByName.has('LeftUpLeg'));
  console.log('Has RightUpLeg:', bonesByName.has('RightUpLeg'));
  console.log('Has LeftFoot:', bonesByName.has('LeftFoot'));

  // Get world positions of feet and hips in rest pose
  gltf.scene.updateMatrixWorld(true);
  const leftFoot = bonesByName.get('LeftFoot');
  const rightFoot = bonesByName.get('RightFoot');
  const hips = bonesByName.get('Hips');
  const head = bonesByName.get('Head');

  const lFootPos = new THREE.Vector3();
  const rFootPos = new THREE.Vector3();
  const hipsPos = new THREE.Vector3();
  const headPos = new THREE.Vector3();

  leftFoot.getWorldPosition(lFootPos);
  rightFoot.getWorldPosition(rFootPos);
  hips.getWorldPosition(hipsPos);
  head.getWorldPosition(headPos);

  console.log('Rest World Hips:', hipsPos.toArray().map(v=>v.toFixed(3)));
  console.log('Rest World LeftFoot:', lFootPos.toArray().map(v=>v.toFixed(3)));
  console.log('Rest World RightFoot:', rFootPos.toArray().map(v=>v.toFixed(3)));
  console.log('Rest World Head:', headPos.toArray().map(v=>v.toFixed(3)));
});
