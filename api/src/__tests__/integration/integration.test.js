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

describe('POST /disasters endpoint', () => {
    const disaster = [{
            uuid: uuid,
            name: 'Typhoon Hagibis',
            type: 'hurricane',
            fatalities: 98,
            missing: 7,
            damage: 15000000000
        },
        {
            location: 'Tokyo'
        }
    ]
    test('if POST /disasters responds to 201 and inserts a disaster into the database', async (done) => {
        try {
            const insertedDisaster = await request.post('/disasters').send(disaster)
            expect(insertedDisaster.status).toBe(201)
            expect(insertedDisaster.body).toHaveLength(1)
            expect(insertedDisaster.body[0].fatalities).toStrictEqual('98')
            expect(insertedDisaster.body[0].name).toStrictEqual('Typhoon Hagibis')
            done()
        } catch (e) {
            if (e) console.log(e);
        }
    });
    test('if POST /disasters responds to 404 if disaster exsists and does not insert into the database', async (done) => {
        try {
            const insertedDisaster = await request.post('/disasters').send(disaster)
            expect(insertedDisaster.status).toBe(404)
            expect(insertedDisaster.body).toStrictEqual({});
            done()
        } catch (e) {
            if (e) console.log(e);
        }
    });
});

describe('PUT /locations endpoint', () => {
    test('if PUT /disasters responds to 404 and does not return a disaster from the database when passing the wrong uuid', async (done) => {
        const dataToUpdate = {
            uuid: `${uuid}5`,
            fatalities: '452'
        }
        try {
            const updatedDisaster = await request.put('/disasters').send(dataToUpdate)
            expect(updatedDisaster.status).toBe(404)
            expect(updatedDisaster.body).toStrictEqual({})
            done()
        } catch (e) {
            if (e) console.log(e);
        }
    });
    test('if PUT /disasters responds to 200 and updates a disaster from the database', async (done) => {
        const dataToUpdate = {
            uuid: uuid,
            fatalities: '452'
        }
        try {
            const updatedDisaster = await request.put('/disasters').send(dataToUpdate)
            expect(updatedDisaster.status).toBe(200)
            expect(updatedDisaster.body).toHaveLength(1)
            expect(updatedDisaster.body[0].name).toStrictEqual('Typhoon Hagibis')
            expect(updatedDisaster.body[0].fatalities).toStrictEqual('452')
            done()
        } catch (e) {
            if (e) console.log(e);
        }
    });
});

// describe('GET /locations endpoint', () => {
//     test('if GET /locations responds to 200 and returns a location from the database', async (done) => {
//         try {
//             const receivedLocation = await request.get(`/locations/${uuid}`)
//             expect(receivedLocation.status).toBe(200)
//             expect(receivedLocation.body).not.toBeNull();
//             expect(receivedLocation.body[0]['id']).toBeDefined();
//             expect(receivedLocation.body[0]['uuid']).toBeDefined();
//             expect(receivedLocation.body[0]['name']).toBeDefined();
//             expect(receivedLocation.body[0]['yearly_averages_high']).toBeDefined();
//             expect(receivedLocation.body[0]['yearly_averages_low']).toBeDefined();
//             expect(receivedLocation.body[0]['geohash']).toBeDefined();
//             expect(receivedLocation.body[0]['created_at']).toBeDefined();
//             expect(receivedLocation.body[0]['updated_at']).toBeDefined();
//             done()
//         } catch (e) {
//             if (e) console.log(e);
//         }
//     });
//     test('if GET /locations responds to 404 when passing the wrong ID and does not return a location', async (done) => {
//         try {
//             const receivedLocation = await request.get(`/locations/${uuid}5`)
//             expect(receivedLocation.status).toBe(404)
//             expect(receivedLocation.body).toStrictEqual({});
//             done()
//         } catch (e) {
//             if (e) console.log(e);
//         }
//     });
// });

describe('GET /join endpoint', () => {
    test('if GET /join responds to 200 and returns a location and a disaster', async (done) => {
        try {
            const response = await request.get(`/join`)
            expect(response.status).toBe(200)
            expect(response.body[0]['fatalities']).toBeDefined();
            expect(response.body[0]['geohash']).toBeDefined();
            done()
        } catch (e) {
            if (e) console.log(e);
        }
    });
});

describe('DELETE /disasters endpoint', () => {
    test('if DELETE /disaster responds to 404 and does not return a disaster when passing wrong uuid', async (done) => {
        try {
            const deletedDisaster = await request.delete(`/disasters/${uuid}6`)
            expect(deletedDisaster.status).toBe(404)
            expect(deletedDisaster.body).toStrictEqual({})
            done()
        } catch (e) {
            if (e) console.log(e);
        }
    });
    test('if DELETE /disasters responds to 200 and deletes a disaster from the database', async (done) => {
        try {
            const deletedDisaster = await request.delete(`/disasters/${uuid}`)
            expect(deletedDisaster.status).toBe(200)
            expect(deletedDisaster.body).toHaveLength(1)
            expect(deletedDisaster.body[0].name).toStrictEqual('Typhoon Hagibis')
            expect(deletedDisaster.body[0].fatalities).toStrictEqual('452')
            done()
        } catch (e) {
            if (e) console.log(e);
        }
    });
});