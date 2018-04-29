const fs = require('fs');
const _ = require('lodash');

let aza = [];
let both = [];
let tpmt = [];
let nudt = [];

const files = fs.readdirSync('./annotations/min');

files.forEach((file) => {
  if(file.includes('json')) {
    const data = fs.readFileSync(`./annotations/min/${file}`);
    const json = JSON.parse(data);
    const chems = json.related.CHEMICAL;
    const listAZA = _.filter(chems, (chem) => chem.name === 'azathioprine');
    if (listAZA.length > 0) {
      const id = parseInt(file.replace('.json', ''));
      aza.push(id);
      const genes = json.related.GENE;
      const lenTPMTs = _.filter(genes, (gene) => gene.symbol === 'TPMT').length;
      const lenNUDTs = _.filter(genes, (gene) => gene.symbol === 'NUDT15').length;
      if (lenTPMTs > 0 && lenNUDTs > 0) both.push(id);
      if (lenTPMTs > 0) tpmt.push(id);
      if (lenNUDTs > 0) nudt.push(id);
    }
  }
});

const data = {
  azathioprine: aza,
  both: both,
  TPMT: tpmt,
  NUDT15: nudt
};

fs.writeFileSync(`./filters/data.json`, JSON.stringify(data));
