precision highp float;

attribute float aClusterIndex;
attribute float aSize;
attribute float aAlpha;
attribute float aWarmth;
attribute float aPhase;
attribute float aDriftSpeed;

uniform float uTime;
uniform float uClusterBrightness[9];
uniform float uPointSize;

varying float vBrightness;
varying float vAlpha;
varying float vWarmth;

float getClusterBrightness(float cluster) {
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
  float cluster = clamp(aClusterIndex, 0.0, 8.0);
  float brightness = getClusterBrightness(cluster);
  float driftTime = uTime * aDriftSpeed + aPhase;
  vec3 drift = vec3(
    sin(driftTime),
    cos(driftTime * 0.71 + aPhase * 0.37),
    sin(driftTime * 0.53 + aPhase * 1.13)
  ) * 0.1;
  vec3 driftedPosition = position + drift;
  vec4 driftedViewPosition = modelViewMatrix * vec4(driftedPosition, 1.0);
  float parallaxScale = 1.0 + (20.0 / max(1.0, -driftedViewPosition.z)) * 0.04;
  vec4 mvPosition = modelViewMatrix * vec4(position + (drift * parallaxScale), 1.0);
  float distanceScale = 160.0 / max(1.0, -mvPosition.z);
  gl_PointSize = uPointSize * aSize * distanceScale * brightness;
  gl_Position = projectionMatrix * mvPosition;

  vBrightness = brightness;
  vAlpha = aAlpha;
  vWarmth = aWarmth;
}
