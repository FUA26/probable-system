import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { StatusBadge } from '../components/common/StatusBadge';
import { Badge } from '../components/ui/Badge';
import { presensiAPI } from '../services/api/presensi';
import type { AttendanceRecord } from '../types/presensi';
import { formatDate, formatTime } from '../utils/date';
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';

export const HistoryPage: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const response = await presensiAPI.getHistory();
      setRecords(response.data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout title="Riwayat Presensi">
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (records.length === 0) {
    return (
      <MainLayout title="Riwayat Presensi">
        <div className="p-4 text-center text-gray-500 py-12">
          <FiCalendar className="mx-auto mb-2 text-4xl" />
          <p>Belum ada riwayat presensi</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Riwayat Presensi">
      <div className="p-4 space-y-3">
        {records.map((record) => (
          <Card key={record.tgl} className="hover:shadow-md transition-shadow">
            <div className="space-y-2">
              {/* Date and Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-900 font-medium">
                  <FiCalendar />
                  <span>{formatDate(record.tgl)}</span>
                </div>
                <StatusBadge status={record.status} />
              </div>

              {/* Times */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div className="flex items-center gap-2">
                  <FiClock className="text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Masuk</p>
                    <p className="text-sm font-medium">
                      {record.masuk ? formatTime(record.masuk) : '--:--'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <FiClock className="text-red-600" />
                  <div>
                    <p className="text-xs text-gray-500">Keluar</p>
                    <p className="text-sm font-medium">
                      {record.keluar ? formatTime(record.keluar) : '--:--'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Indicators */}
              {(record.is_late || record.is_early || record.keterangan) && (
                <div className="pt-2 border-t">
                  {record.is_late && (
                    <Badge variant="warning" className="mr-2">
                      Terlambat {record.terlambat} menit
                    </Badge>
                  )}
                  {record.is_early && (
                    <Badge variant="warning">
                      Pulang awal {record.pulang_awal} menit
                    </Badge>
                  )}
                  {record.keterangan && (
                    <p className="text-sm text-gray-600 mt-2">
                      Keterangan: {record.keterangan}
                    </p>
                  )}
                </div>
              )}

              {/* Locations */}
              <div className="text-xs text-gray-500 pt-2 border-t">
                <div className="flex items-center gap-1">
                  <FiMapPin className="text-xs" />
                  <span>Masuk: {record.lokasi || '-'}</span>
                </div>
                {record.lokasi_keluar && (
                  <div className="flex items-center gap-1 mt-1">
                    <FiMapPin className="text-xs" />
                    <span>Keluar: {record.lokasi_keluar}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary at bottom */}
      <div className="p-4">
        <Card className="bg-primary-50">
          <h3 className="font-semibold text-gray-900 mb-2">Ringkasan</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary-600">{records.length}</p>
              <p className="text-xs text-gray-600">Total Hari</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {records.filter(r => r.is_late).length}
              </p>
              <p className="text-xs text-gray-600">Terlambat</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {records.filter(r => r.is_early).length}
              </p>
              <p className="text-xs text-gray-600">Pulang Awal</p>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};
