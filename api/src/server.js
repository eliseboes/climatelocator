const express = require('express')
const bodyParser = require('body-parser');
const http = require('http');
const Helpers = require('./utils/helpers.js');
const {
  generateUUID
} = require('./utils/helpers.js');
const {
  doesNotMatch
} = require('assert');
const dbHelper = require('./utils/DatabaseHelper.js');

const port = 3000

const app = express();
http.Server(app);


app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

/*--------------------- INFO ----------------------*/

app.get('/', async (req, res) => {
  res.send(
    '<h2>Endpoints</h2>'
  );
});

/*---------------- ADD LOCATION ------------------*/

const pg = require('knex')({
  client: 'pg',
  version: '9.6',
  searchPath: ['knex', 'public'],
  connection: process.env.PG_CONNECTION_STRING ? process.env.PG_CONNECTION_STRING : 'postgres://example:example@localhost:5432/climatelocator'
});

async function initialiseTables() {
  await pg.schema.hasTable('year').then(async (exists) => {
    if (!exists) {
      await pg.schema
        .createTable('year', (table) => {
          table.increments();
          table.uuid('uuid');
          table.string('most_affected_country');
          table.string('hottest_temperature');
          table.string('hottest_month');
          table.string('temperature_above_average');
          table.string('num_disasters');
          table.timestamps(true, true);
        })
        .then(async () => {
          console.log('created table year');
        });

    }
  });
  await pg.schema.hasTable('locations').then(async (exists) => {
    if (!exists) {
      await pg.schema
        .createTable('locations', (table) => {
          table.increments();
          table.uuid('uuid');
          table.string('name');
          table.string('geohash');
          table.string('yearly_averages_low');
          table.string('yearly_averages_high');
          table.string('year');
          table.timestamps(true, true);
        })
        .then(async () => {
          console.log('created table locations');
        });
    }
  });
}
initialiseTables();

app.post('/addlocation', async (req, res) => {
  const uuid = Helpers.generateUUID();
  const data = {
    uuid: uuid,
    name: 'Tokyo',
    geohash: 'xn76cydhz',
    yearly_averages_low: {
      Jan: 2.0,
      Feb: 2.0,
      Mar: 5.0,
      Apr: 10.0,
      May: 14.0,
      Jun: 18.0,
      Jul: 21.8,
      Aug: 23.0,
      Sep: 20.0,
      Oct: 15.0,
      Nov: 9.0,
      Dec: 4.0
    },
    yearly_averages_high: {
      Jan: 8.0,
      Feb: 9.0,
      Mar: 12.0,
      Apr: 17.0,
      May: 21.0,
      Jun: 25.5,
      Jul: 28.0,
      Aug: 29.0,
      Sep: 26.0,
      Oct: 20.0,
      Nov: 15.0,
      Dec: 11.0
    },
    year: 2020
  }
  if (Helpers.checkGeohashFormat(data.geohash) == data.geohash && Helpers.checkGeohashLength(data.geohash) == data.geohash) {
    pg('locations').insert(data)
      .then(function (result) {
        res.status(201).send();
        app.get()
      }).catch((e) => {
        console.log(e);
        res.status(404).send();
      });
  }
});

app.post('/removelocation', async (req, res) => {
  const uuid = 'b2509760-3c6d-11eb-a0a4-a1cb35889479'
  pg('locations')
    .where({
      uuid: uuid
    })
    .del()
    .then(function (result) {
      res.status(200).send();
    }).catch((e) => {
      console.log(e);
      res.status(404).send();
    });
});

app.post('/updatelocation', async (req, res) => {
  const uuid = '55fb81a0-3c6d-11eb-a3e5-c1be23be73e1'
  pg('locations')
    .where({
      uuid: uuid
    })
    .update({
      yearly_averages_high: {
        Jan: 8.0,
        Feb: 10.0,
        Mar: 13.0,
        Apr: 17.0,
        May: 21.0,
        Jun: 25.5,
        Jul: 28.0,
        Aug: 29.0,
        Sep: 26.0,
        Oct: 20.0,
        Nov: 15.0,
        Dec: 11.0
      }
    })
    .then(function (result) {
      res.status(200).send();
    }).catch((e) => {
      console.log(e);
      res.status(404).send();
    });
});

app.get('/getlocation/:uuid', async (req, res) => {
  pg('locations')
    .where({
      uuid: req.params.uuid
    })
    .then(result => {
      res.json({
        res: result
      })
      res.status(200).send();
    }).catch((e) => {
      console.log(e);
      res.status(404).send();
    });
});

module.exports = app;