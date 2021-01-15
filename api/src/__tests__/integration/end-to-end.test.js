const supertest = require('supertest');
const app = require('../../server.js');
const request = supertest(app);
const Helpers = require('../../utils/helpers.js');
const pg = require('knex')({
    client: 'pg',
    version: '9.6',
    searchPath: ['knex', 'public'],
    connection: process.env.PG_CONNECTION_STRING ? process.env.PG_CONNECTION_STRING : 'postgres://example:example@localhost:5432/climatelocator'
});

describe('DB connection test', () => {
    let uuid = Helpers.generateUUID();
    const disaster = [{
        uuid: uuid,
        name: 'Typhoon Faxai',
        type: 'hurricane',
        fatalities: '123',
        missing: '52',
        damage: '500000'
    }, {
        location: 'Tokyo'
    }]

    test('if disaster is added to the database if does not exsists', async () => {
        try {
            const response = await request.post('/disasters').send(disaster)
            expect(response.status).toBe(201)
            expect(response.body[0]['id']).toBeDefined();
            expect(response.body[0]['uuid']).toBeDefined();
            expect(response.body[0]['name']).toBeDefined();
            expect(response.body[0]['fatalities']).toBeDefined();
            expect(response.body[0]['missing']).toBeDefined();
            expect(response.body[0]['damage']).toBeDefined();
            uuid = response.body[0].uuid;
        } catch (error) {
            throw error
        }
    })

    test('if location is not added to the database if already exsists', async () => {
        try {
            const response = await request.post('/disasters').send(disaster)
            expect(response.status).toBe(404)
            expect(response.body).toStrictEqual({})
        } catch (error) {
            throw error
        }
    })

    test('if get request succeeds', async (done) => {
        try {
            const response = await request.get(`/disasters/${uuid}`)
            console.log(response.body)
            expect(response.status).toBe(200)
            expect(response.body).not.toBeNull();
            expect(response.body[0]['uuid']).toBeDefined();
            expect(response.body[0]['name']).toStrictEqual('Typhoon Faxai');
            expect(response.body[0]['fatalities']).toStrictEqual('123');
            expect(response.body[0]['missing']).toStrictEqual('52');
            done()
        } catch (e) {
            if (e) console.log(e);
        }
    });

    // test('if put request succeeds', async (done) => {
    //     const response = await request.put(`/locations`).send({
    //         uuid: uuid,
    //         name: 'California'
    //     })
    //     expect(response.status).toBe(200)
    //     expect(response.body[0]).toHaveProperty('geohash')
    //     expect(response.body[0]).toHaveProperty('name', 'California')
    //     done();
    // })

    // test('if get request of join succeeds', async (done) => {
    //     const response = await request.get(`/join`)
    //     expect(response.status).toBe(200)
    //     expect(response.body[0]['fatalities']).toBeDefined();
    //     expect(response.body[0]['geohash']).toBeDefined();
    //     done();
    // })

    // test('if location_id is added to disaster after join', async (done) => {
    //     const response = await pg.select('*').table('disasters').where({location_id: uuid})
    //     expect(response.length).toBeGreaterThan(0);
    //     done()
    // })

    // test('if location is removed from database when passing correct uuid', async () => {
    //     try {
    //         const deletedLocation = await request.delete(`/locations/${uuid}`)
    //         expect(deletedLocation.status).toBe(200)
    //         expect(deletedLocation.body).toHaveLength(1)
    //         expect(deletedLocation.body[0].name).toStrictEqual('California')
    //         expect(deletedLocation.body[0].geohash).toStrictEqual('c9gs1gzb4r26')
    //     } catch (error) {
    //         throw error
    //     }
    // })

    // test('if record is deleted in db', async (done) => {
    //     const response = await pg.select('*').table('locations').where({uuid: uuid})
    //     expect(response.length).toBe(0);
    //     done()
    // })


})