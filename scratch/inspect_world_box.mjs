global.self = global;
import fs from 'fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const buf = fs.readFileSync('public/munem_3d_ready_player_me.glb');
const loader = new GLTFLoader();
loader.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), '', (gltf) => {
  gltf.scene.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(gltf.scene);
  console.log('Scene Bounding Box min:', box.min.toArray().map(v=>v.toFixed(3)));
  console.log('Scene Bounding Box max:', box.max.toArray().map(v=>v.toFixed(3)));
  console.log('Scene Height:', (box.max.y - box.min.y).toFixed(3));
});
