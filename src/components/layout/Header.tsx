import React from 'react';

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-primary-600 text-white px-4 py-3 sticky top-0 z-[1001] shadow-md">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <h1 className="text-lg font-bold">
          {title || 'E-Presensi'}
        </h1>
        <span className="text-xs font-medium bg-primary-700 px-2 py-1 rounded-full text-primary-100">
          v1.0.0
        </span>
      </div>
    </header>
  );
};
