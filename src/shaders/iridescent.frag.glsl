precision highp float;

uniform float uTime;
uniform float uHueShift;

varying vec2 vUv;

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

float starLayer(vec2 uv, float scale, float threshold) {
  vec2 grid = uv * scale;
  vec2 cell = floor(grid);
  vec2 local = fract(grid) - vec2(0.5);
  float seed = hash(cell);
  float visible = step(threshold, seed);
  float radius = mix(0.025, 0.007, hash(cell + 19.17));
  float core = 1.0 - smoothstep(radius * 0.35, radius, length(local));
  float shimmer = 0.86 + 0.14 * sin((uTime * 0.35) + seed * 6.28318);
  return core * visible * shimmer * mix(0.35, 1.0, hash(cell + 8.41));
}

vec3 hsl2rgb(vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
}

void main() {
  float drift = uTime * 0.009;

  // ── BASE: 3-band vertical gradient ─────────────────────────────────────────
  // zenith = cosmic black, mid = deep navy, nadir = subtle dark teal
  vec3 zenithColor = vec3(0.000, 0.002, 0.010);
  vec3 midColor    = vec3(0.004, 0.012, 0.036);
  vec3 nadirColor  = vec3(0.001, 0.012, 0.032);
  float verticalDepth = smoothstep(0.08, 0.92, vUv.y);
  float vignette = smoothstep(1.04, 0.18, distance(vUv, vec2(0.52, 0.5)));

  vec3 color = mix(zenithColor, midColor, smoothstep(0.0, 0.55, verticalDepth));
  color = mix(color, nadirColor, smoothstep(0.55, 1.0, verticalDepth) * 0.6);
  color *= mix(0.24, 0.88, vignette);

  // ── NEBULA CLOUDS: 2.5× boost + color variation + centre zone ──────────────
  vec2 nebulaUv = vUv;
  nebulaUv.x *= 1.65;
  float cloudA = fbm((nebulaUv * vec2(1.8, 0.95)) + vec2(drift, -drift * 0.45));
  float cloudB = fbm((nebulaUv * vec2(3.2, 1.9)) + vec2(-drift * 0.4, drift * 0.7));
  float cloudC = fbm((nebulaUv * vec2(2.4, 1.3)) + vec2(drift * 0.6, drift * 0.3));
  float leftWisp   = smoothstep(0.58, 0.88, cloudA) * smoothstep(0.82, 0.2,  distance(vUv, vec2(0.28, 0.55)));
  float rightWisp  = smoothstep(0.60, 0.88, cloudB) * smoothstep(0.78, 0.16, distance(vUv, vec2(0.74, 0.40)));
  float centerWisp = smoothstep(0.62, 0.90, cloudC) * smoothstep(0.70, 0.12, distance(vUv, vec2(0.50, 0.48)));

  // Left wisp tints blue, right wisp tints violet, centre neutral
  vec3 blueNebula   = vec3(0.004, 0.032, 0.13);   // blue-ward
  vec3 violetNebula = vec3(0.010, 0.010, 0.09);   // desaturated violet
  vec3 centreNebula = vec3(0.006, 0.020, 0.10);   // neutral

  color += blueNebula   * (leftWisp   * 0.45) * vignette;
  color += violetNebula * (rightWisp  * 0.36) * vignette;
  color += centreNebula * (centerWisp * 0.28) * vignette;

  // ── AURORA-LIKE UNDULATING BANDS ────────────────────────────────────────────
  // 2 thin flowing bands of teal-cyan — the "alive sky" quality from reference
  float auroraDrift1 = uTime * 0.006;
  float auroraDrift2 = uTime * 0.009;

  // Band 1: gentle diagonal, teal
  vec2 auroraUv1 = vec2(vUv.x * 2.2 + vUv.y * 0.4, vUv.y * 0.6 + auroraDrift1);
  float aurora1  = fbm(auroraUv1 * 3.5) * smoothstep(0.82, 0.62, abs(vUv.y - 0.56));
  aurora1 = smoothstep(0.55, 0.80, aurora1) * vignette;

  // Band 2: subtle horizontal wave, deep cyan
  vec2 auroraUv2 = vec2(vUv.x * 3.0 - vUv.y * 0.3, vUv.y * 0.8 - auroraDrift2);
  float aurora2  = fbm(auroraUv2 * 4.2) * smoothstep(0.78, 0.58, abs(vUv.y - 0.42));
  aurora2 = smoothstep(0.56, 0.82, aurora2) * vignette;

  vec3 auroraColor1 = vec3(0.040, 0.180, 0.280);  // teal
  vec3 auroraColor2 = vec3(0.025, 0.120, 0.240);  // deep cyan
  color += auroraColor1 * aurora1 * 0.055;
  color += auroraColor2 * aurora2 * 0.045;

  // ── MILKY WAY BAND ──────────────────────────────────────────────────────────
  float mwAngle = 0.48;
  float cosA = cos(mwAngle);
  float sinA = sin(mwAngle);
  vec2 centered = vUv - vec2(0.50, 0.46);
  vec2 mwUv = vec2(
    centered.x * cosA - centered.y * sinA,
    centered.x * sinA + centered.y * cosA
  );
  float mwBand = smoothstep(0.26, 0.0, abs(mwUv.y));
  float mwDust1 = fbm(mwUv * vec2(6.5, 2.8)  + vec2(drift * 0.15, 0.0));
  float mwDust2 = fbm(mwUv * vec2(13.0, 5.0) - vec2(0.0, drift * 0.10));
  float mwDust3 = fbm(mwUv * vec2(24.0, 8.5) + vec2(drift * 0.06, drift * 0.04));
  float mwIntensity = mwBand * (0.40 + mwDust1 * 0.38 + mwDust2 * 0.14 + mwDust3 * 0.08);
  mwIntensity = pow(clamp(mwIntensity, 0.0, 1.0), 0.82) * vignette;
  vec3 mwCore  = vec3(0.035, 0.040, 0.145);
  vec3 mwEdge  = vec3(0.010, 0.025, 0.090);
  vec3 mwColor = mix(mwEdge, mwCore, smoothstep(0.16, 0.0, abs(mwUv.y)));
  color += mwColor * mwIntensity * 0.62;

  // ── SECONDARY GALACTIC CORE ─────────────────────────────────────────────────
  // Soft bright ellipse at band centre — matches real MW core photographs
  float coreGlow = exp(-dot(mwUv * vec2(5.0, 12.0), mwUv * vec2(5.0, 12.0)));
  color += vec3(0.025, 0.030, 0.10) * coreGlow * 0.32 * vignette;

  // ── IRIDESCENT MICRO-SHIMMER (original, kept subtle) ───────────────────────
  float radialNoise = (
    sin((vUv.x * 18.0) + (uTime * 0.035)) *
    cos((vUv.y * 14.0) - (uTime * 0.028))
  ) * 0.004;
  float hue = mod((uHueShift / 360.0) + (uTime * 0.003) + (vUv.x * 0.008) + radialNoise, 1.0);
  vec3 iridescent = hsl2rgb(vec3(hue, 0.055, 0.04));
  float atmosphereMix = (0.004 + verticalDepth * 0.008) * vignette;
  color += iridescent * atmosphereMix;

  // ── STARS: 10 layers (was 8) ─────────────────────────────────────────────────
  // Thresholds lowered 0.025–0.038 across all layers for significantly higher density.
  // s9-s10 are new ultra-fine micro-star background layers.
  vec2 starUv = vUv * vec2(1.62, 0.92);

  float s1 = starLayer(starUv + vec2(0.13, 0.27), 42.0,  0.880) * 0.20;  // was 0.918
  float s2 = starLayer(starUv + vec2(0.67, 0.41), 58.0,  0.895) * 0.26;  // was 0.932
  float s3 = starLayer(starUv + vec2(0.07, uTime * 0.00015), 76.0, 0.916) * 0.33;  // was 0.948
  float s4 = starLayer(starUv + vec2(0.53, 0.29), 105.0, 0.930) * 0.46;  // was 0.963
  float s5 = starLayer(starUv + vec2(0.19, 0.71), 148.0, 0.942) * 0.56;  // was 0.973
  float s6 = starLayer(starUv + vec2(0.33, 0.08), 195.0, 0.948) * 0.66;  // was 0.979
  float s7 = starLayer(starUv + vec2(0.03, uTime * 0.00025), 155.0, 0.955) * 0.55;  // was 0.986
  float s8 = starLayer(starUv + vec2(0.41, 0.17),            285.0, 0.970) * 0.90;  // was 0.993
  float s9  = starLayer(starUv + vec2(0.22, 0.83), 350.0, 0.967) * 0.44;  // new
  float s10 = starLayer(starUv + vec2(0.58, 0.36), 480.0, 0.982) * 0.38;  // new

  float allStars = s1 + s2 + s3 + s4 + s5 + s6 + s7 + s8 + s9 + s10;

  float cellSeed = hash(floor(starUv * 80.0) + 7.3);
  vec3 coldStar = vec3(0.64, 0.82, 1.00);
  vec3 warmStar = vec3(1.00, 0.88, 0.60);
  vec3 starColor = mix(coldStar, warmStar, step(0.968, cellSeed));

  float mwStarBoost = mwBand * 0.28;
  // Brightness: mix(0.09, 0.24) → mix(0.20, 0.58) — stars now read clearly
  color += starColor * (allStars + allStars * mwStarBoost) * mix(0.20, 0.58, vignette);

  // Film grain (unchanged)
  color += (hash(vUv * 900.0 + uTime * 0.03) - 0.5) * 0.0016;

  gl_FragColor = vec4(color, 1.0);
}
