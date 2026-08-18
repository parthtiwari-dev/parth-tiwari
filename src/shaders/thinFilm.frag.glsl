precision highp float;

/**
 * Thin-film interference on the centre star (PLAN.md 6.7 — DESIGN.md §5).
 *
 * The colour is not painted on; it is the physics. Light reflecting off the top
 * and bottom of a very thin film travels different distances, and wavelengths
 * whose half-period matches that difference cancel while others reinforce. That
 * is why a soap bubble is banded rather than tinted, and why the bands *move*
 * with viewing angle — which is the whole effect. Dogstudio's KIKK bubble is the
 * reference, and it is cheap: three cosines and a Fresnel term.
 */

uniform float uTime;
uniform vec3 uTint;
uniform float uOpacity;

varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  vec3 normal = normalize(vNormal);
  float facing = clamp(dot(normal, normalize(vViewDir)), 0.0, 1.0);

  // Optical path difference, standing in for film thickness × angle. Breathing
  // slowly on uTime so the bands drift rather than sit — a static interference
  // pattern reads as a texture, and the movement is the tell that it is not one.
  //
  // Both the film thickness and the grazing-angle floor are much lower than a
  // literal reading of the physics wants. `thickness / facing` diverges at the
  // limb, and at the first values tried it packed eight concentric rings into
  // the silhouette — a dartboard, not a bubble. A real soap film shows two or
  // three broad bands, so the frequency is low and the floor is high enough to
  // stop the rim from ringing.
  float thickness = 1.05 + sin(uTime * 0.22) * 0.16;
  float path = thickness / max(facing, 0.34);

  // Three samples of the interference term, offset to stand for R, G and B
  // wavelengths. Equal spacing is the approximation that keeps this three
  // cosines instead of a spectral integral.
  vec3 interference = 0.5 + 0.5 * cos(vec3(
    path * 2.4,
    path * 2.4 + 2.09,
    path * 2.4 + 4.18
  ));
  // Desaturate toward white. Full-strength interference is a pure spectrum,
  // which on a small sphere against a near-black sky reads as a toy. A film is
  // mostly pale with colour concentrated where it thins.
  interference = mix(vec3(dot(interference, vec3(0.333))), interference, 0.55);

  // Fresnel: grazing angles reflect far more, which is why a bubble's rim is the
  // bright, saturated part and its centre is nearly clear.
  float fresnel = pow(1.0 - facing, 2.4);

  // Interference leads, tint only warms it.
  //
  // The first balance had this the other way round — tint at 0.72 and
  // interference at 0.28 — and because the tint is gold, a sphere facing the
  // camera resolved to a flat muddy olive with the bands invisible underneath.
  // The bands *are* the material; anything that outweighs them turns a soap
  // bubble back into a painted ball.
  // The base term matters more than it looks. At the centre of the sphere the
  // Fresnel contribution is zero by definition, so whatever is left is the whole
  // colour there — set it too low and a bubble reads as a dark hole punched in
  // the sky rather than as a thin film catching light.
  vec3 color = interference * (0.88 + fresnel * 1.05) + uTint * 0.18;
  float alpha = (0.58 + fresnel * 0.42) * uOpacity;

  // Dither, as everywhere else in this scene (6.9).
  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  color += (grain - 0.5) * 0.0045;

  gl_FragColor = vec4(color, alpha);
}
