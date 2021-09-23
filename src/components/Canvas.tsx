import React, { useRef } from 'react';
import useResizeObserver from 'use-resize-observer';

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>({} as HTMLCanvasElement);

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

  return (
    <canvas id="webgl_canvas" className="w-screen h-screen" ref={canvasRef} />
  );
};
