import Editor, { loader, useMonaco } from '@monaco-editor/react';
import classnames from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React, { useEffect, useRef, useState } from 'react';
import { FiSettings } from 'react-icons/fi';

import { Canvas } from './components/Canvas';
import { EditorToggle } from './components/EditorToggle';
import { useSettings, SettingsProvider } from './components/SettingsProvider';
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
  const [currentValue, setCurrentValue] = useState('');
  const [editorIsVisible, setEditorVisibility] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { files } = useWebGL();
  const monaco = useMonaco();
  const { settings, setSettings } = useSettings();
  const [tempSettings, setTempSettings] = useState(settings);

  // prevent switching issues when doing first switch between files
  useEffect(() => {
    setCurrentValue(files[currentFile].value);
  }, [files, currentFile]);

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
              <div className="h-10 w-full flex justify-between items-center my-1">
                <div className="flex">
                  {Object.keys(files).map((key) => {
                    const { name } = files[key];
                    const isActive = name.split('.')[0] === currentFile;
                    return (
                      <div
                        key={name}
                        className={classnames(
                          'mx-1 px-4 py-0.5 capitalize font-mono rounded cursor-pointer select-none',
                          {
                            'text-black': isActive && !settingsOpen,
                            'text-white': !isActive || settingsOpen,
                          }
                        )}
                        style={{
                          backgroundColor:
                            isActive && !settingsOpen
                              ? '#BABABACC'
                              : '#000000CC',
                        }}
                        onClick={() => {
                          // possibly save on change here
                          const changesMade =
                            files[currentFile].value !== currentValue;
                          if (changesMade) {
                            const loseUnsaved = window.confirm(
                              settingsOpen
                                ? 'The active file under settings has unsaved changes. Are you sure you want to leave?'
                                : 'You have unsaved changes in this file. Are you sure you want to leave?'
                            );
                            if (loseUnsaved) {
                              setCurrentFile(name.split('.')[0]);
                            }
                          } else {
                            setCurrentFile(name.split('.')[0]);
                          }

                          if (settingsOpen) {
                            setSettingsOpen(false);
                          }
                        }}
                      >
                        {name.split('.')[0]}
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-row">
                  <div
                    className={classnames(
                      'mx-1 px-4 py-0.5 rounded cursor-pointer select-none flex items-center justify-center',
                      {
                        'text-black': settingsOpen,
                        'text-white': !settingsOpen,
                      }
                    )}
                    style={{
                      backgroundColor: settingsOpen ? '#BABABACC' : '#000000CC',
                    }}
                    onClick={() => setSettingsOpen(!settingsOpen)}
                  >
                    <FiSettings />
                  </div>
                  <div
                    className="mx-1 px-4 py-0.5 capitalize font-mono rounded cursor-pointer select-none justify-self-end opacity-80 bg-black text-white active:bg-gray-400 active:text-black"
                    onClick={() => files[currentFile].setValue(currentValue)}
                  >
                    Update
                  </div>
                </div>
              </div>
              <div
                className="h-full w-full relative rounded-lg overflow-hidden"
                style={{ backgroundColor: '#000000CC' }}
              >
                {settingsOpen ? (
                  <div className="h-full py-6 px-6" style={{ width: '60vw' }}>
                    <h2 className="text-white font-sans font-semibold text-3xl mb-6">
                      Editor Settings
                    </h2>
                    <div className="flex flex-col h-5/6 relative justify-between">
                      <div className="flex flex-col">
                        <div className="flex flex-row items-center justify-between">
                          <div className="w-1/2">
                            <label
                              className="text-white font-sans font-semibold text-xl mr-2"
                              htmlFor="vertex-size"
                              title="This sets the size of the vertexes in the shader. Recommended values are 3 and 8."
                            >
                              Vertex Size
                            </label>
                            <p className="text-white text-sm">
                              This sets the size of the vertexes in the shader.
                              Recommended values are 3 and 8.
                            </p>
                          </div>
                          <input
                            className=" px-4 py-2 bg-transparent text-white font-sans font-semibold text-lg"
                            id="vertex-size"
                            type="number"
                            value={tempSettings.vertexSize}
                            onChange={(e) => {
                              setTempSettings({
                                ...tempSettings,
                                vertexSize: parseInt(e.target.value, 10),
                              });
                            }}
                            max={8}
                            min={3}
                          />
                        </div>
                      </div>
                      <div
                        className="inline-block self-end text-white rounded border border-white px-4 py-2 mb-4 cursor-pointer select-none active:bg-gray-400 active:text-black active:border-black"
                        onClick={() => {
                          setSettings(tempSettings);
                        }}
                      >
                        Save Settings
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
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
                      onChange={(value) => setCurrentValue(value ?? '')}
                      keepCurrentModel={true}
                      options={{
                        fontSize: 18,
                        formatOnPaste: true,
                        showUnused: true,
                        minimap: {
                          enabled: false,
                        },
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
                  </>
                )}
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
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </WebGLProvider>
  );
};

export default AppWithProviders;
