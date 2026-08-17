precision highp float;

attribute float aClusterIndex;
attribute float aSize;
attribute float aAlpha;
attribute float aWarmth;
attribute float aPhase;
attribute float aDriftSpeed;
attribute float aTwinkle;

uniform float uTime;
// CLUSTER_COUNT is injected as a #define from useParticleField.ts, sized to
// projects.length. It was a literal 9 with a hand-unrolled if-chain, which broke
// silently on the tenth project — the JS uniform array grew, the declaration did
// not. GLSL ES 1.0 forbids indexing by an arbitrary expression, but a for-loop
// index over a constant bound IS a constant-index-expression, so the lookup below
// is legal and no longer has to know how many projects exist.
uniform float uClusterBrightness[CLUSTER_COUNT];
uniform float uPointSize;

varying float vAlpha;
varying float vBrightness;
varying float vWarmth;
varying float vTwinkle;

float getClusterBrightness(float cluster) {
  if (cluster < -0.5) return 1.0;
  int index = int(cluster + 0.5);
  for (int i = 0; i < CLUSTER_COUNT; i++) {
    if (i == index) return uClusterBrightness[i];
  }
  return 1.0;
}

void main() {
  float isAmbient = 1.0 - step(-0.5, aClusterIndex);
  float brightness = getClusterBrightness(aClusterIndex);
  float driftTime = uTime * aDriftSpeed + aPhase;
  float driftAmount = mix(0.03, 0.007, isAmbient);
  vec3 drift = vec3(
    sin(driftTime),
    cos(driftTime * 0.71 + aPhase * 0.37),
    sin(driftTime * 0.53 + aPhase * 1.13)
  ) * driftAmount;
  vec3 driftedPosition = position + drift;
  vec4 driftedViewPosition = modelViewMatrix * vec4(driftedPosition, 1.0);
  float parallaxScale = 1.0 + (18.0 / max(1.0, -driftedViewPosition.z)) * mix(0.008, 0.026, isAmbient);
  vec4 mvPosition = modelViewMatrix * vec4(position + (drift * parallaxScale), 1.0);
  float distanceScale = clamp(30.0 / max(1.0, -mvPosition.z), 0.3, 1.68);
  float twinkle = 1.0 + aTwinkle * sin((uTime * 5.2) + (aPhase * 3.1)) * 0.28;

  gl_PointSize = uPointSize * aSize * distanceScale * brightness * twinkle * mix(1.0, 1.45, aTwinkle);
  gl_Position = projectionMatrix * mvPosition;

  vAlpha = aAlpha;
  vBrightness = brightness * mix(1.0, twinkle, aTwinkle);
  vWarmth = aWarmth;
  vTwinkle = aTwinkle;
}
