const supertest = require('supertest');
const Helpers = require('../../utils/helpers.js')
const app = require('.././../server.js')
const request = supertest(app);
//let locations, connecteren met db + select + haal alle uuids op from locations *, random op uuids
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

// describe('POST /addlocation endpoint', () => {
//     test('if /addlocation responds to 201 and inserts a location into the database', async (done) => {
//         try {
//             await request.post('/addlocation')
//                 .expect(201)
//                 .then((res) => {
//                     done()
//                 });
//         } catch (e) {
//             if (e) console.log(e);
//         }
//     });
// });

describe('DELETE /removelocation endpoint', () => {
    test('if /remove location responds to 200 and deletes a location from the database', async (done) => {
        try {
            await request.delete('/removelocation')
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

describe('GET /getlocation endpoint', () => {
    test('if /getlocation responds to 200 and returns a location from the database', async (done) => {
        try {
            await request.get('/getlocation/55fb81a0-3c6d-11eb-a3e5-c1be23be73e1')
                .expect(200)
                .then((res) => {
                    done()
                });
        } catch (e) {
            if (e) console.log(e);
        }
    });
});