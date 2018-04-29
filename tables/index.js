const fs = require('fs');
const _ = require('lodash');

const data = fs.readFileSync(`./variants/data.json`);
const tree = JSON.parse(data);

let refStr = '';

_.forEach(tree, (variants, gene) => {
  _.forEach(variants, (races, variant) => {
    _.forEach(races, (phens, race) => {
      _.forEach(phens, (sigs, phen) => {
        _.forEach(sigs, (ids, sig) => {
          _.forEach(ids, (cases, id) => {
            const bib = fs.readFileSync(`./references/${id}.bib`, 'utf-8');
            refStr += bib + '\n';
            const ref = /@.+{(.+),/.exec(bib)[1];
            console.info(ref, `[${cases}]`);
          });
        });
      });
    });
  });
});

fs.writeFileSync(`./tables/bib.bib`, refStr);
