import { getLiftMotion } from './motion.mjs';

for (let f = 70; f <= 110; f += 5) {
  const s = getLiftMotion(f, 30);
  console.log(`f=${f} (t=${(f/30).toFixed(2)}s): y=${s.y.toFixed(3)}, v=${s.v.toFixed(3)}, a=${s.a.toFixed(3)}`);
}
