import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api/auth';
import { secureStorage } from '../services/storage/storage';
import { getDeviceId, getPlatform } from '../services/platform/device';
import type { UserProfile } from '../types/auth';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  deviceId: string;
  platform: 'web' | 'android' | 'ios';
  login: (nip: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [deviceId, setDeviceId] = useState<string>('');
  const [platform, setPlatform] = useState<'web' | 'android' | 'ios'>('web');

  // Initialize: check if user is already authenticated
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        // Get device ID
        const id = await getDeviceId();
        if (mounted) {
          setDeviceId(id);
        }

        // Get platform
        const plat = await getPlatform();
        if (mounted) {
          setPlatform(plat);
        }

        // Check for existing token
        const storedToken = await secureStorage.getItem('auth_token');
        if (storedToken && mounted) {
          setToken(storedToken);

          // Validate token with backend
          try {
            const checkResult = await authAPI.checkToken();
            if (mounted) {
              if (checkResult.active) {
                // Token is valid, fetch user profile
                const profileData = await authAPI.getProfile();
                setUser(profileData.profile);
              } else {
                // Token expired
                await secureStorage.removeItem('auth_token');
                setToken(null);
              }
            }
          } catch (error) {
            // Token validation failed
            if (mounted) {
              await secureStorage.removeItem('auth_token');
              setToken(null);
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (nip: string) => {
    // Check if deviceId is ready
    if (!deviceId) {
      toast.error('Sistem sedang mempersiapkan perangkat. Silakan coba lagi');
      throw new Error('Device ID not initialized');
    }

    try {
      const response = await authAPI.login({ nip, device_id: deviceId });

      // Store token
      await secureStorage.setItem('auth_token', response.token);
      setToken(response.token);

      // Store user data
      setUser(response.user);
      await secureStorage.setItem('user_profile', JSON.stringify(response.user));

      toast.success('Login berhasil');
    } catch (error: any) {
      const errorCode = error.response?.data?.error;

      if (errorCode === 'nip_and_device_id_are_required') {
        toast.error('NIP dan Device ID harus diisi');
      } else if (errorCode === 'invalid_credentials') {
        toast.error('NIP tidak ditemukan');
      } else if (errorCode === 'invalid_device') {
        toast.error('Perangkat tidak terdaftar');
      } else {
        toast.error('Login gagal. Silakan coba lagi');
      }

      throw error;
    }
  }, [deviceId]);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage regardless of API call result
      await secureStorage.removeItem('auth_token');
      await secureStorage.removeItem('user_profile');
      setToken(null);
      setUser(null);
      toast.success('Logout berhasil');
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const checkResult = await authAPI.checkToken();
      return checkResult.active;
    } catch (error) {
      return false;
    }
  }, []);

  const value: AuthContextType = {
    token,
    isAuthenticated: !!token,
    isLoading,
    user,
    deviceId,
    platform,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
