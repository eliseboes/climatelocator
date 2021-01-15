const supertest = require('supertest');
const app = require('../../server.js');
const request = supertest(app);
const Helpers = require('../../utils/helpers.js');

describe('DB connection test', () => {
    let uuid = Helpers.generateUUID();
    const location = {
        uuid: uuid,
        name: 'San Fransisco',
        geohash: 'c9gs1gzb4r26',
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

    test('if location is added to the database if does not exsists', async () => {
        try {
            const response = await request.post('/locations').send(location)
            expect(response.status).toBe(201)
            expect(response.body[0]['id']).toBeDefined();
            expect(response.body[0]['uuid']).toBeDefined();
            expect(response.body[0]['name']).toBeDefined();
            expect(response.body[0]['yearly_averages_high']).toBeDefined();
            expect(response.body[0]['yearly_averages_low']).toBeDefined();
            expect(response.body[0]['geohash']).toBeDefined();
            uuid = response.body[0].uuid;
        } catch (error) {
            throw error
        }
    })
    
    test('if location is not added to the database if already exsists', async () => {
        try {
            const response = await request.post('/locations').send(location)
            expect(response.status).toBe(404)
            expect(response.body).toStrictEqual({})
        } catch (error) {
            throw error
        }
    })

    test('if get request succeeds', async (done) => {
        try {
            const receivedLocation = await request.get(`/locations/${uuid}`)
            expect(receivedLocation.status).toBe(200)
            expect(receivedLocation.body).not.toBeNull();
            expect(receivedLocation.body[0]['name']).toBeDefined();
            expect(receivedLocation.body[0]['yearly_averages_high']).toBeDefined();
            expect(receivedLocation.body[0]['yearly_averages_low']).toBeDefined();
            expect(receivedLocation.body[0]['geohash']).toBeDefined();
            done()
        } catch (e) {
            if (e) console.log(e);
        }
    });

    test('if location is removed from database when passing correct uuid', async () => {
        try {
            const deletedLocation = await request.delete(`/locations/${uuid}`)
            expect(deletedLocation.status).toBe(200)
            expect(deletedLocation.body).toHaveLength(1)
            expect(deletedLocation.body[0].name).toStrictEqual('San Fransisco')
            expect(deletedLocation.body[0].geohash).toStrictEqual('c9gs1gzb4r26')
        } catch (error) {
            throw error
        }
    })
})