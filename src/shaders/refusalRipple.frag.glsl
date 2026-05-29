precision highp float;

uniform float uTime;
uniform float uActive;

varying vec2 vUv;

void main() {
  float dist = distance(vUv, vec2(0.5));
  float wave = smoothstep(0.008, 0.0, abs(dist - uTime * 0.18));
  float envelope = smoothstep(0.0, 0.35, uTime) * (1.0 - smoothstep(2.0, 3.0, uTime));
  float alpha = wave * envelope * uActive * 0.004;
  gl_FragColor = vec4(0.62, 0.76, 0.82, alpha);
}
