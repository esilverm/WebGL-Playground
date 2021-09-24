// adapted from https://codesandbox.io/s/webgl-triangle-e90o1?from-embed=&file=/src/utils/webgl.js:0-1600

const VERTEX_SIZE = 3;

export default class WebGLUtils {
  getGLContext(canvas) {
    const gl = canvas.getContext('webgl');

    return gl;
  }

  getShader(gl, shaderSource, shaderType) {
    const shader = gl.createShader(shaderType);

    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
    }

    return shader;
  }

  getProgram(gl, vs, fs) {
    const program = gl.createProgram();

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
    }

    return program;
  }

  createAndBindBuffer(gl, bufferType, typeOfDrawing, data) {
    const buffer = gl.createBuffer();

    gl.bindBuffer(bufferType, buffer);
    gl.bufferData(bufferType, data, typeOfDrawing);
    gl.bindBuffer(bufferType, null);

    return buffer;
  }

  linkGPUAndCPU(gl, { program, channel, buffer }) {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearDepth(-1);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    let aPos = gl.getAttribLocation(program, 'aPos');
    gl.bindBuffer(channel, buffer);
    gl.enableVertexAttribArray(aPos);

    let bpe = Float32Array.BYTES_PER_ELEMENT;
    gl.vertexAttribPointer(
      aPos,
      3,
      gl.FLOAT,
      false,
      VERTEX_SIZE * bpe,
      0 * bpe
    );
  }
}
