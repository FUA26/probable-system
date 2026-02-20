import React, { useEffect, useState } from "react";
import { Geolocation } from "@capacitor/geolocation";
import { Camera } from "@capacitor/camera";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { FiMapPin, FiCamera, FiAlertCircle } from "react-icons/fi";
import { Capacitor } from "@capacitor/core";

interface PermissionWrapperProps {
  children: React.ReactNode;
}

type PermissionStatus = "granted" | "denied" | "prompt" | "unknown";

export const PermissionWrapper: React.FC<PermissionWrapperProps> = ({
  children,
}) => {
  const [locationStatus, setLocationStatus] =
    useState<PermissionStatus>("unknown");
  const [cameraStatus, setCameraStatus] = useState<PermissionStatus>("unknown");
  const [isLoading, setIsLoading] = useState(true);

  const checkPermissions = async () => {
    try {
      if (!Capacitor.isNativePlatform()) {
        // Assume granted on web for now or handle differently if needed
        // For simple PWA testing, we might want to request properly too,
        // but 'permissions' API on web is limited.
        // Let's assume passed for web to avoid blocking dev if not strictly required there yet,
        // or implement web-specific checks if the user insisted on "aplikasi" (usually mobile).
        // Given the context of "install" and "absen", it's likely mobile.
        // However, let's try to check web permissions if possible or mock them.
        setLocationStatus("granted");
        setCameraStatus("granted");
        setIsLoading(false);
        return;
      }

      const location = await Geolocation.checkPermissions();
      const camera = await Camera.checkPermissions();

      setLocationStatus(location.location as PermissionStatus);
      setCameraStatus(camera.camera as PermissionStatus);
    } catch (error) {
      console.error("Error checking permissions:", error);
      // Fallback to prompt/unknown to try again
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      if (locationStatus !== "granted") {
        const locationRequest = await Geolocation.requestPermissions();
        setLocationStatus(locationRequest.location as PermissionStatus);
      }

      if (cameraStatus !== "granted") {
        const cameraRequest = await Camera.requestPermissions();
        setCameraStatus(cameraRequest.camera as PermissionStatus);
      }
    } catch (error) {
      console.error("Error requesting permissions:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const allGranted = locationStatus === "granted" && cameraStatus === "granted";

  if (allGranted) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <FiAlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Izin Diperlukan
          </h2>
          <p className="text-gray-600">
            Aplikasi memerlukan akses ke Lokasi dan Kamera untuk fitur presensi.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div
              className={`p-2 rounded-full ${locationStatus === "granted" ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-500"}`}
            >
              <FiMapPin size={20} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Lokasi</p>
              <p className="text-sm text-gray-500">
                {locationStatus === "granted" ? "Diizinkan" : "Belum diizinkan"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div
              className={`p-2 rounded-full ${cameraStatus === "granted" ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-500"}`}
            >
              <FiCamera size={20} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Kamera</p>
              <p className="text-sm text-gray-500">
                {cameraStatus === "granted" ? "Diizinkan" : "Belum diizinkan"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={requestPermissions} fullWidth>
            Berikan Izin
          </Button>
          {(locationStatus === "denied" || cameraStatus === "denied") && (
            <p className="text-xs text-center text-red-500 mt-2">
              Jika izin ditolak secara permanen, Anda perlu mengaktifkannya
              secara manual melalui Pengaturan Aplikasi di perangkat Anda.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};
