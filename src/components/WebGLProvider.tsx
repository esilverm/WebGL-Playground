/* eslint-disable no-new-func */
import React, { createContext, useContext, useEffect, useState } from 'react';

import { parseWebGLError, WebGLErrorMarker } from '../helpers/errors';
import * as glslx from '../helpers/glslx.min';
import { useDebouncedState } from '../hooks/UseDebouncedState';

const initialEditorFragmentShader =
  `
varying vec3 vPos;
  
void main() {
  gl_FragColor = vec4(sqrt(vPos), 1.);
}`.trim() + '\n';

const initialVertexShader =
  `
attribute vec3 aPos;
varying   vec3 vPos;

void main() {
  gl_Position = vec4((uAspect * vec4((vPos=aPos), 1.)).xyz, 1.);
}`.trim() + '\n';

const initialRenderValue =
  `
S.setUniform('1f', 'uTime', time);
S.gl.drawArrays(S.gl.TRIANGLE_STRIP, 0, 4);
`.trim() + '\n';

export const shaderHeader = `
precision highp float;
uniform mat4 uAspect;
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
      monacoMarkers?: WebGLErrorMarker[];
    };
  };
  setEditorVertexShader: React.Dispatch<React.SetStateAction<string>>;
  setEditorFragmentShader: React.Dispatch<React.SetStateAction<string>>;
  initCallable: Function;
  renderCallable: Function;
}>({
  vertexShader: '',
  editorVertexShader: '',
  editorFragmentShader: '',
  fragmentShader: '',
  files: {},
  setEditorVertexShader: () => {},
  setEditorFragmentShader: () => {},
  initCallable: () => {},
  renderCallable: () => {},
});

export const WebGLProvider: React.FC = ({ children }) => {
  const [editorFragmentShader, setEditorFragmentShader] = useDebouncedState(
    initialEditorFragmentShader
  );
  const [editorVertexShader, setEditorVertexShader] =
    useDebouncedState(initialVertexShader);
  const [initContent, setInitContent] = useDebouncedState('');
  const [renderContent, setRenderContent] =
    useDebouncedState(initialRenderValue);
  const [eventsContent, setEventsContent] = useDebouncedState('');

  const [fragmentMarkers, setFragmentMarkers] = useState<WebGLErrorMarker[]>(
    [] as WebGLErrorMarker[]
  );
  const [vertexMarkers, setVertexMarkers] = useState<WebGLErrorMarker[]>(
    [] as WebGLErrorMarker[]
  );

  const [initCallable, setInitCallable] = useState<{ f: Function }>({
    f: new Function(),
  });
  const [renderCallable, setRenderCallable] = useState<{ f: Function }>({
    f: new Function(),
  });
  // when fragment shader and vertex shaders are updated, validate them and pass model markers to

  useEffect(() => {
    //@ts-ignore
    const compiledGLSLX = glslx.compile(shaderHeader + editorFragmentShader);
    if (compiledGLSLX.output === null) {
      setFragmentMarkers(parseWebGLError(compiledGLSLX.log));
    } else {
      setFragmentMarkers([]);
    }
  }, [editorFragmentShader]);

  useEffect(() => {
    //@ts-ignore
    const compiledGLSLX = glslx.compile(shaderHeader + editorVertexShader);
    if (compiledGLSLX.output === null) {
      setVertexMarkers(parseWebGLError(compiledGLSLX.log));
    } else {
      setVertexMarkers([]);
    }
  }, [editorVertexShader]);

  useEffect(() => {
    const initCode = `
    const S = {};
    try {
    ${initContent}
    } catch (e) {
      console.error('init error:',  e);
    }
    return S;
    `;

    try {
      setInitCallable({ f: new Function(initCode) });
    } catch (e) {
      console.error('not a function');
    }
  }, [initContent]);

  useEffect(() => {
    const renderCode = `
    try {
      ${renderContent}
    } catch (e) {
      console.error('render error:',  e);
    }
    return S;
    `;

    try {
      setRenderCallable({ f: new Function('S', 'time', renderCode) });
    } catch (e) {
      console.error('not a function');
    }
  }, [renderContent]);

  return (
    <WebGLContext.Provider
      value={{
        editorFragmentShader,
        editorVertexShader,
        fragmentShader: shaderHeader + editorFragmentShader,
        vertexShader: shaderHeader + editorVertexShader,
        files: {
          init: {
            name: 'init.js',
            language: 'javascript',
            value: initContent,
            setValue: setInitContent,
          },
          fragment: {
            name: 'fragment.glsl',
            language: 'glsl',
            value: editorFragmentShader,
            setValue: setEditorFragmentShader,
            monacoMarkers: fragmentMarkers,
          },
          vertex: {
            name: 'vertex.glsl',
            language: 'glsl',
            value: editorVertexShader,
            setValue: setEditorVertexShader,
            monacoMarkers: vertexMarkers,
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
        initCallable: initCallable.f,
        renderCallable: renderCallable.f,
      }}
    >
      {children}
    </WebGLContext.Provider>
  );
};

export const useWebGL = () => useContext(WebGLContext);
