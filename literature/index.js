const request = require('request');
const fs = require('fs');

const URL = 'https://api.pharmgkb.org/v1/site/page/publications/PA448515?view=list';

request(URL, (err, res, body) => {
  if (err) {
    return console.error('ERROR ->', err);
    process.exit(1);
  }
  fs.writeFileSync('./literature/data.json', body);
  process.exit(0);
});
