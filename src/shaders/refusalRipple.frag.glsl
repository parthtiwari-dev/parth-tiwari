precision highp float;

uniform float uTime;
uniform float uActive;

varying vec2 vUv;

void main() {
  float dist = distance(vUv, vec2(0.5));
  float wave = smoothstep(0.035, 0.0, abs(dist - uTime * 0.32));
  float envelope = smoothstep(0.0, 0.2, uTime) * (1.0 - smoothstep(2.2, 3.0, uTime));
  float alpha = wave * envelope * uActive * 0.08;
  gl_FragColor = vec4(0.792, 0.659, 0.298, alpha);
}
