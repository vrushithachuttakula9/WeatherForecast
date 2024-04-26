import React, {useState, useEffect} from 'react';
import './App.css';
import Weather  from './components/Weather';
import backgroundVideo from './videos/backgroundVideo.mp4';


function App() {

    return (
    <div className="App">
      <video autoPlay loop muted playsInline className="background-video">
      <source src={backgroundVideo} type="video/mp4" />      </video> 
      <Weather />
    </div>
  );
};

export default App;