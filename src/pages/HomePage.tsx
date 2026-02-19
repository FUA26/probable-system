import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ClockWidget } from '../components/common/ClockWidget';
import { StatusBadge } from '../components/common/StatusBadge';
import { TimeDisplay } from '../components/common/TimeDisplay';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { getGreeting } from '../utils/date';
import { FiCheckCircle, FiLogOut, FiMapPin } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { todayStatus, submitAttendance, isSubmitting, fetchTodayStatus } = useApp();
  const [attendanceType, setAttendanceType] = useState<'' | 'WFH' | 'PDL'>('');
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  useEffect(() => {
    fetchTodayStatus();
  }, [fetchTodayStatus]);

  const handleMasuk = async () => {
    if (!todayStatus?.hasCheckedIn) {
      // Show type selector first
      setShowTypeSelector(true);
    }
  };

  const handleKeluar = async () => {
    if (todayStatus?.hasCheckedIn && !todayStatus?.hasCheckedOut) {
      try {
        await submitAttendance('keluar', attendanceType);
      } catch (error) {
        // Error already handled in context
      }
    }
  };

  const confirmAttendanceType = async () => {
    setShowTypeSelector(false);
    try {
      await submitAttendance('masuk', attendanceType);
    } catch (error) {
      // Error already handled in context
    }
  };

  return (
    <MainLayout>
      <div className="p-4 space-y-4">
        {/* Greeting */}
        <div>
          <p className="text-gray-600">{getGreeting()},</p>
          <h2 className="text-xl font-bold text-gray-900">
            {user?.namaPegawai || 'Pegawai'}
          </h2>
          <p className="text-sm text-gray-600">{user?.jabatan}</p>
        </div>

        {/* Clock Widget */}
        <Card>
          <ClockWidget />
        </Card>

        {/* Today's Status */}
        <Card>
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Status Presensi Hari Ini</h3>

            <div className="grid grid-cols-2 gap-4">
              <TimeDisplay
                label="Masuk"
                time={todayStatus?.checkInTime}
                highlight={todayStatus?.hasCheckedIn}
              />
              <TimeDisplay
                label="Keluar"
                time={todayStatus?.checkOutTime}
                highlight={todayStatus?.hasCheckedOut}
              />
            </div>

            {todayStatus?.hasCheckedIn && (
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <StatusBadge status={todayStatus.status} />
                </div>

                {todayStatus.isLate && (
                  <div className="flex items-center gap-2 mt-2 text-orange-600">
                    <FiMapPin />
                    <span className="text-sm">
                      Terlambat {todayStatus.lateMinutes} menit
                    </span>
                  </div>
                )}

                {todayStatus.isEarly && (
                  <div className="flex items-center gap-2 mt-2 text-orange-600">
                    <FiLogOut />
                    <span className="text-sm">
                      Pulang awal {todayStatus.earlyMinutes} menit
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Attendance Type Selector */}
        {showTypeSelector && (
          <Card className="border-primary-200 bg-primary-50">
            <h3 className="font-semibold text-gray-900 mb-3">Pilih Jenis Presensi</h3>
            <div className="space-y-2">
              <button
                onClick={() => setAttendanceType('')}
                className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${
                  attendanceType === ''
                    ? 'border-primary-600 bg-primary-100 text-primary-700'
                    : 'border-gray-300 hover:border-primary-400'
                }`}
              >
                <div className="font-medium">WFO - Work From Office</div>
                <div className="text-sm text-gray-600">Masuk ke kantor</div>
              </button>

              <button
                onClick={() => setAttendanceType('WFH')}
                className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${
                  attendanceType === 'WFH'
                    ? 'border-primary-600 bg-primary-100 text-primary-700'
                    : 'border-gray-300 hover:border-primary-400'
                }`}
              >
                <div className="font-medium">WFH - Work From Home</div>
                <div className="text-sm text-gray-600">Bekerja dari rumah</div>
              </button>

              <button
                onClick={() => setAttendanceType('PDL')}
                className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${
                  attendanceType === 'PDL'
                    ? 'border-primary-600 bg-primary-100 text-primary-700'
                    : 'border-gray-300 hover:border-primary-400'
                }`}
              >
                <div className="font-medium">PDL - Perjalanan Dinas Luar</div>
                <div className="text-sm text-gray-600">Dinas luar kota</div>
              </button>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                onClick={confirmAttendanceType}
                disabled={!attendanceType}
                className="flex-1"
              >
                Lanjutkan
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowTypeSelector(false)}
                className="flex-1"
              >
                Batal
              </Button>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleMasuk}
            disabled={todayStatus?.hasCheckedIn || isSubmitting}
            className="py-4 text-lg"
          >
            <div className="flex items-center justify-center gap-2">
              <FiCheckCircle />
              <span>Masuk</span>
            </div>
          </Button>

          <Button
            onClick={handleKeluar}
            variant={todayStatus?.hasCheckedIn ? 'primary' : 'secondary'}
            disabled={!todayStatus?.hasCheckedIn || todayStatus?.hasCheckedOut || isSubmitting}
            className="py-4 text-lg"
          >
            <div className="flex items-center justify-center gap-2">
              <FiLogOut />
              <span>Keluar</span>
            </div>
          </Button>
        </div>

        {/* Instructions */}
        <Card className="bg-gray-50">
          <h4 className="font-semibold text-gray-900 mb-2">Petunjuk:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Pastikan GPS aktif sebelum presensi</li>
            <li>• Berada dalam radius kantor untuk WFO</li>
            <li>• Foto akan diambil saat presensi</li>
            <li>• Presensi masuk hanya sekali per hari</li>
          </ul>
        </Card>
      </div>
    </MainLayout>
  );
};
