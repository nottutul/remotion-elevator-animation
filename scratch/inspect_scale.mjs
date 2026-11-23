global.self = global;
import fs from 'fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const buf = fs.readFileSync('public/munem_3d_ready_player_me.glb');
const loader = new GLTFLoader();
loader.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), '', (gltf) => {
  gltf.scene.traverse(obj => {
    if (obj.scale.x !== 1 || obj.scale.y !== 1 || obj.scale.z !== 1) {
      console.log('Scaled object:', obj.name, obj.type, obj.scale.toArray());
    }
  });
});
