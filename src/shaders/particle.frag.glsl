precision highp float;

uniform vec3 uColor;

varying float vBrightness;

void main() {
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);
  float alpha = smoothstep(0.5, 0.0, dist) * 0.55 * vBrightness;
  gl_FragColor = vec4(uColor, alpha);
}
