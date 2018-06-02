const fs = require('fs');
const _ = require('lodash');

const data = fs.readFileSync(`./variants/data.json`);
const json = JSON.parse(data);

const getTitle = (title) => {
  return title.replace(',', '').replace(/{/g, '').replace(/}/g, '').replace(/"/g, '').replace('\\textquotesingles', '').replace('\\ast', '*').trim();
};

let tool = {
  name: 'Tool',
  children: [],
};

_.forEach(json, (variants, gene) => {
  if (gene === 'TPMT') {
    const geneLen = tool.children.push({
      name: gene,
      children: [],
    });
    _.forEach(variants, (races, variant) => {
      const varLen = tool.children[geneLen - 1].children.push({
        name: variant,
        children: [],
      });
      _.forEach(races, (phens, race) => {
        const raceLen = tool.children[geneLen - 1].children[varLen - 1].children.push({
          name: race,
          children: [],
        });
        _.forEach(phens, (sigs, phen) => {
          if (phen === 'efficacy' || phen === 'toxicity') {
            const phenLen = tool.children[geneLen - 1].children[varLen - 1].children[raceLen - 1].children.push({
              name: phen,
              children: [],
            });
            _.forEach(sigs, (ids, sig) => {
              if (sig === 'yes') {
                const sigLen = tool.children[geneLen - 1].children[varLen - 1].children[raceLen - 1].children[phenLen - 1].children.push({
                  name: sig,
                  value: 0,
                });
                _.forEach(ids, (cases) => {
                  tool.children[geneLen - 1].children[varLen - 1].children[raceLen - 1].children[phenLen - 1].children[sigLen - 1].value += cases;
                });
              }
            });
          }
        });
      });
    });
  }
});

fs.writeFileSync(`./tool/tool.json`, JSON.stringify(tool));
