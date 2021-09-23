import React, { useRef } from 'react';

interface Props {
  fragmentShader: string;
  vertexShader: string;
}

const Canvas: React.FC<Props> = ({fragmentShader, vertexShader}) => {
  const canvasRef = useRef(null);



  return <canvas ref={canvasRef}/>
}