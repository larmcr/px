const fs = require('fs');
const _ = require('lodash');

const data = fs.readFileSync(`./variants/data.json`);
const json = JSON.parse(data);

const getTitle = (title) => {
  return title.replace(',', '').replace(/{/g, '').replace(/}/g, '').replace(/"/g, '').replace('\\textquotesingles', '').replace('\\ast', '*').trim();
};

let tree = {
  name: 'Literature',
  children: [],
};

_.forEach(json, (variants, gene) => {
  tree.children.push({
    name: gene,
    children: _.map(variants, (races, variant) => ({
      name: variant,
      children: _.map(races, (phens, race) => ({
        name: race,
        children: _.map(phens, (sigs, phen) => ({
          name: phen,
          children: _.map(sigs, (ids, sig) => ({
            name: sig,
            children: _.map(ids, (cases, id) => {
              const bib = fs.readFileSync(`./references/${id}.bib`, 'utf-8');
              return {
                name: id,
                value: cases,
                title: getTitle(/title.*=(.+)/i.exec(bib)[1]),
              };
            }),
          })),
        })),
      })),
    })),
  });
});

// console.info(JSON.stringify(tree));
fs.writeFileSync(`./tree/tree.json`, JSON.stringify(tree));
