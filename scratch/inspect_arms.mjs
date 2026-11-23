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

  const bonesByName = new Map();
  skinnedMesh.skeleton.bones.forEach(b => {
    const cleanName = b.name.replace(/_\d+$/, '');
    bonesByName.set(cleanName, b);
  });

  const leftArm = bonesByName.get('LeftArm');
  const rightArm = bonesByName.get('RightArm');
  const leftForeArm = bonesByName.get('LeftForeArm');
  const rightForeArm = bonesByName.get('RightForeArm');

  console.log('LeftArm pos:', leftArm.position.toArray());
  console.log('LeftArm rot:', leftArm.rotation.toArray());
  console.log('LeftForeArm pos:', leftForeArm.position.toArray());

  console.log('RightArm pos:', rightArm.position.toArray());
  console.log('RightArm rot:', rightArm.rotation.toArray());
  console.log('RightForeArm pos:', rightForeArm.position.toArray());
});
