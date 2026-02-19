import React from 'react';

interface TimeDisplayProps {
  label: string;
  time: string | null;
  highlight?: boolean;
}

export const TimeDisplay: React.FC<TimeDisplayProps> = ({ label, time, highlight = false }) => {
  return (
    <div className="text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-lg font-semibold ${highlight ? 'text-primary-600' : 'text-gray-900'}`}>
        {time || '--:--'}
      </p>
    </div>
  );
};
