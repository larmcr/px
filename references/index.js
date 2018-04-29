const fs = require('fs');
const _ = require('lodash');
const request = require('request');

let files = {};

fs.readdirSync('./resources').forEach((file) => {
  if(file.includes('json')) {
    const data = fs.readFileSync(`./resources/${file}`);
    const json = JSON.parse(data);
    const refs = json.xrefs;
    const dois = _.filter(refs, (ref) => ref['@id'].includes('doi') || ref.sameAs.includes('doi'));
    if(dois.length > 0) {
      files[file.replace('.json', '')] = dois[0].xrefId;
    }
  }
});

const items = _.toPairs(files);

const getInfo = () => {
  if (items.length > 0) {
    const item = items.shift();
    const id = item[0];
    const doi = item[1];
    const url = `https://www.doi2bib.org/doi2bib?id=${doi}`;
    request(url, (err, res, body) => {
      if (err) {
        return console.error('ERROR ->', err);
        process.exit(1);
      }
      fs.writeFileSync(`./references/${id}.bib`, body);
      getInfo();
    });
  } else {
    process.exit(0);
  }
}

getInfo();
