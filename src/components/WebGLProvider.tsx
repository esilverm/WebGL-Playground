import React, { createContext, useContext, useState } from 'react';

const initialEditorFragmentShader =
  `
// uniform float uTime;
varying vec3 vPos;

void main() {
  gl_FragColor = vec4(sqrt(vPos), 1.);
}`.trim() + '\n';

const initialVertexShader =
  `
attribute vec3 aPos;
varying   vec3 vPos;

void main() {
  gl_Position = vec4(vPos=aPos, 1.);
}`.trim() + '\n';

export const shaderHeader = `
precision highp float;
float noise(vec3 v) {
   vec4 r[2];
   const mat4 E = mat4(0.,0.,0.,0., 0.,.5,.5,0., .5,0.,.5,0., .5,.5,0.,0.);
   for (int j = 0 ; j < 2 ; j++)
   for (int i = 0 ; i < 4 ; i++) {
      vec3 p = .60*v + E[i].xyz, C = floor(p), P = p - C-.5, A = abs(P), D;
      C += mod(C.x+C.y+C.z+float(j),2.) * step(max(A.yzx,A.zxy),A)*sign(P);
      D  = 314.1*sin(59.2*float(i+4*j) + 65.3*C + 58.9*C.yzx + 79.3*C.zxy);
      r[j][i] = dot(P=p-C-.5,fract(D)-.5) * pow(max(0.,1.-2.*dot(P,P)),4.);
   }
   return 6.50 * (r[0].x+r[0].y+r[0].z+r[0].w+r[1].x+r[1].y+r[1].z+r[1].w);
}\n`;

export const WebGLContext = createContext<{
  editorVertexShader: string;
  editorFragmentShader: string;
  vertexShader: string;
  fragmentShader: string;
  files: {
    [name: string]: {
      name: string;
      language: string;
      value: string;
      setValue: React.Dispatch<React.SetStateAction<string>>;
    };
  };
  setEditorVertexShader: React.Dispatch<React.SetStateAction<string>>;
  setEditorFragmentShader: React.Dispatch<React.SetStateAction<string>>;
}>({
  vertexShader: '',
  editorVertexShader: '',
  editorFragmentShader: '',
  fragmentShader: '',
  files: {},
  setEditorVertexShader: () => {},
  setEditorFragmentShader: () => {},
});

export const WebGLProvider: React.FC = ({ children }) => {
  const [editorFragmentShader, setEditorFragmentShader] = useState(
    initialEditorFragmentShader
  );
  const [editorVertexShader, setEditorVertexShader] =
    useState(initialVertexShader);
  const [initContent, setInitContent] = useState('');
  const [renderContent, setRenderContent] = useState('');
  const [eventsContent, setEventsContent] = useState('');

  return (
    <WebGLContext.Provider
      value={{
        editorFragmentShader,
        editorVertexShader,
        fragmentShader: shaderHeader + editorFragmentShader,
        vertexShader: shaderHeader + editorVertexShader,
        files: {
          fragment: {
            name: 'fragment.glsl',
            language: 'glsl',
            value: editorFragmentShader,
            setValue: setEditorFragmentShader,
          },
          vertex: {
            name: 'vertex.glsl',
            language: 'glsl',
            value: editorVertexShader,
            setValue: setEditorVertexShader,
          },
          init: {
            name: 'init.js',
            language: 'javascript',
            value: initContent,
            setValue: setInitContent,
          },
          render: {
            name: 'render.js',
            language: 'javascript',
            value: renderContent,
            setValue: setRenderContent,
          },
          events: {
            name: 'events.js',
            language: 'javascript',
            value: eventsContent,
            setValue: setEventsContent,
          },
        },
        setEditorFragmentShader,
        setEditorVertexShader,
      }}
    >
      {children}
    </WebGLContext.Provider>
  );
};

export const useWebGL = () => useContext(WebGLContext);
