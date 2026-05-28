const fs = require('fs');
const https = require('https');
const path = require('path');

const JELLYFIN_URL = 'https://popcorn.solarusweb.ovh';
const API_KEY = '211b9a996a2c415ea437a56c2d54d00f';

const GHAMDI_ALBUM_ID = 'aede65d36da9d6e28bb3c8ad13dac5df';
const YASSER_ALBUM_ID = '7f6c02c5fcdba288fdac686e6b82d874';

function getTracks(albumId) {
  return new Promise((resolve, reject) => {
    const url = `${JELLYFIN_URL}/Items?api_key=${API_KEY}&ParentId=${albumId}&IncludeItemTypes=Audio&Limit=200`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data).Items || []);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

const SURAHS = [
  'Al-Fatihah', 'Al-Baqarah', 'Al-Imran', 'An-Nisa', 'Al-Ma\'idah',
  'Al-An\'am', 'Al-A\'raf', 'Al-Anfal', 'At-Tawbah', 'Yunus',
  'Hud', 'Yusuf', 'Ar-Ra\'d', 'Ibrahim', 'Al-Hijr',
  'An-Nahl', 'Al-Isra', 'Al-Kahf', 'Maryam', 'Ta-Ha',
  'Al-Anbiya', 'Al-Hajj', 'Al-Mu\'minun', 'An-Nur', 'Al-Furqan',
  'Ash-Shu\'ara', 'An-Naml', 'Al-Qasas', 'Al-\'Ankabut', 'Ar-Rum',
  'Luqman', 'As-Sajdah', 'Al-Ahzab', 'Saba', 'Fatir',
  'Ya-Sin', 'As-Saffat', 'Sad', 'Az-Zumar', 'Ghafir',
  'Fussilat', 'Ash-Shura', 'Az-Zukhruf', 'Ad-Dukhan', 'Al-Jathiya',
  'Al-Ahqaf', 'Muhammad', 'Al-Fath', 'Al-Hujurat', 'Qaf',
  'Az-Zariyat', 'At-Tur', 'An-Najm', 'Al-Qamar', 'Ar-Rahman',
  'Al-Waqi\'ah', 'Al-Hadid', 'Al-Mujadilah', 'Al-Hashr', 'Al-Mumtahinah',
  'As-Saff', 'Al-Jumu\'ah', 'Al-Munafiqun', 'At-Taghabun', 'At-Talaq',
  'At-Tahrim', 'Al-Mulk', 'Al-Qalam', 'Al-Haqqah', 'Al-Ma\'arij',
  'Nuh', 'Al-Jinn', 'Al-Muzzammil', 'Al-Muddaththir', 'Al-Qiyamah',
  'Al-Insan', 'Al-Mursalat', 'An-Naba', 'An-Nazi\'at', '\'Abasa',
  'At-Takwir', 'Al-Infitar', 'Al-Mutaffifin', 'Al-Inshiqaq', 'Al-Buruj',
  'At-Tariq', 'Al-A\'la', 'Al-Ghashiyah', 'Al-Fajr', 'Al-Balad',
  'Ash-Shams', 'Al-Lail', 'Ad-Duha', 'Ash-Sharh', 'At-Tin',
  'Al-\'Alaq', 'Al-Qadr', 'Al-Baiyinah', 'Az-Zalzalah', 'Al-Adiyat',
  'Al-Qari\'ah', 'At-Takathur', 'Al-\'Asr', 'Al-Humazah', 'Al-Fil',
  'Quraysh', 'Al-Ma\'un', 'Al-Kauthar', 'Al-Kafirun', 'An-Nasr',
  'Al-Masad', 'Al-Ikhlas', 'Al-Falaq', 'An-Nas'
];

async function main() {
  try {
    console.log('Fetching tracks from Jellyfin...');
    const ghamdiTracks = await getTracks(GHAMDI_ALBUM_ID);
    const yasserTracks = await getTracks(YASSER_ALBUM_ID);

    console.log(`Found ${ghamdiTracks.length} Ghamdi tracks and ${yasserTracks.length} Yasser tracks.`);

    if (ghamdiTracks.length === 0 || yasserTracks.length === 0) {
      console.error('Error: Empty tracks for one or both reciters');
      process.exit(1);
    }

    // Sort by name (which starts with track number: 001, 002, etc.)
    ghamdiTracks.sort((a, b) => a.Name.localeCompare(b.Name));
    yasserTracks.sort((a, b) => a.Name.localeCompare(b.Name));

    let ghamdiLines = ghamdiTracks.map((track, idx) => {
      const num = idx + 1;
      return `  ${num}: "${track.Id}",  // ${SURAHS[idx]}`;
    }).join('\n');

    let yasserLines = yasserTracks.map((track, idx) => {
      const num = idx + 1;
      return `  ${num}: "${track.Id}", // ${track.Name}`;
    }).join('\n');

    const output = `// Jellyfin Item IDs pour chaque sourate
// Généré automatiquement le ${new Date().toISOString()}
export const JELLYFIN_ITEM_IDS = {
${ghamdiLines}
};

export const getJellyfinUrl = (surahNumber, apiKey = "211b9a996a2c415ea437a56c2d54d00f") => {
  const itemId = JELLYFIN_ITEM_IDS[surahNumber];
  if (!itemId) {
    console.warn("No Jellyfin ID for Surah " + surahNumber);
    return null;
  }
  return "https://popcorn.solarusweb.ovh/Audio/" + itemId + "/stream?api_key=" + apiKey + "&static=true";
};

export const YASSER_JELLYFIN_ITEM_IDS = {
${yasserLines}
};

export const getYasserJellyfinUrl = (surahNumber, apiKey = "211b9a996a2c415ea437a56c2d54d00f") => {
  const itemId = YASSER_JELLYFIN_ITEM_IDS[surahNumber];
  if (!itemId) {
    console.warn("No Jellyfin ID for Surah " + surahNumber);
    return null;
  }
  return "https://popcorn.solarusweb.ovh/Audio/" + itemId + "/stream?api_key=" + apiKey + "&static=true";
};
`;

    const outputPath = path.join(__dirname, '..', 'src', 'Outils', 'jellyfinIds.js');
    fs.writeFileSync(outputPath, output);
    console.log(`Successfully updated ${outputPath}!`);
  } catch (e) {
    console.error('Error running script:', e);
  }
}

main();
