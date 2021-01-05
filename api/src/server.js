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
  await pg.schema.hasTable('disasters').then(async (exists) => {
    if (!exists) {
      await pg.schema
        .createTable('disasters', (table) => {
          table.increments();
          table.uuid('uuid');
          table.string('name');
          table.string('type');
          table.string('fatalities');
          table.string('injuries');
          table.string('missing');
          table.string('damage');
          table.timestamps(true, true);
        })
        .then(async () => {
          let disasters = [{
              uuid: Helpers.generateUUID(),
              name: 'Hurricane Eta',
              type: 'hurricane',
              fatalities: 211,
              missing: 120,
              damage: 7900000000
            },
            {
              uuid: Helpers.generateUUID(),
              name: '2020 East Africa Floods',
              type: 'flood',
              fatalities: 453,
              missing: 8
            }, {
              uuid: Helpers.generateUUID(),
              name: '2019 European Heat Wave',
              type: 'heat wave',
              fatalities: 869
            },
            {
              uuid: Helpers.generateUUID(),
              name: 'Typhoon Hagibis',
              type: 'hurricane',
              fatalities: 98,
              missing: 7,
              damage: 15000000000
            }
          ]
          console.log('created table disasters');
          for (let i = 0; i < disasters.length; i++) {
            await pg.table('disasters').insert(disasters[i]);
          }
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
          table.string('disaster_id');
          table.timestamps(true, true);
        })
        .then(async () => {
          console.log('created table locations');
          let locations = [{
              uuid: Helpers.generateUUID(),
              name: 'Kenya',
              geohash: 'sb4cn8hn24buk',
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
              disaster_id: 'a34a0ac0-4dda-11eb-b21e-6504195ef07a'
            },
            {
              uuid: Helpers.generateUUID(),
              name: 'Paris',
              geohash: 'u09tvmqrep',
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
              disaster_id: 'a34a0ac1-4dda-11eb-b21e-6504195ef07a'
            }, {
              uuid: Helpers.generateUUID(),
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
              disaster_id: 'a34a0ac1-4dda-11eb-b21e-6504195ef07a'
            }
          ]
          for (let i = 0; i < locations.length; i++) {
            await pg.table('locations').insert(locations[i]);
          }
        });
    }
  });
}
initialiseTables();

/**  add location
 * @params req.body 
 * @returns status 201 and inserted location when OK, status 404 when not OK
 */
app.post('/location', async (req, res) => {
  const data = req.body;
  if (Helpers.checkGeohashFormat(data.geohash) == data.geohash && Helpers.checkGeohashLength(data.geohash) == data.geohash) {
    pg('locations').insert(data)
      .then(function (result) {
        res.status(201).send();
        res.json({
          res:result
        })
        app.get()
      }).catch((e) => {
        console.log(e);
        res.status(404).send();
      });
  }
});

/**  delete location
 * @params uuid  
 * @returns status 200 when OK, status 404 when not OK
 */
app.delete('/location/:uuid', async (req, res) => {
  const uuid = req.params.uuid
  pg('locations')
    .del()
    .where({
      uuid: uuid
    })
    .then(function (result) {
      res.status(200).send();
      res.json({
        res: result
      })
    }).catch((e) => {
      console.log(e);
      res.status(404).send();
    });
});

/**  update location
 * @params req.body.uuid
 * @returns status 200 and updated location when OK, status 404 when not OK
 */
app.put('/location', async (req, res) => {
  const uuid = req.body.uuid;
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
      res.json({
        res: result
      })
    }).catch((e) => {
      console.log(e);
      res.status(404).send();
    });
});

/**  get location by uuid
 * @params uuid 
 * @returns status 200 and location when OK, status 404 when not OK
 */
app.get('/location/:uuid', async (req, res) => {
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

/**  get disaster by type
 * @params type
 * @returns status 200 and disasters of selected type when OK, status 404 when not OK
 */
app.get('/disaster/:type', async (req, res) => {
  pg('disasters')
    .where({
      type: req.params.type
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

/**  get all disasters
 * @params 
 * @returns status 200 and all disasters when OK, status 404 when not OK
 */
app.get('/alldisasters', async (req, res) => {
  pg.select('*')
    .from('disasters')
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

/**  update disaster by uuid
 * @params uuid  
 * @returns status 200 and updated disaster when OK, status 404 when not OK
 */
app.put('/disaster/:uuid', async (req, res) => {
  const uuid = req.params.uuid;
  pg('disasters')
    .where({
      uuid: uuid
    })
    .update({
      type: 'wildfire'
    })
    .then(function (result) {
      res.json({
        res: result
      })
      res.status(200).send();
    }).catch((e) => {
      console.log(e);
      res.status(404).send();
    });
});

/**  delete disaster by uuid
 * @params uuid  
 * @returns status 200 when OK, status 404 when not OK
 */
app.delete('/disaster/:uuid', async (req, res) => {
  const uuid = req.params.uuid;
  pg('disasters')
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

/** add disaster
 * @params uuid  
 * @returns status 200 and inserted disaster when OK, status 404 when not OK
 */
app.post('/disaster', async (req, res) => {
  const data = req.body;
  pg('disasters').insert(data)
    .then(function (result) {
      res.status(201).send();
      res.json({
        res: result
      })
      app.get()
    }).catch((e) => {
      console.log(e);
      res.status(404).send();
    });
});


module.exports = app;