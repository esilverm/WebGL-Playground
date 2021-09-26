// adapted from https://codesandbox.io/s/webgl-triangle-e90o1?from-embed=&file=/src/utils/webgl.js:0-1600

const VERTEX_SIZE = 3;

export const getGLContext = (
  canvas: HTMLCanvasElement
): WebGLRenderingContext => {
  const gl = canvas.getContext('webgl');

  if (!gl) {
    throw new Error('error creating webgl rendering context');
  }

  return gl;
};

export const getShader = (
  gl: WebGLRenderingContext,
  shaderSource: string,
  shaderType: number
): WebGLShader => {
  const shader = gl.createShader(shaderType);

  if (!shader) {
    throw new Error('error creating shader');
  }

  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
  }

  return shader;
};

export const getProgram = (
  gl: WebGLRenderingContext,
  vs: WebGLShader,
  fs: WebGLShader
): WebGLProgram => {
  const program = gl.createProgram();

  if (!program) {
    throw new Error('error creating webgl program');
  }

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.useProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
  }

  return program;
};

export const createAndBindBuffer = (
  gl: WebGLRenderingContext,
  bufferType: number,
  typeOfDrawing: number,
  data: BufferSource
): WebGLBuffer => {
  const buffer = gl.createBuffer();

  if (!buffer) {
    throw new Error('error creating webgl buffer');
  }

  gl.bindBuffer(bufferType, buffer);
  gl.bufferData(bufferType, data, typeOfDrawing);

  return buffer;
};

export const linkGPUAndCPU = (
  gl: WebGLRenderingContext,
  {
    program,
    channel,
    buffer,
  }: { program: WebGLProgram; channel: number; buffer: WebGLBuffer }
): void => {
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

export const setUniform = (
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  type: string,
  name: string,
  a: unknown,
  b?: unknown,
  c?: unknown,
  d?: unknown,
  e?: unknown,
  f?: unknown
) => {
  if (gl) {
    let loc = gl.getUniformLocation(program, name);

    // Setting the uniform this way isn't typescript friendly, but this wrapper around setting uniforms is a lot more helpful
    //@ts-ignore
    gl[`uniform${type}`](loc, a, b, c, d, e, f);
  }
};
