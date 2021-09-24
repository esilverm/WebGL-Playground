import Editor, { loader } from '@monaco-editor/react';
import classnames from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React, { useRef, useState } from 'react';

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
  const [currentFile, setCurrentFile] = useState('fragment');
  const [editorIsVisible, setEditorVisibility] = useState(true);
  const { files } = useWebGL();

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  return (
    <div className="relative h-screen w-screen">
      <Canvas />
      <div
        className="absolute top-0 left-0 m-4 rounded-lg overflow-hidden"
        style={{ height: '95%' }}
      >
        <AnimatePresence>
          {editorIsVisible && (
            <motion.div
              className="h-full w-full"
              style={{ backgroundColor: '#000000CC' }}
              initial={{ x: -1300 }}
              animate={{ x: 0 }}
              exit={{ x: -1300 }}
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
              }}
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
