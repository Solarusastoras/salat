#!/usr/bin/env node

const https = require('https');

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
    console.log('Exploration de "0_Coran recité par SaadAL Ghamdi"...\n');
    
    // L'artiste ID
    const artistId = 'ed8f140a69d55c8325881213dcfa8c94';
    
    // Chercher les albums de cet artiste
    console.log('1. Chercher les albums...');
    let albums = await request(`${JELLYFIN_URL}/Items?api_key=${API_KEY}&ParentId=${artistId}&Limit=200&SortBy=Name`);
    
    console.log(`Trouvé ${albums?.Items?.length || 0} albums\n`);
    
    if (albums?.Items && albums.Items.length > 0) {
      albums.Items.slice(0, 10).forEach((album, idx) => {
        console.log(`  ${idx + 1}. ${album.Name} (ID: ${album.Id}, Type: ${album.Type}, ${album.ChildCount} fichiers)`);
      });
      
      if (albums.Items.length > 10) {
        console.log(`  ... et ${albums.Items.length - 10} autres`);
      }
    }
    
    // Chercher directement les fichiers audio
    console.log('\n2. Chercher les fichiers audio de cet artiste...');
    let audioFiles = await request(`${JELLYFIN_URL}/Items?api_key=${API_KEY}&RecursiveId=${artistId}&IncludeItemTypes=Audio&Limit=200&SortBy=Name`);
    
    console.log(`Trouvé ${audioFiles?.Items?.length || 0} fichiers audio\n`);
    
    if (audioFiles?.Items && audioFiles.Items.length > 0) {
      console.log('Premiers fichiers:');
      audioFiles.Items.slice(0, 10).forEach((file, idx) => {
        console.log(`  ${idx + 1}. ${file.Name} (ID: ${file.Id.substring(0, 8)}...)`);
      });
      
      if (audioFiles.Items.length > 10) {
        console.log(`  ... et ${audioFiles.Items.length - 10} autres`);
      }
      
      // Générer le mapping pour les 114 premiers fichiers
      if (audioFiles.Items.length >= 114) {
        console.log('\n3. Génération de jellyfinIds.js...');
        
        // Créer l'objet de mapping (114 surahs)
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
        
        let mapLines = audioFiles.Items.slice(0, 114).map((file, idx) => {
          const surahNumber = idx + 1;
          return '  ' + surahNumber + ': "' + file.Id + '",  // ' + SURAHS[idx];
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
        
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(__dirname, '..', 'src', 'Outils', 'jellyfinIds.js');
        fs.writeFileSync(filePath, output);
        
        console.log(`   ✅ jellyfinIds.js mis à jour avec 114 sou rates!`);
      }
    }
    
  } catch (error) {
    console.error('Erreur:', error.message);
    process.exit(1);
  }
}

main();
