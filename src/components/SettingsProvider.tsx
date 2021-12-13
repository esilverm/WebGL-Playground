import React, { createContext, useContext, useEffect, useState } from 'react';

type Settings = {
  vertexSize: number;
};

export const SettingsContext = createContext<{
  settings: Settings;
  setSettings: (settings: Settings) => void;
}>({
  settings: {
    vertexSize: 3,
  },
  setSettings: () => {},
});

export const SettingsProvider: React.FC = ({ children }) => {
  const [settings, setSettings] = useState({
    vertexSize: 3,
  });

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
