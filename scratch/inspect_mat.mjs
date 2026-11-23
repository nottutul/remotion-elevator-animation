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

  console.log('Material:', skinnedMesh.material.type);
  console.log('Material color:', skinnedMesh.material.color);
  console.log('Material map:', !!skinnedMesh.material.map);
  console.log('Material normalMap:', !!skinnedMesh.material.normalMap);
  console.log('Material transparent:', skinnedMesh.material.transparent);
  console.log('Material opacity:', skinnedMesh.material.opacity);
  console.log('Material visible:', skinnedMesh.material.visible);
  console.log('SkinnedMesh visible:', skinnedMesh.visible);
  console.log('SkinnedMesh frustumCulled:', skinnedMesh.frustumCulled);
});
