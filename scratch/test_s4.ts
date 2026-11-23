import { getProceduralPose, getLiftState, FULL_BODY_SPRING } from "../src/lib/motion";

console.log("Testing S4 pose and kinematics:");
for (const f of [969, 980, 1000, 1050, 1100, 1200, 1300, 1400]) {
  const p = getProceduralPose(f, 30);
  const state = getLiftState(f, 30);
  const comp = FULL_BODY_SPRING[f];
  console.log(`Frame ${f}: a = ${state.a.toFixed(2)}, compression = ${comp.toFixed(4)}, hipOffset.y = ${p.hipOffset.y.toFixed(4)}, heelLift = ${p.heelLift.toFixed(4)}`);
}
