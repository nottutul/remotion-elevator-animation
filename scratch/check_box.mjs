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

  const parentGroup = new THREE.Group();
  parentGroup.scale.set(0.01, 0.01, 0.01);
  parentGroup.add(clone);

  const scene = new THREE.Scene();
  scene.add(parentGroup);
  scene.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(parentGroup);
  console.log('parentGroup box min:', box.min.toArray().map(v=>v.toFixed(3)));
  console.log('parentGroup box max:', box.max.toArray().map(v=>v.toFixed(3)));
});
