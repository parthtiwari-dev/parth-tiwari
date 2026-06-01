precision mediump float;

uniform float uHueOffset;

varying float vAlpha;
varying float vBrightness;
varying float vWarmth;
varying float vTwinkle;

vec3 hueRotate(vec3 color, float angle) {
  const vec3 weights = vec3(0.299, 0.587, 0.114);
  float cosAngle = cos(angle);
  float sinAngle = sin(angle);

  return color * cosAngle
    + cross(weights, color) * sinAngle
    + weights * dot(weights, color) * (1.0 - cosAngle);
}

void main() {
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);
  float core = smoothstep(0.48, 0.015, dist);
  core = pow(core, mix(4.1, 1.8, vTwinkle));
  float horizontalRay = exp(-abs(center.y) * 84.0) * smoothstep(0.48, 0.02, abs(center.x));
  float verticalRay = exp(-abs(center.x) * 84.0) * smoothstep(0.48, 0.02, abs(center.y));
  float diagonalRayA = exp(-abs(center.x - center.y) * 68.0) * smoothstep(0.46, 0.02, dist);
  float diagonalRayB = exp(-abs(center.x + center.y) * 68.0) * smoothstep(0.46, 0.02, dist);
  float diffraction = (horizontalRay + verticalRay + (diagonalRayA + diagonalRayB) * 0.28) * smoothstep(0.62, 0.95, vTwinkle);
  vec3 ice = vec3(0.847, 0.918, 0.941);
  vec3 coldWhite = vec3(0.94, 0.98, 1.0);
  vec3 warmWhite = vec3(0.961, 0.91, 0.784);
  vec3 gold = vec3(0.91, 0.73, 0.32);
  float warmMix = smoothstep(0.16, 0.72, vWarmth);
  float goldMix = smoothstep(0.82, 1.0, vWarmth);
  vec3 color = mix(ice, coldWhite, 0.35);
  color = mix(color, warmWhite, warmMix * (1.0 - goldMix));
  color = mix(color, gold, goldMix);
  color = clamp(hueRotate(color, radians(uHueOffset)), 0.0, 1.0);

  float alpha = (core + diffraction * 0.35) * vAlpha * vBrightness;
  gl_FragColor = vec4(color, alpha);
}
