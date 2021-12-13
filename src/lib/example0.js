export const example0 = {
  init: ``,
  fragment: `
  varying vec3 vPos;
  
  void main() {
    gl_FragColor = vec4(sqrt(vPos), 1.);
  }
  `,
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
