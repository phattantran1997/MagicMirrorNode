import React, { useEffect, useRef, useState } from 'react';
import { InferenceSession, Tensor } from 'onnxruntime-web';

const RealTimeObjectDetection= () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [session, setSession] = useState<InferenceSession | null>(null);
  const [isModelReady, setModelReady] = useState(false);

  // Load the ONNX model
  useEffect(() => {
    const loadModel = async () => {
      try {
        const session = await InferenceSession.create('/models/yolov8n.onnx');
        setSession(session);
        setModelReady(true);
      } catch (error) {
        console.error('Error loading ONNX model', error);
      }
    };

    loadModel();

    // Access webcam
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    });
  }, []);

  const runInference = async () => {
    if (session && videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Resize the canvas to match the video size
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the video frame on the canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get the pixel data from the canvas
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const inputTensor = new Tensor('float32', new Float32Array(imageData.data), [1, 3, canvas.height, canvas.width]);

        // Run inference
        const output = await session.run({ input: inputTensor });
        console.log(output);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isModelReady) {
        runInference();
      }
    }, 100); // Run inference every 100ms

    return () => clearInterval(interval);
  }, [session, isModelReady]);

  return (
    <div>
      <video ref={videoRef} width="640" height="480" />
    </div>
  );
};

export default RealTimeObjectDetection;
