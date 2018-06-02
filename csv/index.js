const fs = require('fs');
const Papa = require('papaparse');

const GENE = 'TPMT';

const tree = {};

let WILD = [];

const processWild = (wild) => {
  const id = wild.shift();
  const func = wild.shift().split(' ')[0].trim();
  WILD = wild;
  tree[wild.join('')] = {
    allele: `${GENE}${id}`,
    function: func,
  };
};

const complete = ({ data, error }) => {
  const header = data.shift();
  const wild = data.shift();
  processWild(wild);
  data.forEach((row) => {
    const id = row.shift();
    const func = row.shift().split(' ')[0].trim();
    let key = '';
    row.forEach((val, ind) => {
      key += val || WILD[ind];
    });
    tree[key] = {
      allele: `${GENE}${id}`,
      function: func,
    };
  });
  fs.writeFileSync('./csv/map.json', JSON.stringify(tree));
};

const error = (err, file, inputElem, reason) => {
  console.error('ERROR ->', err, '->', file, '->', inputElem, '->', reason);
};

Papa.parse(fs.readFileSync('./csv/tpmt.csv', 'utf8'), {
  // header: true,
  skipEmptyLines: true,
  complete: complete,
  error: error,
});
