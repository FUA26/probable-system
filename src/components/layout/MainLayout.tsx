import React from 'react';
import { BottomNav } from './BottomNav';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title={title} />
      <main className="max-w-lg mx-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};
