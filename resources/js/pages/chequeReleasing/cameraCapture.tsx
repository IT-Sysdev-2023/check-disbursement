// CameraCapture.tsx
import React, { useRef, useState, useCallback, useEffect } from 'react';

interface CameraCaptureProps {
  onUploadSuccess?: (url: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ token, onUploadSuccess }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Start camera stream
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 1280, height: 720 },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsStreaming(true);
      setError(null);
    } catch (err) {
      setError('Unable to access camera. Check permissions.');
      console.error(err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsStreaming(false);
  }, []);

  useEffect(() => {
    return () => stopCamera(); // cleanup on unmount
  }, [stopCamera]);

  // Capture a frame and upload it
  const captureAndUpload = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      async (blob) => {
        if (!blob) return;
        setIsUploading(true);
        setError(null);

        try {
          const formData = new FormData();
          formData.append('image', blob, `capture-${Date.now()}.jpg`);

          // Get CSRF cookie first if using Sanctum SPA auth
          // await axios.get('/sanctum/csrf-cookie');

          const response = await fetch('/captures', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'X-CSRF-TOKEN': token,
              // Authorization: `Bearer ${token}`, // if using token auth
            },
            body: formData,
            credentials: 'include', // needed for Sanctum cookie auth
          });

          if (!response.ok) throw new Error('Upload failed');

          const data = await response.json();
          onUploadSuccess?.(data.url);
        } catch (err) {
          setError('Failed to upload image.');
          console.error(err);
        } finally {
          setIsUploading(false);
        }
      },
      'image/jpeg',
      0.9 // quality
    );
  }, [onUploadSuccess, token]);

  return (
    <div className="camera-capture">
      <video ref={videoRef} muted playsInline className="w-full rounded" />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="mt-2 flex gap-2">
        {!isStreaming ? (
          <button onClick={startCamera}>Start Camera</button>
        ) : (
          <>
            <button onClick={captureAndUpload} disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Capture & Upload'}
            </button>
            <button onClick={stopCamera}>Stop Camera</button>
          </>
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default CameraCapture;