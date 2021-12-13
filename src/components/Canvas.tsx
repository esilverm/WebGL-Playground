import React, { useRef, useEffect, useState } from 'react';
import useResizeObserver from 'use-resize-observer';

import {
  createAndBindBuffer,
  getGLContext,
  getProgram,
  getShader,
  linkGPUAndCPU,
  setUniform,
} from '../helpers/webgl';
import { useAnimationFrame } from '../hooks/UseAnimationFrame';

import { useWebGL } from './WebGLProvider';

const coordinates = [-1, 1, 0, 1, 1, 0, -1, -1, 0, 1, -1, 0];

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>({} as HTMLCanvasElement);
  const { vertexShader, fragmentShader, files, initCallable, renderCallable } =
    useWebGL();
  // const { time } = useTime();
  const [webglGlobalState, setWebglGlobalState] = useState<{
    gl: WebGLRenderingContext | null;
    vs: WebGLShader | null;
    fs: WebGLShader | null;
    program: WebGLProgram | null;
  }>({ gl: null, vs: null, fs: null, program: null });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [S, setS] = useState<{ [key: string]: any }>({});

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

  // When any of our files change, we will re-render the canvas and call init
  useEffect(() => {
    if (initCallable) {
      setS(initCallable());
    }
    const gl: WebGLRenderingContext = getGLContext(canvasRef.current);
    const vs: WebGLShader = getShader(gl, vertexShader, gl.VERTEX_SHADER);
    const fs: WebGLShader = getShader(gl, fragmentShader, gl.FRAGMENT_SHADER);
    if (!vs || !fs) {
      return;
    }

    const program: WebGLProgram = getProgram(gl, vs, fs);

    setWebglGlobalState({ gl, vs, fs, program });
  }, [files, fragmentShader, initCallable, vertexShader]);

  useAnimationFrame(
    ({ time, delta }) => {
      const { gl, vs, fs, program } = webglGlobalState;

      if (!gl || !vs || !fs || !program) {
        return;
      }

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

      if (renderCallable) {
        setS((S) => {
          if (S && !S.setUniform && !S.gl) {
            S.setUniform = (
              type: string,
              name: string,
              a: unknown,
              b?: unknown,
              c?: unknown,
              d?: unknown,
              e?: unknown,
              f?: unknown
            ) => setUniform(gl, program, type, name, a, b, c, d, e, f);

            S.gl = gl;
          }

          return renderCallable(S, time);
        });
      }
    },
    [fragmentShader, renderCallable, vertexShader, webglGlobalState]
  );

  return <canvas className="w-screen h-screen" ref={canvasRef} />;
};
