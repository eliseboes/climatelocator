const express = require('express')
const bodyParser = require('body-parser');
const http = require('http');
const Helpers = require('./utils/helpers.js');
const {
  generateUUID,
  checkDataComplete
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
          table.string('missing');
          table.string('damage');
          table.string('location_id')
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
              missing: 8,
              damage: 360000000
            }, {
              uuid: Helpers.generateUUID(),
              name: '2019 European Heat Wave',
              type: 'heat wave',
              fatalities: 869,
              missing: 10,
              damage: 3560000000
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
              }
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
              }
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
              }
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

/**  add location to db
 * @param req.body - location that gets inserted into db
 * @returns inserted location when OK, empty object when error
 */
app.post('/locations', async (req, res) => {
  const data = req.body[0];
  if (Helpers.checkGeohashFormat(data.geohash) == data.geohash && Helpers.checkGeohashLength(data.geohash) == data.geohash) {
    const result = pg('locations')
      .select()
      .where('name', data.name)
      .then(function (rows) {
        if (rows.length === 0 && Helpers.checkDataComplete(data)) {
          pg('locations')
            .insert(data)
            .returning('*')
            .then(function (result) {
              res.status(201)
              res.json(result)
                .send();
            })
            .then(result => {})
        } else {
          res.status(404).send();
        }
      });
  }
});

/**  delete location from db
 * @param req.params.uuid  - uuid of location that gets deleted
 * @returns deleted location when OK, empty object when error
 */
app.delete('/locations/:uuid', async (req, res) => {
  const uuid = req.params.uuid
  pg('locations')
    .del()
    .where({
      uuid: uuid
    })
    .returning('*')
    .then(function (result) {
      res.json(result)
      res.status(200).send();
    }).catch((e) => {
      console.log(e);
      res.status(404).send();
    });
});

/**  update location
 * @param req.body - location to be updated
 * @returns updated location when OK, empty object when error
 */
app.put('/locations', async (req, res) => {
  const uuid = req.body.uuid;
  const dataToUpdate = req.body;
  pg('locations')
    .where({
      uuid: uuid
    })
    .update(dataToUpdate)
    .returning('*')
    .then(function (result) {
      res.status(200)
      res.json(result)
        .send();
    }).catch((e) => {
      console.log(e);
      res.status(404).send();
    });
});

/**  get location by uuid
 * @param req.params.uuid - uuid of location that has to be found
 * @returns location when OK, empty object when error
 */
app.get('/locations/:uuid', async (req, res) => {
  pg('locations')
    .select('*')
    .where({
      uuid: req.params.uuid
    })
    .then(result => {
      res.json(result)
      res.status(200).send();
    }).catch((e) => {
      console.log(e);
      res.status(404).send();
    });
});

/** add disaster
 * @param  req.body - disaster that gets inserted into db
 * @returns inserted disaster when OK, empty object when error
 */
app.post('/disasters', async (req, res) => {
  const data = req.body[0];
  const location = req.body[1].location;
  const result = pg('disasters')
    .select()
    .where('name', data.name)
    .then(function (rows) {
      if (rows.length === 0 && Helpers.checkDataComplete(data)) {
        pg('locations')
          .select('*')
          .where({
            name: location
          })
          .then(result => {
            data.location_id = result[0].uuid;
            pg('disasters')
              .insert(data)
              .returning('*')
              .then(function (result) {
                res.status(201)
                res.json(result)
                  .send();
              })
          })
      } else {
        res.status(404).send();
      }
    });
});

/** get disaster by uuid
 * @param req.params.uuid - uuid of disaster that has to be found
 * @returns disaster when OK, empty object when error
 */
app.get('/disasters/:uuid', async (req, res) => {
  pg('disasters')
    .select('*')
    .where({
      uuid: req.params.uuid
    })
    .then(result => {
      res.json(result)
      res.status(200).send();
    }).catch((e) => {
      console.log(e);
      res.status(404).send();
    });
});

/**  update disaster by uuid
 * @param req.body - data to be updated  
 * @returns updated disaster when OK, empty object when error
 */
app.put('/disasters', async (req, res) => {
  const uuid = req.body.uuid;
  const dataToUpdate = req.body;
  pg('disasters')
    .where({
      uuid: uuid
    })
    .update(dataToUpdate)
    .returning('*')
    .then(function (result) {
      res.json(result)
      res.status(200).send();
    }).catch((e) => {
      console.log(e);
      res.status(404).send();
    });
});

/**  delete disaster by uuid
 * @params req.params.uuid - uuid of disaster that gets deleted 
 * @returns deleted disaster when ok, empty object when error
 */
app.delete('/disasters/:uuid', async (req, res) => {
  const uuid = req.params.uuid;
  pg('disasters')
    .where({
      uuid: uuid
    })
    .returning('*')
    .del()
    .then(function (result) {
      res.json(result)
      res.status(200).send();
    }).catch((e) => {
      console.log(e);
      res.status(404).send();
    });
});
/**
 * @param
 * @returns data of tables in relation, in object form
 */
app.get('/join', async (req, res) => {
  await pg.table('disasters')
    .join('locations', pg.raw('disasters.location_id::varchar'), pg.raw('locations.uuid::varchar'))
    .select('locations.*', 'disasters.*')
    .then((data) => {
      res.status(200)
      res.send(data)
    })
})

module.exports = app;