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
                    const insertedLocation = await request.post('/locations').send(location)
                    expect(insertedLocation.status).toBe(201)
                    expect(insertedLocation.body).toHaveLength(1)
                    expect(insertedLocation.body[0].geohash).toStrictEqual('d71w2zvdd')
                    expect(insertedLocation.body[0].name).toStrictEqual('Jamaica')
                    done()
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
                    const insertedLocation = await request.post('/locations').send(location)
                    expect(insertedLocation.status).toBe(404)
                    expect(insertedLocation.body).toStrictEqual({});
                    done()
                } catch (e) {
                    if (e) console.log(e);
                }
            });
    });
});

describe('PUT /locations endpoint', () => {
    test('if PUT /locations responds to 404 and does not return a location from the database when passing the wrong uuid', async (done) => {
        const dataToUpdate = {
            uuid: `${uuid}5`,
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
            const updatedLocation = await request.put('/locations').send(dataToUpdate)
            expect(updatedLocation.status).toBe(404)
            expect(updatedLocation.body).toStrictEqual({})
            done()
        } catch (e) {
            if (e) console.log(e);
        }
    });
    test('if put /locations responds to 200 and updates a location from the database', async (done) => {
        const dataToUpdate = {
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
            const updatedLocation = await request.put('/locations').send(dataToUpdate)
            expect(updatedLocation.status).toBe(200)
            expect(updatedLocation.body).toHaveLength(1)
            expect(updatedLocation.body[0].name).toStrictEqual('Jamaica')
            expect(updatedLocation.body[0].geohash).toStrictEqual('d71w2zvdd')
            done()
        } catch (e) {
            if (e) console.log(e);
        }
    });
});

describe('GET /locations endpoint', () => {
    test('if GET /locations responds to 200 and returns a location from the database', async (done) => {
        try {
            const receivedLocation = await request.get(`/locations/${uuid}`)
            expect(receivedLocation.status).toBe(200)
            expect(receivedLocation.body).not.toBeNull();
            expect(receivedLocation.body[0]['id']).toBeDefined();
            expect(receivedLocation.body[0]['uuid']).toBeDefined();
            expect(receivedLocation.body[0]['name']).toBeDefined();
            expect(receivedLocation.body[0]['yearly_averages_high']).toBeDefined();
            expect(receivedLocation.body[0]['yearly_averages_low']).toBeDefined();
            expect(receivedLocation.body[0]['disaster_id']).toBeDefined();
            expect(receivedLocation.body[0]['geohash']).toBeDefined();
            expect(receivedLocation.body[0]['created_at']).toBeDefined();
            expect(receivedLocation.body[0]['updated_at']).toBeDefined();
            done()
        } catch (e) {
            if (e) console.log(e);
        }
    });
    test('if GET /locations responds to 404 when passing the wrong ID and does not return a location', async (done) => {
        try {
            const receivedLocation = await request.get(`/locations/${uuid}5`)
            expect(receivedLocation.status).toBe(404)
            expect(receivedLocation.body).toStrictEqual({});
            done()
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