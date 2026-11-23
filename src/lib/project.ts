import * as THREE from "three";
import { getCameraZ } from "./motion";

// Shared reusable PerspectiveCamera matching the scene configuration exactly
const projCamera = new THREE.PerspectiveCamera(42, 1080 / 1920, 0.1, 1000);

/**
 * Pure 2D screen projection helper using the fixed camera setup.
 * Converts 3D world space coordinate (x, y, z) into 2D viewport pixels (0 to 1080, 0 to 1920).
 *
 * @param x 3D X position in meters
 * @param y 3D Y position in meters
 * @param z 3D Z position in meters
 * @param globalFrame Remotion global frame number
 * @returns { x: number, y: number } in screen pixels
 */
export function projectToScreen(
  x: number,
  y: number,
  z: number,
  globalFrame = 340
): { x: number; y: number } {
  const cameraZ = getCameraZ(globalFrame);
  projCamera.position.set(0, 1.30, cameraZ);
  projCamera.lookAt(0, 1.30, 0);
  projCamera.updateMatrixWorld();
  projCamera.updateProjectionMatrix();

  const v = new THREE.Vector3(x, y, z);
  v.project(projCamera);

  return {
    x: Math.round((v.x * 0.5 + 0.5) * 1080),
    y: Math.round((-v.y * 0.5 + 0.5) * 1920),
  };
}
