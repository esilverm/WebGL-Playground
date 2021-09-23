import Editor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React, { useRef, useState } from 'react';

import { Canvas } from './components/Canvas';
import { useWebGL, WebGLProvider } from './components/WebGLProvider';
import { language, conf } from './monaco/glsl';
import { theme } from './monaco/theme';

loader.init().then((monaco) => {
  monaco.languages.register({ id: 'glsl' });

  monaco.languages.setMonarchTokensProvider('glsl', language);
  monaco.languages.setLanguageConfiguration('glsl', conf);

  monaco.editor.defineTheme('glsl-dark', theme);
});

function App() {
  const [currentFile, setCurrentFile] = useState('fragment');
  const { files } = useWebGL();

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  return (
    <div className="relative h-screen w-screen">
      <Canvas />
      <div
        className="absolute top-0 left-0 m-4 rounded-lg overflow-hidden"
        style={{ backgroundColor: '#000000CC', height: '95%' }}
      >
        <div className="absolute uppercase text-white right-0 top-0 z-20 py-4 px-6 font-semibold tracking-wider font-sans">
          {files[currentFile].language === 'glsl'
            ? 'webgl'
            : files[currentFile].language}
        </div>
        <Editor
          height="100%"
          width="60vw"
          theme="glsl-dark"
          path={files[currentFile].name}
          language={files[currentFile].language}
          value={files[currentFile].value}
          onMount={(editor) => (editorRef.current = editor)}
          onChange={(value) => files[currentFile].setValue(value ?? '')}
          keepCurrentModel={true}
          options={{
            fontSize: 18,
            formatOnPaste: true,
            showUnused: true,
            minimap: {
              enabled: false,
            },
            scrollBeyondLastLine: false,
            scrollbar: {
              verticalScrollbarSize: 16,
            },
            padding: {
              top: 16,
            },
            // NOTE: if the wrapping gets annoying we can just turn it to "on"
            wordWrap: 'bounded',
          }}
        />
      </div>
    </div>
  );
}

const AppWithProviders = () => {
  return (
    <WebGLProvider>
      <App />
    </WebGLProvider>
  );
};

export default AppWithProviders;
