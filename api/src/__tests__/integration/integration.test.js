const supertest = require('supertest');
const Helpers = require('../../utils/helpers.js')
const app = require('.././../server.js')
const request = supertest(app);
const pg = require('knex')({
    client: 'pg',
    version: '9.6',
    searchPath: ['knex', 'public'],
    connection: process.env.PG_CONNECTION_STRING ? process.env.PG_CONNECTION_STRING : 'postgres://example:example@localhost:5432/climatelocator'
});
const uuid = Helpers.generateUUID();

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
            uuid: uuid,
            name: 'Jamaica',
            geohash: 'd71w2zvdd',
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
     test('if /locations responds to 404 if location exsists and does not insert a location into the database', async (done) => {
        const disasterName = 'Hurricane Eta';
        const location = {
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
                        .expect(404)
                        .then((res) => {
                            done()
                        });
                } catch (e) {
                    if (e) console.log(e);
                }
            });
    });
});

describe('PUT /locations endpoint', () => {
    test('if put /locations responds to 200 and updates a location from the database', async (done) => {
        const data = {
            uuid: uuid,
            yearly_averages_low: {
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
     test('if GET /locations responds to 200 and returns a location from the database', async (done) => {
        try {
            await request.get(`/locations/${uuid}`)
                .expect(200)
                .then((res) => {
                    console.log(res.body);
                    expect(res.body).not.toBeNull();
                    expect(res.body.res[0]['id']).toBeDefined();
                    expect(res.body.res[0]['uuid']).toBeDefined();
                    expect(res.body.res[0]['name']).toBeDefined();
                    expect(res.body.res[0]['yearly_averages_high']).toBeDefined();
                    expect(res.body.res[0]['yearly_averages_low']).toBeDefined();
                    expect(res.body.res[0]['disaster_id']).toBeDefined();
                    expect(res.body.res[0]['geohash']).toBeDefined();
                    expect(res.body.res[0]['created_at']).toBeDefined();
                    expect(res.body.res[0]['updated_at']).toBeDefined();
                    done()
                });
        } catch (e) {
            if (e) console.log(e);
        }
    });
    test('if GET /locations responds to 404 when passing the wrong ID and does not return a location', async (done) => {
        try {
            await request.get(`/locations/${uuid}5`)
                .expect(404)
                .then((res) => {
                    console.log(res.body);
                    expect(res.body).toStrictEqual({});
                    done()
                });
        } catch (e) {
            if (e) console.log(e);
        }
    });
});

describe('DELETE /locations endpoint', () => {
    test('if /remove locations responds to 200 and deletes a location from the database', async (done) => {
        try {
            await request.delete(`/locations/${uuid}`)
                .expect(200)
                .then((res) => {
                    done()
                });
        } catch (e) {
            if (e) console.log(e);
        }
    });
});