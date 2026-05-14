#!/usr/bin/env node

const https = require('https');

const JELLYFIN_URL = 'https://popcorn.solarusweb.ovh';
const API_KEY = '211b9a996a2c415ea437a56c2d54d00f';

async function request(url) {
  return new Promise((resolve, reject) => {
    console.log('Requête:', url.split('?')[0].substring(JELLYFIN_URL.length));
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
    // 1. Récupérer les users
    console.log('\n1. Récupération des utilisateurs...');
    let users = await request(`${JELLYFIN_URL}/Users?api_key=${API_KEY}`);
    console.log('   Utilisateurs trouvés:', users?.length || 0);
    
    // 2. Lister les collections/bibliothèques
    console.log('\n2. Lister les collections...');
    let collections = await request(`${JELLYFIN_URL}/Items?api_key=${API_KEY}&IncludeItemTypes=Folder,CollectionFolder&Limit=50`);
    console.log('   Éléments trouvés:', collections?.Items?.length || 0);
    
    if (collections?.Items) {
      collections.Items.forEach(item => {
        console.log(`     - ${item.Name} (${item.Type}, ID: ${item.Id.substring(0, 8)}...)`);
      });
    }
    
    // 3. Chercher tout (Audio, Music, etc.)
    console.log('\n3. Chercher les fichiers Audio...');
    let allAudio = await request(`${JELLYFIN_URL}/Items?api_key=${API_KEY}&IncludeItemTypes=Audio&Limit=50&SortBy=Name`);
    console.log('   Fichiers audio trouvés:', allAudio?.Items?.length || 0);
    
    if (allAudio?.Items) {
      allAudio.Items.slice(0, 5).forEach(item => {
        console.log(`     - ${item.Name} (ID: ${item.Id.substring(0, 8)}...)`);
      });
    }
    
    // 4. Chercher des artistes
    console.log('\n4. Chercher les artistes...');
    let artists = await request(`${JELLYFIN_URL}/Items?api_key=${API_KEY}&IncludeItemTypes=MusicArtist&Limit=20`);
    console.log('   Artistes trouvés:', artists?.Items?.length || 0);
    
    if (artists?.Items) {
      artists.Items.slice(0, 5).forEach(item => {
        console.log(`     - ${item.Name} (ID: ${item.Id})`);
      });
    }
    
    // 5. Chercher des albums
    console.log('\n5. Chercher les albums...');
    let albums = await request(`${JELLYFIN_URL}/Items?api_key=${API_KEY}&IncludeItemTypes=MusicAlbum&Limit=20&SortBy=Name`);
    console.log('   Albums trouvés:', albums?.Items?.length || 0);
    
    if (albums?.Items) {
      albums.Items.forEach(item => {
        console.log(`     - ${item.Name} (${item.Type}, ID: ${item.Id}, ${item.ChildCount} fichiers)`);
      });
    }
    
    // 6. Chercher spécifiquement "Saad"
    console.log('\n6. Chercher "Saad"...');
    let saad = await request(`${JELLYFIN_URL}/Items?api_key=${API_KEY}&SearchTerm=Saad&Limit=20`);
    console.log('   Résultats pour "Saad":', saad?.Items?.length || 0);
    
    if (saad?.Items) {
      saad.Items.forEach(item => {
        console.log(`     - ${item.Name} (${item.Type}, ID: ${item.Id})`);
      });
    }
    
  } catch (error) {
    console.error('Erreur:', error.message);
    process.exit(1);
  }
}

main();
