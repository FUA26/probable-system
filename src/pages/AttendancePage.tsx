import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MapComponent } from '../components/map/MapComponent';
import { useApp } from '../contexts/AppContext';
import { calculateDistance } from '../services/platform/geolocation';
import { FiMapPin, FiHome, FiBriefcase, FiAlertCircle } from 'react-icons/fi';
// import { toast } from 'react-hot-toast';

export const AttendancePage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    officeLocation, 
    currentLocation, 
    getCurrentLocation, 
    submitAttendance, 
    isSubmitting 
  } = useApp();

  const [attendanceType, setAttendanceType] = useState<'' | 'WFH' | 'PDL'>('');
  const [distance, setDistance] = useState<number | null>(null);
  const [isLocationValid, setIsLocationValid] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [keterangan, setKeterangan] = useState('');

  // Initial location check
  useEffect(() => {
    getCurrentLocation().catch((err) => {
      console.error('Failed to get location', err);
      setLocationError('Gagal mendapatkan lokasi. Pastikan GPS aktif.');
    });
  }, [getCurrentLocation]);

  // Calculate distance for WFO validation
  useEffect(() => {
    if (currentLocation && officeLocation) {
      const dist = calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        String(officeLocation.lat),
        String(officeLocation.lng)
      );
      setDistance(dist);
      
      // Radius check for WFO (attendanceType === '')
      // Check if distance is <= radius
      setIsLocationValid(dist <= officeLocation.radius);
    }
  }, [currentLocation, officeLocation]);

  const handleSubmit = async () => {
    try {
      /*
      if (attendanceType === '' && !isLocationValid) {
        toast.error(`Posisi Anda diluar radius kantor (${Math.round(distance || 0)}m).`);
        return;
      }
      */

      await submitAttendance('masuk', attendanceType, keterangan);
      navigate('/');
    } catch (error) {
      // Error handled in context
    }
  };

  const getRadiusStatusColor = () => {
    if (!distance || !officeLocation) return 'text-gray-500';
    return distance <= officeLocation.radius ? 'text-green-600' : 'text-red-600';
  };

  return (
    <MainLayout>
      <div className="p-4 space-y-4 pb-24">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Presensi Masuk</h2>
          <Button variant="secondary" size="sm" onClick={() => navigate('/')}>
            Kembali
          </Button>
        </div>

        {/* Map Section */}
        <Card className="overflow-hidden p-0 border border-gray-200 shadow-sm">
          <MapComponent 
            currentLocation={currentLocation ? { lat: Number(currentLocation.lat), lng: Number(currentLocation.lng) } : null}
            officeLocation={officeLocation}
          />
          <div className="p-3 bg-white border-t border-gray-100">
             {officeLocation ? (
               <div className="flex items-center justify-between text-sm">
                 <div className="flex items-center gap-2">
                   <FiMapPin className="text-primary-600" />
                   <span className="text-gray-600">Jarak ke kantor:</span>
                 </div>
                 <span className={`font-semibold ${getRadiusStatusColor()}`}>
                   {distance ? `${Math.round(distance)} meter` : 'Menghitung...'}
                 </span>
               </div>
             ) : (
               <p className="text-sm text-yellow-600 flex items-center gap-2">
                 <FiAlertCircle />
                 Lokasi kantor belum diset
               </p>
             )}
             {locationError && (
               <p className="text-xs text-red-500 mt-1">{locationError}</p>
             )}
          </div>
        </Card>

        {/* Attendance Type Selector */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Pilih Lokasi Kerja</h3>
          
          {/* WFO Option */}
          <button
            onClick={() => setAttendanceType('')}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden ${
              attendanceType === ''
                ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600'
                : 'border-gray-200 bg-white hover:border-primary-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${attendanceType === '' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}>
                <FiBriefcase size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`font-semibold ${attendanceType === '' ? 'text-primary-900' : 'text-gray-900'}`}>
                    WFO - Work From Office
                  </h4>
                  {distance !== null && officeLocation && distance > officeLocation.radius && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                      Diluar Radius
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">Bekerja dari kantor pusat</p>
                
                {attendanceType === '' && (
                  <div className="mt-3 pt-3 border-t border-primary-100 text-sm">
                    {isLocationValid ? (
                      <p className="text-green-600 flex items-center gap-1">
                        <FiCheckCircle className="inline" /> Lokasi terverifikasi
                      </p>
                    ) : (
                      <p className="text-red-600 flex items-center gap-1">
                        <FiAlertCircle className="inline" /> Anda berada diluar jangkauan presensi
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </button>

          {/* WFH Option */}
          <button
            onClick={() => setAttendanceType('WFH')}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
              attendanceType === 'WFH'
                ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600'
                : 'border-gray-200 bg-white hover:border-primary-200'
            }`}
          >
             <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${attendanceType === 'WFH' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}>
                <FiHome size={20} />
              </div>
              <div>
                <h4 className={`font-semibold ${attendanceType === 'WFH' ? 'text-primary-900' : 'text-gray-900'}`}>
                  WFH - Work From Home
                </h4>
                <p className="text-sm text-gray-500 mt-1">Bekerja dari rumah</p>
              </div>
            </div>
          </button>

          {/* PDL Option */}
          <button
            onClick={() => setAttendanceType('PDL')}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
              attendanceType === 'PDL'
                ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600'
                : 'border-gray-200 bg-white hover:border-primary-200'
            }`}
          >
             <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${attendanceType === 'PDL' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}>
                <FiMapPin size={20} />
              </div>
              <div className="w-full">
                <h4 className={`font-semibold ${attendanceType === 'PDL' ? 'text-primary-900' : 'text-gray-900'}`}>
                  PDL - Dinas Luar
                </h4>
                <p className="text-sm text-gray-500 mt-1">Perjalanan dinas luar kota</p>
                
                {attendanceType === 'PDL' && (
                  <div className="mt-3">
                     <textarea 
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        placeholder="Masukkan keterangan dinas..."
                        rows={2}
                        value={keterangan}
                        onChange={(e) => setKeterangan(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                     />
                  </div>
                )}
              </div>
            </div>
          </button>
        </div>

        {/* Submit Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-[60]">
          <div className="max-w-md mx-auto">
            <Button 
              fullWidth 
              size="lg" 
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={
                isSubmitting || 
                // (attendanceType === '' && !isLocationValid) || // disabled location check
                (attendanceType === 'PDL' && !keterangan)
              }
            >
              {attendanceType === '' && !isLocationValid 
                ? 'Lokasi Tidak Sesuai (Debug: Enabled)' 
                : 'Kirim Presensi Masuk'}
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Helper icon for check circle
function FiCheckCircle({ className }: { className?: string }) {
  return (
    <svg 
      stroke="currentColor" 
      fill="none" 
      strokeWidth="2" 
      viewBox="0 0 24 24" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className} 
      height="1em" 
      width="1em" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}
