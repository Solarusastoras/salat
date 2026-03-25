import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Book } from 'lucide-react';
import './coran.scss';

// Noms français des sourates
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

const Coran = () => {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await axios.get('https://api.alquran.cloud/v1/surah');
        setSurahs(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching surahs', error);
        setLoading(false);
      }
    };
    fetchSurahs();
  }, []);

  const filteredSurahs = surahs.filter(surah =>
    (NOMS_FR[surah.number - 1] || '').toLowerCase().includes(search.toLowerCase()) ||
    surah.name.includes(search)
  );

  return (
    <div className="coran-page">
      <div className="coran-header glass-panel">
        <div>
          <h1>Le Coran</h1>
          <p className="text-secondary">Liste des 114 Sourates</p>
        </div>
        <div className="coran-search">
          <Search size={20} className="text-secondary" />
          <input
            type="text"
            placeholder="Rechercher une sourate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="surahs-grid">
          {filteredSurahs.map((surah) => (
            <Link to={`/coran/${surah.number}`} key={surah.number} className="surah-card glass-panel">
              <div className="surah-card__number">
                {surah.number}
              </div>
              <div className="surah-card__info">
                <h3>{surah.englishName}</h3>
                <p className="surah-card__ayahs">{surah.numberOfAyahs} Versets</p>
                <p className="surah-card__fr">{NOMS_FR[surah.number - 1]}</p>
              </div>
              <div className="surah-card__arabic">
                {surah.name}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Coran;
