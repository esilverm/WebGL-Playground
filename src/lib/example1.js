export const example1 = {
  init: ``,
  fragment: `
// uniform float uTime;
varying vec3 vPos;

float turbulence(vec3 p) {
  float t = 0., f = 1.;
  for (int i = 0 ; i < 10 ; i++) {
    t += abs(noise(f * p)) / f;
    f *= 2.;
  }
return t;
}

vec3 stripes(float x) {
  float t = pow(sin(x) * .5 + .5, .1);
  return vec3(t, t*t, t*t*t);
}

void main() {
  vec3 p = 6.*vPos; 
  vec3 color = stripes(p.x+5.*turbulence(p/5.));
  gl_FragColor = vec4(sqrt(color), 1.);
}`,
  vertex: `
attribute vec3 aPos;
varying   vec3 vPos;

void main() {
  gl_Position = vec4((uAspect * vec4((vPos=aPos), 1.)).xyz, 1.);
}`,
  render: `
  S.setUniform('1f', 'uTime', time);
S.gl.drawArrays(S.gl.TRIANGLE_STRIP, 0, 4);
`,
  events: ``,
};
