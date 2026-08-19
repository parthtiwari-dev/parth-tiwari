precision highp float;

/**
 * The centre star (PLAN.md 8.5 — DESIGN.md §5).
 *
 * **What was here before, and why it went.** A thin-film interference shader —
 * genuinely the physics of a soap bubble, three cosines and a Fresnel term,
 * modelled on Dogstudio's KIKK piece. It was correct and it was wrong. Read at
 * distance it resolved to a flat green disc with a violet rim, a pea sitting
 * next to the project nodes and easily mistaken for one; flown past at close
 * range it filled the frame as a ball of concentric rainbow rings. Two frames
 * out of a scroll capture settled it. A soap bubble is a beautiful object and
 * it is not a star, and this one is the origin of a coordinate system whose
 * every radius is measured from it.
 *
 * **What a star actually looks like.** Not a lit sphere — it emits, so there is
 * no terminator and no shadow side. The two things that make a photographed
 * star read as one are *limb darkening* (the disc is brightest dead centre and
 * falls off toward the edge, because near the limb you are looking through more
 * of a cooler outer atmosphere) and a colour temperature that runs hot-white in
 * the core to its spectral tint at the edge. Both are cheap, and between them
 * they carry the whole illusion.
 *
 * The output deliberately exceeds 1.0 in the core. The scene renders to a
 * half-float buffer with a bloom pass over it, so values above the threshold
 * bleed — which is how a real overexposed highlight behaves and the only way a
 * 0.42-unit sphere reads as something with a furnace inside it.
 */

uniform float uTime;
uniform vec3 uTint;
uniform float uOpacity;

varying vec3 vNormal;
varying vec3 vViewDir;

/** Cheap value noise, for the granulation. */
float hash(vec2 p) {
  p = fract(p * vec2(127.1, 311.7));
  p += dot(p, p + 42.7);
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

void main() {
  vec3 normal = normalize(vNormal);
  float facing = clamp(dot(normal, normalize(vViewDir)), 0.0, 1.0);

  // Limb darkening. The exponent is the whole shape of the disc: near 1.0 the
  // sphere reads as a flat card, and much above 0.5 it collapses to a point
  // with a dark ring. 0.36 is the value at which the falloff is visible as a
  // *sphere* without the edge going black.
  float limb = pow(facing, 0.36);

  // Granulation — convection cells. Sampled in normal space so the pattern is
  // fixed to the surface and tumbles with the mesh rather than swimming across
  // it, which is the tell of a screen-space texture. Very low contrast: it is
  // there to stop the gradient reading as a CSS radial-gradient, not to be
  // seen.
  float cells = noise(normal.xy * 7.4 + uTime * 0.02)
    * 0.6 + noise(normal.zy * 15.1 - uTime * 0.014) * 0.4;
  float granulation = 0.94 + cells * 0.12;

  // Core to limb: white-hot through the tint. `uTint` is the same `--gold` the
  // legend uses, so the star and its swatch cannot disagree.
  vec3 core = mix(uTint, vec3(1.0), limb * limb);

  // Past 1.0 on purpose — see the note at the top about the bloom pass.
  vec3 color = core * (0.30 + limb * 2.35) * granulation;

  // A thin chromatic fringe at the very edge, and *only* there. This is all
  // that survives of the thin-film idea: a hint of spectral separation where
  // the sightline grazes the atmosphere. Confined to the outer few percent of
  // the disc, because the moment it spreads inward the beach ball is back.
  float rim = smoothstep(0.34, 0.02, facing);
  vec3 fringe = vec3(
    0.5 + 0.5 * cos(rim * 5.2),
    0.5 + 0.5 * cos(rim * 5.2 + 2.09),
    0.5 + 0.5 * cos(rim * 5.2 + 4.18)
  );
  color += fringe * rim * 0.16;

  // Opaque across the disc. The old material was transparent with
  // `depthWrite: false`, which let the particle field show through the star —
  // a body you can see stars behind is not a body.
  float alpha = uOpacity;

  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  color += (grain - 0.5) * 0.0045;

  gl_FragColor = vec4(color, alpha);
}
