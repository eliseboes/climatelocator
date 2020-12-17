const supertest = require('supertest');
const Helpers = require('../../utils/helpers.js')
const app = require('.././../server.js')
const request = supertest(app);

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

describe('POST /addlocation endpoint', () => {
    test('if /addlocation responds to 201 and inserts a location into the database', async (done) => {
        try {
            await request.post('/addlocation')
                .expect(201)
                .then((res) => {
                    done()
                });
        } catch (e) {
            if (e) console.log(e);
        }
    });
});

describe('POST /removelocation endpoint', () => {
    test('if /remove location responds to 200 and deletes a location from the database', async (done) => {
        try {
            await request.post('/removelocation')
                .expect(200)
                .then((res) => {
                    done()
                });
        } catch (e) {
            if (e) console.log(e);
        }
    });
});

describe('POST /updatelocation endpoint', () => {
    test('if /update location responds to 200 and updates a location from the database', async (done) => {
        try {
            await request.post('/updatelocation')
                .expect(200)
                .then((res) => {
                    done()
                });
        } catch (e) {
            if (e) console.log(e);
        }
    });
});