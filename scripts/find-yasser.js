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
    let tracks = await request(`${JELLYFIN_URL}/Items?api_key=${API_KEY}&Recursive=true&IncludeItemTypes=Audio&SearchTerm=Yasser`);
    console.log("Search for Yasser tracks:");
    if (tracks && tracks.Items) {
      tracks.Items.forEach(i => console.log(i.Name, i.Id, i.AlbumId));
    }

    let folders = await request(`${JELLYFIN_URL}/Items?api_key=${API_KEY}&Recursive=true&IncludeItemTypes=Folder,MusicAlbum&SearchTerm=Yasser`);
    console.log("\nSearch for Yasser folders:");
    if (folders && folders.Items) {
      folders.Items.forEach(i => console.log(i.Name, i.Type, i.Id));
    }
  } catch (error) {
    console.error('Erreur:', error.message);
  }
}
main();
