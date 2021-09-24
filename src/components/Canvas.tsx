import React, { useRef, useEffect } from 'react';
import useResizeObserver from 'use-resize-observer';

import WebGLUtils from '../helpers/webgl';

import { useWebGL } from './WebGLProvider';

const webGL = new WebGLUtils();
const coordinates = [-1, 1, 0, 1, 1, 0, -1, -1, 0, 1, -1, 0];

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>({} as HTMLCanvasElement);
  const { vertexShader, fragmentShader } = useWebGL();
  // Resize our canvas to full screen
  useResizeObserver<HTMLCanvasElement>({
    ref: canvasRef,
    box: 'content-box',
    onResize: ({ width, height }) => {
      if (width && height) {
        const dpr = window.devicePixelRatio;

        canvasRef.current.width = Math.round(width * dpr);
        canvasRef.current.height = Math.round(width * dpr);
      }
    },
  });

  useEffect(() => {
    const gl: WebGLRenderingContext = webGL.getGLContext(canvasRef.current);
    const vs: WebGLShader = webGL.getShader(gl, vertexShader, gl.VERTEX_SHADER);
    const fs: WebGLShader = webGL.getShader(
      gl,
      fragmentShader,
      gl.FRAGMENT_SHADER
    );
    const program = webGL.getProgram(gl, vs, fs);

    const buffer = webGL.createAndBindBuffer(
      gl,
      gl.ARRAY_BUFFER,
      gl.STATIC_DRAW,
      new Float32Array(coordinates)
    );

    webGL.linkGPUAndCPU(gl, {
      program,
      channel: gl.ARRAY_BUFFER,
      buffer,
    });

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }, [fragmentShader, vertexShader]);

  return <canvas className="w-screen h-screen" ref={canvasRef}></canvas>;
};
