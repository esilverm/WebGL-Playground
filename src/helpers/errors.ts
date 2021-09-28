import { MarkerSeverity } from 'monaco-editor';

import { shaderHeader } from '../components/WebGLProvider';

export type WebGLErrorMarker = {
  severity?: MarkerSeverity;
  startColumn?: number;
  endColumn?: number;
  startLineNumber?: number;
  endLineNumber?: number;
  message?: string;
};

export const parseWebGLError = (error: string) => {
  const headerLength = shaderHeader.split('\n').length - 1;
  const errorList = error.split('<stdin>:').filter(Boolean);
  console.log(errorList);
  // get the lines with errors
  return errorList.map((currentError): WebGLErrorMarker => {
    const [startLineNumber, startColumn, ...rest] = currentError.split(':');
    const errorString = rest.slice(1).join(':').trimStart();
    let endColumn;

    if (currentError.trimEnd().lastIndexOf('^') === currentError.length - 2) {
      endColumn = +startColumn + 1;
    } else {
      const splitString = errorString.split('\n');
      const matchLength = (
        splitString[splitString.length - 2].match(/~/g) || []
      ).length;

      endColumn = +startColumn + matchLength;
    }

    return {
      severity: MarkerSeverity.Error,
      startColumn: +startColumn,
      startLineNumber: +startLineNumber - headerLength,
      endColumn,
      endLineNumber: +startLineNumber - headerLength,
      message: errorString,
    };
  });
};
