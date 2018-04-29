const fs = require('fs');
const _ = require('lodash');
const request = require('request');

const data = fs.readFileSync('./literature/data.json');
const json = JSON.parse(data);
const ids = _.map(json.data.relatedLiteratures, 'id');

const getInfo = () => {
  if (ids.length > 0) {
    const id = ids.shift();
    const url = `https://api.pharmgkb.org/v1/site/literature/${id}?view=most`;
    request(url, (err, res, body) => {
      if (err) {
        return console.error('ERROR ->', err);
        process.exit(1);
      }
      fs.writeFileSync(`./annotations/most/${id}.json`, body);
      getInfo();
    });
  } else {
    process.exit(0);
  }
}

getInfo();
