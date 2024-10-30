// WebcamFeed.js
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import { drawRect } from "../../ultils/drawRect";
import "./WebcamFeed.css";

const MODEL_FILE_URL = "modeljs/model.json";

function WebcamFeed() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);

  // Load model
  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadGraphModel(MODEL_FILE_URL);
        setModel(loadedModel);
        console.log("Custom model loaded.");
      } catch (error) {
        console.error("Error loading model:", error);
      }
    };
    loadModel();
  }, []);

  const detect = async () => {
    if (
      webcamRef.current &&
      webcamRef.current.video.readyState === 4 &&
      model
    ) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
  
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
  
      // Create a tensor from the video frame
      const inputTensor = tf.browser.fromPixels(video)
        .resizeBilinear([640, 640]) // Adjust to your model's input size
        .toFloat()
        .expandDims();
  
      let predictions;
      try {
        predictions = await model.executeAsync(inputTensor);
      } catch (error) {
        console.error("Prediction error:", error);
        return;
      }
  
      // Convert tensor output to an array for further inspection
      const predictionArray = await predictions.array();
      console.log("Prediction Array:", predictionArray); // Inspect this to confirm structure
  
      // Process predictions if array contains detected objects
      if (predictionArray.length > 0 && Array.isArray(predictionArray[0])) {
        const formattedPredictions = predictionArray[0].map((pred) => {
          // Assuming pred has [x, y, width, height, classIndex, score]
          const [x, y, width, height, classIndex, score] = pred;
          const classLabels = ["Class A", "Class B", "Class C"]; // Adjust based on your model's classes
          return {
            bbox: [x, y, width, height],
            class: classLabels[classIndex],
            score: score
          };
        });
  
        // Draw each detected object on the canvas
        const ctx = canvasRef.current.getContext("2d");
        drawRect(formattedPredictions, ctx);
      }
  
      // Clean up tensors
      inputTensor.dispose();
      predictions.dispose();
    }
  };
  

  // Run detect function at intervals
  useEffect(() => {
    const intervalId = setInterval(() => {
      detect();
    }, 100); // Adjust the interval as needed
    return () => clearInterval(intervalId);
  }, [model]);

  return (
    <>
      <Webcam ref={webcamRef} muted={true} className="webcam" />
      <canvas ref={canvasRef} className="canvas-overlay" />
    </>
  );
}

export default WebcamFeed;
