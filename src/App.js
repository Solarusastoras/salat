import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './Composants/Header';
import Salat from './Pages/Salat';
import Coran from './Pages/Coran';
import Surah from './Pages/Surah';
import Apprendre from './Pages/Apprendre';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/salat" replace />} />
          <Route path="/salat" element={<Salat />} />
          <Route path="/coran" element={<Coran />} />
          <Route path="/coran/:id" element={<Surah />} />
          <Route path="/apprendre" element={<Apprendre />} />
        </Routes>
      </main>
      {/* Footer can go here */}
    </div>
  );
}

export default App;
