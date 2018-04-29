const fs = require('fs');
const _ = require('lodash');
const request = require('request');

let dois = {};
let pubs = {};

files = fs.readdirSync('./resources');

files.forEach((file) => {
  if(file.includes('json')) {
    const data = fs.readFileSync(`./resources/${file}`);
    const json = JSON.parse(data);
    const refs = json.xrefs;
    const doi = _.filter(refs, (ref) => ref['@id'].includes('doi') || ref.sameAs.includes('doi'));
    const pub = _.filter(refs, (ref) => ref['resource'] === 'PubMed');
    let ref = '';
    if(doi.length > 0) {
      dois[file.replace('.json', '')] = doi[0].xrefId;
    } else if (pub.length > 0) {
      pubs[file.replace('.json', '')] = pub[0].xrefId;
    }
  }
});

dois = _.toPairs(dois);
pubs = _.toPairs(pubs);

// console.info(pubs);

// const getInfo = () => {
//   if (items.length > 0) {
//     const item = items.shift();
//     const id = item[0];
//     const doi = item[1];
//     const url = `https://www.doi2bib.org/doi2bib?id=${doi}`;
//     request(url, (err, res, body) => {
//       if (err) {
//         return console.error('ERROR ->', err);
//         process.exit(1);
//       }
//       fs.writeFileSync(`./references/${id}.bib`, body);
//       getInfo();
//     });
//   } else {
//     process.exit(0);
//   }
// }

// getInfo();

const getInfo = () => {
  if (pubs.length > 0) {
    const item = pubs.shift();
    const id = item[0];
    const pub = item[1];
    const url = `https://www.bioinformatics.org/texmed/cgi-bin/list.cgi?PMID=${pub}`;
    // console.info(url);
    request(url, (err, res, body) => {
      if (err) {
        return console.error('ERROR ->', err);
        process.exit(1);
      }
      const from = body.indexOf('@');
      const to = body.indexOf('</PRE>');
      const ref = body.slice(from, to);
      fs.writeFileSync(`./references/${id}.bib`, ref.trim());
      getInfo();
    });
  } else {
    process.exit(0);
  }
}

getInfo();

// const bibs = fs.readdirSync('./references');

// console.info(files.length - 1);
// console.info(_.keys(dois).length);
// console.info(_.keys(pubs).length);
// console.info((_.keys(dois).length + _.keys(pubs).length), bibs.length);
// console.info(diff.length);
