import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import toast from 'react-hot-toast';

/**
 * Capture photo from camera
 * Uses Capacitor plugin on native, file input on web
 */
export async function capturePhoto(): Promise<string> {
  const isCapacitor = Capacitor.isNativePlatform();

  try {
    if (isCapacitor) {
      // Use Capacitor Camera plugin
      const result = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      return result.dataUrl || '';
    } else {
      // Use file input with capture attribute
      return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment'; // rear camera

        const cleanup = () => {
          input.onchange = null;
          input.oncancel = null;
          if (input.parentNode) {
            input.parentNode.removeChild(input);
          }
        };

        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
              toast.error('Ukuran foto maksimal 5MB');
              cleanup();
              reject(new Error('File too large'));
              return;
            }

            const reader = new FileReader();
            reader.onload = () => {
              cleanup();
              resolve(reader.result as string);
            };
            reader.onerror = () => {
              cleanup();
              toast.error('Gagal membaca foto');
              reject(new Error('Failed to read file'));
            };
            reader.readAsDataURL(file);
          } else {
            cleanup();
            reject(new Error('Camera cancelled'));
          }
        };

        input.oncancel = () => {
          cleanup();
          reject(new Error('Camera cancelled'));
        };

        input.click();
      });
    }
  } catch (error: any) {
    if (error.message === 'User cancelled photos app') {
      throw error; // Don't show toast for cancellation
    }

    toast.error('Gagal membuka kamera. Pastikan izin kamera aktif.');
    throw error;
  }
}
