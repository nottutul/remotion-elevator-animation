global.self = global;
import fs from 'fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const buf = fs.readFileSync('public/munem_3d_ready_player_me.glb');
const loader = new GLTFLoader();
loader.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), '', (gltf) => {
  const root = new THREE.Group();
  root.scale.set(0.01, 0.01, 0.01);
  root.add(gltf.scene);

  const scene = new THREE.Scene();
  scene.add(root);
  scene.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(root);
  console.log('Root with scale 0.01 bounding box:');
  console.log('min:', box.min.toArray().map(v=>v.toFixed(3)));
  console.log('max:', box.max.toArray().map(v=>v.toFixed(3)));
  console.log('size:', box.getSize(new THREE.Vector3()).toArray().map(v=>v.toFixed(3)));

  // Test camera view
  const camera = new THREE.PerspectiveCamera(32, 1920/1080, 0.1, 100);
  camera.position.set(0, 1.05, 4.2);
  camera.lookAt(0, 1.05, 0);
  camera.updateMatrixWorld(true);

  const frustum = new THREE.Frustum();
  frustum.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));

  console.log('Is box inside camera frustum?', frustum.intersectsBox(box));
});
