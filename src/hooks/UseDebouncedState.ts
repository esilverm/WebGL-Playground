import { debounce } from 'lodash';
import { useState } from 'react';

// Adapted for typescript from https://github.com/facebook/react/issues/1360#issuecomment-584875927
export const useDebouncedState = (initialState: any, durationInMs = 500) => {
  const [internalState, setInternalState] = useState(initialState);
  const debouncedFunction = debounce(setInternalState, durationInMs);
  return [internalState, debouncedFunction];
};
