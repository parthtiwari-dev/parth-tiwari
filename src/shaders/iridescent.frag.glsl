precision highp float;

uniform float uTime;
uniform float uHueShift;

varying vec2 vUv;

vec3 hsl2rgb(vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
}

void main() {
  vec3 baseColor = vec3(0.004, 0.014, 0.028);
  vec3 upperColor = vec3(0.008, 0.028, 0.052);
  float verticalDepth = smoothstep(0.08, 0.92, vUv.y);
  baseColor = mix(baseColor, upperColor, verticalDepth * 0.22);
  float vignette = smoothstep(1.02, 0.18, distance(vUv, vec2(0.52, 0.5)));
  float radialNoise = (
    sin((vUv.x * 18.0) + (uTime * 0.035)) *
    cos((vUv.y * 14.0) - (uTime * 0.028))
  ) * 0.006;
  float hue = mod((uHueShift / 360.0) + (uTime * 0.004) + (vUv.x * 0.01) + radialNoise, 1.0);
  vec3 iridescent = hsl2rgb(vec3(hue, 0.055, 0.048));
  float atmosphereMix = (0.006 + verticalDepth * 0.012) * vignette;
  vec3 color = mix(baseColor, iridescent, atmosphereMix);
  color *= mix(0.34, 1.0, vignette);
  gl_FragColor = vec4(color, 1.0);
}
