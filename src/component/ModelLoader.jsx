import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

const ModelLoader = () => {
  const [model, setModel] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const MODEL_FILE_URL = 'modeljs/model.json';


  // Load the TensorFlow.js model
  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadGraphModel(MODEL_FILE_URL);
        setModel(loadedModel);
      } catch (error) {
        console.error('Error loading the model:', error);
      }
    };
    loadModel();
  }, []);

  // Function to handle image input
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to predict using the loaded model and input image
  const handlePredict = async () => {
    if (model && imageSrc) {
      const img = document.getElementById('input-image');
      const inputTensor = tf.browser.fromPixels(img).resizeBilinear([640, 640]).toFloat().expandDims();
      
      // Predict using the loaded model
      const predictionTensor = model.predict(inputTensor);
      const predictedClass = predictionTensor.argMax(-1).dataSync()[0];

      // Display the predicted class
      setPrediction(predictedClass);
      predictionTensor.dispose(); // Clean up memory
    }
  };

  return (
    <div>
      <h1>TensorFlow.js Model Predictor</h1>

      {/* Upload an image */}
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      
      {/* Display uploaded image */}
      {imageSrc && <img id="input-image" src={imageSrc} alt="input" width={224} height={224} />}

      {/* Button to predict */}
      <button onClick={handlePredict}>Predict</button>

      {/* Display prediction */}
      {prediction !== null && <h2>Predicted Class: {prediction}</h2>}
    </div>
  );
};

export default ModelLoader;
