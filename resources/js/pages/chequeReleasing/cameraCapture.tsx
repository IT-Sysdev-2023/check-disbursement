// CameraCapture.tsx
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Box, Button, Stack, Alert, Paper } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ReplayIcon from '@mui/icons-material/Replay';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface CameraCaptureProps {
  onCapture?: (imageDataUrl: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

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
      setCapturedImage(null);
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
    setCapturedImage(null);
  }, []);

  // Discard the captured still and go back to the live feed
  const retake = useCallback(() => {
    setCapturedImage(null);
  }, []);

  // Hand the captured image back to the parent and stop the camera
  const handleBack = useCallback(() => {
    if (capturedImage) {
      onCapture?.(capturedImage);
    }
    stopCamera();
  }, [capturedImage, onCapture, stopCamera]);

  useEffect(() => {
    return () => stopCamera(); // cleanup on unmount
  }, [stopCamera]);

  // Capture a still frame from the video
  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Freeze the frame in place of the live camera view
    setCapturedImage(canvas.toDataURL('image/jpeg', 0.9));
    setError(null);
  }, []);

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        maxWidth: 640,
        mx: 'auto',
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          bgcolor: 'grey.900',
          borderRadius: 1,
          overflow: 'hidden',
          aspectRatio: '16 / 9',
        }}
      >
        <Box
          component="video"
          ref={videoRef}
          muted
          playsInline
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: isStreaming && !capturedImage ? 'block' : 'none',
          }}
        />

        {capturedImage && (
          <Box
            component="img"
            src={capturedImage}
            alt="Captured preview"
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}

        {!isStreaming && !capturedImage && (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ width: '100%', height: '100%', color: 'grey.500' }}
          >
            <CameraAltIcon fontSize="large" />
          </Stack>
        )}
      </Box>

      <Box component="canvas" ref={canvasRef} sx={{ display: 'none' }} />

      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        {!isStreaming ? (
          <Button
            variant="contained"
            startIcon={<CameraAltIcon />}
            onClick={startCamera}
          >
            Start Camera
          </Button>
        ) : capturedImage ? (
          <>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
            >
              Back
            </Button>
            <Button variant="outlined" startIcon={<ReplayIcon />} onClick={retake}>
              Retake
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PhotoCameraIcon />}
              onClick={captureFrame}
            >
              Capture
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<StopCircleIcon />}
              onClick={stopCamera}
            >
              Stop Camera
            </Button>
          </>
        )}
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Paper>
  );
};

export default CameraCapture;