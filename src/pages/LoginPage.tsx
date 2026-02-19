import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { DEV_CONFIG } from '../config/development';
import { validateNIP } from '../utils/validation';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, deviceId, platform, isAuthenticated } = useAuth();
  const [nip, setNip] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isDev = import.meta.env.DEV;

  // Pre-fill NIP in development mode
  useEffect(() => {
    if (isDev && DEV_CONFIG.VALID_NIP) {
      setNip(DEV_CONFIG.VALID_NIP);
    }
  }, [isDev]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!nip) {
      setError('NIP harus diisi');
      return;
    }

    if (!validateNIP(nip)) {
      setError('Format NIP tidak valid (18 digit angka)');
      return;
    }

    setIsLoading(true);

    try {
      await login(nip);
      navigate('/');
    } catch (err: any) {
      if (err.response?.data?.error === 'invalid_credentials') {
        setError('NIP tidak ditemukan');
      } else if (err.response?.data?.error === 'invalid_device') {
        setError('Perangkat tidak terdaftar');
      } else {
        setError('Login gagal. Silakan coba lagi');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Prescap</h1>
          <p className="text-gray-600 mt-1">Presensi Pegawai</p>
        </div>

        {/* Login Form */}
        <Card>
          <form onSubmit={handleSubmit}>
            {isDev && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <strong>Mode Pengembangan:</strong>
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  NIP: {DEV_CONFIG.VALID_NIP}
                </p>
                <p className="text-xs text-yellow-700">
                  Device ID: {deviceId}
                </p>
              </div>
            )}

            <Input
              label="Nomor Induk Pegawai (NIP)"
              type="text"
              inputMode="numeric"
              placeholder="Masukkan 18 digit NIP"
              value={nip}
              onChange={(e) => setNip(e.target.value)}
              error={error}
              maxLength={18}
              autoFocus
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Device ID
              </label>
              <input
                type="text"
                value={deviceId}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">
                ID perangkat terdeteksi secara otomatis
              </p>
            </div>

            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Platform:</strong> {platform.toUpperCase()}
              </p>
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              disabled={!nip}
            >
              Masuk
            </Button>
          </form>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Silakan login menggunakan NIP dan perangkat terdaftar
        </p>
      </div>
    </div>
  );
};
