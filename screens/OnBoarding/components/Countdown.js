import React, { useState, useEffect } from 'react';
import { Text, View } from 'native-base';

function Countdown({ initialSeconds }) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds === 0) {
      return;
    }

    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [seconds]);

  return seconds
}

export default Countdown;
