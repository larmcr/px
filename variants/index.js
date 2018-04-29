const fs = require('fs');
const _ = require('lodash');

const data = fs.readFileSync(`./filters/data.json`);
const json = JSON.parse(data);

const keys = {
  TPMT: json.TPMT,
  NUDT15: json.NUDT15
}

let tree = {};

_.forEach(keys, (ids, key) => {
  tree[key] = {};
  ids.forEach((id) => {
    const info = fs.readFileSync(`./annotations/min/${id}.json`);
    const json = JSON.parse(info);
    const annotations = json.variantAnnotations;
    if (annotations) {
      annotations.forEach((annotation) => {
        const listAZA = _.filter(annotation.chemicals, (chem) => chem.text === 'azathioprine');
        const listGene = _.filter(annotation.genes, (gene) => gene.text === key);
        const cases = annotation.cases;
        if(listAZA.length > 0 && listGene.length > 0 && cases > 0) {
          const race = annotation.race;
          const sig = annotation.significance;
          annotation.variants.forEach((variant) => {
            const text = variant.text;
            if (!tree[key][text]) tree[key][text] = {};
            if (!tree[key][text][race]) tree[key][text][race] = {};
            annotation.phenotypeCategories.forEach((phen) => {
              if (!tree[key][text][race][phen]) tree[key][text][race][phen] = {};
              if (!tree[key][text][race][phen][sig]) tree[key][text][race][phen][sig] = {};
              tree[key][text][race][phen][sig][id] = cases;
            });
          });
        }
      });
    }
  });
});

fs.writeFileSync(`./variants/data.json`, JSON.stringify(tree));
