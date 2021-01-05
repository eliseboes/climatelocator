const supertest = require('supertest');
const Helpers = require('../../utils/helpers.js')
const app = require('.././../server.js')
const request = supertest(app);
//let locations, connecteren met db + select + haal alle uuids op from locations *, random op uuids
const pg = require('knex')({
    client: 'pg',
    version: '9.6',
    searchPath: ['knex', 'public'],
    connection: process.env.PG_CONNECTION_STRING ? process.env.PG_CONNECTION_STRING : 'postgres://example:example@localhost:5432/climatelocator'
});

describe('GET / endpoint', () => {
    test('check if / responds to 200', async (done) => {
        try {
            await request.get('/')
                .expect(200)
                .then((res) => {
                    done()
                });
        } catch (e) {
            if (e) console.log(e);
        }
    });
});

describe('POST /locations endpoint', () => {
    test('if /locations responds to 201 and inserts a location into the database', async (done) => {
        const disasterName = 'Hurricane Eta';
        const location = {
            uuid: Helpers.generateUUID(),
            name: 'Florida',
            geohash: 'dhvz72pzpyz',
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
        pg.select('*')
            .from('disasters')
            .then(async (result) => {
                let disasters = result;
                disasters.forEach(disaster => {
                    if (disasterName == disaster.name) {
                        location.disaster_id = disaster.uuid;
                    }
                });
                try {
                    await request.post('/locations')
                        .send(location)
                        .expect(201)
                        .then((res) => {
                            done()
                        });
                } catch (e) {
                    if (e) console.log(e);
                }
            });
    });
});

describe('DELETE /locations endpoint', () => {
    test('if /remove locations responds to 200 and deletes a location from the database', async (done) => {
        try {
            await request.delete('/locations/b36b0132-4c49-11eb-b596-0fdd0e82187f')
                .expect(200)
                .then((res) => {
                    done()
                });
        } catch (e) {
            if (e) console.log(e);
        }
    });
});

describe('PUT /locations endpoint', () => {
    test('if put /locations responds to 200 and updates a location from the database', async (done) => {
        const data = {
            uuid: '75b5d0c0-4c4b-11eb-8f01-43d1e1dd6c98',
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
        }
        try {
            await request.put('/locations')
                .send(data)
                .expect(200)
                .then((res) => {
                    done()
                });
        } catch (e) {
            if (e) console.log(e);
        }
    });
});

describe('GET /locations endpoint', () => {
    test('if /locations responds to 200 and returns a location from the database', async (done) => {
        try {
            await request.get('/locations/75b5d0c0-4c4b-11eb-8f01-43d1e1dd6c98')
                .expect(200)
                .then((res) => {
                    done()
                });
        } catch (e) {
            if (e) console.log(e);
        }
    });
});