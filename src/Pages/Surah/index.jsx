import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Play, Pause, Loader } from 'lucide-react';
import { getJellyfinUrl, getYasserJellyfinUrl, getBasetJellyfinUrl } from '../../Outils/jellyfinIds';
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

const AyahCard = React.memo(({ ayah, isThisAyahPlaying, isBuffering, onTogglePlay }) => (
  <div className={`ayah-card glass-panel ${isThisAyahPlaying ? 'active' : ''}`}>
    <div className="ayah-card__header">
      <span className="ayah-card__number">{ayah.numberInSurah}</span>
      <button
        className={`ayah-card__play ${isThisAyahPlaying ? 'playing' : ''}`}
        onClick={() => onTogglePlay(ayah)}
        disabled={isBuffering}>
        {isBuffering ? <Loader size={18} className="spin" /> : (isThisAyahPlaying ? <Pause size={18} /> : <Play size={18} />)}
      </button>
    </div>
    <div className="ayah-card__content">
      <p className="ayah-card__arabic">{ayah.arabicText}</p>
      <p className="ayah-card__transliteration">{ayah.transliterationText}</p>
      <p className="ayah-card__translation">{ayah.translationText}</p>
    </div>
  </div>
));

const Surah = () => {
  const { id } = useParams();
  const [surahData, setSurahData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAyah, setActiveAyah] = useState(null);
  const [selectedReciter, setSelectedReciter] = useState('ghamdi');
  const [isAudioBuffering, setIsAudioBuffering] = useState(false);
  const audioRef = useRef(new Audio());
  const stateRef = useRef({ activeAyah: null, isPlaying: false });

  useEffect(() => {
    stateRef.current = { activeAyah, isPlaying };
  }, [activeAyah, isPlaying]);

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
          // Audio sourate complète via Jellyfin
          localAudio: getJellyfinUrl(parseInt(id)),
          localAudioYasser: getYasserJellyfinUrl(parseInt(id)),
          localAudioBaset: getBasetJellyfinUrl(parseInt(id)),
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching surah', error);
        setLoading(false);
      }
    };
    fetchSurah();

    const audio = audioRef.current;
    audio.onerror = () => {
      console.error('Audio load error', audio.src, audio.error);
    };
    return () => { 
      if (audio) {
        audio.pause(); 
      }
    };
  }, [id]);

  const togglePlay = useCallback((ayah) => {
    const { activeAyah: prevActive, isPlaying: prevPlaying } = stateRef.current;
    if (prevActive === ayah.numberInSurah && prevPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.src = ayah.audioUrl;
      audioRef.current.play();
      setActiveAyah(ayah.numberInSurah);
      setIsPlaying(true);
    }
  }, []);

  // Lecture sourate complète (fichier local Saad Al Ghamdi, Yasser Al Dossari, ou AbdulBaset)
  const toggleFullSurah = () => {
    let audioSrc = surahData.localAudio;
    let activeId = 'full-ghamdi';
    
    if (selectedReciter === 'yasser') {
      audioSrc = surahData.localAudioYasser;
      activeId = 'full-yasser';
    } else if (selectedReciter === 'baset') {
      audioSrc = surahData.localAudioBaset;
      activeId = 'full-baset';
    }

    if (isPlaying && activeAyah === activeId) {
      audioRef.current.pause();
      setIsPlaying(false);
      setActiveAyah(null);
    } else {
      audioRef.current.src = audioSrc;
      audioRef.current.play();
      setActiveAyah(activeId);
      setIsPlaying(true);
    }
  };

  const handleReciterChange = (e) => {
    const newReciter = e.target.value;
    setSelectedReciter(newReciter);
    
    // Stop current audio if it's playing full surah
    if (isPlaying && (activeAyah === 'full-ghamdi' || activeAyah === 'full-yasser' || activeAyah === 'full-baset')) {
      audioRef.current.pause();
      setIsPlaying(false);
      setActiveAyah(null);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    const handleWaiting = () => setIsAudioBuffering(true);
    const handlePlaying = () => setIsAudioBuffering(false);
    const handleCanPlay = () => setIsAudioBuffering(false);
    const handleEnded = () => { setIsPlaying(false); setActiveAyah(null); setIsAudioBuffering(false); };
    const handleError = (e) => { 
      console.error('Audio load error', audio.src, audio.error); 
      setIsAudioBuffering(false); 
      setIsPlaying(false);
    };

    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('loadstart', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => { 
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('loadstart', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
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
        <div className="surah-header__controls">
          <select 
            className="surah-header__select" 
            value={selectedReciter} 
            onChange={handleReciterChange}
          >
            <option value="ghamdi">Saad Al Ghamdi</option>
            <option value="yasser">Yasser Al Dossari</option>
            <option value="baset">AbdulBaset AbdulSamad</option>
          </select>
          <button className={`surah-header__play-full ${(activeAyah === 'full-ghamdi' || activeAyah === 'full-yasser' || activeAyah === 'full-baset') && isPlaying ? 'playing' : ''}`}
            onClick={toggleFullSurah}
            disabled={isAudioBuffering && (activeAyah === 'full-ghamdi' || activeAyah === 'full-yasser' || activeAyah === 'full-baset')}>
            {isAudioBuffering && (activeAyah === 'full-ghamdi' || activeAyah === 'full-yasser' || activeAyah === 'full-baset')
              ? <><Loader size={18} className="spin" /> Chargement...</>
              : (activeAyah === 'full-ghamdi' || activeAyah === 'full-yasser' || activeAyah === 'full-baset') && isPlaying
              ? <><Pause size={18} /> Pause</>
              : <><Play size={18} /> Écouter</>
            }
          </button>
        </div>
      </div>

      <div className="ayahs-list">
        {surahData.ayahs.map((ayah) => (
          <AyahCard
            key={ayah.numberInSurah}
            ayah={ayah}
            isThisAyahPlaying={activeAyah === ayah.numberInSurah && isPlaying}
            isBuffering={activeAyah === ayah.numberInSurah && isAudioBuffering}
            onTogglePlay={togglePlay}
          />
        ))}
      </div>
    </div>
  );
};

export default Surah;
