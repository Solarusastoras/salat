const fs = require('fs');
const https = require('https');
const API_KEY = '211b9a996a2c415ea437a56c2d54d00f';

https.get('https://popcorn.solarusweb.ovh/Items?api_key=' + API_KEY + '&ParentId=a7ce53b13d0a9f4ba060cbaae68d00d6&IncludeItemTypes=Audio&Limit=200', res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    let items = JSON.parse(data).Items;
    items.sort((a, b) => a.Name.localeCompare(b.Name));
    
    let yasserIds = '\nexport const YASSER_JELLYFIN_ITEM_IDS = {\n';
    items.forEach((item, index) => {
      yasserIds += '  ' + (index + 1) + ': "' + item.Id + '", // ' + item.Name + '\n';
    });
    yasserIds += '};\n';
    
    fs.appendFileSync('src/Outils/jellyfinIds.js', yasserIds);
    console.log("Appended YASSER_JELLYFIN_ITEM_IDS");
  });
});
