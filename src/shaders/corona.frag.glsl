precision highp float;

/**
 * The centre star's corona (PLAN.md 8.5).
 *
 * A billboard whose brightness falls off from the centre, standing in for the
 * light that a real star throws outside its own silhouette. It is what makes
 * the body read as an emitter rather than as a sphere painted bright — the
 * shipped version had no such layer, and no amount of work on the disc itself
 * substituted for it.
 *
 * Two falloffs summed rather than one: a tight bright core that hugs the
 * silhouette and sells the overexposure, and a very wide faint halo that gives
 * the eye something to find the star by from across the constellation. A single
 * exponent can be one or the other and reads as a vignette either way.
 */

uniform float uTime;
uniform vec3 uTint;
uniform float uOpacity;

varying vec2 vUv;

void main() {
  // The plane is sized to the corona's full extent, so the body's own disc is
  // a small circle at the centre of it.
  float r = length(vUv - 0.5) * 2.0;
  if (r > 1.0) discard;

  // `1/(1+kr^2)` rather than an exponential: it has a real tail, which is what
  // a scattering halo has, where `exp` goes to nothing and leaves a visible
  // edge where the plane ends.
  float inner = 1.0 / (1.0 + 92.0 * r * r);
  float outer = 1.0 / (1.0 + 7.5 * r * r);

  // Breathing, at a different rate from the body's tumble so the two never
  // beat against each other into a visible pulse.
  float breath = 0.94 + 0.06 * sin(uTime * 0.31);

  vec3 color = mix(uTint, vec3(1.0), 0.62) * inner * 1.35
    + uTint * outer * 0.30;

  // Fade the last of the plane to nothing so its square edge can never show,
  // whatever the falloff constants are set to.
  float edge = 1.0 - smoothstep(0.72, 1.0, r);

  gl_FragColor = vec4(color * breath * edge, uOpacity * edge);
}
