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

// describe('PUT /locations endpoint', () => {
//     test('if PUT /locations responds to 404 and does not return a location from the database when passing the wrong uuid', async (done) => {
//         const dataToUpdate = {
//             uuid: `${uuid}5`,
//             yearly_averages_low: {
//                 Jan: 8.0,
//                 Feb: 10.0,
//                 Mar: 13.0,
//                 Apr: 17.0,
//                 May: 21.0,
//                 Jun: 25.5,
//                 Jul: 28.0,
//                 Aug: 29.0,
//                 Sep: 26.0,
//                 Oct: 20.0,
//                 Nov: 15.0,
//                 Dec: 11.0
//             }
//         }
//         try {
//             const updatedLocation = await request.put('/locations').send(dataToUpdate)
//             expect(updatedLocation.status).toBe(404)
//             expect(updatedLocation.body).toStrictEqual({})
//             done()
//         } catch (e) {
//             if (e) console.log(e);
//         }
//     });
//     test('if PUT /locations responds to 200 and updates a location from the database', async (done) => {
//         const dataToUpdate = {
//             uuid: uuid,
//             yearly_averages_low: {
//                 Jan: 8.0,
//                 Feb: 10.0,
//                 Mar: 13.0,
//                 Apr: 17.0,
//                 May: 21.0,
//                 Jun: 25.5,
//                 Jul: 28.0,
//                 Aug: 29.0,
//                 Sep: 26.0,
//                 Oct: 20.0,
//                 Nov: 15.0,
//                 Dec: 11.0
//             }
//         }
//         try {
//             const updatedLocation = await request.put('/locations').send(dataToUpdate)
//             expect(updatedLocation.status).toBe(200)
//             expect(updatedLocation.body).toHaveLength(1)
//             expect(updatedLocation.body[0].name).toStrictEqual('Jamaica')
//             expect(updatedLocation.body[0].geohash).toStrictEqual('d71w2zvdd')
//             done()
//         } catch (e) {
//             if (e) console.log(e);
//         }
//     });
// });

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

// describe('GET /join endpoint', () => {
//     test('if GET /join responds to 200 and returns a location and a disaster', async (done) => {
//         try {
//             const response = await request.get(`/join`)
//             expect(response.status).toBe(200)
//             expect(response.body[0]['fatalities']).toBeDefined();
//             expect(response.body[0]['geohash']).toBeDefined();
//             done()
//         } catch (e) {
//             if (e) console.log(e);
//         }
//     });
// });

// describe('DELETE /locations endpoint', () => {
//     test('if DELETE /locations responds to 404 and does not return a location when passing wrong uuid', async (done) => {
//         try {
//             const deletedLocation = await request.delete(`/locations/${uuid}6`)
//             expect(deletedLocation.status).toBe(404)
//             expect(deletedLocation.body).toStrictEqual({})
//             done()
//         } catch (e) {
//             if (e) console.log(e);
//         }
//     });
//     test('if DELETE /locations responds to 200 and deletes a location from the database', async (done) => {
//         try {
//             const deletedDisaster = await request.delete(`/disasterss/${uuid}`)
//             expect(deletedDisaster.status).toBe(200)
//             expect(deletedDisaster.body).toHaveLength(1)
//             expect(deletedDisaster.body[0].name).toStrictEqual('Jamaica')
//             expect(deletedDisaster.body[0].geohash).toStrictEqual('d71w2zvdd')
//             done()
//         } catch (e) {
//             if (e) console.log(e);
//         }
//     });
// });