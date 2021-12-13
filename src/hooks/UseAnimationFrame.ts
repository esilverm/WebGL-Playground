/* eslint-disable react-hooks/rules-of-hooks */
// adapted from
// https://github.com/franciscop/use-animation-frame/blob/master/index.js
import { useEffect, useRef } from 'react';

type AnimationFrame = {
  time: number;
  delta: number;
};

export const useAnimationFrame = (
  callback: (a: AnimationFrame) => void,
  dependencies: Array<any>
) => {
  if (typeof performance === 'undefined' || typeof window === 'undefined') {
    return;
  }

  const frame = useRef<number>(0);
  const last = useRef(performance.now());
  const init = useRef(performance.now());

  const animate = () => {
    const now = performance.now();
    const time = (now - init.current) / 1000;
    const delta = (now - last.current) / 1000;
    // In seconds ~> you can do ms or anything in userland
    callback({ time, delta });
    last.current = now;
    frame.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    frame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies); // Make sure to change it if the deps change
};
