import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaClock, FaUser } from 'react-icons/fa';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Beranda', icon: <FaHome size={20} /> },
  { path: '/history', label: 'Riwayat', icon: <FaClock size={20} /> },
  { path: '/profile', label: 'Profil', icon: <FaUser size={20} /> },
];

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="max-w-lg mx-auto flex justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className={isActive ? 'text-primary-600' : 'text-gray-600'}>
                {item.icon}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
