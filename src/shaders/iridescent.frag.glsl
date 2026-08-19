precision highp float;

uniform float uTime;
uniform float uHueShift;

varying vec2 vUv;
varying vec3 vDir;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// SKY_OCTAVES is injected from IridescentBackground.vue via the shared quality
// tier (PLAN.md 2.4). This shader is the largest GPU cost in the app: 7 triFbm
// calls, each running fbm three times, each looping this many times. At 3 that
// is 63 noise() evaluations per fragment, fullscreen, every frame. Fewer
// octaves reads as a softer nebula, not a missing one.
#ifndef SKY_OCTAVES
#define SKY_OCTAVES 3
#endif

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;

  for (int i = 0; i < SKY_OCTAVES; i += 1) {
    value += amplitude * noise(p);
    p *= 2.03;
    amplitude *= 0.5;
  }

  return value;
}

float triFbm(vec3 p) {
  vec3 blend = pow(abs(normalize(p)), vec3(2.0));
  blend /= max(0.0001, blend.x + blend.y + blend.z);

  float xy = fbm(p.xy + vec2(11.7, 3.1));
  float yz = fbm(p.yz + vec2(4.3, 19.9));
  float xz = fbm(p.xz + vec2(23.5, 7.6));

  return xy * blend.z + yz * blend.x + xz * blend.y;
}

float starLayer(vec2 uv, float scale, float threshold) {
  vec2 grid = uv * scale;
  vec2 cell = floor(grid);
  vec2 local = fract(grid) - vec2(0.5);
  float seed = hash(cell);
  float visible = step(threshold, seed);
  float radius = mix(0.021, 0.005, hash(cell + 19.17));
  float core = 1.0 - smoothstep(radius * 0.35, radius, length(local));
  float shimmer = 0.88 + 0.12 * sin((uTime * 0.35) + seed * 6.28318);

  return core * visible * shimmer * mix(0.35, 1.0, hash(cell + 8.41));
}

float directionStars(vec3 dir, float scale, float threshold, vec2 offset) {
  float xy = starLayer(dir.xy * 0.5 + 0.5 + offset, scale, threshold) * abs(dir.z);
  float yz = starLayer(dir.yz * 0.5 + 0.5 + offset * 1.37, scale, threshold) * abs(dir.x);
  float xz = starLayer(dir.xz * 0.5 + 0.5 + offset * 0.73, scale, threshold) * abs(dir.y);

  return max(max(xy, yz), xz);
}

vec3 hsl2rgb(vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
}

void main() {
  vec3 dir = normalize(vDir);
  float drift = uTime * 0.012;
  float verticalDepth = dir.y * 0.5 + 0.5;
  float screenVignette = 0.82 + 0.18 * smoothstep(-0.85, 0.65, dir.z);

  // Pure black is the canvas, not a dark navy (PLAN.md 8.4 — DESIGN.md §5).
  //
  // Sampled from the shipped build, the empty sky read rgb(1, 4, 13): blue was
  // twelve times red, so what looked like "space" was a flat navy wash with a
  // handful of dots on it. Real deep-field imagery is the other way round — the
  // void is genuinely black and every bit of colour is concentrated *in* an
  // object. The reference set says the same thing about the design side: Dala's
  // rule is "pure #000000 as every background, never dark gray — the void is
  // the design", and it works there because the thing inside the void is dense.
  //
  // So the gradient keeps only enough lift to stop the sky reading as a dead
  // pixel area, and the colour budget moves to the nebula, the band and the
  // stars, which are the things that have earned it.
  vec3 zenithColor = vec3(0.000, 0.000, 0.001);
  vec3 midColor = vec3(0.001, 0.003, 0.009);
  vec3 nadirColor = vec3(0.000, 0.002, 0.006);

  vec3 color = mix(nadirColor, midColor, smoothstep(0.0, 0.58, verticalDepth));
  color = mix(color, zenithColor, smoothstep(0.58, 1.0, verticalDepth) * 0.72);
  color *= mix(0.58, 1.0, screenVignette);

  vec3 nebulaP = dir * 2.4;
  float cloudA = triFbm(nebulaP * 1.55 + vec3(drift, -drift * 0.38, drift * 0.24));
  float cloudB = triFbm(nebulaP * 2.45 + vec3(-drift * 0.33, drift * 0.55, 9.2));
  float cloudC = triFbm(nebulaP * 4.2 + vec3(13.0, drift * 0.18, -drift * 0.16));

  // Thresholds pushed up and weights down: the nebula should be a few discrete
  // clouds against black, not a haze covering the whole sphere. The old floor
  // meant a majority of fragments picked up some blue, which is what turned the
  // void navy.
  float softNebula = smoothstep(0.62, 0.86, cloudA) * 0.20;
  softNebula += smoothstep(0.68, 0.92, cloudB) * 0.13;
  softNebula += smoothstep(0.74, 0.95, cloudC) * 0.06;
  softNebula *= 0.58 + 0.42 * screenVignette;

  vec3 blueNebula = vec3(0.004, 0.030, 0.125);
  vec3 cyanNebula = vec3(0.002, 0.046, 0.105);
  color += mix(blueNebula, cyanNebula, smoothstep(0.2, 0.85, cloudB)) * softNebula;

  vec3 bandNormal = normalize(vec3(0.38, 0.82, -0.34));
  float bandDistance = abs(dot(dir, bandNormal));
  float milkyBand = exp(-bandDistance * bandDistance * 32.0);
  float milkyDust = triFbm(dir * 5.8 + vec3(drift * 0.14, -drift * 0.1, 4.2));
  float milkyFine = triFbm(dir * 13.0 + vec3(8.1, drift * 0.08, -drift * 0.05));
  float milkyIntensity = milkyBand * (0.26 + milkyDust * 0.42 + milkyFine * 0.16);
  // The band survives at close to full strength — it is a real structure and
  // the one place a broad wash of colour is honest.
  color += vec3(0.012, 0.030, 0.098) * milkyIntensity * 0.40;

  float auroraA = smoothstep(0.60, 0.86, triFbm(dir * 3.4 + vec3(drift * 0.25, 2.0, -drift * 0.12)));
  float auroraB = smoothstep(0.62, 0.88, triFbm(dir * 4.1 + vec3(7.0, -drift * 0.2, drift * 0.18)));
  // Aurora halved. It was the least defensible term here — nothing in deep
  // space glows like this, and it was spreading cyan across fragments that
  // should have been black.
  color += vec3(0.028, 0.135, 0.210) * auroraA * 0.013 * screenVignette;
  color += vec3(0.020, 0.090, 0.185) * auroraB * 0.011 * screenVignette;

  float hue = mod((uHueShift / 360.0) + (uTime * 0.003) + (dir.x * 0.015) + (dir.z * 0.01), 1.0);
  vec3 iridescent = hsl2rgb(vec3(hue, 0.05, 0.04));
  color += iridescent * (0.001 + verticalDepth * 0.002) * screenVignette;

  float s1 = directionStars(dir, 42.0, 0.902, vec2(0.13, 0.27)) * 0.18;
  float s2 = directionStars(dir, 58.0, 0.914, vec2(0.67, 0.41)) * 0.24;
  float s3 = directionStars(dir, 76.0, 0.930, vec2(0.07, uTime * 0.00015)) * 0.32;
  float s4 = directionStars(dir, 105.0, 0.944, vec2(0.53, 0.29)) * 0.42;
  float s5 = directionStars(dir, 148.0, 0.956, vec2(0.19, 0.71)) * 0.52;
  float s6 = directionStars(dir, 205.0, 0.964, vec2(0.33, 0.08)) * 0.60;
  float s7 = directionStars(dir, 320.0, 0.979, vec2(0.22, 0.83)) * 0.44;
  float allStars = s1 + s2 + s3 + s4 + s5 + s6 + s7;

  float cellSeed = hash(floor((dir.xy * 0.5 + 0.5) * 91.0) + 7.3);
  vec3 coldStar = vec3(0.62, 0.80, 1.00);
  vec3 warmStar = vec3(1.00, 0.88, 0.62);
  vec3 starColor = mix(coldStar, warmStar, step(0.972, cellSeed));
  // Brighter, because they are now doing the work the wash used to. A real
  // long exposure is mostly black with a lot of very small very bright points,
  // and that contrast is the thing that reads as depth.
  color += starColor * allStars * mix(0.34, 0.78, screenVignette);

  // Dither (PLAN.md 6.9 — DESIGN.md §5). Deep space is nothing but dark
  // gradients, and 8-bit output bands across every one of them.
  //
  // Keyed to `gl_FragCoord`, not `vUv`: the noise has to be one *device pixel*
  // per cell to break up a band. Against UV it scales with the quad, so at
  // DPR 1.25 each cell covered more than a pixel and the pattern read as texture
  // rather than as dither. The previous version was also animated by uTime,
  // which turned a static grain into a shimmer on a still page.
  color += (hash(gl_FragCoord.xy) - 0.5) * 0.0045;

  gl_FragColor = vec4(color, 1.0);
}
