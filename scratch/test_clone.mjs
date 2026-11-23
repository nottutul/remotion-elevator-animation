global.self = global;
import fs from 'fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js';

const buf = fs.readFileSync('public/munem_3d_ready_player_me.glb');
const loader = new GLTFLoader();
loader.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), '', (gltf) => {
  const master = gltf.scene;
  const clone = cloneSkeleton(master);

  let cloneMesh = null;
  clone.traverse(obj => {
    if (obj.isSkinnedMesh) cloneMesh = obj;
  });

  console.log('Clone has mesh:', !!cloneMesh);
  console.log('Clone skeleton bones:', cloneMesh.skeleton.bones.length);
  console.log('Clone skeleton bone 0 parent:', cloneMesh.skeleton.bones[0].parent ? cloneMesh.skeleton.bones[0].parent.name : null);

  const parentGroup = new THREE.Group();
  parentGroup.scale.set(0.01, 0.01, 0.01);
  parentGroup.add(clone);

  const scene = new THREE.Scene();
  scene.add(parentGroup);
  scene.updateMatrixWorld(true);

  console.log('Clone mesh world pos:', cloneMesh.getWorldPosition(new THREE.Vector3()).toArray());
  console.log('Bone 1 world pos:', cloneMesh.skeleton.bones[1].getWorldPosition(new THREE.Vector3()).toArray());
});
