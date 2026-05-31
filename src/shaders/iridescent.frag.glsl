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

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;

  for (int i = 0; i < 5; i += 1) {
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

  vec3 zenithColor = vec3(0.000, 0.002, 0.010);
  vec3 midColor = vec3(0.004, 0.013, 0.040);
  vec3 nadirColor = vec3(0.001, 0.011, 0.028);

  vec3 color = mix(nadirColor, midColor, smoothstep(0.0, 0.58, verticalDepth));
  color = mix(color, zenithColor, smoothstep(0.58, 1.0, verticalDepth) * 0.72);
  color *= mix(0.58, 1.0, screenVignette);

  vec3 nebulaP = dir * 2.4;
  float cloudA = triFbm(nebulaP * 1.55 + vec3(drift, -drift * 0.38, drift * 0.24));
  float cloudB = triFbm(nebulaP * 2.45 + vec3(-drift * 0.33, drift * 0.55, 9.2));
  float cloudC = triFbm(nebulaP * 4.2 + vec3(13.0, drift * 0.18, -drift * 0.16));

  float softNebula = smoothstep(0.48, 0.78, cloudA) * 0.28;
  softNebula += smoothstep(0.55, 0.84, cloudB) * 0.18;
  softNebula += smoothstep(0.62, 0.88, cloudC) * 0.09;
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
  color += vec3(0.014, 0.035, 0.120) * milkyIntensity * 0.42;

  float auroraA = smoothstep(0.60, 0.86, triFbm(dir * 3.4 + vec3(drift * 0.25, 2.0, -drift * 0.12)));
  float auroraB = smoothstep(0.62, 0.88, triFbm(dir * 4.1 + vec3(7.0, -drift * 0.2, drift * 0.18)));
  color += vec3(0.028, 0.135, 0.210) * auroraA * 0.026 * screenVignette;
  color += vec3(0.020, 0.090, 0.185) * auroraB * 0.022 * screenVignette;

  float hue = mod((uHueShift / 360.0) + (uTime * 0.003) + (dir.x * 0.015) + (dir.z * 0.01), 1.0);
  vec3 iridescent = hsl2rgb(vec3(hue, 0.05, 0.04));
  color += iridescent * (0.003 + verticalDepth * 0.006) * screenVignette;

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
  color += starColor * allStars * mix(0.20, 0.48, screenVignette);

  color += (hash(vUv * 900.0 + uTime * 0.03) - 0.5) * 0.0015;

  gl_FragColor = vec4(color, 1.0);
}
