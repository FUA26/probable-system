import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

import { validateNIP } from '../utils/validation';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, platform, isAuthenticated } = useAuth();
  const [nip, setNip] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');



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
          <div className="inline-flex items-center justify-center mb-4">
            <img
              src="/logo.png"
              alt="Logo Prescap"
              className="w-24 h-24 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">E-Presensi</h1>
          <p className="text-gray-600 mt-1">Presensi Kabupaten Malang</p>
        </div>

        {/* Login Form */}
        <Card>
          <form onSubmit={handleSubmit}>


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
        <p className="text-center text-xs text-gray-400 mt-2">
          v1.0.0
        </p>
      </div>
    </div>
  );
};
