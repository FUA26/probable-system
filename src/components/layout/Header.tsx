import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const { user } = useAuth();

  return (
    <header className="bg-primary-600 text-white px-4 py-4 sticky top-0 z-[1001]">
      <div className="max-w-lg mx-auto">
        {title ? (
          <h1 className="text-xl font-bold">{title}</h1>
        ) : (
          <div>
            <p className="text-sm text-primary-100">
              Selamat datang,
            </p>
            <h1 className="text-xl font-bold">
              {user?.namaPegawai || 'Pegawai'}
            </h1>
          </div>
        )}
      </div>
    </header>
  );
};
