import { Camera, CameraResultType, CameraSource, CameraDirection } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import toast from 'react-hot-toast';

/**
 * Capture photo from camera
 * Uses Capacitor plugin on native, file input on web
 * Forces Front Camera (Selfie)
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
        direction: CameraDirection.Front, // Force selfie camera
        // width: 600, // Optional: resize
        // correctOrientation: true
      });

      return result.dataUrl || '';
    } else {
      // Use file input wrapper for web
      return capturePhotoWeb();
    }
  } catch (error: any) {
    if (error.message === 'User cancelled photos app') {
      throw new Error('Camera cancelled');
    }

    console.error('Camera error:', error);
    // Don't show toast if it's just a cancellation
    if (error.message !== 'Camera cancelled') {
      toast.error('Gagal membuka kamera. Pastikan izin kamera aktif.');
    }
    throw error;
  }
}

/**
 * Web fallback using file input
 */
function capturePhotoWeb(): Promise<string> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.setAttribute('capture', 'user'); // 'user' for front camera (selfie)

    const cleanup = () => {
      input.onchange = null;
      input.oncancel = null;
      if (input.parentNode) {
        input.parentNode.removeChild(input);
      }
    };

    // Trigger on mobile web often requires appending to body
    input.style.display = 'none';
    document.body.appendChild(input);

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

    // Note: oncancel support varies by browser
    input.oncancel = () => {
      cleanup();
      reject(new Error('Camera cancelled'));
    };

    input.click();

    // Cleanup input from DOM after a timeout if not used? 
    // Usually handled by listeners, but we appended it.
    // The change/cancel events will handle removal.
  });
}
