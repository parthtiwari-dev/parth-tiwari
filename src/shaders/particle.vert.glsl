precision highp float;

attribute float aClusterIndex;

uniform float uTime;
uniform float uClusterBrightness[9];
uniform float uPointSize;

varying float vBrightness;

float noise(vec3 p) {
  return sin(p.x * 1.7 + p.y * 2.3 + p.z * 2.9) * 0.5 + 0.5;
}

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
  vec3 drift = vec3(
    noise(position * 0.32 + vec3(uTime * 0.08, 0.0, 0.0)) - 0.5,
    noise(position * 0.24 + vec3(0.0, uTime * 0.06, 0.0)) - 0.5,
    noise(position * 0.28 + vec3(0.0, 0.0, uTime * 0.05)) - 0.5
  ) * 0.18;

  vec4 mvPosition = modelViewMatrix * vec4(position + drift, 1.0);
  float distanceScale = 160.0 / max(1.0, -mvPosition.z);
  gl_PointSize = uPointSize * distanceScale * brightness;
  gl_Position = projectionMatrix * mvPosition;

  vBrightness = brightness;
}
