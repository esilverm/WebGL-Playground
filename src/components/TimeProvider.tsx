import React, { createContext, useContext, useEffect, useState } from 'react';

export const TimeContext = createContext<{
  time: number;
}>({
  time: Date.now(),
});

export const TimeProvider: React.FC = ({ children }) => {
  const [startTime] = useState(Date.now());
  const [time, setTime] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((Date.now() - startTime) / 1000);
    }, 60);

    return () => {
      clearInterval(intervalId);
    };
  }, [startTime, time]);

  return (
    <TimeContext.Provider value={{ time }}>{children}</TimeContext.Provider>
  );
};

export const useTime = () => useContext(TimeContext);
