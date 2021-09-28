import React, { useRef, useEffect } from 'react';
import useResizeObserver from 'use-resize-observer';

import {
  createAndBindBuffer,
  getGLContext,
  getProgram,
  getShader,
  linkGPUAndCPU,
  setUniform,
} from '../helpers/webgl';

import { useTime } from './TimeProvider';
import { useWebGL } from './WebGLProvider';

const coordinates = [-1, 1, 0, 1, 1, 0, -1, -1, 0, 1, -1, 0];

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>({} as HTMLCanvasElement);
  const { vertexShader, fragmentShader } = useWebGL();
  const { time } = useTime();
  // Resize our canvas to full screen
  useResizeObserver<HTMLCanvasElement>({
    ref: canvasRef,
    box: 'content-box',
    onResize: ({ width, height }) => {
      if (width && height) {
        const dpr = window.devicePixelRatio;

        canvasRef.current.width = Math.round(width * dpr);
        canvasRef.current.height = Math.round(height * dpr);
      }
    },
  });

  useEffect(() => {
    const gl: WebGLRenderingContext = getGLContext(canvasRef.current);
    const vs: WebGLShader = getShader(gl, vertexShader, gl.VERTEX_SHADER);
    const fs: WebGLShader = getShader(gl, fragmentShader, gl.FRAGMENT_SHADER);
    const program: WebGLProgram = getProgram(gl, vs, fs);

    const buffer = createAndBindBuffer(
      gl,
      gl.ARRAY_BUFFER,
      gl.STATIC_DRAW,
      new Float32Array(coordinates)
    );

    linkGPUAndCPU(gl, {
      program,
      channel: gl.ARRAY_BUFFER,
      buffer,
    });

    setUniform(gl, program, '1f', 'uTime', time);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }, [fragmentShader, time, vertexShader, canvasRef]);

  return <canvas className="w-screen h-screen" ref={canvasRef}></canvas>;
};
