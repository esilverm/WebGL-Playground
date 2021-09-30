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
    // there is an error within the code of our shader (we can get this error from glslx instead)
    // console.error(gl.getShaderInfoLog(shader));
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
    // the current shader is invalid
    //console.error(`Program error: ${gl.getProgramInfoLog(program)}`);
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

  // Compute a projection matrix to handle the aspect ratio
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const fieldOfViewRadians = Math.PI * (40 / 180);
  const projection = perspective(fieldOfViewRadians, aspect, 0, 2000);

  setUniform(
    gl,
    program,
    'Matrix4fv',
    'uAspect',
    false,
    projection as Float32List
  );

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clearDepth(-1);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  const aPos = gl.getAttribLocation(program, 'aPos');
  gl.bindBuffer(channel, buffer);
  gl.enableVertexAttribArray(aPos);
  const bpe = Float32Array.BYTES_PER_ELEMENT;
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

// Perspective matrix function from https://stackoverflow.com/questions/30429523/webgl-perspective-projection-matrix
function perspective(
  fieldOfViewRadians: number,
  aspect: number,
  zNear: number,
  zFar: number
) {
  const dst = new Float32Array(16);

  const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewRadians);
  const rangeInv = 1.0 / (zNear - zFar);

  dst[0] = f / aspect;
  dst[1] = 0;
  dst[2] = 0;
  dst[3] = 0;

  dst[4] = 0;
  dst[5] = f;
  dst[6] = 0;
  dst[7] = 0;

  dst[8] = 0;
  dst[9] = 0;
  dst[10] = (zNear + zFar) * rangeInv;
  dst[11] = -1;

  dst[12] = 0;
  dst[13] = 0;
  dst[14] = zNear * zFar * rangeInv * 2;
  dst[15] = 0;

  return dst;
}
