precision highp float;

uniform float uTime;
uniform float uHueShift;

varying vec2 vUv;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;

  for (int i = 0; i < 5; i += 1) {
    value += amplitude * noise(p);
    p *= 2.03;
    amplitude *= 0.5;
  }

  return value;
}

vec3 hsl2rgb(vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
}

void main() {
  vec3 baseColor = vec3(0.002, 0.008, 0.018);
  vec3 upperColor = vec3(0.008, 0.030, 0.062);
  float verticalDepth = smoothstep(0.08, 0.92, vUv.y);
  vec2 nebulaUv = vUv;
  nebulaUv.x *= 1.65;
  float drift = uTime * 0.012;
  float cloudA = fbm((nebulaUv * vec2(1.8, 0.95)) + vec2(drift, -drift * 0.45));
  float cloudB = fbm((nebulaUv * vec2(3.2, 1.9)) + vec2(-drift * 0.4, drift * 0.7));
  float leftWisp = smoothstep(0.54, 0.88, cloudA) * smoothstep(0.82, 0.2, distance(vUv, vec2(0.28, 0.55)));
  float rightWisp = smoothstep(0.56, 0.88, cloudB) * smoothstep(0.78, 0.16, distance(vUv, vec2(0.76, 0.38)));
  float lowerWisp = smoothstep(0.56, 0.92, cloudA + cloudB * 0.4) * smoothstep(0.66, 0.14, distance(vUv, vec2(0.55, 0.14)));
  float nebula = clamp(leftWisp * 0.34 + rightWisp * 0.36 + lowerWisp * 0.22, 0.0, 1.0);
  float filament = smoothstep(0.64, 0.92, fbm((nebulaUv * vec2(6.5, 3.2)) + vec2(drift * 1.4, -drift)));
  float vignette = smoothstep(1.04, 0.16, distance(vUv, vec2(0.52, 0.5)));
  baseColor = mix(baseColor, upperColor, verticalDepth * 0.22);
  float radialNoise = (
    sin((vUv.x * 18.0) + (uTime * 0.035)) *
    cos((vUv.y * 14.0) - (uTime * 0.028))
  ) * 0.006;
  float hue = mod((uHueShift / 360.0) + (uTime * 0.004) + (vUv.x * 0.01) + radialNoise, 1.0);
  vec3 iridescent = hsl2rgb(vec3(hue, 0.08, 0.055));
  vec3 cyanNebula = vec3(0.015, 0.22, 0.38);
  vec3 blueNebula = vec3(0.015, 0.075, 0.22);
  float atmosphereMix = (0.008 + verticalDepth * 0.014) * vignette;
  vec3 color = mix(baseColor, iridescent, atmosphereMix);
  color += mix(blueNebula, cyanNebula, cloudB) * nebula * (0.28 + filament * 0.1);
  color += cyanNebula * filament * nebula * 0.045;
  color *= mix(0.28, 1.0, vignette);
  color += (hash(vUv * 900.0 + uTime * 0.03) - 0.5) * 0.0016;
  gl_FragColor = vec4(color, 1.0);
}
