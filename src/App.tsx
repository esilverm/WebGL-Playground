import Editor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React, { useRef } from 'react';

import { language, conf } from './monaco/glsl';
import { theme } from './monaco/theme';

loader.init().then((monaco) => {
  monaco.languages.register({ id: 'glsl' });

  monaco.languages.setMonarchTokensProvider('glsl', language);
  monaco.languages.setLanguageConfiguration('glsl', conf);

  monaco.editor.defineTheme('glsl-dark', theme);
});

const initialFragShader =
  `
uniform float uTime;
varying vec3 vPos;

void main() {
  vec3 color = vec3(0., 0., 0.);

  gl_FragColor = vec3(sqrt(color), 1.);
}

`.trim() + '\n';

function App() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  return (
    <div className="App">
      <Editor
        height="100vh"
        width="70vw"
        defaultLanguage="glsl"
        theme="glsl-dark"
        defaultValue={initialFragShader}
        onMount={(editor) => (editorRef.current = editor)}
        options={{
          minimap: {
            enabled: false,
          },
        }}
      />
    </div>
  );
}

export default App;
