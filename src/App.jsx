import logo from './logo.svg';
import React from 'react';  // Add this line
import './App.css';
import RealTimeObjectDetection from './component/RealTimeObjectDetection';
import ModelLoader from './component/ModelLoader';  // Import ModelLoader
import WebcamFeed from './component/WebcamFeed/WebcamFeed';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Real-Time Object Detection</h1>
        <WebcamFeed />
      </header>
    </div>
  );
}
export default App;
