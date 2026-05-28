precision highp float;

varying float vAlpha;
varying float vBrightness;
varying float vWarmth;
varying float vTwinkle;

void main() {
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);
  float core = smoothstep(0.48, 0.015, dist);
  core = pow(core, mix(3.2, 1.75, vTwinkle));
  vec3 ice = vec3(0.847, 0.918, 0.941);
  vec3 coldWhite = vec3(0.94, 0.98, 1.0);
  vec3 warmWhite = vec3(0.961, 0.91, 0.784);
  vec3 gold = vec3(0.91, 0.73, 0.32);
  float warmMix = smoothstep(0.16, 0.72, vWarmth);
  float goldMix = smoothstep(0.82, 1.0, vWarmth);
  vec3 color = mix(ice, coldWhite, 0.35);
  color = mix(color, warmWhite, warmMix * (1.0 - goldMix));
  color = mix(color, gold, goldMix);

  gl_FragColor = vec4(color, core * vAlpha * vBrightness);
}
