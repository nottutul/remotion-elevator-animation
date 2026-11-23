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
  const rest = new Map();
  skinnedMesh.skeleton.bones.forEach(b => {
    const cleanName = b.name.replace(/_\d+$/, '');
    bones.set(cleanName, b);
    rest.set(cleanName, {
      position: b.position.clone(),
      quaternion: b.quaternion.clone(),
    });
  });

  const leftFoot = bones.get('LeftFoot');
  const initialFootWorld = new THREE.Vector3();
  gltf.scene.updateMatrixWorld(true);
  leftFoot.getWorldPosition(initialFootWorld);
  console.log('Initial LeftFoot world position (cm):', initialFootWorld.toArray().map(v=>v.toFixed(3)));
});
