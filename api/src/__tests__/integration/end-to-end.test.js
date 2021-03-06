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

    test('if record is added to db', async (done) => {
        try {
            const response = await pg.select('*').table('disasters').where({
                uuid: uuid
            })
            expect(response.length).toBeGreaterThan(0);
            expect(response[0]['name']).toStrictEqual('Typhoon Faxai');
            expect(response[0]['fatalities']).toStrictEqual('123');
            done()
        } catch (e) {
            if (e) console.log(e);
        }
    });

    test('if put request succeeds', async (done) => {
        try {
            const response = await request.put(`/disasters`).send({
                uuid: uuid,
                fatalities: '22'
            })
            expect(response.status).toBe(200)
            expect(response.body[0]).toHaveProperty('fatalities', '22')
            done();
        } catch (e) {
            if (e) console.log(e);
        }
    })

    test('if get request of join succeeds', async (done) => {
        try {
            const response = await request.get(`/join`)
            expect(response.status).toBe(200)
            expect(response.body[0]['fatalities']).toBeDefined();
            expect(response.body[0]['geohash']).toBeDefined();
            done();
        } catch (e) {
            if (e) console.log(e);
        }
    })

    test('if disaster is removed from database when passing correct uuid', async () => {
        try {
            const response = await request.delete(`/disasters/${uuid}`)
            expect(response.status).toBe(200)
            expect(response.body).toHaveLength(1)
            expect(response.body[0].fatalities).toStrictEqual('22')
            expect(response.body[0].name).toStrictEqual('Typhoon Faxai')
        } catch (error) {
            throw error
        }
    })

    test('if record is deleted in db', async (done) => {
        try {
            const response = await pg.select('*').table('disasters').where({
                uuid: uuid
            })
            expect(response.length).toBe(0);
            done()
        } catch (e) {
            if (e) console.log(e);
        }
    })
})