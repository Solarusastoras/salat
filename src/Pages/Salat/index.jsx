import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Search, Clock, Sunrise, Sunset, Moon } from 'lucide-react';
import './salat.scss';

const PRAYER_NAMES = {
  Fajr: 'Fajr',
  Sunrise: 'Chourouk',
  Dhuhr: 'Dohr',
  Asr: 'Asr',
  Maghrib: 'Maghreb',
  Isha: 'Icha'
};

const Salat = () => {
  const [city, setCity] = useState('Paris');
  const [country, setCountry] = useState('France');
  const [searchQuery, setSearchQuery] = useState('');
  const [timings, setTimings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPrayerTimes(city, country);
  }, [city, country]);

  const fetchPrayerTimes = async (cityName, countryName) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`https://api.aladhan.com/v1/timingsByCity`, {
        params: {
          city: cityName,
          country: countryName,
          method: 12, // Musulmans de France (ex-UOIF) - Angle 12°
        }
      });
      setTimings(response.data.data.timings);
      setLoading(false);
    } catch (err) {
      setError('Impossible de récupérer les horaires pour cette ville.');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Basic splitting for "City, Country"
      const parts = searchQuery.split(',');
      setCity(parts[0].trim());
      if (parts.length > 1) {
        setCountry(parts[1].trim());
      }
      setSearchQuery('');
    }
  };

  const renderPrayerCard = (name, time, isNext = false) => {
    let Icon = Clock;
    if (name === 'Sunrise') Icon = Sunrise;
    else if (name === 'Maghrib') Icon = Sunset;
    else if (name === 'Isha' || name === 'Fajr') Icon = Moon;

    const displayName = PRAYER_NAMES[name] || name;

    return (
      <div key={name} className={`prayer-card glass-panel ${isNext ? 'next-prayer' : ''}`}>
        <div className="prayer-card__icon-wrap">
          <Icon size={24} className="prayer-card__icon" />
        </div>
        <div className="prayer-card__info">
          <h3>{displayName}</h3>
          <p className="prayer-card__time">{time}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="salat-page">
      <div className="salat-header glass-panel">
        <div className="salat-header__location">
          <MapPin className="text-accent" size={28} />
          <div>
            <h1>{city}</h1>
            <p className="text-secondary">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="salat-search">
          <input
            type="text"
            placeholder="Rechercher une ville (ex: Lyon, France)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="salat-search__input"
          />
          <button type="submit" className="salat-search__button">
            <Search size={20} />
          </button>
        </form>
      </div>

      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <p>Chargement des horaires...</p>
        </div>
      ) : error ? (
        <div className="error-message glass-panel">
          <p>{error}</p>
        </div>
      ) : timings ? (
        <div className="prayers-grid">
          {['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer) => 
            renderPrayerCard(prayer, timings[prayer])
          )}
        </div>
      ) : null}
    </div>
  );
};

export default Salat;
