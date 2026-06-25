const axios = require('axios');
const fs = require('fs');

async function fetchIDs() {
  try {
    const res = await axios.get('https://popcorn.solarusweb.ovh/Items', {
      params: {
        api_key: '211b9a996a2c415ea437a56c2d54d00f',
        IncludeItemTypes: 'Audio',
        Recursive: 'true',
        Fields: 'Path'
      }
    });

    const items = res.data.Items;
    const basetItems = items.filter(item => item.Path && item.Path.includes('AbdulBaset'));
    
    console.log(`Found ${basetItems.length} items`);
    if (basetItems.length > 0) {
      console.log('Sample path:', basetItems[0].Path);
      // Map them by surah number
      // Assuming filename starts with surah number like "001. Al-Fatiha.mp3"
      const ids = {};
      for (const item of basetItems) {
        // match "001"
        const match = item.Path.match(/\\(\d{3})\.\s/);
        if (match) {
          const num = parseInt(match[1], 10);
          ids[num] = item.Id;
        }
      }
      fs.writeFileSync('abdulbaset_ids.json', JSON.stringify(ids, null, 2));
      console.log('Saved to abdulbaset_ids.json');
    }
  } catch(e) {
    console.error(e.message);
  }
}
fetchIDs();
