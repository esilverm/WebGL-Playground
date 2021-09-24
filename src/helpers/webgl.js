// adapted from https://codesandbox.io/s/webgl-triangle-e90o1?from-embed=&file=/src/utils/webgl.js:0-1600

const VERTEX_SIZE = 3;

export const getGLContext = (canvas) => {
  const gl = canvas.getContext('webgl');

  return gl;
};

export const getShader = (gl, shaderSource, shaderType) => {
  const shader = gl.createShader(shaderType);

  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
  }

  return shader;
};

export const getProgram = (gl, vs, fs) => {
  const program = gl.createProgram();

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.useProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
  }

  return program;
};

export const createAndBindBuffer = (gl, bufferType, typeOfDrawing, data) => {
  const buffer = gl.createBuffer();

  gl.bindBuffer(bufferType, buffer);
  gl.bufferData(bufferType, data, typeOfDrawing);

  return buffer;
};

export const linkGPUAndCPU = (gl, { program, channel, buffer }) => {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clearDepth(-1);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  let aPos = gl.getAttribLocation(program, 'aPos');
  gl.bindBuffer(channel, buffer);
  gl.enableVertexAttribArray(aPos);
  let bpe = Float32Array.BYTES_PER_ELEMENT;
  gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, VERTEX_SIZE * bpe, 0 * bpe);
};

export const setUniform = (gl, program, type, name, a, b, c, d, e, f) => {
  if (gl) {
    let loc = gl.getUniformLocation(program, name);
    gl[`uniform${type}`](loc, a, b, c, d, e, f);
  }
};
