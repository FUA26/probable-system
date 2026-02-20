import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export const ClockWidget: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center py-6">
      <div className="text-sm text-gray-600 mt-1">
        {format(currentTime, 'EEEE, dd MMMM yyyy', { locale: id })}
      </div>
      <div className="text-6xl font-bold text-primary-600">
        {format(currentTime, 'HH:mm:ss')}
      </div>

    </div>
  );
};
