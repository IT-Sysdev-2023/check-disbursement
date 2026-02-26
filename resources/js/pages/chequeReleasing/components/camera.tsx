import { useRef, useState } from "react";
import { Button } from "@mui/material";

export default function CameraCapture({ onCapture }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);

    const startCamera = async () => {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" }, // front camera
        });
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
            onCapture(blob); // send to parent
        }, "image/jpeg");
    };

    const stopCamera = () => {
        stream?.getTracks().forEach(track => track.stop());
    };

    return (
        <div>
            <Button variant="contained" onClick={startCamera}>
                Open Camera
            </Button>

            <video ref={videoRef} autoPlay style={{ width: "100%" }} />
            <canvas ref={canvasRef} style={{ display: "none" }} />

            <Button variant="contained" color="secondary" onClick={capturePhoto}>
                Capture
            </Button>

            <Button variant="outlined" onClick={stopCamera}>
                Stop
            </Button>
        </div>
    );
}