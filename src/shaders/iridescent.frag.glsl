precision highp float;

uniform float uTime;
uniform float uHueShift;

varying vec2 vUv;

vec3 hsl2rgb(vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
}

void main() {
  vec3 baseColor = vec3(0.047, 0.102, 0.125);
  float topDepth = smoothstep(0.7, 1.0, vUv.y);
  baseColor *= 1.0 - (topDepth * 0.1);
  float radialNoise = (
    sin((vUv.x * 16.0) + (uTime * 0.08)) *
    cos((vUv.y * 12.0) - (uTime * 0.05))
  ) * 0.02;
  float hue = mod((uHueShift / 360.0) + (uTime * 0.015) + (vUv.x * 0.035) + radialNoise, 1.0);
  vec3 iridescent = hsl2rgb(vec3(hue, 0.22, 0.12));
  float vignette = smoothstep(0.95, 0.15, distance(vUv, vec2(0.5)));
  float atmosphereMix = 0.48 * (0.72 + vignette * 0.28);
  vec3 color = mix(baseColor, iridescent, atmosphereMix);
  gl_FragColor = vec4(color, 1.0);
}
