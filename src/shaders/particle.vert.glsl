precision highp float;

attribute float aClusterIndex;
attribute float aSize;
attribute float aAlpha;
attribute float aWarmth;
attribute float aPhase;
attribute float aDriftSpeed;
attribute float aTwinkle;

uniform float uTime;
uniform float uClusterBrightness[9];
uniform float uPointSize;

varying float vAlpha;
varying float vBrightness;
varying float vWarmth;
varying float vTwinkle;

float getClusterBrightness(float cluster) {
  if (cluster < -0.5) return 1.0;
  if (cluster < 0.5) return uClusterBrightness[0];
  if (cluster < 1.5) return uClusterBrightness[1];
  if (cluster < 2.5) return uClusterBrightness[2];
  if (cluster < 3.5) return uClusterBrightness[3];
  if (cluster < 4.5) return uClusterBrightness[4];
  if (cluster < 5.5) return uClusterBrightness[5];
  if (cluster < 6.5) return uClusterBrightness[6];
  if (cluster < 7.5) return uClusterBrightness[7];
  return uClusterBrightness[8];
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
