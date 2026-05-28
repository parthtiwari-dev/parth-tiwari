precision highp float;

varying float vBrightness;
varying float vAlpha;
varying float vWarmth;

void main() {
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);
  float alpha = smoothstep(0.5, 0.1, dist) * vAlpha * vBrightness;
  vec3 ice = vec3(0.847, 0.918, 0.941);
  vec3 warmWhite = vec3(0.961, 0.91, 0.784);
  vec3 color = mix(ice, warmWhite, vWarmth);
  gl_FragColor = vec4(color, alpha);
}
