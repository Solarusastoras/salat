import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Play, Pause } from 'lucide-react';
import './surah.scss';


const NOMS_FR = [
  'L\'Ouverture', 'La Vache', 'La Famille d\'Imran', 'Les Femmes', 'La Table Servie',
  'Les Bestiaux', 'Les Murailles', 'Le Butin', 'Le Repentir', 'Jonas',
  'Houd', 'Joseph', 'Le Tonnerre', 'Ibrahim', 'Al-Hijr',
  'Les Abeilles', 'Le Voyage Nocturne', 'La Caverne', 'Marie', 'Tâ-Hâ',
  'Les Prophètes', 'Le Pèlerinage', 'Les Croyants', 'La Lumière', 'Le Discernement',
  'Les Poètes', 'Les Fourmis', 'Le Récit', 'L\'Araignée', 'Les Byzantins',
  'Luqman', 'La Prosternation', 'Les Coalisés', 'Saba\'', 'Le Créateur',
  'Yâ-Sîn', 'Ceux qui se rangent en rangs', 'Sâd', 'Les Groupes', 'Le Croyant',
  'Fussilat', 'La Concertation', 'L\'Ornement', 'La Fumée', 'L\'Agenouillée',
  'Les Dunes', 'Muhammad', 'La Victoire', 'Les Appartements', 'Qâf',
  'Les Vents Dispersants', 'Le Mont', 'L\'Étoile', 'La Lune', 'Le Miséricordieux',
  'L\'Inéluctable', 'Le Fer', 'La Controverse', 'Le Rassemblement', 'La Mise à l\'Épreuve',
  'La Rangée', 'Le Vendredi', 'Les Hypocrites', 'La Spoliation', 'Le Divorce',
  'L\'Interdiction', 'Le Royaume', 'La Plume', 'La Réalité', 'Les Degrés d\'Élévation',
  'Noé', 'Les Djinns', 'L\'Enveloppé', 'Le Revêtu d\'un Manteau', 'La Résurrection',
  'L\'Homme', 'Ceux qu\'on Envoie', 'La Nouvelle', 'Ceux qui Arrachent', 'Il s\'est Renfrogné',
  'L\'Obscurcissement', 'L\'Éclatement', 'Ceux qui Lésinent', 'L\'Éclatement', 'Les Constellations',
  'Le Nocturne', 'Le Très-Haut', 'L\'Enveloppant', 'L\'Aube', 'La Cité',
  'Le Soleil', 'La Nuit', 'Le Matin', 'L\'Expansion', 'Le Figuier',
  'Le Caillot de Sang', 'La Nuit du Destin', 'La Preuve', 'Le Tremblement de Terre',
  'Les Poulains', 'Le Fracas', 'La Rivalité', 'L\'Après-Midi', 'Le Calomniateur',
  'L\'Éléphant', 'Qoraych', 'L\'Ustensile', 'L\'Abondance', 'Les Infidèles',
  'Le Secours', 'Les Fibres', 'La Pureté', 'L\'Aube Naissante', 'Les Hommes',
];

const Surah = () => {
  const { id } = useParams();
  const [surahData, setSurahData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAyah, setActiveAyah] = useState(null);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const fetchSurah = async () => {
      try {
        setLoading(true);
        // Fetch Arabic + Translitération + Traduction française
        const response = await axios.get(
          `https://api.alquran.cloud/v1/surah/${id}/editions/quran-uthmani,en.transliteration,fr.hamidullah`
        );

        const arabic = response.data.data[0];
        const transliteration = response.data.data[1];
        const translation = response.data.data[2];

        const mergedAyahs = arabic.ayahs.map((ayah, index) => ({
          numberInSurah: ayah.numberInSurah,
          arabicText: ayah.text,
          transliterationText: transliteration.ayahs[index].text,
          translationText: translation.ayahs[index].text,
          // Audio local Saad Al Ghamdi par verset via API
          audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`,
        }));

        setSurahData({
          name: NOMS_FR[parseInt(id) - 1],
          arabicName: arabic.name,
          revelationType: arabic.revelationType,
          numberOfAyahs: arabic.numberOfAyahs,
          ayahs: mergedAyahs,
          // Audio sourate complète local
          localAudio: `/sound/${String(id).padStart(3, '0')}.mp3`,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching surah', error);
        setLoading(false);
      }
    };
    fetchSurah();

    return () => { audioRef.current.pause(); };
  }, [id]);

  const togglePlay = (ayah) => {
    if (activeAyah === ayah.numberInSurah && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.src = ayah.audioUrl;
      audioRef.current.play();
      setActiveAyah(ayah.numberInSurah);
      setIsPlaying(true);
    }
  };

  // Lecture sourate complète (fichier local Saad Al Ghamdi)
  const toggleFullSurah = () => {
    if (isPlaying && activeAyah === 'full') {
      audioRef.current.pause();
      setIsPlaying(false);
      setActiveAyah(null);
    } else {
      audioRef.current.src = surahData.localAudio;
      audioRef.current.play();
      setActiveAyah('full');
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => { setIsPlaying(false); setActiveAyah(null); };
    audio.addEventListener('ended', handleEnded);
    return () => { audio.removeEventListener('ended', handleEnded); };
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="surah-page">
      <Link to="/coran" className="back-link">
        <ArrowLeft size={20} /> Retour aux sourates
      </Link>

      <div className="surah-header glass-panel">
        <div className="surah-header__title">
          <h1>{surahData.name}</h1>
          <p>{surahData.numberOfAyahs} versets</p>
        </div>
        <div className="surah-header__arabic">{surahData.arabicName}</div>
        {/* Bouton lecture sourate complète Saad Al Ghamdi */}
        <button className={`surah-header__play-full ${activeAyah === 'full' && isPlaying ? 'playing' : ''}`}
          onClick={toggleFullSurah}>
          {activeAyah === 'full' && isPlaying
            ? <><Pause size={18} /> Pause</>
            : <><Play size={18} /> Écouter · Saad Al Ghamdi</>
          }
        </button>
      </div>

      <div className="ayahs-list">
        {surahData.ayahs.map((ayah) => (
          <div key={ayah.numberInSurah}
            className={`ayah-card glass-panel ${activeAyah === ayah.numberInSurah ? 'active' : ''}`}>
            <div className="ayah-card__header">
              <span className="ayah-card__number">{ayah.numberInSurah}</span>
              <button
                className={`ayah-card__play ${activeAyah === ayah.numberInSurah && isPlaying ? 'playing' : ''}`}
                onClick={() => togglePlay(ayah)}>
                {activeAyah === ayah.numberInSurah && isPlaying
                  ? <Pause size={18} />
                  : <Play size={18} />}
              </button>
            </div>
            <div className="ayah-card__content">
              <p className="ayah-card__arabic">{ayah.arabicText}</p>
              <p className="ayah-card__transliteration">{ayah.transliterationText}</p>
              <p className="ayah-card__translation">{ayah.translationText}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Surah;
