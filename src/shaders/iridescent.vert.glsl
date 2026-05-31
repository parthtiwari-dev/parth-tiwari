varying vec2 vUv;
varying vec3 vDir;

void main() {
  vUv = uv;
  vDir = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
