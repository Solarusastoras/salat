#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

const JELLYFIN_URL = 'https://popcorn.solarusweb.ovh';
const API_KEY = '211b9a996a2c415ea437a56c2d54d00f';

async function request(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  try {
    console.log('Extraction des 114 surahs depuis l\'album "Quran"...\n');
    
    // L'album ID
    const albumId = '3aafd2241c734ba8a5e7316adc0411f7';
    
    // Chercher tous les fichiers audio de cet album
    console.log('Récupération des pistes audio...');
    let tracks = await request(`${JELLYFIN_URL}/Items?api_key=${API_KEY}&ParentId=${albumId}&IncludeItemTypes=Audio&Limit=200&SortBy=IndexNumber`);
    
    console.log(`Trouvé ${tracks?.Items?.length || 0} pistes audio\n`);
    
    if (!tracks?.Items || tracks.Items.length === 0) {
      console.error('❌ Aucune piste audio trouvée!');
      process.exit(1);
    }
    
    if (tracks.Items.length < 114) {
      console.warn(`⚠️  Attention: seulement ${tracks.Items.length}/114 pistes trouvées`);
    }
    
    // Afficher les premières et dernières pistes
    console.log('Premières pistes:');
    tracks.Items.slice(0, 5).forEach((track, idx) => {
      console.log(`  ${idx + 1}. ${track.Name} (ID: ${track.Id.substring(0, 8)}...)`);
    });
    
    console.log('\nDernières pistes:');
    const start = Math.max(0, tracks.Items.length - 5);
    tracks.Items.slice(start).forEach((track, idx) => {
      console.log(`  ${tracks.Items.length - 5 + idx + 1}. ${track.Name} (ID: ${track.Id.substring(0, 8)}...)`);
    });
    
    // Créer le fichier jellyfinIds.js
    console.log('\n📝 Génération de jellyfinIds.js...');
    
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
    
    let mapLines = tracks.Items.slice(0, Math.min(114, tracks.Items.length)).map((track, idx) => {
      const surahNumber = idx + 1;
      return '  ' + surahNumber + ': "' + track.Id + '",  // ' + SURAHS[idx];
    }).join('\n');
    
    const output = '// Jellyfin Item IDs pour chaque sourate\n' +
      '// Généré automatiquement le ' + new Date().toISOString() + '\n' +
      'export const JELLYFIN_ITEM_IDS = {\n' +
      mapLines + '\n' +
      '};\n\n' +
      'export const getJellyfinUrl = (surahNumber, apiKey = "211b9a996a2c415ea437a56c2d54d00f") => {\n' +
      '  const itemId = JELLYFIN_ITEM_IDS[surahNumber];\n' +
      '  if (!itemId) {\n' +
      '    console.warn("No Jellyfin ID for Surah " + surahNumber);\n' +
      '    return null;\n' +
      '  }\n' +
      '  return "https://popcorn.solarusweb.ovh/Items/" + itemId + "/Download?api_key=" + apiKey;\n' +
      '};\n';
    
    const filePath = path.join(__dirname, '..', 'src', 'Outils', 'jellyfinIds.js');
    fs.writeFileSync(filePath, output);
    
    console.log(`✅ jellyfinIds.js créé avec ${Math.min(114, tracks.Items.length)} sou rates!`);
    console.log(`   Fichier: ${filePath}`);
    
    if (tracks.Items.length >= 114) {
      console.log('\n✅ Toutes les 114 surahs trouvées et mappées!');
    } else {
      console.log(`\n⚠️  ${114 - tracks.Items.length} surahs manquent (trouvé ${tracks.Items.length}/114)`);
    }
    
  } catch (error) {
    console.error('Erreur:', error.message);
    process.exit(1);
  }
}

main();
