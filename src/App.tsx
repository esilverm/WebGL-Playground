import Editor, { loader, useMonaco } from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React, { useEffect, useRef, useState } from 'react';

import { Canvas } from './components/Canvas';
import { EditorToggle } from './components/EditorToggle';
import { TimeProvider } from './components/TimeProvider';
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentFile, setCurrentFile] = useState('fragment');
  const [editorIsVisible, setEditorVisibility] = useState(true);
  const { files } = useWebGL();
  const monaco = useMonaco();

  // INFO: If we are in an editor that provides monacoMarkers, show them with our code when they appear
  useEffect(() => {
    if (monaco && monaco.editor && files[currentFile].monacoMarkers) {
      const model = monaco.editor.getModels();

      monaco.editor.setModelMarkers(
        model[0],
        'glsl',
        files[currentFile].monacoMarkers as monaco.editor.IMarkerData[]
      );
    }
  }, [currentFile, files, monaco]);

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  return (
    <div className="relative h-screen w-screen">
      <Canvas />
      <div className="absolute top-0 left-0 m-4 " style={{ height: '95%' }}>
        <AnimatePresence>
          {editorIsVisible && (
            <motion.div
              className="h-full w-full rounded-b-lg overflow-hidden"
              initial={{ x: -1300 }}
              animate={{ x: 0 }}
              exit={{ x: -1300 }}
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
              }}
            >
              <div className="h-10 w-full flex justify-start items-center my-1">
                {Object.keys(files).map((key) => {
                  const { name } = files[key];
                  return (
                    <div
                      key={name}
                      className="mx-1 px-4 py-0.5 text-white capitalize font-mono rounded cursor-pointer select-none"
                      style={{ backgroundColor: '#000000CC' }}
                      onClick={() => {
                        setCurrentFile(name.split('.')[0]);
                      }}
                    >
                      {name.split('.')[0]}
                    </div>
                  );
                })}
              </div>
              <div
                className="h-full w-full relative rounded-lg overflow-hidden"
                style={{ backgroundColor: '#000000CC' }}
              >
                <div className="absolute uppercase  text-white right-0 top-0 z-20 py-4 px-6 font-semibold tracking-wider font-sans cursor-text select-none">
                  {files[currentFile].language === 'glsl' ? 'webgl' : 'js'}
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
            </motion.div>
          )}
        </AnimatePresence>
        <EditorToggle open={editorIsVisible} onClick={setEditorVisibility} />
      </div>
    </div>
  );
}

const AppWithProviders = () => {
  return (
    <WebGLProvider>
      <TimeProvider>
        <App />
      </TimeProvider>
    </WebGLProvider>
  );
};

export default AppWithProviders;
