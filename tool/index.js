const fs = require('fs');
const _ = require('lodash');

const data = fs.readFileSync(`./variants/data.json`);
const json = JSON.parse(data);

const getTitle = (title) => {
  return title.replace(',', '').replace(/{/g, '').replace(/}/g, '').replace(/"/g, '').replace('\\textquotesingles', '').replace('\\ast', '*').trim();
};

let tool = {
  name: 'tool',
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
              value: 0,
            });
            _.forEach(sigs, (ids, sig) => {
              if (sig === 'yes') {
                _.forEach(ids, (cases) => {
                  tool.children[geneLen - 1].children[varLen - 1].children[raceLen - 1].children[phenLen - 1].value += cases;
                });
              }
            });
            if (tool.children[geneLen - 1].children[varLen - 1].children[raceLen - 1].children[phenLen - 1].value === 0) {
              tool.children[geneLen - 1].children[varLen - 1].children[raceLen - 1].children.pop();
            }
          }
        });
        if (tool.children[geneLen - 1].children[varLen - 1].children[raceLen - 1].children.length === 0) {
          tool.children[geneLen - 1].children[varLen - 1].children.pop();
        }
      });
      if (tool.children[geneLen - 1].children[varLen - 1].children.length === 0) {
        tool.children[geneLen - 1].children.pop();
      }
    });
  }
});

const tree = {};

_.forEach(tool.children, ({ name, children }) => {
  const gene = name;
  tree[gene] = {};
  _.forEach(children, ({ name, children }) => {
    const variant = name;
    tree[gene][variant] = {};
    _.forEach(children, ({ name, children }) => {
      const race = name;
      tree[gene][variant][race] = {};
      _.forEach(children, ({ name, value }) => {
        const phen = name;
        tree[gene][variant][race][phen] = value; 
      });
    });
  });
});

fs.writeFileSync(`./tool/tool.json`, JSON.stringify(tool));
fs.writeFileSync(`./tool/tree.json`, JSON.stringify(tree));
