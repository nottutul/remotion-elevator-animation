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
  skinnedMesh.skeleton.bones.forEach(b => {
    bones.set(b.name.replace(/_\d+$/, ''), b);
  });

  const leftUpLeg = bones.get('LeftUpLeg');
  const leftLeg = bones.get('LeftLeg');
  const leftFoot = bones.get('LeftFoot');

  console.log('LeftUpLeg pos:', leftUpLeg.position.toArray());
  console.log('LeftLeg pos:', leftLeg.position.toArray());
  console.log('LeftFoot pos:', leftFoot.position.toArray());

  const testKnee = (axis, angleDeg) => {
    const q = new THREE.Quaternion().setFromAxisAngle(axis, THREE.MathUtils.degToRad(angleDeg));
    leftLeg.quaternion.copy(leftLeg.userData.restQuat || leftLeg.quaternion.clone()).multiply(q);
    gltf.scene.updateMatrixWorld(true);
    const footPos = new THREE.Vector3();
    leftFoot.getWorldPosition(footPos);
    return footPos;
  };

  leftLeg.userData.restQuat = leftLeg.quaternion.clone();

  console.log('Rest foot:', testKnee(new THREE.Vector3(1,0,0), 0).toArray().map(v=>v.toFixed(1)));
  console.log('Knee X +30:', testKnee(new THREE.Vector3(1,0,0), 30).toArray().map(v=>v.toFixed(1)));
  console.log('Knee X -30:', testKnee(new THREE.Vector3(1,0,0), -30).toArray().map(v=>v.toFixed(1)));
  console.log('Knee Z +30:', testKnee(new THREE.Vector3(0,0,1), 30).toArray().map(v=>v.toFixed(1)));
  console.log('Knee Z -30:', testKnee(new THREE.Vector3(0,0,1), -30).toArray().map(v=>v.toFixed(1)));
});
