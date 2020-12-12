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
          table.string('yearly_averages');
          table.string('year');
          table.string('year_id');
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
      res.status(201).send();
});

dbHelper.initialiseTables;

module.exports = app;