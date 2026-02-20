import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ClockWidget } from '../components/common/ClockWidget';
import { StatusBadge } from '../components/common/StatusBadge';
import { TimeDisplay } from '../components/common/TimeDisplay';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { getGreeting } from '../utils/date';
import { FiCheckCircle, FiLogOut, FiMapPin } from 'react-icons/fi';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { todayStatus, submitAttendance, isSubmitting, fetchTodayStatus } = useApp();

  useEffect(() => {
    // Fetch on initial mount
    console.log('[HomePage] Fetching todayStatus on mount...');
    fetchTodayStatus().then(() => {
      console.log('[HomePage] todayStatus fetched on mount.');
    });

    // Refetch when tab/window becomes visible (handles browser refresh & tab switching)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('[HomePage] Page became visible, refetching todayStatus...');
        fetchTodayStatus().then(() => {
          console.log('[HomePage] todayStatus refetched after visibility change.');
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Also refetch on window focus (e.g., switching back from another app)
    const handleFocus = () => {
      console.log('[HomePage] Window focused, refetching todayStatus...');
      fetchTodayStatus().then(() => {
        console.log('[HomePage] todayStatus refetched after window focus.');
      });
    };

    window.addEventListener('focus', handleFocus);

    // Periodic refetch every 60 seconds
    const interval = setInterval(() => {
      console.log('[HomePage] Periodic refetch of todayStatus...');
      fetchTodayStatus().then(() => {
        console.log('[HomePage] todayStatus periodic refetch done.');
      });
    }, 60_000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [fetchTodayStatus]);

  const handleMasuk = async () => {
    if (!todayStatus?.hasCheckedIn) {
      navigate('/attendance');
    }
  };

  const handleKeluar = async () => {
    if (todayStatus?.hasCheckedIn && !todayStatus?.hasCheckedOut) {
      try {
        // For checkout, we can pass empty string or existing status. 
        // Passing '' assumes backend knows match or doesn't care for checkout.
        await submitAttendance('keluar', (todayStatus.status as 'WFH'|'PDL'|'') || '');
      } catch (error) {
        // Error already handled in context
      }
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
