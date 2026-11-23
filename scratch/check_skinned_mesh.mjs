global.self = global;
import fs from 'fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js';

const buf = fs.readFileSync('public/munem_3d_ready_player_me.glb');
const loader = new GLTFLoader();
loader.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), '', (gltf) => {
  const master = gltf.scene;
  let masterMesh = null;
  master.traverse(obj => {
    if (obj.isSkinnedMesh) masterMesh = obj;
  });

  const clone = cloneSkeleton(master);
  let cloneMesh = null;
  clone.traverse(obj => {
    if (obj.isSkinnedMesh) cloneMesh = obj;
  });

  console.log('Master mesh skeleton !== clone mesh skeleton:', masterMesh.skeleton !== cloneMesh.skeleton);
  console.log('Clone mesh skeleton bones count:', cloneMesh.skeleton.bones.length);
  console.log('Clone mesh geometry:', !!cloneMesh.geometry);
  console.log('Clone mesh material:', cloneMesh.material.type);

  // Check bones
  const b1 = cloneMesh.skeleton.bones[1];
  console.log('Bone 1 name:', b1.name);
  console.log('Bone 1 in clone scene:', clone.getObjectByName(b1.name) === b1);
});
