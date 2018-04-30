const fs = require('fs');
const _ = require('lodash');

const data = fs.readFileSync(`./variants/data.json`);
const tree = JSON.parse(data);

let bibs = [];

let str = `\\begin{center}
\\begin{longtable}[H]{|l|l|l|l||l||l|}
\\hline
\\textbf{Genes}
& \\textbf{Variantes}
& \\textbf{Razas}
& \\textbf{Fenotipos}
& \\textbf{Significancias}
& \\textbf{Referencias [casos]} \\\\
\\hline
\\endhead
\\hline\\hline\n`;

_.forEach(tree, (variants, gene) => {
  let row = `${gene} `;
  let x = 6;
  _.forEach(variants, (races, variant) => {
    str += '\\cline{2-6}\n';
    row += `& ${variant} `;
    let firstVariant = true;
    _.forEach(races, (phens, race) => {
      if (firstVariant) {
        firstVariant = false;
        row += '& ';
      } else {
        str += '\\cline{3-6}\n';
        row += '& & ';
      }
      row += `${race} `;
      let firstRace = true;
      _.forEach(phens, (sigs, phen) => {
        if (firstRace) {
          firstRace = false;
          row += '& ';
        } else {
          str += '\\cline{4-6}\n';
          row += '& & & ';
        }
        row += `${phen} `;
        let firstPhen = true;
        _.forEach(sigs, (ids, sig) => {
          if (firstPhen) {
            firstPhen = false;
            row += '& ';
          } else {
            str += '\\cline{5-6}\n';
            row += '& & & & ';
          }
          row += `${sig} `;
          let firstSig = true;
          _.forEach(ids, (cases, id) => {
            bibs.push(id);
            const bib = fs.readFileSync(`./references/${id}.bib`, 'utf-8');
            const ref = /@.+{(.+),/.exec(bib)[1];
            if (firstSig) {
              firstSig = false;
              row += '& ';
            } else {
              str += '\\cline{6-6}\n';
              row += '& & & & & ';
            }
            row += `\\citeauthor{${ref}} \\citeyear{${ref}} [${cases}] \\\\\n`;
            str += row;
            row = '';
          });
        });
      });
    });
  });
  str += '\\hline\\hline\n';
});

str += `\\end{longtable}
\\end{center}\n`;

fs.writeFileSync(`./tables/tex.tex`, str);
