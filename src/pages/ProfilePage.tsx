import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiCreditCard, FiMapPin, FiLogOut, FiSmartphone } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { user, deviceId, platform, logout } = useAuth();

  const handleLogout = async () => {
    if (window.confirm('Apakah Anda yakin ingin logout?')) {
      await logout();
    }
  };

  const handleClearCache = async () => {
    if (window.confirm('Hapus cache data? Ini akan menghapus data tersimpan secara lokal.')) {
      try {
        localStorage.clear();
        toast.success('Cache berhasil dihapus');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        toast.error('Gagal menghapus cache');
      }
    }
  };

  return (
    <MainLayout title="Profil">
      <div className="p-4 space-y-4">
        {/* User Info Card */}
        <Card>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <FiUser className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {user?.namaPegawai || 'Pegawai'}
              </h2>
              <p className="text-sm text-gray-600">{user?.jabatan}</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <InfoRow
              icon={<FiCreditCard />}
              label="NIP"
              value={user?.nipBaru || '-'}
            />
            <InfoRow
              icon={<FiCreditCard />}
              label="ID Elektronik"
              value={user?.idelektronik ? user.idelektronik.toString() : '-'}
            />
            <InfoRow
              icon={<FiMapPin />}
              label="SKPD"
              value={user?.skpd || user?.opd || '-'}
            />
            <InfoRow
              icon={<FiCreditCard />}
              label="Shift"
              value={`Shift ${user?.shift || '-'}`}
            />
          </div>
        </Card>

        {/* Device Info Card */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-3">Informasi Perangkat</h3>
          <div className="space-y-2">
            <InfoRow
              icon={<FiSmartphone />}
              label="Device ID"
              value={deviceId}
            />
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Platform</span>
              <Badge variant="info">{platform.toUpperCase()}</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Versi Aplikasi</span>
              <span className="text-sm font-medium">1.0.0</span>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={handleClearCache}
          >
            Hapus Cache
          </Button>

          <Button
            variant="danger"
            fullWidth
            onClick={handleLogout}
          >
            <div className="flex items-center justify-center gap-2">
              <FiLogOut />
              <span>Logout</span>
            </div>
          </Button>
        </div>

        {/* Version Info */}
        <p className="text-center text-xs text-gray-500 pt-4">
          Prescap v1.0.0
        </p>
      </div>
    </MainLayout>
  );
};

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => {
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="text-primary-600 mt-0.5">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900 break-all">{value}</p>
      </div>
    </div>
  );
};
