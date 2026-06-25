const axios = require('axios');

async function check() {
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
    console.log("Total Audio Items:", items.length);
    const basetItems = items.filter(item => item.Path && item.Path.toLowerCase().includes('abdul'));
    console.log(`Found ${basetItems.length} items with 'abdul'`);
    if(basetItems.length > 0) {
      console.log(basetItems.slice(0, 5).map(i => i.Path).join("\n"));
    }
  } catch(e) {
    console.error(e.message);
  }
}
check();
