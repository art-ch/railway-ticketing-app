import { getFormattedTime } from '@/utils/formatters';
import React, { useEffect, useState } from 'react';

export const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedTime = getFormattedTime(time);

  return (
    <div className="clock">
      <time>{formattedTime}</time>
    </div>
  );
};
