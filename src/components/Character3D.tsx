import React, { useLayoutEffect, useMemo } from "react";
import { staticFile } from "remotion";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import { getProceduralPose } from "../lib/motion";

export interface Character3DProps {
  frame: number;
  fps?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  overridePose?: "t-pose" | "natural-standing" | "heavy" | "light" | "think";
}

interface RestBoneTransform {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  scale: THREE.Vector3;
}

const MODEL_PATH = staticFile("munem_3d_ready_player_me.glb");

// Preload GLB asset
useGLTF.preload(MODEL_PATH);

export const Character3D: React.FC<Character3DProps> = ({
  frame,
  fps = 30,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 0.01, // Scale from cm to meters (186.5 cm -> 1.865m)
  overridePose,
}) => {
  // Load asset via useGLTF
  const { scene: masterScene } = useGLTF(MODEL_PATH);

  // Clone with SkeletonUtils to give each character instance its own independent skeleton
  const { clonedScene, bonesMap, restBones, skinnedMesh } = useMemo<{
    clonedScene: THREE.Group;
    bonesMap: Map<string, THREE.Bone>;
    restBones: Map<string, RestBoneTransform>;
    skinnedMesh: THREE.SkinnedMesh | null;
  }>(() => {
    const clone = cloneSkeleton(masterScene) as THREE.Group;

    let foundMesh: unknown = null;
    clone.traverse((obj) => {
      if ((obj as THREE.SkinnedMesh).isSkinnedMesh) {
        const sm = obj as THREE.SkinnedMesh;
        sm.castShadow = true;
        sm.receiveShadow = false;
        sm.frustumCulled = false; // CRITICAL: prevent bounding box culling on skinned meshes

        if (sm.material) {
          const mat = sm.material as THREE.MeshStandardMaterial;
          mat.roughness = Math.max(0.65, mat.roughness);
          mat.needsUpdate = true;
        }
        foundMesh = sm;
      }
    });

    const mesh = foundMesh as THREE.SkinnedMesh | null;
    const bMap = new Map<string, THREE.Bone>();
    const rBones = new Map<string, RestBoneTransform>();

    if (mesh) {
      const skeleton = mesh.skeleton;
      skeleton.bones.forEach((bone: THREE.Bone) => {
        const cleanName = bone.name.replace(/_\d+$/, "");
        bMap.set(cleanName, bone);
        rBones.set(cleanName, {
          position: bone.position.clone(),
          quaternion: bone.quaternion.clone(),
          scale: bone.scale.clone(),
        });
      });

      // Required verification: log any missing expected bone
      const expectedBones = [
        "Hips",
        "Spine",
        "Spine1",
        "Spine2",
        "Neck",
        "Head",
        "LeftShoulder",
        "RightShoulder",
        "LeftArm",
        "RightArm",
        "LeftForeArm",
        "RightForeArm",
        "LeftHand",
        "RightHand",
        "LeftUpLeg",
        "RightUpLeg",
        "LeftLeg",
        "RightLeg",
        "LeftFoot",
        "RightFoot",
        "LeftToeBase",
        "RightToeBase",
        "LeftEye",
        "RightEye",
      ];
      expectedBones.forEach((expected) => {
        if (!bMap.has(expected)) {
          console.warn(`[Character3D] Warning: Expected bone not found: ${expected}`);
        }
      });
    }

    return {
      clonedScene: clone,
      bonesMap: bMap,
      restBones: rBones,
      skinnedMesh: mesh,
    };
  }, [masterScene]);

  // Evaluate the pose for current frame or override pose
  const poseData = useMemo(() => {
    if (overridePose === "t-pose") return null;

    let targetFrame = frame;
    if (overridePose === "natural-standing") targetFrame = 30; // 1.0s at rest
    if (overridePose === "heavy") targetFrame = 95; // 3.17s upward acceleration peak
    if (overridePose === "light") targetFrame = 220; // 7.33s downward acceleration peak
    if (overridePose === "think") targetFrame = 310; // 10.33s think pose

    return getProceduralPose(targetFrame, fps);
  }, [frame, fps, overridePose]);

  // Apply deterministic pose transformations to the skeleton
  useLayoutEffect(() => {
    const mesh = skinnedMesh;
    if (!mesh || !bonesMap.size || !restBones.size) return;

    // 1. Reset all bones to rest transforms
    bonesMap.forEach((bone, cleanName) => {
      const restTransform = restBones.get(cleanName);
      if (restTransform) {
        bone.position.copy(restTransform.position);
        bone.quaternion.copy(restTransform.quaternion);
        bone.scale.copy(restTransform.scale);
      }
    });

    if (overridePose === "t-pose" || !poseData) {
      mesh.skeleton.update();
      return;
    }

    // Helper to rotate a bone from its rest quaternion
    const rotateBone = (cleanName: string, eulerDelta: THREE.Euler) => {
      const bone = bonesMap.get(cleanName);
      const restTransform = restBones.get(cleanName);
      if (bone && restTransform) {
        const qDelta = new THREE.Quaternion().setFromEuler(eulerDelta);
        bone.quaternion.copy(restTransform.quaternion).multiply(qDelta);
      }
    };

    // 2. Pose Hips (In meters)
    const hips = bonesMap.get("Hips");
    const restHips = restBones.get("Hips");
    if (hips && restHips) {
      // Convert world-space hip displacement into hips parent space.
      // ReadyPlayerMe _rootJoint has a -90 deg X-rotation:
      // World X -> Local X
      // World Y (vertical up) -> Local Z
      // World Z (depth forward) -> Local -Y
      const localHipX = poseData.hipOffset.x;
      const localHipY = -poseData.hipOffset.z;
      const localHipZ = poseData.hipOffset.y;

      hips.position.x = restHips.position.x + localHipX;
      hips.position.y = restHips.position.y + localHipY;
      hips.position.z = restHips.position.z + localHipZ;

      const qHipRot = new THREE.Quaternion().setFromEuler(poseData.hipRotation);
      hips.quaternion.copy(restHips.quaternion).multiply(qHipRot);
    }

    // 3. Pose Spine, Neck & Head
    rotateBone("Spine", poseData.spineRotation);
    rotateBone("Spine1", poseData.spine1Rotation);
    rotateBone("Spine2", poseData.spine2Rotation);
    rotateBone("Neck", poseData.neckRotation);
    rotateBone("Head", poseData.headRotation);

    // Eyes saccades
    rotateBone("LeftEye", poseData.leftEyeRotation);
    rotateBone("RightEye", poseData.rightEyeRotation);

    // 4. Pose Arms & Forearms
    rotateBone("LeftArm", poseData.leftArmRotation);
    rotateBone("LeftForeArm", poseData.leftForeArmRotation);
    rotateBone("LeftHand", poseData.leftHandRotation);

    rotateBone("RightArm", poseData.rightArmRotation);
    rotateBone("RightForeArm", poseData.rightForeArmRotation);
    rotateBone("RightHand", poseData.rightHandRotation);

    // 5. Relax & Curl Fingers
    const curlFingers = (prefix: "Left" | "Right", curlFactor: number) => {
      const fingerNames = ["Thumb", "Index", "Middle", "Ring", "Pinky"];
      fingerNames.forEach((fName) => {
        for (let seg = 1; seg <= 3; seg++) {
          const boneName = `${prefix}Hand${fName}${seg}`;
          const bone = bonesMap.get(boneName);
          const restT = restBones.get(boneName);
          if (bone && restT) {
            const curlAngle = (fName === "Thumb" ? 14 : 22) * curlFactor * (Math.PI / 180);
            const qCurl = new THREE.Quaternion().setFromAxisAngle(
              new THREE.Vector3(1, 0, 0),
              curlAngle
            );
            bone.quaternion.copy(restT.quaternion).multiply(qCurl);
          }
        }
      });
    };

    curlFingers("Left", poseData.fingerCurlLeft);
    curlFingers("Right", poseData.fingerCurlRight);

    // 6. Two-Bone Analytic IK for Legs & Feet Planting
    const applyLegIK = (side: "Left" | "Right") => {
      const upLegName = `${side}UpLeg`;
      const legName = `${side}Leg`;
      const footName = `${side}Foot`;

      const upLeg = bonesMap.get(upLegName);
      const leg = bonesMap.get(legName);
      const foot = bonesMap.get(footName);

      const restUpLeg = restBones.get(upLegName);
      const restLeg = restBones.get(legName);
      const restFoot = restBones.get(footName);

      if (upLeg && leg && foot && restUpLeg && restLeg && restFoot) {
        const dropM = Math.max(0, -poseData.hipOffset.y);
        const cosTheta = Math.max(0.65, Math.min(1.0, 1 - dropM / 0.765));
        const theta = Math.acos(cosTheta);
        const kneeFlex = theta * 2.0;

        const heelLiftPitch = poseData.heelLift > 0.005 ? poseData.heelLift * 1.5 : 0;

        const qThigh = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(theta, 0, side === "Left" ? -0.05 : 0.05)
        );
        upLeg.quaternion.copy(restUpLeg.quaternion).multiply(qThigh);

        const qKnee = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(1, 0, 0),
          -kneeFlex
        );
        leg.quaternion.copy(restLeg.quaternion).multiply(qKnee);

        const qAnkle = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(
            theta + heelLiftPitch,
            side === "Left" ? -0.07 : 0.07,
            0
          )
        );
        foot.quaternion.copy(restFoot.quaternion).multiply(qAnkle);
      }
    };

    applyLegIK("Left");
    applyLegIK("Right");

    mesh.skeleton.update();
  }, [poseData, overridePose, bonesMap, restBones, skinnedMesh]);

  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <primitive object={clonedScene} />
    </group>
  );
};
