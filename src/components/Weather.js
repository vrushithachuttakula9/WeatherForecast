//src/components/Weather.js

import React, { useState, useEffect } from 'react';
import './Weather.css';
import search from '../images/search.png';
import location from '../images/location.png';
import loadingGif from '../images/loading.gif';
import windImg from '../images/wind.png';
import humidity from '../images/humidity.png';
import cloud from '../images/cloud.png';
import notFound from '../images/not-found.png';
import sky from '../images/sky.png';

const Weather = () => {
  const [activeTab, setActiveTab] = useState('userWeather');
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [countryCode, setCountryCode] = useState(null);
  const [weatherIcon, setWeatherIcon] = useState(null);
  const [grantAccess, setGrantAccess] = useState(false); 


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
          <p>Please grant location access to see weather information</p>
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
          <img width="200" height="200" src={notFound} alt="not-found" />
          <p>City not found</p>
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
        <p style={{fontSize:"25px"}}>{weatherData.main.temp} °C</p>
        <div className="parameter-container">
        <div class="parameter">
          {/* <img src={windImg} alt="wind-image" loading="lazy" /> */}
          <img src={sky} alt="wind-image" loading="lazy" />
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

  return (
    <div className="container"> 
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
