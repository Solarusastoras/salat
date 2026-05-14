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

async function exploreFolder(folderId, folderName, depth = 0) {
  const indent = '  '.repeat(depth);
  
  try {
    const url = `${JELLYFIN_URL}/Items?api_key=${API_KEY}&ParentId=${folderId}&Limit=100&SortBy=Name`;
    const items = await request(url);
    
    console.log(`${indent}📁 ${folderName} (${items?.Items?.length || 0} éléments)`);
    
    if (items?.Items && items.Items.length > 0) {
      items.Items.forEach(item => {
        const isFolder = item.IsFolder;
        const icon = isFolder ? '📁' : '🎵';
        console.log(`${indent}  ${icon} ${item.Name} (${item.Type})`);
        
        if (isFolder && depth < 2) {
          // Recursively explore folders
          // Uncomment the line below to explore subfolders
          // exploreFolder(item.Id, item.Name, depth + 1);
        }
      });
    }
  } catch (e) {
    console.error(`${indent}  Erreur:`, e.message);
  }
}

async function main() {
  try {
    console.log('Exploration de la structure Jellyfin...\n');
    
    // ID de la collection "Musiques": 5e1aff96135d5e13105f021e6bea2793
    await exploreFolder('5e1aff96135d5e13105f021e6bea2793', 'Musiques');
    
    console.log('\n');
    
    // On peut aussi essayer de chercher directement des albums contenant "Quran" ou "Saad"
    console.log('Recherche d\'albums contenant "Quran"...');
    let quranAlbums = await request(`${JELLYFIN_URL}/Items?api_key=${API_KEY}&ParentId=5e1aff96135d5e13105f021e6bea2793&SearchTerm=Quran&Limit=20`);
    
    if (quranAlbums?.Items && quranAlbums.Items.length > 0) {
      console.log(`Trouvé ${quranAlbums.Items.length} albums/dossiers avec "Quran":`);
      quranAlbums.Items.forEach(item => {
        console.log(`  - ${item.Name} (ID: ${item.Id}, Type: ${item.Type})`);
      });
    }
    
    // Essayer aussi "Ghamdi"
    console.log('\nRecherche d\'albums contenant "Ghamdi"...');
    let ghamdiAlbums = await request(`${JELLYFIN_URL}/Items?api_key=${API_KEY}&ParentId=5e1aff96135d5e13105f021e6bea2793&SearchTerm=Ghamdi&Limit=20`);
    
    if (ghamdiAlbums?.Items && ghamdiAlbums.Items.length > 0) {
      console.log(`Trouvé ${ghamdiAlbums.Items.length} albums/dossiers avec "Ghamdi":`);
      ghamdiAlbums.Items.forEach(item => {
        console.log(`  - ${item.Name} (ID: ${item.Id}, Type: ${item.Type})`);
      });
    }
    
  } catch (error) {
    console.error('Erreur:', error.message);
    process.exit(1);
  }
}

main();
