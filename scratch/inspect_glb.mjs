global.self = global;
import fs from 'fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const buf = fs.readFileSync('public/munem_3d_ready_player_me.glb');
const arrayBuf = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

const loader = new GLTFLoader();
loader.parse(arrayBuf, '', (gltf) => {
  console.log('GLTF parsed successfully!');
  const scene = gltf.scene;
  let skinnedMesh = null;
  scene.traverse(obj => {
    if (obj.isSkinnedMesh) skinnedMesh = obj;
  });
  if (skinnedMesh) {
    console.log('SkinnedMesh name:', skinnedMesh.name);
    console.log('Skeleton bones count:', skinnedMesh.skeleton.bones.length);
    skinnedMesh.geometry.computeBoundingBox();
    const bb = skinnedMesh.geometry.boundingBox;
    console.log('Geometry BoundingBox min:', bb.min.x.toFixed(3), bb.min.y.toFixed(3), bb.min.z.toFixed(3));
    console.log('Geometry BoundingBox max:', bb.max.x.toFixed(3), bb.max.y.toFixed(3), bb.max.z.toFixed(3));
    console.log('Height:', (bb.max.y - bb.min.y).toFixed(3));

    const checkBones = ['Hips_01', 'Spine_02', 'Spine1_03', 'Spine2_04', 'Neck_05', 'Head_06', 'LeftShoulder_010', 'LeftArm_011', 'LeftForeArm_012', 'LeftHand_013', 'LeftUpLeg_057', 'LeftLeg_058', 'LeftFoot_059', 'RightUpLeg_062', 'RightLeg_063', 'RightFoot_064'];
    skinnedMesh.skeleton.bones.forEach((b) => {
      if (checkBones.includes(b.name)) {
        console.log(`Bone ${b.name}: pos=[${b.position.toArray().map(v=>v.toFixed(3)).join(', ')}], rot=[${b.rotation.toArray().slice(0,3).map(v=>v.toFixed(3)).join(', ')}]`);
      }
    });
  }
}, (err) => console.error(err));
