#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

const JELLYFIN_URL = 'https://popcorn.solarusweb.ovh';
const API_KEY = '211b9a996a2c415ea437a56c2d54d00f';

// Récupère les infos sur les fichiers de la série Quran
async function fetchJellyfinItems() {
  return new Promise((resolve, reject) => {
    // Chercher les albums/fichiers contenant "quran" ou dans le dossier Saad Al-Ghamdi
    const url = `${JELLYFIN_URL}/Items?api_key=${API_KEY}&searchTerm=quran&IncludeItemTypes=Audio&SortBy=Name&recursive=true&limit=200`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Alternative: Chercher dans un dossier spécifique
async function fetchItemsByParent(parentId) {
  return new Promise((resolve, reject) => {
    const url = `${JELLYFIN_URL}/Items?api_key=${API_KEY}&ParentId=${parentId}&SortBy=Name&recursive=false`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  try {
    console.log('Récupération des fichiers Quran depuis Jellyfin...');
    
    // Essayer avec la recherche d'abord
    let items = await fetchJellyfinItems();
    
    if (!items.Items || items.Items.length === 0) {
      console.log('Aucun item trouvé avec la recherche "quran"');
      console.log('Cherchons manuellement...');
      
      // Si pas de résultats, on peut aussi chercher par root
      const rootUrl = `${JELLYFIN_URL}/Items?api_key=${API_KEY}&Recursive=true&IncludeItemTypes=Audio&SortBy=Name&limit=200`;
      items = await fetchJellyfinItems();
    }
    
    const audioItems = (items.Items || [])
      .filter(item => item.Type === 'Audio' && item.IsFolder === false)
      .sort((a, b) => {
        // Trier par nom pour obtenir l'ordre correct (001, 002, etc.)
        const aNum = parseInt(a.Name.match(/\d+/)?.[0] || '0');
        const bNum = parseInt(b.Name.match(/\d+/)?.[0] || '0');
        return aNum - bNum;
      });
    
    console.log(`\nTrouvé ${audioItems.length} fichiers audio`);
    
    if (audioItems.length === 0) {
      console.error('Aucun fichier audio trouvé!');
      process.exit(1);
    }
    
    // Afficher les premiers fichiers trouvés
    console.log('\nPremiers fichiers:');
    audioItems.slice(0, 5).forEach((item, i) => {
      console.log(`  ${i + 1}. "${item.Name}" (ID: ${item.Id})`);
    });
    
    // Créer l'objet de mapping
    const jellyfinIds = {};
    
    audioItems.forEach((item, index) => {
      // index 0 = sourate 1, index 1 = sourate 2, etc.
      const surahNumber = index + 1;
      jellyfinIds[surahNumber] = item.Id;
    });
    
    // Générer le contenu du fichier
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
    
    let mapLines = Object.entries(jellyfinIds).map(([num, id]) => {
      const numInt = parseInt(num);
      return '  ' + numInt + ': "' + id + '",  // ' + SURAHS[numInt - 1];
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
    
    // Écrire le fichier
    const filePath = path.join(__dirname, '..', 'src', 'Outils', 'jellyfinIds.js');
    fs.writeFileSync(filePath, output);
    
    console.log(`\n✅ jellyfinIds.js mis à jour avec ${audioItems.length} sourates!`);
    console.log(`Fichier écrit: ${filePath}`);
    
    // Afficher un résumé
    console.log('\nRésumé:');
    console.log(`  Sourates trouvées: ${audioItems.length}/114`);
    if (audioItems.length < 114) {
      console.log(`  ⚠️  Attention: ${114 - audioItems.length} sou rates manquent!`);
    }
    
  } catch (error) {
    console.error('Erreur:', error.message);
    process.exit(1);
  }
}

main();
