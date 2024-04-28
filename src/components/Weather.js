//src/components/Weather.js

import React, { useState, useEffect } from 'react';
import './Weather.css';
import search from '../images/search.png';
import location from '../images/location.png';
import loadingGif from '../images/loading.gif';
import humidity from '../images/humidity.png';
import cloud from '../images/cloud.png';
import notFound from '../images/notFound.jpg';
import windImg from '../images/windImg.png';

import backgroundVideo from '../videos/backgroundVideo.mp4';
import brokenCloudsVideo from '../videos/brokenClouds.mp4';
import clearSkyVideo from '../videos/clearSky.mp4';
import fewCloudsVideo from '../videos/fewClouds.mp4';
import mistVideo from '../videos/mist.mp4';
import rainVideo from '../videos/rain.mp4';
import showerRainVideo from '../videos/showerRain.mp4';
import thunderstormVideo from '../videos/thunderstorm.mp4';
import snowVideo from '../videos/snow.mp4';
import scatteredCloudsVideo from '../videos/scatteredClouds.mp4';
import overcastCloudsVideo from '../videos/overcastClouds.mp4';



const weatherBackgrounds = {
  'broken clouds' :  brokenCloudsVideo,
  'clear sky' : clearSkyVideo,
  'few clouds' : fewCloudsVideo,
  mist : mistVideo,
  rain : rainVideo,
  'shower rain' : showerRainVideo,
  thunderstorm: thunderstormVideo,
  snow: snowVideo,
  'scattered clouds': scatteredCloudsVideo,
  'overcast clouds' : overcastCloudsVideo,
};

const Weather = () => {
  const [activeTab, setActiveTab] = useState('userWeather');
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [countryCode, setCountryCode] = useState(null);
  const [weatherIcon, setWeatherIcon] = useState(null);
  const [grantAccess, setGrantAccess] = useState(false); 
  const [backgroundVideoKey, setBackgroundVideoKey] = useState(0);


  useEffect(() => {
    if (activeTab === 'userWeather' && grantAccess) {
     
      getLocation();
    } else {
      setWeatherData(null);
      setSearchQuery('');
    }
  }, [activeTab, grantAccess]);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const showPosition = (position) => {
    const { latitude, longitude } = position.coords;
    fetchWeatherData(latitude, longitude);
  };

  const renderWeatherIcons = () => {
    return weatherData.weather.map((condition, index) => {
      const iconCode = condition.icon;
      const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
      return (
        <img
          key={index}
          src={iconUrl}
          alt={condition.main}
          width="60"
          height="60"
        />
      );
    });
  };

  const fetchWeatherData = async (latitude, longitude) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_WEATHER_API}&units=metric`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch weather data');
        
      }
      setWeatherData(data);
      setCountryCode(data.sys.country)
      setWeatherIcon(data.weather[0].icon)
      setLoading(false);
      setError(null);
    } catch (error) {
      setError(error.message);
      setLoading(false);
      setWeatherData(null);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    setLoading(true);
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=${process.env.REACT_APP_WEATHER_API}&units=metric`);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const data = await response.json();
      console.log('Data:', data);

      setWeatherData(data);
      setCountryCode(data.sys.country);
      setLoading(false);
      setError(null);
    } catch (error) {
      setError(error.message);
      setLoading(false);
      setWeatherData(null);
    }
  };



  const renderWeatherInfo = () => {

    if (!grantAccess && activeTab !== 'searchWeather') {
      return (
        <div className='weather-container'>
          <div className='sub-container grant-location-container'>
          <img
                src={location}
                alt="location-image"
                width="80"
                height="80"
                loading="lazy"/>
          <button className='btn' onClick={grantLocationAccess}>Grant Location Access</button>
          <p style={{fontSize : "20px", fontWeight : "500"}}>Please grant location access to see weather information</p>
        </div>
        </div>
      );
    }
    if (loading) {
      return (
        <div className='loading-container'>
          <img
            src={loadingGif}
            alt="loading-animation"
            width="150"
            height="150"
            loading="lazy"
          />
          <p>Loading..</p>
        </div>
      );
      
    }
    if (error && !weatherData) {
      return (
        <div className="notFound">
          <img width="250" height="200" src={notFound} alt="not-found" />
          <p >City not found</p>
        </div>
      );
    }
    

    if (!weatherData) {
      return null;
    }
    return (
      <div className="weather-info">
        <h2 style={{fontSize:"30px"}}>{weatherData.name} {countryCode && <img
          src={`https://flagcdn.com/144x108/${countryCode.toLowerCase()}.png`}
          alt="country-flag" width="25" height="25"
          />}
        </h2>
        <p style={{fontSize:"25px"}}>{weatherData.weather[0].description}</p>
        <div className="weather-icons">
          {renderWeatherIcons()}
        </div>
        <p style={{fontSize:"35px"}}>{weatherData.main.temp} °C</p>
        <div className="parameter-container">
        <div class="parameter">
          <img src={windImg} alt="wind-image" loading="lazy" />
          <p>Windspeed</p>
          <p>{weatherData.wind.speed}</p>
        </div>

        <div className="parameter">
          <img src={humidity} alt="humidity-img" loading="lazy" />
          <p>Humidity</p>
          <p>{weatherData.main.humidity}%</p>
        </div>

        <div class="parameter">
          <img src={cloud} alt="cloud-img" loading="lazy" />
          <p>Cloudiness</p>
          <p>{weatherData.clouds.all}%</p>
        </div>
      </div>
        
      </div>
    );
  };

  const grantLocationAccess = () => {
    setGrantAccess(true);
    getLocation();
  };


  const getBackgroundVideo = () => {
    let backgroundVideoSrc = backgroundVideo;

    if (weatherData && weatherData.weather && weatherData.weather.length > 0) {
      const weatherDescription = weatherData.weather[0].description;
      const selectedVideo = weatherBackgrounds[weatherDescription];
      if (selectedVideo) {
        backgroundVideoSrc = selectedVideo;
      } else {
        console.log(`Video for ${weatherDescription} not found. Using default video.`);
      }
    }

    console.log('Selected background video:', backgroundVideoSrc);
    return backgroundVideoSrc;
  };

  useEffect(() => {
        setBackgroundVideoKey(prevKey => prevKey + 1);
  }, [weatherData]);


  return (
    <div className="container"> 
    <video key={backgroundVideoKey} autoPlay loop muted playsInline className="background-video">
        <source src={getBackgroundVideo()} type="video/mp4" />
      </video>
      <h1>Weather App</h1>
      <div className="tabs">
      <button
        className={`transparent-btn ${activeTab === 'userWeather' ? 'active' : ''}`}
        onClick={() => setActiveTab('userWeather')}
>
          Your Weather
        </button>
        <button
          className={`transparent-btn ${activeTab === 'searchWeather' ? 'active' : ''}`}
          onClick={() => setActiveTab('searchWeather')}
        >
          Search Weather
        </button>
      </div>
      {activeTab === 'searchWeather' && (
        <form className='form-container' onSubmit={handleSearch}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter city name..."
          /> &nbsp;
          <button className='btn' type="submit"><img
                src={search}
                alt="Search-image"
                width="20"
                height="20"
                loading="lazy"
              /></button>
        </form>
      )}
      {renderWeatherInfo()}
    </div>
  );
};

export default Weather;
