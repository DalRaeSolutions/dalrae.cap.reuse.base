const fs = require('fs').promises;
const path = require('path');
const cds = require('@sap/cds')
const app = require('express')()

const logLevel = 'none' //'info'

let files;

const readCSV = async () => {
  if(!files) {
    const dPath = path.normalize(__dirname + '/../db/data');
    const csv = await (await fs.readdir(dPath)).filter(f => /.csv$/.test(f));
    const content = await Promise.all(csv.map(async c => fs.readFile(path.normalize(`${dPath}/${c}`), 'utf-8')));
  
    files = csv.map((c, i) => {
      return {
        table: c.replace('.csv', '').replace('-', '.'),
        columns: content[i].split('\n')[0].split(';'),
        rows: content[i].split('\n').slice(1).filter(l => !!l).map(l => l.split(';'))
      }
    });
  }

  return files;
}

module.exports.readCSV = readCSV;

module.exports.setup = async () => {
  if(!global.app) {
    await cds.connect({ kind: 'sqlite', database: ':memory:' })
    const csn = await cds.load('srv')
    await cds.deploy(csn)
    await cds.serve('all', { logLevel }).in(app)

    global.app = app;
  }

  await readCSV()
}